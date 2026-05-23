import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BrainCircuit, Mic, MicOff, Pause, Power, Radio, Shield, Volume2, VolumeX } from 'lucide-react';
import { NeuralCore } from './components/core/NeuralCore';
import { LeftSystemPanel } from './components/panels/LeftSystemPanel';
import { RightInteractionPanel } from './components/panels/RightInteractionPanel';
import { executeGoal, getSystemStatus, subscribeToEvents } from './services/api';
import { useOperatingStore } from './store/useOperatingStore';

export default function App() {
  const {
    aiState,
    autonomous,
    executionState,
    microphone,
    muted,
    status,
    setStatus,
    addEvent,
    addMessage,
    mergeStatus,
    setAiState,
    setExecutionState,
    toggleAutonomous,
    toggleMicrophone,
    toggleMuted,
    upsertTask,
  } = useOperatingStore();

  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      try {
        const nextStatus = await getSystemStatus();
        if (mounted) {
          setStatus(nextStatus);
          setBackendOnline(true);
        }
      } catch {
        if (mounted) {
          setBackendOnline(false);
        }
      }
    }

    loadStatus();
    const id = window.setInterval(loadStatus, 2000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, [setStatus]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    try {
      subscribeToEvents(addEvent, mergeStatus)
        .then((unsubscribe) => {
          if (cancelled) {
            unsubscribe();
            return;
          }
          cleanup = unsubscribe;
        })
        .catch(() => undefined);
    } catch {
      cleanup = undefined;
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [addEvent, mergeStatus]);

  useEffect(() => {
    if (!window.electro?.onBackendLog) {
      return undefined;
    }

    return window.electro.onBackendLog((line) => {
      if (line.toLowerCase().includes('error')) {
        addEvent({
          id: crypto.randomUUID(),
          kind: 'system',
          title: 'Backend signal',
          detail: line.trim().slice(0, 220),
          timestamp: new Date().toISOString(),
        });
      }
    });
  }, [addEvent]);

  const coreCaption = useMemo(() => {
    if (!backendOnline) {
      return 'backend link pending';
    }
    if (aiState === 'thinking') {
      return 'semantic planning active';
    }
    if (aiState === 'error') {
      return 'attention required';
    }
    return 'local operating companion online';
  }, [aiState, backendOnline]);

  async function handleGoal(goal: string) {
    const taskId = crypto.randomUUID();
    addMessage({ role: 'user', text: goal });
    setAiState('thinking');
    setExecutionState('planning');
    upsertTask({ id: taskId, goal, state: 'planning', confidence: 0.34 });

    try {
      const result = await executeGoal(goal);
      setAiState(result.completed ? 'online' : result.requires_confirmation ? 'error' : 'thinking');
      setExecutionState(result.completed ? 'idle' : result.requires_confirmation ? 'paused' : 'verifying');
      upsertTask({
        id: taskId,
        goal,
        state: result.completed ? 'idle' : result.requires_confirmation ? 'paused' : 'verifying',
        confidence: result.confidence,
      });
      result.events.forEach(addEvent);
      addMessage({ role: 'assistant', text: result.summary });
    } catch {
      setAiState('error');
      setExecutionState('paused');
      addMessage({
        role: 'assistant',
        text: 'The desktop core is not reachable yet. I kept the request in view and will reconnect when the backend is available.',
      });
    }
  }

  return (
    <main className="os-shell">
      <div className="scanline" />
      <div className="window-drag-region" />

      <section className="left-rail">
        <LeftSystemPanel status={status} backendOnline={backendOnline} />
      </section>

      <section className="core-stage" aria-label="AI core visualization">
        <motion.div
          className="core-header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="eyebrow">Electro Agent</span>
            <h1>Autonomous desktop intelligence</h1>
          </div>
          <div className={`state-pill ${aiState}`}>
            <Radio size={15} />
            {coreCaption}
          </div>
        </motion.div>

        <NeuralCore state={aiState} executionState={executionState} />

        <div className="reasoning-band">
          <div>
            <BrainCircuit size={18} />
            <span>Goal model</span>
            <strong>{status.ollama.active_model}</strong>
          </div>
          <div>
            <Shield size={18} />
            <span>Safety layer</span>
            <strong>confirm destructive actions</strong>
          </div>
          <div>
            <Power size={18} />
            <span>Operator mode</span>
            <strong>{autonomous ? 'autonomous' : 'manual approval'}</strong>
          </div>
        </div>
      </section>

      <section className="right-rail">
        <RightInteractionPanel onSubmitGoal={handleGoal} />
      </section>

      <footer className="bottom-command">
        <button className={muted ? 'control active' : 'control'} type="button" onClick={toggleMuted} title="Mute voice">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{muted ? 'Muted' : 'Voice'}</span>
        </button>
        <button className="control" type="button" title="Pause assistant">
          <Pause size={18} />
          <span>Pause</span>
        </button>
        <button className={microphone ? 'control active' : 'control'} type="button" onClick={toggleMicrophone} title="Microphone">
          {microphone ? <Mic size={18} /> : <MicOff size={18} />}
          <span>{microphone ? 'Mic live' : 'Mic off'}</span>
        </button>
        <button className={autonomous ? 'control active' : 'control'} type="button" onClick={toggleAutonomous} title="Autonomous mode">
          <BrainCircuit size={18} />
          <span>{autonomous ? 'Autonomous' : 'Manual'}</span>
        </button>
        <button className="control danger" type="button" title="Emergency stop">
          <AlertTriangle size={18} />
          <span>Stop</span>
        </button>
        <div className="command-readout">
          <span>AI</span>
          <strong>{aiState}</strong>
          <span>Execution</span>
          <strong>{executionState}</strong>
          <span>Model</span>
          <strong>{status.ollama.active_model}</strong>
        </div>
      </footer>
    </main>
  );
}
