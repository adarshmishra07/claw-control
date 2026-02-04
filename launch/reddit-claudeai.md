# r/ClaudeAI Post Draft

## Title Options (pick one):
1. **Built an MCP-enabled mission control dashboard for Claude agents - open source**
2. **Claw Control: Kanban board for AI agents with native MCP server (works with Claude Desktop)**
3. **Open-sourced a task dashboard for multi-agent Claude workflows - includes MCP tools**

---

## Post Body:

Hey Claude community!

Wanted to share something I built while running multiple Claude-based agents - **Claw Control**, an open-source mission control dashboard for AI agent coordination.

### Why I built it:

Running Claude Code and other Claude-powered agents for different tasks (backend work, research, deployments), I needed a way to:
- See which agent is working on what
- Track task progress across the team
- Have a shared activity feed

So I built a Kanban dashboard with **native MCP (Model Context Protocol) support**.

### MCP Integration:

The included MCP server (`mcp-server.js`) provides these tools your Claude agents can use:

| Tool | What it does |
|------|-------------|
| `list_tasks` | Get all tasks (filter by status) |
| `create_task` | Add new tasks to the board |
| `update_task` | Move tasks, change status |
| `list_agents` | See all configured agents |
| `update_agent_status` | Agent marks itself as working/idle |
| `post_message` | Post to the activity feed |

**MCP Config for Claude Desktop:**
```json
{
  "mcpServers": {
    "claw-control": {
      "command": "node",
      "args": ["packages/backend/src/mcp-server.js"],
      "env": {
        "DATABASE_URL": "sqlite:./data/claw.db"
      }
    }
  }
}
```

### REST API too:

For agents not using MCP, there's a full REST API:
```bash
PUT /api/agents/:id    # Update agent status
POST /api/messages     # Post to feed
PUT /api/tasks/:id     # Update task
```

Plus Server-Sent Events for real-time dashboard updates.

### Stack:
- **Frontend:** React 19, Vite, TailwindCSS (cyberpunk dark theme)
- **Backend:** Fastify 5, Node.js
- **Database:** SQLite (zero-config) or PostgreSQL
- **Deploy:** Docker Compose ready, Railway template included

### Getting started:
```bash
git clone https://github.com/gokuclaw-adarsh/claw-control.git
cd claw-control/packages/backend
npm install
echo "DATABASE_URL=sqlite:./data/claw.db" > .env
npm run migrate && npm start
```

Dashboard at `localhost:5173`, API at `localhost:3001`.

**Repo:** https://github.com/gokuclaw-adarsh/claw-control

MIT licensed. Contributions welcome - especially if anyone wants to improve the MCP tooling or add more Claude-specific features.

Anyone else here running multi-agent Claude setups? Curious how you're handling coordination.
