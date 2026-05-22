import { FormEvent, useState } from 'react';
import { Bot, Brain, Chrome, ClipboardList, Send, Sparkles, TerminalSquare } from 'lucide-react';
import { useOperatingStore } from '../../store/useOperatingStore';

interface Props {
  onSubmitGoal: (goal: string) => void;
}

export function RightInteractionPanel({ onSubmitGoal }: Props) {
  const { events, messages, tasks } = useOperatingStore();
  const [goal, setGoal] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = goal.trim();
    if (!trimmed) {
      return;
    }
    onSubmitGoal(trimmed);
    setGoal('');
  }

  return (
    <aside className="interaction-panel">
      <div className="panel-title">
        <Bot size={18} />
        <span>Interaction core</span>
      </div>

      <div className="conversation-stream">
        {messages.map((message) => (
          <div className={`message ${message.role}`} key={message.id}>
            <span>{message.role}</span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="goal-input" onSubmit={handleSubmit}>
        <textarea
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="Ask naturally: open WhatsApp, inspect my desktop, search the marketplace..."
        />
        <button type="submit" title="Send goal">
          <Send size={18} />
        </button>
      </form>

      <div className="panel-section compact-list">
        <div className="section-label">
          <ClipboardList size={16} />
          <span>Active tasks</span>
        </div>
        {tasks.length === 0 ? <span className="muted-line">No autonomous run active</span> : null}
        {tasks.map((task) => (
          <div className="task-row" key={task.id}>
            <div>
              <strong>{task.goal}</strong>
              <span>{task.state}</span>
            </div>
            <em>{Math.round(task.confidence * 100)}%</em>
          </div>
        ))}
      </div>

      <div className="panel-section event-stream">
        <div className="section-label">
          <Brain size={16} />
          <span>Reasoning trace</span>
        </div>
        {events.map((event) => (
          <div className={`event-row ${event.kind}`} key={event.id}>
            <i />
            <div>
              <strong>{event.title}</strong>
              <span>{event.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-dock">
        <div>
          <Chrome size={17} />
          <span>Browser activity</span>
        </div>
        <div>
          <TerminalSquare size={17} />
          <span>Desktop actions</span>
        </div>
        <div>
          <Sparkles size={17} />
          <span>Voice channel</span>
        </div>
      </div>
    </aside>
  );
}
