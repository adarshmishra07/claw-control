/**
 * @fileoverview Kanban Board Component.
 * 
 * Implements a drag-and-drop Kanban board for task management using @dnd-kit.
 * Tasks can be dragged between columns (Backlog, Todo, In Progress, Review, Completed)
 * to update their status. Supports both desktop and mobile layouts with
 * horizontal scrolling on mobile devices.
 * 
 * @module components/KanbanBoard
 */

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Inbox, ListTodo, Eye, CheckCircle2, GripVertical, Clock, Bot, Play } from 'lucide-react';
import type { Task, KanbanData, TaskStatus, Agent } from '../types';

/**
 * Formats a date string to relative time (e.g., "5m ago", "2h ago").
 * @param dateString - ISO date string
 * @returns Relative time string
 */
function getRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Color configuration for task cards based on status */
const statusColors: Record<TaskStatus, { border: string; glow: string }> = {
  backlog: { border: 'border-l-cyber-purple', glow: 'shadow-cyber-purple/20' },
  todo: { border: 'border-l-cyber-red', glow: 'shadow-cyber-red/20' },
  in_progress: { border: 'border-l-cyber-orange', glow: 'shadow-cyber-orange/20' },
  review: { border: 'border-l-cyber-yellow', glow: 'shadow-cyber-yellow/20' },
  completed: { border: 'border-l-cyber-green', glow: 'shadow-cyber-green/20' },
};

interface KanbanBoardProps {
  kanban: KanbanData;
  agents: Agent[];
  loading?: boolean;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
}

/** Column configuration mapping status to display properties */
const columnConfig: Record<TaskStatus, { title: string; icon: typeof Inbox; color: string }> = {
  backlog: { title: 'Backlog', icon: Inbox, color: 'cyber-purple' },
  todo: { title: 'Todo', icon: ListTodo, color: 'cyber-red' },
  in_progress: { title: 'In Progress', icon: Play, color: 'cyber-orange' },
  review: { title: 'Review', icon: Eye, color: 'cyber-yellow' },
  completed: { title: 'Completed', icon: CheckCircle2, color: 'cyber-green' },
};

interface TaskCardProps {
  task: Task;
  agents: Agent[];
  isDragging?: boolean;
}

/**
 * Task card component showing title, description, assigned agent, and timestamp.
 * @param props.task - Task data
 * @param props.agents - Available agents for assignment lookup
 * @param props.isDragging - Whether card is currently being dragged
 */
function TaskCard({ task, agents, isDragging }: TaskCardProps) {
  const agent = agents.find(a => a.id === task.agentId);
  const statusStyle = statusColors[task.status];
  const relativeTime = getRelativeTime(task.updatedAt || task.createdAt);
  
  return (
    <div 
      className={`
        group relative p-2.5 sm:p-3 bg-cyber-dark border border-white/10 rounded-lg transition-all
        border-l-2 ${statusStyle.border} touch-manipulation
        ${isDragging ? 'shadow-lg shadow-cyber-green/30 opacity-90 scale-[1.02]' : `hover:border-white/20 hover:${statusStyle.glow} active:scale-[0.98]`}
      `}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
      </div>
      
      <h4 className="text-sm font-semibold text-white pr-6 leading-tight">{task.title}</h4>
      
      {task.description && (
        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
      
      {/* Footer: Agent Badge + Timestamp */}
      <div className="flex items-center justify-between mt-2.5 sm:mt-3 pt-2 border-t border-white/5 gap-2">
        {agent ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-cyber-blue/30 to-cyber-purple/30 border border-cyber-blue/30 flex items-center justify-center flex-shrink-0">
              {agent.avatar ? (
                <img src={agent.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Bot className="w-3 h-3 text-cyber-blue" />
              )}
            </div>
            <span className="text-[10px] font-medium text-cyber-blue/80 truncate max-w-[70px] sm:max-w-[80px]">
              {agent.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 opacity-50 min-w-0">
            <div className="w-5 h-5 rounded-full bg-gray-700/50 border border-gray-600/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-[10px] text-gray-500">Unassigned</span>
          </div>
        )}
        
        {relativeTime && (
          <div className="flex items-center gap-1 text-gray-500 flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-mono">{relativeTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface SortableTaskProps {
  task: Task;
  agents: Agent[];
}

/**
 * Wrapper component that makes TaskCard sortable via dnd-kit.
 */
function SortableTask({ task, agents }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} agents={agents} />
    </div>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  agents: Agent[];
}

/**
 * Kanban column component that serves as a drop zone for tasks.
 */
function KanbanColumn({ status, tasks, agents }: KanbanColumnProps) {
  const config = columnConfig[status];
  const Icon = config.icon;
  
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'column' },
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex flex-col h-full bg-black/30 border border-white/5 rounded-xl overflow-hidden min-w-[280px] sm:min-w-[300px] md:min-w-0 max-w-[90vw] md:max-w-none snap-center flex-shrink-0 md:flex-shrink"
    >
      <div className={`p-2 sm:p-3 border-b border-${config.color}/20 bg-${config.color}/5`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${config.color}`} />
          <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider text-${config.color}`}>
            {config.title}
          </h3>
          <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-${config.color}/20 text-${config.color}`}>
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-1.5 sm:p-2 overflow-y-auto space-y-2 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTask key={task.id} task={task} agents={agents} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-600 text-xs">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main Kanban board component with drag-and-drop functionality.
 * Renders five columns and handles task movement between them.
 * 
 * @param props.kanban - Kanban data with tasks grouped by status
 * @param props.agents - Available agents for assignment display
 * @param props.loading - Whether data is still loading
 * @param props.onMoveTask - Callback when task is moved to new column
 */
export function KanbanBoard({ kanban, agents, loading, onMoveTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'completed'];
  const allTasks = [...kanban.backlog, ...kanban.todo, ...kanban.in_progress, ...kanban.review, ...kanban.completed];

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: TaskStatus | null = null;
    
    // Check if dropped directly on a column
    if (columns.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus;
    } else {
      // Dropped on another task - use that task's column
      const overTask = allTasks.find(t => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && newStatus !== task.status) {
      onMoveTask(taskId, newStatus);
    }
  };

  if (loading) {
    return (
      <div className="h-full p-2 sm:p-4">
        <div className="flex md:grid md:grid-cols-5 gap-2 sm:gap-4 h-full overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory pb-2 md:pb-0">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-black/30 rounded-xl animate-pulse min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-2 sm:p-4 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex md:grid md:grid-cols-5 gap-2 sm:gap-4 h-full overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory md:snap-none pb-2 md:pb-0 scrollbar-thin">
          {columns.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={kanban[status]}
              agents={agents}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} agents={agents} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
