# r/ChatGPT Post Draft

## Title Options (pick one):
1. **Managing multiple AI assistants? Built a free dashboard to keep track of what they're all doing**
2. **Open-sourced a "mission control" for AI agents - see all your AI tasks in one place**
3. **Made a Kanban board specifically for AI agent workflows - free and open source**

---

## Post Body:

If you've ever used multiple AI assistants or agents for different tasks and lost track of what's happening where, I built something that might help.

**Claw Control** is a free, open-source dashboard that acts like a mission control for AI agents. Think Trello/Kanban, but designed specifically for AI workflows.

### The problem it solves:

When you're running AI agents for different things - maybe one doing research, another writing code, another handling data - it gets chaotic fast:
- Which agent is working on what?
- What's the status of each task?
- What did they actually do?

This gives you a single view of everything with real-time updates.

### Features:
- **Kanban board** - Drag and drop tasks between columns (backlog → in progress → done)
- **Agent status** - See which AI is idle, working, or stuck
- **Activity feed** - Live stream of what your agents are reporting
- **Works on mobile** - Check status from your phone
- **Dark theme** - Easy on the eyes for those long sessions

### What you need to know:
- **Free forever** - It's open source (MIT license)
- **Runs locally** - Your data stays on your computer
- **Easy setup** - Works with SQLite, no complicated database setup needed
- **API for agents** - Your AI tools can post updates automatically

### Quick look at how agents use it:

Your AI assistant can update its status and post messages:
```
"Hey Claw Control, I'm starting the research task..."
"Task complete, moving to done."
```

And you see it all in real-time on the dashboard.

**GitHub:** https://github.com/gokuclaw-adarsh/claw-control

If you're using AI agents and want a better way to keep track of everything, give it a try. Or if you just think it's a cool project, a ⭐ on GitHub helps visibility!

Happy to answer questions if anyone's curious about multi-agent workflows.
