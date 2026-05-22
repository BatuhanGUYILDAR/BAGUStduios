import { create } from 'zustand';
import type { AgentEvent, AiState, ConversationMessage, ExecutionState, SystemStatus, TaskItem } from '../types';

const now = () => new Date().toISOString();

function fallbackStatus(): SystemStatus {
  return {
    time: new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()),
    date: new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()),
    weather: 'Local weather pending',
    internet: {
      online: false,
      label: 'Backend offline',
      sent_per_sec: 0,
      received_per_sec: 0,
    },
    cpu_percent: 0,
    gpu_percent: null,
    vram_percent: null,
    ram_percent: 0,
    temperatures: {},
    fan_speeds: {},
    active_models: ['qwen3:8b', 'deepseek-r1:8b'],
    active_agents: ['planner', 'observer', 'operator'],
    ollama: {
      online: false,
      models: [],
      active_model: 'qwen3:8b',
      message: 'Waiting for backend',
    },
    voice: {
      listening: false,
      muted: false,
      wake_word: 'electro',
      provider: 'faster-whisper',
    },
    execution_state: 'idle',
    ai_state: 'online',
  };
}

interface OperatingStore {
  aiState: AiState;
  executionState: ExecutionState;
  autonomous: boolean;
  microphone: boolean;
  muted: boolean;
  status: SystemStatus;
  messages: ConversationMessage[];
  events: AgentEvent[];
  tasks: TaskItem[];
  setStatus: (status: SystemStatus) => void;
  mergeStatus: (status: Partial<SystemStatus>) => void;
  setAiState: (state: AiState) => void;
  setExecutionState: (state: ExecutionState) => void;
  toggleAutonomous: () => void;
  toggleMicrophone: () => void;
  toggleMuted: () => void;
  addMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  addEvent: (event: AgentEvent) => void;
  upsertTask: (task: TaskItem) => void;
}

export const useOperatingStore = create<OperatingStore>((set) => ({
  aiState: 'online',
  executionState: 'idle',
  autonomous: true,
  microphone: true,
  muted: false,
  status: fallbackStatus(),
  messages: [
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: 'I am online. Local systems are coming into focus.',
      timestamp: now(),
    },
  ],
  events: [
    {
      id: crypto.randomUUID(),
      kind: 'system',
      title: 'Core initialized',
      detail: 'Desktop shell, orchestration core, and local model router are standing by.',
      timestamp: now(),
    },
  ],
  tasks: [],
  setStatus: (status) =>
    set({
      status,
      aiState: status.ai_state,
      executionState: status.execution_state,
    }),
  mergeStatus: (status) =>
    set((state) => ({
      status: { ...state.status, ...status },
      aiState: status.ai_state ?? state.aiState,
      executionState: status.execution_state ?? state.executionState,
    })),
  setAiState: (aiState) => set({ aiState }),
  setExecutionState: (executionState) => set({ executionState }),
  toggleAutonomous: () => set((state) => ({ autonomous: !state.autonomous })),
  toggleMicrophone: () => set((state) => ({ microphone: !state.microphone })),
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages.slice(-11),
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: now(),
        },
      ],
    })),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events.slice(-10), event],
    })),
  upsertTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks.filter((item) => item.id !== task.id)].slice(0, 5),
    })),
}));
