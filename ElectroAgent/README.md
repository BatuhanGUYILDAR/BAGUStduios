# Electro Agent

Electro Agent is a desktop-first autonomous AI operating companion. It is built as an Electron shell with a React cinematic operating surface and a local FastAPI orchestration core.

## Architecture

- Desktop layer: Electron main and preload process
- UI layer: React, Vite, Three.js, React Three Fiber, Framer Motion, Zustand
- Backend core: FastAPI with modular agent services
- Local AI: Ollama-first model router
- Memory: ChromaDB when available, JSONL fallback
- Desktop intelligence: app discovery, desktop observation, browser handoff, voice status, safety policy

## Run

Install Node dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

Start the desktop app:

```bash
npm run dev
```

The UI runs at `http://127.0.0.1:5173`, the local core runs at `http://127.0.0.1:8710`, and Electron hosts the native desktop shell.

Install optional desktop automation packages only when you are ready to enable screenshot OCR, ChromaDB, Playwright, and native control:

```bash
.venv\Scripts\python.exe -m pip install -r backend\requirements-optional.txt
```

## Safety Model

Auto allowed:

- Open safe applications
- Open browser searches
- Observe desktop state
- Read app indexes and local memory

Confirmation required:

- Deleting files
- Registry actions
- Shell and terminal execution
- Shutdown and restart
- Sensitive system changes

Restricted:

- Credential theft
- Keylogging
- Security bypasses
- Unrestricted arbitrary execution
