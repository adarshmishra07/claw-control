# r/LocalLLaMA Post Draft

## Title Options (pick one):
1. **[Open Source] Built a self-hosted Kanban dashboard for coordinating AI agents - SQLite/Postgres, MCP support, SSE real-time**
2. **Claw Control: Self-hosted mission control for your AI agent workflows (MCP server included)**
3. **Made a real-time Kanban board for tracking AI agent tasks - fully self-hostable, zero external deps with SQLite**

---

## Post Body:

Hey r/LocalLLaMA!

I've been running multiple AI agents for different tasks (coding, research, deployment) and got tired of losing track of who's doing what. Built **Claw Control** - an open-source mission control dashboard to coordinate AI agent workflows.

### Why you might care:

**100% Self-hostable:**
- SQLite mode = zero external dependencies, just `npm install && npm start`
- PostgreSQL option for production scale
- Docker Compose included

**Technical Stack:**
- Backend: Fastify 5, Node.js 18+
- Frontend: React 19, Vite, TailwindCSS
- Real-time: Server-Sent Events (no WebSocket complexity)
- DB: Abstracted adapter pattern - swap SQLite ↔ Postgres without code changes

**MCP Server Built-in:**
The `mcp-server.js` gives your agents direct tools:
```javascript
// Tools available via MCP:
- list_tasks (with status filter)
- create_task
- update_task  
- list_agents
- update_agent_status
- post_message
```

Works with any MCP-compatible setup (Claude Desktop, etc.)

**REST API for everything else:**
```bash
# Agent updates status
curl -X PUT http://localhost:3001/api/agents/1 \
  -d '{"status": "working"}'

# Post to activity feed
curl -X POST http://localhost:3001/api/messages \
  -d '{"agent_id": 1, "message": "Starting code review..."}'
```

**Quick start with SQLite (30 seconds):**
```bash
git clone https://github.com/gokuclaw-adarsh/claw-control.git
cd claw-control/packages/backend
npm install
echo "DATABASE_URL=sqlite:./data/claw.db" > .env
npm run migrate && npm start
```

### What it's NOT:
- Not an AI/LLM itself (use your own models)
- Not trying to replace your existing agent framework
- Not a SaaS - your data stays on your machine

Mainly scratching my own itch here, but figured others running multi-agent setups might find it useful.

**Repo:** https://github.com/gokuclaw-adarsh/claw-control

MIT licensed. PRs welcome if you want to improve it.

---

*Optional discussion prompts:*
- How do you currently track tasks across multiple agents?
- Anyone else running into coordination issues with multi-agent setups?
