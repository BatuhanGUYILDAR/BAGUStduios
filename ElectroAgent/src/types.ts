export type AiState = 'online' | 'thinking' | 'error';

export type ExecutionState = 'idle' | 'observing' | 'planning' | 'executing' | 'verifying' | 'paused';

export interface OllamaStatus {
  online: boolean;
  models: string[];
  active_model: string;
  message?: string;
}

export interface NetworkStatus {
  online: boolean;
  label: string;
  sent_per_sec: number;
  received_per_sec: number;
}

export interface VoiceStatus {
  listening: boolean;
  muted: boolean;
  wake_word: string;
  provider: string;
}

export interface SystemStatus {
  time: string;
  date: string;
  weather: string;
  internet: NetworkStatus;
  cpu_percent: number;
  gpu_percent: number | null;
  vram_percent: number | null;
  ram_percent: number;
  temperatures: Record<string, number>;
  fan_speeds: Record<string, number>;
  active_models: string[];
  active_agents: string[];
  ollama: OllamaStatus;
  voice: VoiceStatus;
  execution_state: ExecutionState;
  ai_state: AiState;
}

export interface AgentEvent {
  id: string;
  kind: 'observation' | 'reasoning' | 'action' | 'verification' | 'safety' | 'system';
  title: string;
  detail: string;
  timestamp: string;
}

export interface TaskItem {
  id: string;
  goal: string;
  state: ExecutionState;
  confidence: number;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface GoalResponse {
  run_id: string;
  goal: string;
  completed: boolean;
  confidence: number;
  summary: string;
  events: AgentEvent[];
  requires_confirmation?: boolean;
}
