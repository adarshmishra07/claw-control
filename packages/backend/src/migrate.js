const pool = require('./db');

const migration = `
-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'idle',
  role TEXT DEFAULT 'Agent',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'backlog',
  tags TEXT[] DEFAULT '{}',
  agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create agent_messages table
CREATE TABLE IF NOT EXISTS agent_messages (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_agent_id ON agent_messages(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON agent_messages(created_at DESC);

-- Add role column to agents if missing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agents' AND column_name='role') THEN 
        ALTER TABLE agents ADD COLUMN role TEXT DEFAULT 'Agent'; 
    END IF; 
END $$;

-- Add tags column to tasks if missing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='tags') THEN 
        ALTER TABLE tasks ADD COLUMN tags TEXT[] DEFAULT '{}'; 
    END IF; 
END $$;
`;

async function migrate() {
  console.log('Running database migration...');
  try {
    await pool.query(migration);
    console.log('Migration completed successfully!');
    
    // Check if we have any agents, if not create a default one
    const { rows } = await pool.query('SELECT COUNT(*) FROM agents');
    if (parseInt(rows[0].count) === 0) {
      console.log('Creating default agent...');
      await pool.query(
        "INSERT INTO agents (name, description, status) VALUES ($1, $2, $3)",
        ['Main Agent', 'Primary mission control agent', 'idle']
      );
      console.log('Default agent created.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
