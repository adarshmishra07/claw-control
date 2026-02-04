# BOOTSTRAP.md - First Run Instructions

> **This file is your birth certificate.**
> Follow it, complete the setup, then delete it. You won't need it again.

---

## 👋 Welcome, New Agent

You've just been spawned. This file tells you who you are and what to do first.

**After completing setup, DELETE THIS FILE.** It's only for first run.

---

## 🎯 Step 1: Claim Your Identity

### Your Agent Details
```
Agent Name: [YOUR_NAME]
Agent ID: [YOUR_ID]
Role: [YOUR_ROLE]
Specialization: [WHAT_YOU_DO]
```

### Register with Mission Control
```bash
# Replace with your Mission Control URL
MISSION_CONTROL_URL="https://your-mission-control.example.com"

# Check if you're already registered
curl -s "$MISSION_CONTROL_URL/api/agents" | jq '.[] | select(.id == YOUR_ID)'

# If not, your coordinator will create you, or POST:
curl -X POST "$MISSION_CONTROL_URL/api/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "YOUR_NAME",
    "role": "YOUR_ROLE",
    "status": "idle",
    "avatar_url": "https://example.com/avatar.png"
  }'
```

---

## 📚 Step 2: Read Your Core Files

Before doing anything else, read and understand:

1. **`AGENTS.md`** — Your operating instructions
2. **`SOUL.md`** — Your personality (if it exists)
3. **`USER.md`** — Your human's context (if it exists)
4. **`TOOLS.md`** — Tool-specific configs (if it exists)

These files define how you work. Follow them.

---

## 🔧 Step 3: Initial Setup Tasks

### Create Required Directories
```bash
mkdir -p memory
```

### Create Your First Daily Note
```bash
DATE=$(date +%Y-%m-%d)
cat > "memory/$DATE.md" << 'EOF'
# $(date +%Y-%m-%d)

## First Run
- Agent initialized
- Completed bootstrap setup

## Notes
- [Add notes as you work]
EOF
```

### Verify Mission Control Connection
```bash
MISSION_CONTROL_URL="https://your-mission-control.example.com"

# Test connection
curl -s "$MISSION_CONTROL_URL/api/agents" && echo "✅ Connected"

# Announce yourself
curl -X POST "$MISSION_CONTROL_URL/api/messages" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": YOUR_ID, "message": "🚀 Agent [YOUR_NAME] online and ready!"}'
```

---

## 📋 Step 4: Understand Your Role

### If You're the Coordinator (Main Agent)
- You manage task delegation
- You communicate with the human
- You verify completed work
- You DO NOT execute tasks yourself

### If You're a Specialized Agent
- You receive tasks from the coordinator
- You update your status when working
- You post progress messages
- You mark tasks for review when done

### Task Workflow Reminder
```
backlog → todo → in_progress → review → completed
```

When you pick up a task:
```bash
# Set task to in_progress and assign yourself
curl -X PUT "$MISSION_CONTROL_URL/api/tasks/TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": YOUR_ID, "status": "in_progress"}'

# Set your status to working
curl -X PUT "$MISSION_CONTROL_URL/api/agents/YOUR_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "working"}'

# Post starting message
curl -X POST "$MISSION_CONTROL_URL/api/messages" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": YOUR_ID, "message": "🏗️ Starting task: [Task Name]"}'
```

When you finish:
```bash
# Set task to review
curl -X PUT "$MISSION_CONTROL_URL/api/tasks/TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "review"}'

# Set your status to idle
curl -X PUT "$MISSION_CONTROL_URL/api/agents/YOUR_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "idle"}'

# Post completion message
curl -X POST "$MISSION_CONTROL_URL/api/messages" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": YOUR_ID, "message": "✅ Task complete: [Task Name]"}'
```

---

## 🗑️ Step 5: Clean Up

You've completed first-run setup. Now:

1. **Delete this file:**
```bash
rm BOOTSTRAP.md
```

2. **Commit the deletion** (if in a git repo):
```bash
git add -A
git commit -m "Complete agent bootstrap"
```

---

## ✅ Checklist

Before deleting this file, confirm:

- [ ] Read `AGENTS.md`
- [ ] Read `SOUL.md` (if exists)
- [ ] Read `USER.md` (if exists)
- [ ] Created `memory/` directory
- [ ] Created first daily note
- [ ] Verified Mission Control connection
- [ ] Posted "online" message
- [ ] Understand your role

---

## 💡 Tips for Your First Session

1. **Don't overthink it** — Start working, learn as you go
2. **Update frequently** — Mission Control messages keep everyone in sync
3. **Ask when unsure** — Better to ask than to break something
4. **Document everything** — Your memory files are your continuity
5. **Follow the workflow** — The system works when everyone uses it

---

**You're ready. Delete this file and get to work.** 🚀
