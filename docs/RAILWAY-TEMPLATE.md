# 🦞 Claw Control - Railway Template

> **Deploy a complete AI agent dashboard in 2 minutes**

## What You're Deploying

This template sets up everything you need to run Claw Control:

| Service | Description |
|---------|-------------|
| **Backend** | Fastify API server with real-time SSE |
| **Frontend** | React dashboard with Kanban board |
| **Database** | PostgreSQL for persistent storage |

All services are automatically connected and configured.

---

## 🚀 Quick Deploy

1. **Click "Deploy on Railway"** 
2. **Wait ~2 minutes** for build & deploy
3. **Open your frontend URL** - that's it!

No environment variables required for basic setup.

---

## 📋 What's Included

### Dashboard Features
- **Kanban Board** - Drag-and-drop task management (Backlog → Todo → Review → Done)
- **Agent Status** - Real-time tracking (idle/working/error)
- **Activity Feed** - Live message stream from agents
- **Mobile Responsive** - Works on any device

### API Endpoints
Your backend exposes these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `GET` | `/api/agents` | List all agents |
| `PUT` | `/api/agents/:id` | Update agent status |
| `POST` | `/api/messages` | Post to activity feed |
| `GET` | `/api/stream` | SSE real-time updates |

---

## ⚙️ Environment Variables

### Backend (Auto-configured)
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | Auto-set by Railway |
| `PORT` | Server port | `3001` |
| `API_KEY` | Optional auth key | Empty (open mode) |

### Frontend (Auto-configured)
| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Backend API URL | Auto-set to backend service |

### Optional Security

To require authentication for write operations, add `API_KEY` to your backend:

1. Go to **Backend service** → **Variables**
2. Add `API_KEY` = `your-secret-key`
3. Include in requests: `Authorization: Bearer your-secret-key`

---

## 🤖 Connecting AI Agents

### Quick Start

```bash
# Set your backend URL
export CLAW_CONTROL_URL=https://your-backend.up.railway.app

# Update agent status
curl -X PUT $CLAW_CONTROL_URL/api/agents/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "working"}'

# Create a task
curl -X POST $CLAW_CONTROL_URL/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Deploy feature", "status": "todo"}'

# Post a message
curl -X POST $CLAW_CONTROL_URL/api/messages \
  -H "Content-Type: application/json" \
  -d '{"agent_id": 1, "message": "Starting deployment..."}'
```

### OpenClaw Integration

If you're using OpenClaw, install the Claw Control skill:

```
https://clawhub.ai/adarshmishra07/claw-control
```

The skill will:
- Walk you through connecting to your deployed instance
- Set up themed agent teams (DBZ, One Piece, Marvel, etc.)
- Configure your AGENTS.md for proper workflow
- Optionally set up Supermemory + QMD for enhanced memory

---

## 🎨 Customizing Your Team

### Default Agents (DBZ Theme)

| ID | Name | Role |
|----|------|------|
| 1 | Goku | Coordinator |
| 2 | Vegeta | Backend |
| 3 | Piccolo | Architecture |
| 4 | Gohan | Research |
| 5 | Bulma | DevOps |
| 6 | Trunks | Deployment |

### Change Agent Names

```bash
curl -X PUT $CLAW_CONTROL_URL/api/agents/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Tony", "role": "Coordinator"}'
```

---

## 📊 After Deployment

### Your URLs

After deployment, you'll have:
- **Frontend**: `https://[project]-frontend.up.railway.app` → Your dashboard
- **Backend**: `https://[project]-backend.up.railway.app` → API endpoint

### First Steps

1. **Open the frontend URL** - See your empty dashboard
2. **Create your first task** - Click "+ Add Task" or use the API
3. **Connect an agent** - Use the API to update agent status
4. **Watch it update** - Real-time via SSE!

---

## 🔧 Troubleshooting

### Frontend shows "OFFLINE"
- Check that backend deployed successfully
- Verify `API_URL` is set in frontend variables
- Check backend logs for errors

### Database connection errors
- Railway auto-provisions PostgreSQL - wait a minute for it to initialize
- Check `DATABASE_URL` is set in backend variables

### Agents not updating
- Ensure you're hitting the correct backend URL
- Check API responses for error messages
- If using `API_KEY`, verify the header is correct

---

## 📚 Resources

- **Website**: [www.clawcontrol.xyz](https://www.clawcontrol.xyz)
- **GitHub**: [github.com/adarshmishra07/claw-control](https://github.com/adarshmishra07/claw-control)
- **Skill**: [clawhub.ai/adarshmishra07/claw-control](https://clawhub.ai/adarshmishra07/claw-control)

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/adarshmishra07/claw-control/issues)
- **Discord**: Join the OpenClaw community

---

<p align="center">
  Made with 🦞 by the Claw Control team
</p>
