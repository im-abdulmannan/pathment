/**
 * Seed the "What's New" changelog with ready-to-review DRAFTS.
 *
 * Everything is created unpublished (published_at = NULL) so nothing shows to
 * users until an admin reviews and hits Publish. Re-running REFRESHES the drafts:
 * it clears existing unpublished entries and reinserts this current copy, while
 * leaving anything already published untouched.
 *
 * Run: node server/scripts/seed-changelog.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { models, sequelize } = require('../src/db');

const ALL = ['admin', 'mentor', 'mentee'];

const ENTRIES = [
  // ── Major (these pop the one-time modal once published) ──────────────────────
  {
    title: 'Make a task fit one mentee',
    type: 'feature', audience: ['mentor'], isMajor: true,
    body: `<p>Now you can tweak a task for just one mentee without changing it for everyone. Edit the title, rewrite the brief, drop in different resources, or leave a private note only they see.</p><p>Changed your mind? You can edit it later, take it back, or assign it again. Everyone gets the version that suits them.</p>`,
  },
  {
    title: 'Run your weekly reviews on one screen',
    type: 'feature', audience: ['mentor'], isMajor: true,
    body: `<p>Cohort Review puts your weekly check-ins in one place. Take attendance, see how each mentee is doing, and hand out tasks right there.</p><p>A review is only created once you actually start one, so you won't end up with empty sessions by accident. And if one does slip in, you can delete it from your history.</p>`,
  },
  {
    title: 'Lead more than one clan? Jump between them',
    type: 'feature', audience: ['mentor'], isMajor: true,
    body: `<p>If you run more than one clan, there's now a quick switcher in the sidebar. Pick a clan and your dashboard, messages, and community all focus on just that group, so nothing gets mixed up.</p>`,
  },
  {
    title: 'Give your team the right access',
    type: 'feature', audience: ['admin'], isMajor: true,
    body: `<p>The new Roles and Access area lets you decide exactly what each admin and mentor can do, and keep it to the right program or clan. A program admin only sees their own program, for example.</p><p>You can add or remove access anytime, and every change is saved.</p>`,
  },

  // ── Improvements ─────────────────────────────────────────────────────────────
  {
    title: 'Build and reuse roadmaps faster',
    type: 'improvement', audience: ['admin', 'mentor'], isMajor: false,
    body: `<p>Roadmaps are easier to work with now. There's a proper editor, and every step can carry its own links and resources. You can also export a roadmap and bring it into another one, so you're not rebuilding the same plan twice.</p>`,
  },
  {
    title: 'Custom tasks work just like roadmap tasks',
    type: 'improvement', audience: ['mentor'], isMajor: false,
    body: `<p>When you create a one-off task, you can now add resources and format the brief, the same way you do on roadmap tasks. Your mentees see a clean, easy-to-read task instead of plain text.</p>`,
  },
  {
    title: 'Find people fast on Invites and Clans',
    type: 'improvement', audience: ['admin'], isMajor: false,
    body: `<p>The Invites and Clans pages now have search and filters by program and clan, plus paging, so long lists stay quick to scan as you grow.</p>`,
  },
  {
    title: 'Assign to several mentees at once',
    type: 'improvement', audience: ['mentor'], isMajor: false,
    body: `<p>You can now search for mentees and pick a few at once when assigning from a roadmap, then send it to all of them in one go instead of one at a time.</p>`,
  },
  {
    title: 'Set and change task deadlines',
    type: 'improvement', audience: ['mentor'], isMajor: false,
    body: `<p>Tasks now have clear deadlines you can set and change whenever you need, and you can unassign a task if plans change.</p>`,
  },
  {
    title: 'Nicer dark mode',
    type: 'improvement', audience: ALL, isMajor: false,
    body: `<p>We cleaned up dark mode across task details, clan cards, and progress bars so everything is easy to read at night.</p>`,
  },

  // ── Fixes (collapsed under "Also fixed") ─────────────────────────────────────
  {
    title: 'Both people hear about a booked meeting',
    type: 'fix', audience: ['mentor', 'mentee'], isMajor: false,
    body: `<p>When a meeting gets booked, both of you get a notification and an email. We also fixed a rare case where the same slot could be booked twice.</p>`,
  },
  {
    title: 'Important emails arrive right away',
    type: 'fix', audience: ALL, isMajor: false,
    body: `<p>The emails you can't log in without, like password resets, email verification, and invites, now go out straight away and never wait behind regular emails.</p>`,
  },
  {
    title: 'Move a mentee to the right clan',
    type: 'fix', audience: ['admin'], isMajor: false,
    body: `<p>Put someone in the wrong clan? You can now move a mentee to a different clan in a couple of clicks, and the directory shows each mentee's current clan.</p>`,
  },
  {
    title: 'Bring suspended members back',
    type: 'fix', audience: ['admin'], isMajor: false,
    body: `<p>We fixed a problem where suspended users disappeared from the directory, which made it impossible to un-suspend them. They stay visible now, so you can give access back.</p>`,
  },
  {
    title: 'Dashboard numbers are right again',
    type: 'fix', audience: ['admin'], isMajor: false,
    body: `<p>We fixed a glitch where the dashboard could show 0 active mentees even when clans were full. Your totals are accurate again.</p>`,
  },
  {
    title: 'See the password rules as you type',
    type: 'fix', audience: ALL, isMajor: false,
    body: `<p>The sign-up and password reset screens now show the password rules while you type, so you're not left guessing why a password didn't work.</p>`,
  },
];

async function run() {
  // Make sure the table exists locally (no-op if it does; creates only this table).
  await models.ProductUpdate.sync();

  // Default: refresh only drafts (published entries stay untouched — prod-safe).
  // `--reset`: wipe EVERYTHING and start clean (use in dev when republishing fresh copy).
  const reset = process.argv.slice(2).includes('--reset');
  const where = reset ? {} : { published_at: null };
  const removed = await models.ProductUpdate.destroy({ where, truncate: false });

  let created = 0;
  for (const e of ENTRIES) {
    await models.ProductUpdate.create({ ...e, publishedAt: null, createdBy: null });
    created++;
    console.log(`  ✓ draft: ${e.title}`);
  }
  console.log(`\n✅ Done — cleared ${removed} old draft(s), created ${created} fresh draft(s). Review + publish at /admin/changelog.`);
}

run()
  .then(() => sequelize.close())
  .then(() => process.exit(0))
  .catch((err) => { console.error('❌ Seed failed:', err.message); process.exit(1); });
