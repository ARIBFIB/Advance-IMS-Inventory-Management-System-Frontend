// ═══════════════════════════════════════════════════════════
// PANEL: All Tasks  (tab → 'all')
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Task } from './types';
import { STAFF_LIST } from './constants';
import { getStaffColor, getStaffRole, initials, progressColor } from './helpers';
import { Badge, PriorityDot, ProgressBar } from './MicroComponents';

interface AllTasksPanelProps {
  tasks: Task[];
  onOpenTask: (id: string) => void;
  onMarkDone: (id: string) => void;
  onNewTask: () => void;
}

const CHIPS = [
  { label: 'All',         value: '',            icon: 'fa-list'                },
  { label: 'Pending',     value: 'Pending',     icon: ''                       },
  { label: 'In Progress', value: 'In Progress', icon: ''                       },
  { label: 'Done',        value: 'Done',        icon: ''                       },
  { label: 'Overdue',     value: 'Overdue',     icon: 'fa-triangle-exclamation' },
  { label: '🔴 High',    value: 'High',         icon: ''                       },
  { label: '🟡 Medium',  value: 'Medium',       icon: ''                       },
  { label: '🟢 Low',     value: 'Low',          icon: ''                       },
];

const AllTasksPanel: React.FC<AllTasksPanelProps> = ({ tasks, onOpenTask, onMarkDone, onNewTask }) => {
  const [search,         setSearch]         = useState('');
  const [chipFilter,     setChipFilter]     = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  const filtered = tasks.filter(t => {
    const q           = search.toLowerCase();
    const matchSearch = !search
      || t.title.toLowerCase().includes(q)
      || t.assignee.toLowerCase().includes(q)
      || t.id.toLowerCase().includes(q);
    const matchChip     = !chipFilter     || t.status === chipFilter || t.priority === chipFilter;
    const matchAssignee = !assigneeFilter || t.assignee === assigneeFilter;
    return matchSearch && matchChip && matchAssignee;
  });

  return (
    <>
      {/* ── Chip Filters ── */}
      <div className="chip-group">
        {CHIPS.map(c => (
          <div
            key={c.value}
            className={`chip ${chipFilter === c.value ? 'active' : ''}`}
            onClick={() => setChipFilter(c.value)}
          >
            {c.icon && (
              <i
                className={`fa-solid ${c.icon}`}
                style={c.value === 'Overdue' ? { color: 'var(--red)' } : undefined}
              />
            )}
            {c.label}
          </div>
        ))}
      </div>

      <div className="card">
        {/* ── Toolbar ── */}
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="t-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search task or staff..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="t-btn">
              <i className="fa-solid fa-calendar" /> Due Date
            </button>
            <select
              className="form-select"
              style={{ height: 27, fontSize: '10.5px' }}
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
            >
              <option value="">All Staff</option>
              {STAFF_LIST.map(s => <option key={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="toolbar-right">
            <button className="t-btn">
              <i className="fa-solid fa-file-export" /> Export
            </button>
            <button className="t-btn primary" onClick={onNewTask}>
              <i className="fa-solid fa-plus" /> New Task
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Task Title</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Assigned By</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const color    = getStaffColor(t.assignee);
                const barColor = progressColor(t.status);
                return (
                  <tr key={t.id} onClick={() => onOpenTask(t.id)}>
                    <td onClick={e => e.stopPropagation()}>
                      <input type="checkbox" />
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <PriorityDot priority={t.priority} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 11 }}>{t.title}</div>
                          <div className="td-sub">
                            <code className="ref">{t.id}</code>
                            {t.linked !== '—' && (
                              <> · <span className="tag">{t.linked}</span></>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td><span className="tag">{t.category}</span></td>

                    <td>
                      <div className="td-flex">
                        <div
                          className="row-avatar"
                          style={{ background: color }}
                        >
                          {initials(t.assignee)}
                        </div>
                        <div>
                          <div style={{ fontSize: '10.5px', fontWeight: 500 }}>{t.assignee}</div>
                          <div className="td-sub">{getStaffRole(t.assignee)}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {t.assignedBy}
                    </td>

                    <td
                      style={{
                        fontSize: 10,
                        whiteSpace: 'nowrap',
                        color:      t.status === 'Overdue' ? 'var(--red)' : undefined,
                        fontWeight: t.status === 'Overdue' ? 600 : undefined,
                      }}
                    >
                      {t.due}
                    </td>

                    <td><Badge label={t.priority} /></td>
                    <td><Badge label={t.status}   /></td>

                    <td style={{ minWidth: 80 }}>
                      <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginBottom: 2 }}>
                        {t.progress}%
                      </div>
                      <ProgressBar pct={t.progress} color={barColor} />
                    </td>

                    <td onClick={e => e.stopPropagation()}>
                      {t.status !== 'Done' && (
                        <button
                          className="t-btn primary"
                          style={{ height: 22, fontSize: 9.5 }}
                          onClick={() => onMarkDone(t.id)}
                        >
                          <i className="fa-solid fa-check" />
                        </button>
                      )}
                      <button
                        className="t-btn"
                        style={{ height: 22, fontSize: 9.5, marginLeft: 3 }}
                        onClick={() => onOpenTask(t.id)}
                      >
                        <i className="fa-solid fa-eye" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="pagination">
          <div>Showing 1–{filtered.length} of {filtered.length} tasks</div>
          <div className="pag-controls">
            <button className="pag-btn active">1</button>
            {filtered.length > 10 && <button className="pag-btn">2</button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTasksPanel;