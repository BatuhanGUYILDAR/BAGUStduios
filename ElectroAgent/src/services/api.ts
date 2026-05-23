import type { AgentEvent, GoalResponse, SystemStatus } from '../types';

const fallbackBackendUrl = 'http://127.0.0.1:8710';
let backendUrlPromise: Promise<string> | null = null;

async function getBackendUrl(): Promise<string> {
  if (!backendUrlPromise) {
    backendUrlPromise = window.electro?.platform
      ? window.electro.platform().then((platform) => platform.backendUrl || fallbackBackendUrl).catch(() => fallbackBackendUrl)
      : Promise.resolve(fallbackBackendUrl);
  }

  return backendUrlPromise;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const backendUrl = await getBackendUrl();
  const response = await fetch(`${backendUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  return request<SystemStatus>('/system/status');
}

export async function executeGoal(goal: string): Promise<GoalResponse> {
  return request<GoalResponse>('/agent/execute', {
    method: 'POST',
    body: JSON.stringify({ goal, autonomous: true }),
  });
}

export async function subscribeToEvents(onEvent: (event: AgentEvent) => void, onState?: (state: Partial<SystemStatus>) => void) {
  const backendUrl = await getBackendUrl();
  const socketUrl = backendUrl.replace(/^http/, 'ws');
  const socket = new WebSocket(`${socketUrl}/ws/events`);

  socket.addEventListener('message', (message) => {
    const payload = JSON.parse(message.data);
    if (payload.type === 'event') {
      onEvent(payload.data as AgentEvent);
    }
    if (payload.type === 'status') {
      onState?.(payload.data as Partial<SystemStatus>);
    }
  });

  return () => socket.close();
}
