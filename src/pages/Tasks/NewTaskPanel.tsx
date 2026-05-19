// ═══════════════════════════════════════════════════════════
// PANEL: New Task Form  (tab → 'add')
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { Task } from './types';
import { STAFF_LIST, CATEGORIES } from './constants';
import { getStaffColor, initials } from './helpers';
import { Badge, ProgressBar, ToggleSwitch } from './MicroComponents';

interface NewTaskPanelProps {
  tasks: Task[];
  onCancel: () => void;
}

const NewTaskPanel: React.FC<NewTaskPanelProps> = ({ tasks, onCancel }) => {
  // Build workload map: assignee → task count
  const workload: Record<string, number> = {};
  tasks.forEach(t => {
    workload[t.assignee] = (workload[t.assignee] || 0) + 1;
  });

  return (
    <div className="detail-grid-2" style={{ alignItems: 'start' }}>

      {/* ── Left: Create Task form ── */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-circle-plus ic-orange" /> Create New Task
          </div>
        </div>
        <div className="card-body">

          {/* Title */}
          <div className="form-row single">
            <div className="form-group">
              <div className="form-label">Task Title *</div>
              <input
                className="form-input"
                placeholder="e.g. Restock warehouse shelves — Section B"
              />
            </div>
          </div>

          {/* Category + Priority */}
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Category *</div>
              <select className="form-select">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Priority *</div>
              <select className="form-select">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Assign To + Assigned By */}
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Assign To *</div>
              <select className="form-select">
                {STAFF_LIST.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Assigned By</div>
              <select className="form-select">
                <option>Admin Khan (Self)</option>
                <option>Operations Manager</option>
              </select>
            </div>
          </div>

          {/* Due Date + Due Time */}
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Due Date *</div>
              <input className="form-input" type="date" />
            </div>
            <div className="form-group">
              <div className="form-label">Due Time</div>
              <input className="form-input" type="time" defaultValue="17:00" />
            </div>
          </div>

          {/* Linked To */}
          <div className="form-row single">
            <div className="form-group">
              <div className="form-label">Linked To (Optional)</div>
              <select className="form-select">
                <option value="">— None —</option>
                <option>Order: ORD-1045</option>
                <option>Order: ORD-1040</option>
                <option>Product: Classic Lawn Suit</option>
                <option>Supplier: Al-Karam Textile</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-row single">
            <div className="form-group">
              <div className="form-label">Description / Instructions</div>
              <textarea
                className="form-textarea"
                placeholder="Detailed instructions for this task..."
              />
            </div>
          </div>

          {/* Notify toggle */}
          <div className="form-row single">
            <div
              className="form-group"
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <div className="form-label" style={{ marginBottom: 0 }}>Notify Assignee</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>
                  Send notification when task is created
                </div>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="t-btn primary">
              <i className="fa-solid fa-check" /> Create Task
            </button>
            <button className="t-btn" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>

      {/* ── Right: sidebar widgets ── */}
      <div>
        {/* Recent Tasks */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-clock-rotate-left" /> Recent Tasks Created
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {tasks.slice(0, 5).map(t => (
              <div className="list-item" key={t.id}>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: '10.5px' }}>
                    {t.title.slice(0, 45)}…
                  </div>
                  <div className="list-meta">{t.assignee} · {t.category}</div>
                </div>
                <div className="list-right">
                  <Badge label={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Workload */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-users ic-blue" /> Staff Workload
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {Object.entries(workload)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => {
                const color    = getStaffColor(name);
                const pct      = Math.round((count / 15) * 100);
                const barColor = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--yellow)' : 'var(--green)';
                return (
                  <div className="list-item" key={name}>
                    <div
                      className="row-avatar"
                      style={{ background: color, width: 22, height: 22, fontSize: 9 }}
                    >
                      {initials(name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 500, marginBottom: 3 }}>
                        {name.split(' ')[0]}{' '}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({count} tasks)
                        </span>
                      </div>
                      <ProgressBar pct={pct} color={barColor} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default NewTaskPanel;