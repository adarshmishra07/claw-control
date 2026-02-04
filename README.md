# 🦞 Claw Control

> **Kanban for AI Agents** - Coordinate your AI team with style

Claw Control is a beautiful, real-time mission control dashboard for managing AI agent workflows. Track tasks, monitor agent status, and coordinate your AI team through an intuitive Kanban interface with live updates.

![Claw Control Dashboard](https://img.shields.io/badge/status-alpha-orange) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **📋 Kanban Board** - Drag-and-drop task management with real-time sync
- **🤖 Agent Tracking** - Monitor agent status (idle/working/error)
- **💬 Activity Feed** - Real-time agent message stream
- **🔄 SSE Updates** - Live updates without polling
- **📱 Mobile Responsive** - Works on any device
- **🎨 Cyberpunk UI** - Sleek, dark theme with glowing accents

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- **SQLite** (bundled, no setup!) OR **PostgreSQL 14+** (production)
- npm or yarn

### Option 1: SQLite - Zero Setup! (Recommended for Local Dev)

```bash
# Clone the repo
git clone https://github.com/gokuclaw-adarsh/claw-control.git
cd claw-control

# Setup backend with SQLite
cd packages/backend
npm install
echo "DATABASE_URL=sqlite:./data/claw-control.db" > .env
npm run migrate
npm start

# In another terminal, setup frontend
cd packages/frontend
npm install
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```

That's it! No PostgreSQL needed! 🎉

### Option 2: Docker with PostgreSQL (Production)

```bash
# Clone the repo
git clone https://github.com/gokuclaw-adarsh/claw-control.git
cd claw-control

# Copy environment file
cp .env.example .env

# Start with Docker Compose (uses PostgreSQL)
docker-compose up -d
```

Visit `http://localhost:5173` - you're ready to go! 🎉

### Option 3: Docker with SQLite

```bash
# Use the SQLite override
docker-compose -f docker-compose.yml -f docker-compose.sqlite.yml up -d --scale db=0
```

### Option 4: Manual PostgreSQL Setup

```bash
# Clone the repo
git clone https://github.com/gokuclaw-adarsh/claw-control.git
cd claw-control

# Setup backend
cd packages/backend
npm install
cp .env.example .env  # Configure your PostgreSQL URL
npm run migrate
npm start

# In another terminal, setup frontend
cd packages/frontend
npm install
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```

## 📦 Project Structure

```
claw-control/
├── packages/
│   ├── frontend/          # React + Vite + TailwindCSS
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── types/       # TypeScript types
│   │   └── package.json
│   │
│   └── backend/           # Fastify + SQLite/PostgreSQL
│       ├── src/
│       │   ├── server.js      # Main API server
│       │   ├── db-adapter.js  # Database abstraction (SQLite/Postgres)
│       │   ├── sqlite-schema.sql  # SQLite schema
│       │   └── migrate.js     # DB migrations
│       └── package.json
│
├── docker-compose.yml         # Full stack (PostgreSQL)
├── docker-compose.sqlite.yml  # SQLite override
├── .env.example               # Environment template
└── LICENSE
```

## 🔌 API Reference

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/tasks/:id/progress` | Move task to next status |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | List all agents |
| POST | `/api/agents` | Create an agent |
| PUT | `/api/agents/:id` | Update agent (status, etc.) |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | List recent messages |
| POST | `/api/messages` | Post agent message |

### Real-time Stream

```
GET /api/stream - Server-Sent Events stream
```

Events: `task-created`, `task-updated`, `task-deleted`, `agent-updated`, `message-created`

## ⚙️ Agent Configuration

Claw Control uses a YAML file to define your agents. Edit `config/agents.yaml` to customize your team:

```yaml
# config/agents.yaml
agents:
  - name: "Goku"
    description: "Main coordinator - delegates tasks"
    role: "Coordinator"
    avatar: "🥋"

  - name: "Vegeta"
    description: "Backend specialist - APIs, databases"
    role: "Backend"
    avatar: "💪"

  - name: "Bulma"
    description: "DevOps & Frontend - infrastructure, UI"
    role: "DevOps"
    avatar: "🔧"
```

### Config Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Display name for the agent |
| `description` | ❌ | What this agent does |
| `role` | ❌ | Agent role/specialty (default: "Agent") |
| `avatar` | ❌ | Emoji or image path (default: "🤖") |
| `status` | ❌ | Initial status: idle, working, offline (default: "idle") |

### How It Works

1. **On first startup**: If no agents exist in the database, they're seeded from `config/agents.yaml`
2. **No config file?**: Falls back to default agents
3. **Docker**: Config is mounted as a volume - edit without rebuilding!

### Reload Config (Hot Reload)

Reload agents from config without restarting:

```bash
# Add new agents from config (won't overwrite existing)
curl -X POST http://localhost:3001/api/config/reload

# Force reload - clear all agents and recreate from config
curl -X POST http://localhost:3001/api/config/reload \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

### Config API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/config/reload` | Reload agents from YAML |
| GET | `/api/config/status` | Check config file status |

## 🎛️ Environment Variables

### Backend

```env
# SQLite (easy local setup - no external database needed):
DATABASE_URL=sqlite:./data/claw-control.db

# Or PostgreSQL (production):
DATABASE_URL=postgresql://user:password@localhost:5432/claw_control

PORT=3001
```

The database adapter auto-detects the type based on the URL prefix:
- `sqlite:` → Uses better-sqlite3 (bundled, zero setup)
- `postgresql://` → Uses pg (requires PostgreSQL server)

### Frontend

```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Integration

### MCP (Model Context Protocol)

Claw Control includes an MCP server for native AI agent integration. Claude and other MCP-compatible agents can interact with Mission Control directly.

**Available Tools:**
- `list_tasks` - Get all tasks (with optional status filter)
- `create_task` - Create a new task
- `update_task` - Update task status/details
- `list_agents` - Get all agents
- `update_agent_status` - Change agent status
- `post_message` - Post to agent feed

**MCP Configuration:**

Add to your Claude Desktop config (`claude_desktop_config.json`) or MCP client:

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

Or run directly:
```bash
cd packages/backend
npm run mcp
```

### REST API

Claw Control also exposes a simple REST API that any AI agent can use:

```javascript
// Update agent status
await fetch('http://localhost:3001/api/agents/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'working' })
});

// Post a message
await fetch('http://localhost:3001/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    agent_id: 1, 
    message: 'Starting task: Deploy to production' 
  })
});

// Create a task
await fetch('http://localhost:3001/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    title: 'Implement feature X',
    description: 'Add the new feature',
    status: 'todo',
    agent_id: 1
  })
});
```

## 🎨 Customization

The UI uses TailwindCSS with custom cyber-themed colors. Edit `packages/frontend/tailwind.config.js`:

```javascript
colors: {
  'cyber-green': '#39ff14',
  'cyber-blue': '#00d4ff',
  'cyber-red': '#ff3366',
  // ... add your own
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

Built with:
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Fastify](https://fastify.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [dnd-kit](https://dndkit.com/) for drag-and-drop
- [Lucide Icons](https://lucide.dev/)

---

Made with 🦞 by the OpenClaw team
