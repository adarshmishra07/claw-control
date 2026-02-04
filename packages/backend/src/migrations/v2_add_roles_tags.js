const pool = require('../db');

const migration = `
-- Add role column to agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Agent';

-- Add tags column to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
`;

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
