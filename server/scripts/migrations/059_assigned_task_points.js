/**
 * Migration: 059_assigned_task_points
 *
 * Per-assignment points. An AssignedTask had only `points_awarded` (set at
 * review), so the points a mentor set when assigning a CUSTOM task were silently
 * dropped, and points couldn't be shown or edited per task. `points_base` is the
 * target points for THIS assignment — copied from the roadmap step on assign,
 * set directly for a custom task, and editable per mentee. Nullable → falls back
 * to the roadmap step's points / a default when unset.
 *
 * Run:      node server/scripts/migrations/059_assigned_task_points.js
 * Rollback: node server/scripts/migrations/059_assigned_task_points.js --rollback
 */
const { Sequelize } = require('sequelize');
const sequelize = require('./_db');

async function up() {
  const qi = sequelize.getQueryInterface();
  console.log('▶ Running migration 059: assigned_tasks.points_base');
  try {
    await qi.addColumn('assigned_tasks', 'points_base', { type: Sequelize.INTEGER, allowNull: true });
    console.log('  ✓ Added assigned_tasks.points_base');
  } catch (e) {
    if (/already exists|duplicate column/i.test(e.message)) console.log('  ℹ assigned_tasks.points_base exists, skipping');
    else throw e;
  }
  console.log('✅ Migration 059 complete');
}

async function down() {
  const qi = sequelize.getQueryInterface();
  console.log('▶ Rolling back migration 059');
  try { await qi.removeColumn('assigned_tasks', 'points_base'); console.log('  ✓ Dropped assigned_tasks.points_base'); }
  catch (e) { if (!/does not exist/i.test(e.message)) throw e; }
  console.log('✅ Rollback 059 complete');
}

if (require.main === module) {
  const isRollback = process.argv.slice(2).some((a) => a === '--rollback' || a === '-r');
  (async () => { try { await (isRollback ? down() : up()); process.exit(0); } catch (e) { console.error('❌ Migration failed:', e.message); process.exit(1); } })();
}

module.exports = { up, down };
