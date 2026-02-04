/**
 * @fileoverview Agent Configuration Loader.
 * 
 * Loads agent definitions from a YAML configuration file. Searches multiple
 * paths for flexibility across different deployment environments.
 * 
 * @module config-loader
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/** @type {string[]} Paths to search for agents.yaml configuration file */
const CONFIG_PATHS = [
  path.join(process.cwd(), 'config', 'agents.yaml'),
  path.join(process.cwd(), '..', '..', 'config', 'agents.yaml'),
  '/app/config/agents.yaml',
  path.join(__dirname, '..', '..', '..', 'config', 'agents.yaml')
];

/**
 * Loads agents configuration from YAML file.
 * Searches predefined paths and falls back to defaults if not found.
 * @returns {Array<{name: string, description: string|null, role: string, avatar: string, status: string}>}
 */
function loadAgentsConfig() {
  let configPath = null;
  
  for (const p of CONFIG_PATHS) {
    if (fs.existsSync(p)) {
      configPath = p;
      break;
    }
  }
  
  if (!configPath) {
    console.warn('No agents.yaml found. Searched paths:');
    CONFIG_PATHS.forEach(p => console.warn(`   - ${p}`));
    console.warn('Using default agents.');
    return getDefaultAgents();
  }
  
  try {
    console.log(`Loading agents from: ${configPath}`);
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents);
    
    if (!config || !Array.isArray(config.agents)) {
      console.warn('Invalid agents.yaml format. Expected { agents: [...] }');
      return getDefaultAgents();
    }
    
    const agents = config.agents.map((agent, index) => ({
      name: agent.name || `Agent ${index + 1}`,
      description: agent.description || null,
      role: agent.role || 'Agent',
      avatar: agent.avatar || '🤖',
      status: agent.status || 'idle'
    }));
    
    console.log(`Loaded ${agents.length} agents from config`);
    return agents;
    
  } catch (err) {
    console.error(`Error loading agents.yaml: ${err.message}`);
    return getDefaultAgents();
  }
}

/**
 * Returns default agent configuration when no config file exists.
 * @returns {Array<{name: string, role: string, description: string, avatar: string, status: string}>}
 */
function getDefaultAgents() {
  return [
    { name: 'Agent Alpha', role: 'Coordinator', description: 'Team lead and task coordinator', avatar: '🤖', status: 'idle' },
    { name: 'Agent Beta', role: 'Developer', description: 'Backend systems and APIs', avatar: '💻', status: 'idle' },
    { name: 'Agent Gamma', role: 'DevOps', description: 'Infrastructure and deployments', avatar: '🔧', status: 'idle' },
    { name: 'Agent Delta', role: 'Researcher', description: 'Analysis and documentation', avatar: '📖', status: 'idle' },
  ];
}

/**
 * Gets the path where configuration was loaded from.
 * @returns {string|null} Path to config file, or null if not found
 */
function getConfigPath() {
  for (const p of CONFIG_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

module.exports = {
  loadAgentsConfig,
  getDefaultAgents,
  getConfigPath,
  CONFIG_PATHS
};
