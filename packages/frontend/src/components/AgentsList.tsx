import { Bot, Circle } from 'lucide-react';
import type { Agent, AgentStatus } from '../types';

interface AgentsListProps {
  agents: Agent[];
  loading?: boolean;
}

const statusConfig: Record<AgentStatus, { color: string; label: string; pulse: boolean }> = {
  working: { color: 'bg-cyber-green', label: 'Working', pulse: true },
  idle: { color: 'bg-cyber-yellow', label: 'Idle', pulse: false },
  offline: { color: 'bg-cyber-red', label: 'Offline', pulse: false },
};

function StatusIndicator({ status }: { status: AgentStatus }) {
  const config = statusConfig[status] || statusConfig.offline;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <Circle 
          className={`w-2.5 h-2.5 ${config.color.replace('bg-', 'fill-')} ${config.color.replace('bg-', 'text-')}`}
          fill="currentColor"
        />
        {config.pulse && (
          <Circle 
            className={`absolute inset-0 w-2.5 h-2.5 ${config.color.replace('bg-', 'text-')} animate-ping opacity-75`}
            fill="currentColor"
          />
        )}
      </div>
      <span className={`text-[10px] uppercase tracking-wider ${config.color.replace('bg-', 'text-')}`}>
        {config.label}
      </span>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="p-3 sm:p-3 bg-cyber-dark/50 border border-cyber-green/20 rounded-lg hover:border-cyber-green/40 active:border-cyber-green/50 transition-colors group touch-manipulation">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center flex-shrink-0 group-hover:border-cyber-green/50 transition-colors">
          {agent.avatar ? (
            <img src={agent.avatar} alt={agent.name} className="w-full h-full rounded-lg object-cover" />
          ) : (
            <Bot className="w-5 h-5 text-cyber-green" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-white text-sm sm:text-sm truncate">{agent.name}</h3>
          </div>
          {agent.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{agent.description}</p>
          )}
          <div className="mt-2">
            <StatusIndicator status={agent.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentsList({ agents, loading }: AgentsListProps) {
  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-cyber-green/20">
          <h2 className="text-sm font-bold text-cyber-green uppercase tracking-widest flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Agents
          </h2>
        </div>
        <div className="flex-1 p-3 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-cyber-dark/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-cyber-green/20 bg-black/30">
        <h2 className="text-sm font-bold text-cyber-green uppercase tracking-widest flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Agents
          <span className="ml-auto text-[10px] font-mono text-cyber-green/50">{agents.length}</span>
        </h2>
      </div>
      {/* Mobile: grid layout for better use of space, Desktop: list */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        {agents.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            No agents connected
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
