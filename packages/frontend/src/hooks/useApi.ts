import { useEffect, useState, useCallback, useRef } from 'react';
import type { Agent, Task, Message, KanbanData, TaskStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Transform helpers
export function transformTask(apiTask: Record<string, unknown>): Task {
  return {
    id: String(apiTask.id),
    title: String(apiTask.title || ''),
    description: String(apiTask.description || ''),
    status: (apiTask.status as TaskStatus) || 'backlog',
    agentId: apiTask.agent_id ? String(apiTask.agent_id) : undefined,
    createdAt: String(apiTask.created_at || new Date().toISOString()),
    updatedAt: String(apiTask.updated_at || new Date().toISOString()),
  };
}

export function transformAgent(apiAgent: Record<string, unknown>): Agent {
  return {
    id: String(apiAgent.id),
    name: String(apiAgent.name || ''),
    description: String(apiAgent.description || ''),
    status: (apiAgent.status as Agent['status']) || 'idle',
    avatar: apiAgent.avatar ? String(apiAgent.avatar) : undefined,
  };
}

export function transformMessage(apiMsg: Record<string, unknown>): Message {
  const ts = String(apiMsg.created_at ?? apiMsg.timestamp ?? new Date().toISOString());
  if (isNaN(new Date(ts).getTime())) {
     console.error("Invalid timestamp detected in transformMessage:", apiMsg, ts);
  }
  return {
    id: String(apiMsg.id ?? apiMsg.Id ?? ''),
    agentId: String(apiMsg.agent_id ?? apiMsg.agentId ?? ''),
    agentName: String(apiMsg.agent_name ?? apiMsg.agentName ?? 'Unknown'),
    content: String(apiMsg.message ?? apiMsg.content ?? ''),
    timestamp: ts,
    type: (apiMsg.type as Message['type']) ?? 'info',
  };
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/agents`);
      if (!res.ok) throw new Error('Failed to fetch agents');
      const data = await res.json();
      const rawAgents = Array.isArray(data) ? data : data.agents || [];
      setAgents(rawAgents.map(transformAgent));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, setAgents, loading, error, refetch: fetchAgents };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      const rawTasks = Array.isArray(data) ? data : data.tasks || [];
      setTasks(rawTasks.map(transformTask));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const kanban: KanbanData = {
    backlog: tasks.filter(t => t.status === 'backlog'),
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
    
    try {
      await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      fetchTasks();
    }
  }, [fetchTasks]);

  return { tasks, setTasks, kanban, loading, error, refetch: fetchTasks, moveTask };
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      const rawMessages = Array.isArray(data) ? data : data.messages || [];
      setMessages(rawMessages.map(transformMessage));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev.slice(-199), msg]);
  }, []);

  return { messages, setMessages, loading, error, refetch: fetchMessages, addMessage };
}

export function useSSE(
  onAgent?: (agent: Agent, action?: 'created' | 'updated') => void,
  onTask?: (task: Task | { id: string }, action?: 'created' | 'updated' | 'deleted') => void,
  onMessage?: (message: Message) => void,
  onInit?: (data: { tasks: Task[]; agents: Agent[] }) => void
) {
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    // Handle init event with full state
    eventSource.addEventListener('init', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        // Transform init data if needed
        // Assuming backend sends raw DB format, we might need to transform here too if onInit uses it directly
        // But onInit isn't widely used in current App.tsx logic (hooks handle fetching).
        onInit?.(data);
      } catch {}
    });

    // Agent events
    eventSource.addEventListener('agent-created', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onAgent?.(transformAgent(data), 'created');
      } catch {}
    });

    eventSource.addEventListener('agent-updated', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onAgent?.(transformAgent(data), 'updated');
      } catch {}
    });

    // Task events
    eventSource.addEventListener('task-created', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onTask?.(transformTask(data), 'created');
      } catch {}
    });

    eventSource.addEventListener('task-updated', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onTask?.(transformTask(data), 'updated');
      } catch {}
    });

    eventSource.addEventListener('task-deleted', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        // Deleted event sends ID as string for type compatibility
        onTask?.({ id: String(data.id) }, 'deleted');
      } catch {}
    });

    // Message events
    eventSource.addEventListener('message-created', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onMessage?.(transformMessage(data));
      } catch {}
    });

    // Legacy event names
    eventSource.addEventListener('agent', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onAgent?.(transformAgent(data), 'updated');
      } catch {}
    });

    eventSource.addEventListener('task', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onTask?.(transformTask(data), 'updated');
      } catch {}
    });

    eventSource.addEventListener('message', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        onMessage?.(transformMessage(data));
      } catch {}
    });

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onAgent, onTask, onMessage, onInit]);

  return { connected };
}
