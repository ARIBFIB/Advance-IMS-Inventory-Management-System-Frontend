// ═══════════════════════════════════════════════════════════
// COMPONENT: Task Detail Overlay (slide-in panel)
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { Task } from './types';
import { getStaffColor, initials, progressColor } from './helpers';
import { Badge, ProgressBar } from './MicroComponents';

interface TaskOverlayProps {
  task: Task | null;
  onClose: () => void;
  onMarkDone: (id: string) => void;
}

const TaskOverlay: React.FC<TaskOverlayProps> = ({ task, onClose, onMarkDone }) => {
  if (!task) return null;

  const color    = getStaffColor(task.assignee);
  const barColor = progressColor(task.status);

  const rows: [string, React.ReactNode][] = [
    ['Task ID',     <code className="ref">{task.id}</code>],
    ['Assigned To', (
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
        <div
          className="row-avatar"
          style={{ background: color, width: 20, height: 20, fontSize: 9 }}
        >
          {initials(task.assignee)}
        </div>
        {task.assignee}
      </div>
    )],
    ['Assigned By', task.assignedBy],
    ['Due Date',    task.due],
    ['Priority',    <Badge label={task.priority} />],
    ['Status',      <Badge label={task.status}   />],
    ['Linked To',
      task.linked !== '—'
        ? <span className="tag">{task.linked}</span>
        : '—'
    ],
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="task-backdrop open" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="task-overlay open">
        {/* Header */}
        <div className="overlay-header">
          <div className="overlay-title">
            {task.id} — {task.title.slice(0, 30)}…
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="overlay-body">
          {/* Status / priority / category tags */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            <Badge label={task.status}   />
            <Badge label={task.priority} />
            <span className="tag">{task.category}</span>
          </div>

          {/* Full title */}
          <div
            style={{
              fontSize: 13, fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 10, lineHeight: 1.4,
            }}
          >
            {task.title}
          </div>

          {/* Detail rows */}
          {rows.map(([k, v], i) => (
            <div className="detail-row" key={i}>
              <div className="detail-key">{k}</div>
              <div className="detail-val">{v}</div>
            </div>
          ))}

          {/* Progress */}
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 9.5, fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5,
              }}
            >
              Progress — {task.progress}%
            </div>
            <ProgressBar pct={task.progress} color={barColor} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {task.status !== 'Done' && (
              <button className="t-btn primary" onClick={() => onMarkDone(task.id)}>
                <i className="fa-solid fa-check" /> Mark Done
              </button>
            )}
            {(task.status === 'Pending' || task.status === 'In Progress') && (
              <button className="t-btn">
                <i className="fa-solid fa-pen" /> Edit
              </button>
            )}
            <button className="t-btn danger">
              <i className="fa-solid fa-trash" /> Delete
            </button>
            <button className="t-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskOverlay;