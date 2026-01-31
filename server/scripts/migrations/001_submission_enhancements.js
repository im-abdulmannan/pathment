/**
 * Migration: Add submission and feedback enhancements
 * - Add extension request fields to task_submissions
 * - Add inline feedback support to task_feedback
 * - Add submission status field
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { sequelize } = require('../../src/db');
const { QueryTypes } = require('sequelize');

async function migrate() {
  console.log('Starting migration: Submission and Feedback Enhancements...');

  try {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Add new columns to task_submissions
      console.log('Adding new columns to task_submissions...');
      
      await sequelize.query(`
        ALTER TABLE task_submissions 
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
        ADD COLUMN IF NOT EXISTS extension_requested BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS extension_reason TEXT,
        ADD COLUMN IF NOT EXISTS extension_days INTEGER,
        ADD COLUMN IF NOT EXISTS extension_status VARCHAR(20);
      `, { transaction });

      // Set default version to 1 if NULL
      await sequelize.query(`
        UPDATE task_submissions 
        SET version = 1 
        WHERE version IS NULL;
      `, { transaction });

      await sequelize.query(`
        ALTER TABLE task_submissions 
        ALTER COLUMN version SET DEFAULT 1;
      `, { transaction });

      // Add index on status
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_task_submissions_status 
        ON task_submissions(status);
      `, { transaction });

      // Add new columns to task_feedback
      console.log('Adding new columns to task_feedback...');
      
      await sequelize.query(`
        ALTER TABLE task_feedback 
        ADD COLUMN IF NOT EXISTS inline_feedback JSONB,
        ADD COLUMN IF NOT EXISTS feedback_type VARCHAR(20) DEFAULT 'general';
      `, { transaction });

      // Update existing feedback to have feedback_type
      await sequelize.query(`
        UPDATE task_feedback 
        SET feedback_type = 'general' 
        WHERE feedback_type IS NULL;
      `, { transaction });

      // Add cloudinary_public_id to task_submission_files for easier deletion
      await sequelize.query(`
        ALTER TABLE task_submission_files 
        ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255);
      `, { transaction });

      // Commit transaction
      await transaction.commit();
      console.log('✓ Migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }
}

async function rollback() {
  console.log('Rolling back migration: Submission and Feedback Enhancements...');

  try {
    const transaction = await sequelize.transaction();

    try {
      // Remove columns from task_submissions
      await sequelize.query(`
        ALTER TABLE task_submissions 
        DROP COLUMN IF EXISTS status,
        DROP COLUMN IF EXISTS extension_requested,
        DROP COLUMN IF EXISTS extension_reason,
        DROP COLUMN IF EXISTS extension_days,
        DROP COLUMN IF EXISTS extension_status;
      `, { transaction });

      // Remove columns from task_feedback
      await sequelize.query(`
        ALTER TABLE task_feedback 
        DROP COLUMN IF EXISTS inline_feedback,
        DROP COLUMN IF EXISTS feedback_type;
      `, { transaction });

      // Remove column from task_submission_files
      await sequelize.query(`
        ALTER TABLE task_submission_files 
        DROP COLUMN IF EXISTS cloudinary_public_id;
      `, { transaction });

      await transaction.commit();
      console.log('✓ Rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('✗ Rollback failed:', error);
    throw error;
  }
}

// Run migration
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'rollback') {
    rollback()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    migrate()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { migrate, rollback };
