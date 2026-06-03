const clanService = require('./clanService');
const cohortService = require('./cohortService');

const MENTOR_ROLES = ['lead_mentor', 'co_mentor'];

function avg(nums) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function nameOf(user) {
  if (!user) return null;
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || null;
}

function initialsOf(user) {
  if (!user) return '—';
  const a = (user.firstName || '').charAt(0);
  const b = (user.lastName || '').charAt(0);
  return (a + b).toUpperCase() || '—';
}

/**
 * Derive a clan's health status from its mentee rows.
 *   red    → "Needs attention"  (a third of the cohort at risk, or completion stalled)
 *   amber  → "Watch"            (some risk / slipping on-time / behind pace)
 *   green  → "Healthy"          (everyone tracking)
 * An empty clan (no active mentees) is "Watch" — nothing to read yet.
 */
function deriveStatus({ memberCount, atRisk, avgCompletion, avgOnTime }) {
  if (memberCount === 0) return { status: 'amber', label: 'Watch', reason: 'No active mentees yet' };

  const atRiskRatio = atRisk / memberCount;
  if (atRiskRatio >= 0.34 || avgCompletion < 40) {
    return { status: 'red', label: 'Needs attention', reason: `${atRisk} of ${memberCount} mentees at risk` };
  }
  if (atRisk > 0 || avgOnTime < 70 || avgCompletion < 65) {
    const bits = [];
    if (atRisk > 0) bits.push(`${atRisk} at risk`);
    if (avgOnTime < 70) bits.push(`${avgOnTime}% on-time`);
    if (avgCompletion < 65) bits.push(`${avgCompletion}% complete`);
    return { status: 'amber', label: 'Watch', reason: bits.join(' · ') };
  }
  return { status: 'green', label: 'Healthy', reason: 'On track' };
}

class ClanHealthService {
  /**
   * Org-wide health snapshot for the admin dashboard: clans grouped by program,
   * each clan scored from its mentees' real cohort rows. Returns org KPIs plus
   * programs[] → clans[] so the UI can render "clan status, program-wise".
   */
  async programHealth() {
    const clans = await clanService.listClans();

    // Collect every distinct mentee across clans, then build each row once.
    const menteeIds = new Set();
    for (const clan of clans) {
      for (const m of clan.memberships || []) {
        if (m.role === 'mentee') menteeIds.add(m.userId);
      }
    }
    const rowList = await Promise.all([...menteeIds].map((id) => cohortService.buildMenteeRow(id)));
    const rowById = new Map();
    for (const row of rowList) {
      if (row) rowById.set(row.id, row);
    }

    const programs = new Map(); // programId -> { id, name, status, clans: [] }
    const orgRows = [];

    for (const clan of clans) {
      const memberships = clan.memberships || [];
      const menteeMemberships = memberships.filter((m) => m.role === 'mentee');
      const mentorMemberships = memberships.filter((m) => MENTOR_ROLES.includes(m.role));

      const rows = menteeMemberships.map((m) => rowById.get(m.userId)).filter(Boolean);
      orgRows.push(...rows);

      const memberCount = menteeMemberships.length;
      const avgCompletion = avg(rows.map((r) => r.absoluteProgress));
      const avgOnTime = avg(rows.map((r) => r.onTimeRate));
      const atRisk = rows.filter((r) => r.risk !== 'low').length;
      const openBlockers = rows.reduce((sum, r) => sum + (r.openBlockers || 0), 0);
      const pendingApprovals = rows.reduce((sum, r) => sum + (r.pendingApprovals || 0), 0);

      const health = deriveStatus({ memberCount, atRisk, avgCompletion, avgOnTime });

      const clanCard = {
        id: clan.id,
        name: clan.name,
        status: health.status,
        statusLabel: health.label,
        statusReason: health.reason,
        memberCount,
        mentorCount: mentorMemberships.length,
        avgCompletion,
        avgOnTime,
        atRisk,
        openBlockers,
        pendingApprovals,
        leadMentor: clan.leadMentor
          ? { id: clan.leadMentor.id, name: nameOf(clan.leadMentor), avatar: initialsOf(clan.leadMentor) }
          : null,
      };

      const program = clan.program;
      const programId = program?.id || 'unassigned';
      if (!programs.has(programId)) {
        programs.set(programId, {
          id: programId,
          name: program?.name || 'Unassigned',
          status: program?.status || null,
          clans: [],
        });
      }
      programs.get(programId).clans.push(clanCard);
    }

    // Sort clans within each program worst-first; sort programs by attention need.
    const statusRank = { red: 0, amber: 1, green: 2 };
    const programList = [...programs.values()].map((p) => {
      p.clans.sort((a, b) =>
        statusRank[a.status] !== statusRank[b.status]
          ? statusRank[a.status] - statusRank[b.status]
          : b.atRisk - a.atRisk
      );
      const programMembers = p.clans.reduce((s, c) => s + c.memberCount, 0);
      const programAtRisk = p.clans.reduce((s, c) => s + c.atRisk, 0);
      return {
        ...p,
        clanCount: p.clans.length,
        memberCount: programMembers,
        atRisk: programAtRisk,
        avgCompletion: avg(p.clans.filter((c) => c.memberCount > 0).map((c) => c.avgCompletion)),
      };
    });
    programList.sort((a, b) => b.atRisk - a.atRisk || b.memberCount - a.memberCount);

    const kpis = {
      activeMentees: orgRows.length,
      avgCompletion: avg(orgRows.map((r) => r.absoluteProgress)),
      avgOnTime: avg(orgRows.map((r) => r.onTimeRate)),
      atRisk: orgRows.filter((r) => r.risk !== 'low').length,
      clans: clans.length,
      programs: programList.length,
    };

    // Flat org-wide "needs attention" rollup: the actual at-risk mentees.
    const atRiskMentees = orgRows
      .filter((r) => r.risk !== 'low')
      .sort((a, b) => (a.risk === 'high' ? -1 : 1) - (b.risk === 'high' ? -1 : 1))
      .slice(0, 12)
      .map((r) => ({
        id: r.id,
        name: r.name,
        avatar: r.avatar,
        program: r.program,
        risk: r.risk,
        riskReason: r.riskReason,
        absoluteProgress: r.absoluteProgress,
        onTimeRate: r.onTimeRate,
      }));

    return { kpis, programs: programList, atRiskMentees };
  }
}

module.exports = new ClanHealthService();
