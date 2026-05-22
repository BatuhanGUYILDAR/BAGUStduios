/// <reference types="vite/client" />

interface Window {
  electro?: {
    platform: () => Promise<{ platform: string; backendUrl: string }>;
    onBackendLog: (handler: (line: string) => void) => () => void;
  };
}
