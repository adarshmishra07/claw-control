/**
 * @fileoverview Database Seeding Script.
 * 
 * Seeds the database with sample agents and assigns random tags to tasks.
 * Use this script to populate a development database with test data.
 * 
 * Usage: node seed_v2.js
 * 
 * @module seed_v2
 */

const pool = require('./db');

/** @type {Array<{name: string, role: string, description: string}>} Sample agent definitions */
const sampleAgents = [
  { name: 'Agent Alpha', role: 'Coordinator', description: 'Team lead and task coordinator' },
  { name: 'Agent Beta', role: 'Developer', description: 'Backend systems and APIs' },
  { name: 'Agent Gamma', role: 'DevOps', description: 'Infrastructure and deployments' },
  { name: 'Agent Delta', role: 'Researcher', description: 'Analysis and documentation' },
];

/** @type {Array<string[]>} Sample tag combinations for tasks */
const sampleTags = [
  ['frontend', 'ui'],
  ['backend', 'api'],
  ['bug', 'urgent'],
  ['feature', 'v2'],
  ['database', 'optimization'],
  ['docs', 'readme']
];

/**
 * Seeds the database with sample data.
 * Creates agents if none exist and assigns tags to tasks without them.
 * @returns {Promise<void>}
 */
async function seed() {
  console.log('Seeding Claw Control data...');
  
  try {
    const { rows: existingAgents } = await pool.query("SELECT COUNT(*) as count FROM agents");
    
    if (parseInt(existingAgents[0].count) === 0) {
      console.log('Creating sample agents...');
      for (const agent of sampleAgents) {
        await pool.query(
          "INSERT INTO agents (name, role, description, status) VALUES ($1, $2, $3, 'idle')",
          [agent.name, agent.role, agent.description]
        );
        console.log(`Created agent: ${agent.name}`);
      }
    } else {
      console.log('Agents already exist, skipping agent creation.');
    }

    const { rows: tasks } = await pool.query("SELECT id FROM tasks WHERE tags IS NULL OR tags = '{}'");
    console.log(`Found ${tasks.length} tasks without tags.`);
    
    for (const task of tasks) {
      const tags = sampleTags[Math.floor(Math.random() * sampleTags.length)];
      await pool.query(
        "UPDATE tasks SET tags = $1 WHERE id = $2",
        [tags, task.id]
      );
    }
    console.log('Tasks updated with sample tags.');
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
