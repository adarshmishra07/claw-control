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
- PostgreSQL 14+
- npm or yarn

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/gokuclaw-adarsh/claw-control.git
cd claw-control

# Copy environment file
cp .env.example .env

# Start with Docker Compose
docker-compose up -d
```

Visit `http://localhost:5173` - you're ready to go! 🎉

### Option 2: Manual Setup

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
│   └── backend/           # Fastify + PostgreSQL
│       ├── src/
│       │   ├── server.js    # Main API server
│       │   ├── db.js        # Database connection
│       │   └── migrate.js   # DB migrations
│       └── package.json
│
├── docker-compose.yml     # Full stack deployment
├── .env.example           # Environment template
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

## 🎛️ Environment Variables

### Backend

```env
DATABASE_URL=postgresql://user:password@localhost:5432/claw_control
PORT=3001
```

### Frontend

```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Integration

Claw Control exposes a simple REST API that any AI agent can use:

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
