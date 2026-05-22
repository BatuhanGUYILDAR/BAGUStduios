import { Activity, Cpu, DatabaseZap, Gauge, Globe2, HardDrive, MemoryStick, ServerCog, Thermometer, Wifi } from 'lucide-react';
import type { SystemStatus } from '../../types';

function Meter({ label, value, accent = 'green' }: { label: string; value: number | null; accent?: 'green' | 'blue' | 'amber' | 'red' }) {
  const normalized = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong>{value === null ? 'n/a' : `${Math.round(value)}%`}</strong>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${accent}`} style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}

export function LeftSystemPanel({ status, backendOnline }: { status: SystemStatus; backendOnline: boolean }) {
  const temperatureEntries = Object.entries(status.temperatures).slice(0, 3);
  const fanEntries = Object.entries(status.fan_speeds).slice(0, 3);

  return (
    <aside className="system-panel">
      <div className="panel-title">
        <ServerCog size={18} />
        <span>System telemetry</span>
      </div>

      <div className="time-block">
        <strong>{status.time}</strong>
        <span>{status.date}</span>
      </div>

      <div className="signal-grid">
        <div>
          <Wifi size={16} />
          <span>{status.internet.label}</span>
        </div>
        <div>
          <Globe2 size={16} />
          <span>{status.weather}</span>
        </div>
        <div>
          <DatabaseZap size={16} />
          <span>{backendOnline ? 'Core linked' : 'Core pending'}</span>
        </div>
      </div>

      <div className="panel-section">
        <div className="section-label">
          <Gauge size={16} />
          <span>Compute</span>
        </div>
        <Meter label="CPU" value={status.cpu_percent} accent="green" />
        <Meter label="RAM" value={status.ram_percent} accent="blue" />
        <Meter label="GPU" value={status.gpu_percent} accent="amber" />
        <Meter label="VRAM" value={status.vram_percent} accent="red" />
      </div>

      <div className="panel-section compact-list">
        <div className="section-label">
          <Thermometer size={16} />
          <span>Thermals</span>
        </div>
        {temperatureEntries.length === 0 ? <span className="muted-line">Sensor access unavailable</span> : null}
        {temperatureEntries.map(([name, value]) => (
          <div className="metric-row" key={name}>
            <span>{name}</span>
            <strong>{Math.round(value)} C</strong>
          </div>
        ))}
        {fanEntries.map(([name, value]) => (
          <div className="metric-row" key={name}>
            <span>{name}</span>
            <strong>{Math.round(value)} rpm</strong>
          </div>
        ))}
      </div>

      <div className="panel-section compact-list">
        <div className="section-label">
          <Activity size={16} />
          <span>Network</span>
        </div>
        <div className="metric-row">
          <span>Upload</span>
          <strong>{Math.round(status.internet.sent_per_sec / 1024)} KB/s</strong>
        </div>
        <div className="metric-row">
          <span>Download</span>
          <strong>{Math.round(status.internet.received_per_sec / 1024)} KB/s</strong>
        </div>
      </div>

      <div className="panel-section compact-list">
        <div className="section-label">
          <Cpu size={16} />
          <span>AI models</span>
        </div>
        {status.active_models.map((model) => (
          <div className="metric-row" key={model}>
            <span>{model}</span>
            <strong>{status.ollama.models.includes(model) ? 'local' : 'ready'}</strong>
          </div>
        ))}
      </div>

      <div className="panel-section compact-list">
        <div className="section-label">
          <MemoryStick size={16} />
          <span>Active agents</span>
        </div>
        {status.active_agents.map((agent) => (
          <div className="metric-row" key={agent}>
            <span>{agent}</span>
            <strong>armed</strong>
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <HardDrive size={15} />
        <span>{status.ollama.online ? 'Ollama online' : status.ollama.message ?? 'Ollama offline'}</span>
      </div>
    </aside>
  );
}
