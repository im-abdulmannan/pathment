const { Op } = require('sequelize');
const { models, sequelize } = require('../db');
const { NotFoundError, ValidationError } = require('../utils/errors/errorTypes');
const clanService = require('./clanService');

const fullName = (u) => (u ? `${u.firstName} ${u.lastName}`.trim() : null);

/** Admin clan operations: change requests, cross-clan assignments, policies. */
class ClanRequestsService {
  async overview() {
    const [requests, crossClan] = await Promise.all([
      models.ClanChangeRequest.findAll({
        order: [['status', 'ASC'], ['created_at', 'DESC']],
        include: [
          { model: models.User, as: 'mentee', attributes: ['firstName', 'lastName'] },
          { model: models.Clan, as: 'fromClan', attributes: ['name'] },
          { model: models.Clan, as: 'toClan', attributes: ['name'] }
        ]
      }),
      models.CrossClanAssignment.findAll({
        order: [['created_at', 'DESC']],
        include: [
          { model: models.User, as: 'user', attributes: ['firstName', 'lastName'] },
          { model: models.Clan, as: 'fromClan', attributes: ['name'] },
          { model: models.Clan, as: 'toClan', attributes: ['name'] }
        ]
      })
    ]);

    return {
      requests: requests.map((r) => ({
        id: r.id,
        mentee: fullName(r.mentee),
        fromClan: r.fromClan?.name || null,
        toClan: r.toClan?.name || null,
        reason: r.reason,
        status: r.status,
        resolutionNote: r.resolutionNote,
        at: r.createdAt
      })),
      crossClan: crossClan.map((c) => ({
        id: c.id,
        kind: c.kind,
        user: fullName(c.user),
        fromClan: c.fromClan?.name || null,
        toClan: c.toClan?.name || null,
        note: c.note,
        at: c.createdAt
      }))
    };
  }

  async createRequest({ menteeId, toClanId, fromClanId, reason }, createdBy) {
    if (!menteeId || !toClanId) throw new ValidationError('menteeId and toClanId are required');
    return models.ClanChangeRequest.create({ menteeId, toClanId, fromClanId: fromClanId || null, reason: reason || null, createdBy });
  }

  async resolveRequest(id, { status, note }) {
    if (!['approved', 'denied'].includes(status)) throw new ValidationError('status must be approved or denied');
    const req = await models.ClanChangeRequest.findByPk(id);
    if (!req) throw new NotFoundError('Request not found');

    return sequelize.transaction(async (transaction) => {
      req.status = status;
      req.resolutionNote = note || null;
      await req.save({ transaction });

      if (status === 'approved') {
        // Move the mentee: remove old membership, add to the target clan.
        if (req.fromClanId) {
          const old = await models.ClanMembership.findOne({ where: { clanId: req.fromClanId, userId: req.menteeId }, transaction });
          if (old) { old.status = 'removed'; old.leftAt = new Date(); await old.save({ transaction }); }
        }
      }
      return req;
    }).then(async (req) => {
      if (status === 'approved') {
        await clanService.addMember(req.toClanId, { userId: req.menteeId, role: 'mentee' });
      }
      return req;
    });
  }

  async createCrossClan(data, createdBy) {
    if (!data.kind) throw new ValidationError('kind is required');
    // A cross-clan assignment must name WHO is helping and WHICH clan — otherwise
    // it grants nothing (the authz engine derives co-mentor access from these).
    if (!data.userId) throw new ValidationError('Select the person who will help');
    if (!data.toClanId) throw new ValidationError('Select the clan they will help');

    const [user, toClan] = await Promise.all([
      models.User.findByPk(data.userId),
      models.Clan.findByPk(data.toClanId)
    ]);
    if (!user) throw new NotFoundError('User not found');
    if (!toClan) throw new NotFoundError('Target clan not found');
    if (data.fromClanId && !(await models.Clan.findByPk(data.fromClanId))) {
      throw new ValidationError('From-clan not found');
    }

    return models.CrossClanAssignment.create({
      kind: data.kind,
      userId: data.userId,
      fromClanId: data.fromClanId || null,
      toClanId: data.toClanId,
      note: data.note || null,
      createdBy
    });
  }

  /** Cross-clan assignments touching a specific clan (for the lead mentor's view). */
  async listCrossClanForClan(clanId) {
    if (!clanId) return [];
    const rows = await models.CrossClanAssignment.findAll({
      where: { [Op.or]: [{ toClanId: clanId }, { fromClanId: clanId }] },
      order: [['created_at', 'DESC']],
      include: [
        { model: models.User, as: 'user', attributes: ['firstName', 'lastName'] },
        { model: models.Clan, as: 'fromClan', attributes: ['name'] },
        { model: models.Clan, as: 'toClan', attributes: ['name'] }
      ]
    });
    return rows.map((c) => ({
      id: c.id, kind: c.kind, user: fullName(c.user),
      fromClan: c.fromClan?.name || null, toClan: c.toClan?.name || null,
      note: c.note, at: c.createdAt
    }));
  }

  async removeCrossClan(id) {
    const a = await models.CrossClanAssignment.findByPk(id);
    if (!a) throw new NotFoundError('Assignment not found');
    await a.destroy();
    return { removed: true };
  }
}

module.exports = new ClanRequestsService();
