import { useEffect, useRef } from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import type { Message } from '../types';

interface AgentChatProps {
  messages: Message[];
  loading?: boolean;
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } catch {
    return timestamp;
  }
}

const typeColors: Record<string, string> = {
  info: 'text-cyber-blue',
  success: 'text-cyber-green',
  warning: 'text-cyber-yellow',
  error: 'text-cyber-red',
};

function ChatMessage({ message }: { message: Message }) {
  console.log('ChatMessage render:', { message, timestampType: typeof message.timestamp, timestampVal: message.timestamp });
  const typeColor = typeColors[message.type || 'info'] || typeColors.info;
  
  return (
    <div className="px-2.5 sm:px-3 py-2.5 sm:py-2 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 last:border-0 touch-manipulation">
      <div className="flex items-center gap-2 mb-1.5 sm:mb-1">
        <div className="w-6 h-6 sm:w-5 sm:h-5 rounded bg-cyber-green/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-cyber-green" />
        </div>
        <span className="text-xs font-semibold text-cyber-green truncate">{message.agentName}</span>
        <span className="text-[10px] text-gray-500 font-mono ml-auto flex-shrink-0">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      <p className={`text-sm sm:text-sm pl-8 sm:pl-7 ${typeColor} break-words leading-relaxed`}>
        {message.content}
      </p>
    </div>
  );
}

export function AgentChat({ messages, loading }: AgentChatProps) {
  console.log('AgentChat render:', { messagesCount: messages.length, messages, loading });
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && containerRef.current) {
      const container = containerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-cyber-blue/20">
          <h2 className="text-sm font-bold text-cyber-blue uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Agent Feed
          </h2>
        </div>
        <div className="flex-1 p-3 space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-cyber-dark/30 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-cyber-blue/20 bg-black/30">
        <h2 className="text-sm font-bold text-cyber-blue uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Agent Feed
          <span className="ml-auto text-[10px] font-mono text-cyber-blue/50">{messages.length}</span>
        </h2>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No messages yet</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={scrollRef} />
          </>
        )}
      </div>
    </div>
  );
}
