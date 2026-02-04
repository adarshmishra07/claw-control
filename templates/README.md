# 📁 Claw Control Templates

Ready-to-use templates for setting up AI agent workspaces with Mission Control integration.

## What's Here

| File | Purpose |
|------|---------|
| `AGENTS.md` | Main workspace instructions template |
| `BOOTSTRAP.md` | First-run setup for new agents |

## Quick Start

### 1. Copy Templates to Your Agent Workspace

```bash
# Copy to your AI agent's workspace root
cp templates/AGENTS.md /path/to/your/agent/workspace/
cp templates/BOOTSTRAP.md /path/to/your/agent/workspace/
```

### 2. Configure Your Setup

Edit `AGENTS.md`:
- Update the Mission Control URL
- Customize agent roles if using multi-agent setup
- Add your team's specific conventions

Edit `BOOTSTRAP.md`:
- Fill in agent name, ID, and role
- Update the Mission Control URL
- Customize first-run tasks

### 3. Create Supporting Files

Your workspace should have:

```
workspace/
├── AGENTS.md          # Workspace instructions (from template)
├── BOOTSTRAP.md       # First-run setup (delete after use)
├── SOUL.md            # Agent personality (create your own)
├── USER.md            # Human context (create your own)
├── TOOLS.md           # Tool configs (create as needed)
├── MEMORY.md          # Long-term memories (agent creates)
└── memory/            # Daily notes (agent creates)
    └── YYYY-MM-DD.md
```

### 4. Start Your Agent

When your AI agent starts its first session, it will:
1. Read `BOOTSTRAP.md`
2. Follow the setup instructions
3. Connect to Mission Control
4. Delete `BOOTSTRAP.md`
5. Begin normal operations using `AGENTS.md`

## Example Configurations

### Single Agent Setup

For one AI assistant managing everything:

```markdown
# In BOOTSTRAP.md
Agent Name: Assistant
Agent ID: 1
Role: General
Specialization: Everything
```

### Multi-Agent Team

For a coordinated team of specialized agents:

```markdown
# Coordinator
Agent Name: Coordinator
Agent ID: 1
Role: Coordinator
Specialization: Delegation and user communication

# Backend Developer
Agent Name: Backend
Agent ID: 2
Role: Developer
Specialization: APIs, databases, backend systems

# Frontend Developer
Agent Name: Frontend
Agent ID: 3
Role: Developer
Specialization: UI components, styling, UX
```

## Integration with Mission Control

These templates assume you have a Mission Control backend running. Key endpoints:

```
POST   /api/tasks      - Create a task
GET    /api/tasks      - List all tasks
PUT    /api/tasks/:id  - Update a task

POST   /api/agents     - Create an agent
GET    /api/agents     - List all agents
PUT    /api/agents/:id - Update agent status

POST   /api/messages   - Post a message to the feed
GET    /api/messages   - Get recent messages
```

See the main [Claw Control README](../README.md) for deployment instructions.

## Customization Guide

### Adding Custom Workflows

In `AGENTS.md`, add a section for your team's specific processes:

```markdown
## 🔄 Our Workflow

### Code Review Process
1. Create PR
2. Post link to Mission Control
3. Wait for approval
4. Merge and update task

### Deployment Checklist
- [ ] Tests passing
- [ ] Docs updated
- [ ] Changelog entry
```

### Adding Tool Documentation

Create `TOOLS.md` for tool-specific notes:

```markdown
# TOOLS.md

## API Keys
- OpenAI: stored in .env
- GitHub: use gh cli

## SSH Hosts
- prod: user@prod.example.com
- staging: user@staging.example.com
```

### Custom Agent Personalities

Create `SOUL.md` to define agent personality:

```markdown
# SOUL.md

## Who I Am
I am a helpful AI assistant focused on software development.

## My Style
- Clear and concise
- Technical but approachable
- Ask clarifying questions when unsure

## My Values
- Code quality over speed
- Documentation matters
- Test everything
```

## Tips

1. **Start simple** — Use the templates as-is, customize later
2. **Version control** — Keep your workspace files in git
3. **Update frequently** — The templates are living documents
4. **Share learnings** — Contribute improvements back to Claw Control!

## Contributing

Found a way to improve these templates? We'd love your contribution!

1. Fork the repo
2. Edit the templates
3. Submit a PR with your improvements

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

---

*These templates are part of the [Claw Control](https://github.com/gokuclaw-adarsh/claw-control) project.*
