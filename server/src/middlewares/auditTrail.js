const { createAuditLog } = require('../utils/auditContext');

/**
 * Automatic audit trail: records EVERY state-changing request (who, what, when,
 * to which entity, with what result) into audit_logs. Semantic per-service logs
 * (ROLE_GRANTED, etc.) still fire for rich detail; this is the catch-all so
 * nothing a user does goes unrecorded.
 *
 * Mounted globally before the routes. It reads req.user in the `finish` handler,
 * which runs AFTER the route's authenticate middleware has populated it.
 */

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Keys whose values must never be written to the audit log, matched loosely.
const SENSITIVE = ['password', 'token', 'secret', 'apikey', 'api_key', 'otp', 'code', 'pin', 'authorization'];
const isSensitive = (key) => SENSITIVE.some((s) => key.toLowerCase().includes(s));

function sanitize(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (isSensitive(k)) out[k] = '[redacted]';
    else if (typeof v === 'string' && v.length > 500) out[k] = `${v.slice(0, 500)}…`;
    else if (v && typeof v === 'object') out[k] = '[object]';
    else out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

module.exports = function auditTrail(req, res, next) {
  if (!MUTATING.has(req.method)) return next();

  // Capture context now (req.ip / headers are reliable here); read req.user later.
  const ip = req.ip || null;
  const userAgent = req.headers['user-agent'] || null;
  const requestId = req.id || null;

  res.on('finish', () => {
    const path = (req.originalUrl || req.url || '').split('?')[0];
    const segs = path.split('/').filter(Boolean); // ['api', '<resource>', '<id>', ...]
    const entityType = segs[0] === 'api' ? segs[1] || 'root' : segs[0] || 'root';
    const id = req.params && req.params.id;

    createAuditLog({
      userId: req.user ? req.user.id : null,
      action: `${req.method} ${path}`.slice(0, 100),
      entityType: String(entityType).slice(0, 50),
      entityId: id && UUID_RE.test(String(id)) ? id : null,
      // requestId rides along in newValues (no dedicated column) for correlation.
      newValues: {
        status: res.statusCode,
        requestId,
        params: sanitize(req.params),
        body: sanitize(req.body),
      },
      ipAddress: ip,
      userAgent,
    }).catch(() => {});
  });

  next();
};
