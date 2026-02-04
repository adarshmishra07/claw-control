/**
 * @fileoverview V2 Migration - Adds roles and tags columns.
 * 
 * This migration adds:
 * - role column to agents table
 * - tags column to tasks table
 * 
 * Note: This migration is PostgreSQL-specific. SQLite schema includes these
 * columns by default.
 * 
 * Usage: node migrations/v2_add_roles_tags.js
 * 
 * @module migrations/v2_add_roles_tags
 */

const pool = require('../db');

/** SQL migration statement for adding new columns */
const migration = `
-- Add role column to agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Agent';

-- Add tags column to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
`;

/**
 * Runs the V2 migration.
 * @returns {Promise<void>}
 */
async function migrate() {
  console.log('Running V2 migration (roles & tags)...');
  try {
    await pool.query(migration);
    console.log('V2 Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('V2 Migration failed:', err);
    process.exit(1);
  }
}

migrate();
