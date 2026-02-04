#!/usr/bin/env node
/**
 * @fileoverview MCP (Model Context Protocol) Server for Claw Control.
 * 
 * Exposes Claw Control's task and agent management via MCP tools,
 * allowing AI agents (Claude, etc.) to interact with Mission Control natively.
 * 
 * Uses stdio transport (standard for MCP).
 * 
 * @module mcp-server
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

const dbAdapter = require('./db-adapter');

/**
 * Generates parameterized query placeholder based on database type.
 * @param {number} index - 1-based parameter index
 * @returns {string} Placeholder string ('?' for SQLite, '$n' for Postgres)
 */
const param = (index) => dbAdapter.isSQLite() ? '?' : `$${index}`;

/**
 * Tool definitions for the MCP server.
 */
const TOOLS = [
  {
    name: 'list_tasks',
    description: 'List all tasks from Mission Control. Optionally filter by status.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by task status: backlog, todo, review, completed',
          enum: ['backlog', 'todo', 'review', 'completed']
        }
      }
    }
  },
  {
    name: 'create_task',
    description: 'Create a new task in Mission Control.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Task title (required)'
        },
        description: {
          type: 'string',
          description: 'Task description'
        },
        status: {
          type: 'string',
          description: 'Initial status (default: backlog)',
          enum: ['backlog', 'todo', 'review', 'completed'],
          default: 'backlog'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Task tags'
        },
        agent_id: {
          type: 'number',
          description: 'ID of the agent to assign this task to'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'update_task',
    description: 'Update an existing task in Mission Control.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Task ID (required)'
        },
        title: {
          type: 'string',
          description: 'New task title'
        },
        description: {
          type: 'string',
          description: 'New task description'
        },
        status: {
          type: 'string',
          description: 'New task status',
          enum: ['backlog', 'todo', 'review', 'completed']
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'New task tags'
        },
        agent_id: {
          type: 'number',
          description: 'ID of the agent to assign this task to'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'list_agents',
    description: 'List all agents in Mission Control.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'update_agent_status',
    description: 'Update an agent\'s status in Mission Control.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Agent ID (required)'
        },
        status: {
          type: 'string',
          description: 'New status: idle, working, offline, error',
          enum: ['idle', 'working', 'offline', 'error']
        }
      },
      required: ['id', 'status']
    }
  },
  {
    name: 'post_message',
    description: 'Post a message to the Mission Control activity feed.',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'number',
          description: 'Agent ID posting the message (required)'
        },
        message: {
          type: 'string',
          description: 'Message content (required)'
        }
      },
      required: ['agent_id', 'message']
    }
  }
];

/**
 * Tool handler implementations.
 */
const toolHandlers = {
  /**
   * List all tasks with optional status filter.
   */
  async list_tasks({ status }) {
    let query = 'SELECT * FROM tasks';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` WHERE status = ${param(1)}`;
    }
    query += ' ORDER BY created_at DESC';
    
    const { rows } = await dbAdapter.query(query, params);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(rows, null, 2)
      }]
    };
  },

  /**
   * Create a new task.
   */
  async create_task({ title, description, status = 'backlog', tags = [], agent_id }) {
    if (!title) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Title is required' })
        }],
        isError: true
      };
    }

    const tagsValue = dbAdapter.isSQLite() ? JSON.stringify(tags) : tags;

    const { rows } = await dbAdapter.query(
      `INSERT INTO tasks (title, description, status, tags, agent_id) 
       VALUES (${param(1)}, ${param(2)}, ${param(3)}, ${param(4)}, ${param(5)}) 
       RETURNING *`,
      [title, description || null, status, tagsValue, agent_id || null]
    );

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(rows[0], null, 2)
      }]
    };
  },

  /**
   * Update an existing task.
   */
  async update_task({ id, title, description, status, tags, agent_id }) {
    if (!id) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Task ID is required' })
        }],
        isError: true
      };
    }

    const tagsValue = tags !== undefined && dbAdapter.isSQLite() ? JSON.stringify(tags) : tags;
    const nowFn = dbAdapter.isSQLite() ? "datetime('now')" : 'NOW()';

    const { rows } = await dbAdapter.query(
      `UPDATE tasks 
       SET title = COALESCE(${param(1)}, title),
           description = COALESCE(${param(2)}, description),
           status = COALESCE(${param(3)}, status),
           tags = COALESCE(${param(4)}, tags),
           agent_id = COALESCE(${param(5)}, agent_id),
           updated_at = ${nowFn}
       WHERE id = ${param(6)}
       RETURNING *`,
      [title, description, status, tagsValue, agent_id, id]
    );

    if (rows.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Task not found' })
        }],
        isError: true
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(rows[0], null, 2)
      }]
    };
  },

  /**
   * List all agents.
   */
  async list_agents() {
    const { rows } = await dbAdapter.query(
      'SELECT * FROM agents ORDER BY id ASC'
    );

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(rows, null, 2)
      }]
    };
  },

  /**
   * Update agent status.
   */
  async update_agent_status({ id, status }) {
    if (!id || !status) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Agent ID and status are required' })
        }],
        isError: true
      };
    }

    const validStatuses = ['idle', 'working', 'offline', 'error'];
    if (!validStatuses.includes(status)) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
        }],
        isError: true
      };
    }

    const nowFn = dbAdapter.isSQLite() ? "datetime('now')" : 'NOW()';

    const { rows } = await dbAdapter.query(
      `UPDATE agents 
       SET status = ${param(1)}, updated_at = ${nowFn}
       WHERE id = ${param(2)}
       RETURNING *`,
      [status, id]
    );

    if (rows.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Agent not found' })
        }],
        isError: true
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(rows[0], null, 2)
      }]
    };
  },

  /**
   * Post a message to the activity feed.
   */
  async post_message({ agent_id, message }) {
    if (!agent_id || !message) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Agent ID and message are required' })
        }],
        isError: true
      };
    }

    const { rows } = await dbAdapter.query(
      `INSERT INTO messages (agent_id, message) 
       VALUES (${param(1)}, ${param(2)}) 
       RETURNING *`,
      [agent_id, message]
    );

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(rows[0], null, 2)
      }]
    };
  }
};

/**
 * Main function to start the MCP server.
 */
async function main() {
  const server = new Server(
    {
      name: 'claw-control',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const handler = toolHandlers[name];
    if (!handler) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: `Unknown tool: ${name}` })
        }],
        isError: true
      };
    }

    try {
      return await handler(args || {});
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: error.message })
        }],
        isError: true
      };
    }
  });

  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Claw Control MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
