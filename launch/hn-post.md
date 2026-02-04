# Show HN: Claw Control – Open-source Kanban for AI Agents

**Title:** Show HN: Claw Control – Open-source Kanban for AI Agents

---

**Body:**

Hey HN!

I built Claw Control because managing multiple AI agents felt like herding cats in the dark. When you've got Claude handling research, GPT doing code review, and custom agents processing data—who's working on what? What just finished? Is anything stuck?

Claw Control is a real-time Kanban dashboard for coordinating AI agent workflows. Think Trello, but designed for AI teams instead of human ones.

**What it does:**
- **Kanban board** with drag-and-drop task management
- **Agent status tracking** (idle/working/error) at a glance
- **Live activity feed** showing what agents are reporting
- **Real-time updates** via SSE—no polling, instant sync
- **MCP integration** for native Claude Desktop / AI tool support
- **REST API** for easy integration with any agent framework

**Tech stack:** React 19, TypeScript, Fastify 5, SQLite (dev) or PostgreSQL (prod), TailwindCSS

**What makes it different:** Most task boards assume humans are the workers. Claw Control treats AI agents as first-class team members—they can update their own status, post messages, and move tasks through the pipeline via API or MCP tools.

Zero setup for local dev—SQLite bundled, just `npm install && npm start`. Docker available for production deployments.

**Links:**
- GitHub: https://github.com/gokuclaw-adarsh/claw-control
- MIT licensed

This started as an internal tool for managing our own AI workflows and we decided to open-source it. Still in alpha—the UI has a cyberpunk aesthetic that might not be everyone's taste, and we're working on better docs.

Would love feedback: Is this solving a real problem for others? What integrations would be most useful? Any obvious features we're missing?
