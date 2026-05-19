// ═══════════════════════════════════════════════════════════
// PANEL: Calendar  (tab → 'calendar')
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Task } from './types';
import { getTasksForDay } from './helpers';
import { Badge, EmptyState, ProgressBar } from './MicroComponents';
import { WEEKLY_DAYS } from './constants';

interface CalendarPanelProps {
  tasks: Task[];
  onOpenTask: (id: string) => void;
}

const DAY_LABELS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const START_DAY   = 4;   // May 2026 starts on Thursday (index 4)
const DAYS_IN_MONTH = 31;

const getDotColor = (t: Task): string => {
  if (t.status === 'Done')        return 'var(--green)';
  if (t.status === 'Overdue')     return 'var(--red)';
  if (t.status === 'In Progress') return 'var(--blue)';
  return 'var(--text-muted)';
};

const CalendarPanel: React.FC<CalendarPanelProps> = ({ tasks, onOpenTask }) => {
  const [selectedDay, setSelectedDay] = useState(11);

  const dayTasks = getTasksForDay(tasks, selectedDay);

  return (
    <>
      {/* ── Month calendar card ── */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-calendar-days ic-orange" /> May 2026
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="t-btn"><i className="fa-solid fa-chevron-left" /></button>
            <button className="t-btn">Today</button>
            <button className="t-btn"><i className="fa-solid fa-chevron-right" /></button>
          </div>
        </div>

        <div className="card-body">
          {/* Day-of-week labels */}
          <div className="cal-grid">
            {DAY_LABELS.map(d => (
              <div className="cal-day-label" key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="cal-grid">
            {/* Leading empty cells (prev month) */}
            {Array.from({ length: START_DAY }).map((_, i) => (
              <div className="cal-cell other-month" key={`pre-${i}`}>
                <div className="cal-date">{30 - START_DAY + 1 + i}</div>
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: DAYS_IN_MONTH }).map((_, idx) => {
              const d           = idx + 1;
              const dayTaskList = getTasksForDay(tasks, d);
              const isHighlight = d === 11 || d === selectedDay;

              return (
                <div
                  key={d}
                  className={`cal-cell ${isHighlight ? 'today' : ''}`}
                  onClick={() => setSelectedDay(d)}
                >
                  <div className="cal-date">{d}</div>
                  {dayTaskList.slice(0, 3).map((t, i) => (
                    <div
                      key={i}
                      className="cal-dot"
                      style={{ background: getDotColor(t), opacity: 0.7 }}
                    />
                  ))}
                  {dayTaskList.length > 3 && (
                    <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>
                      +{dayTaskList.length - 3}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Trailing empty cells (next month) */}
            {Array.from({ length: (7 - ((START_DAY + DAYS_IN_MONTH) % 7)) % 7 }).map((_, i) => (
              <div className="cal-cell other-month" key={`post-${i}`}>
                <div className="cal-date">{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row: selected-day tasks + weekly overview ── */}
      <div className="detail-grid-2">

        {/* Selected-day Tasks */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-calendar-day" /> Tasks for {selectedDay} May 2026
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {dayTasks.length === 0 ? (
              <EmptyState icon="fa-calendar-xmark" title="No tasks this day" />
            ) : (
              dayTasks.map(t => {
                const iconClass =
                  t.status === 'Done'    ? 'fa-check ic-green'              :
                  t.status === 'Overdue' ? 'fa-triangle-exclamation ic-red' :
                                           'fa-clock ic-blue';

                const bgColor =
                  t.status === 'Done'    ? 'var(--green-bg)' :
                  t.status === 'Overdue' ? 'var(--red-bg)'   :
                                           'var(--blue-bg)';

                return (
                  <div
                    className="list-item"
                    key={t.id}
                    onClick={() => onOpenTask(t.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="list-icon" style={{ background: bgColor }}>
                      <i className={`fa-solid ${iconClass}`} style={{ fontSize: 10 }} />
                    </div>
                    <div className="list-content">
                      <div className="list-title" style={{ fontSize: '10.5px' }}>{t.title}</div>
                      <div className="list-meta">
                        {t.assignee} · {t.due.split(',')[1] || ''}
                      </div>
                    </div>
                    <div className="list-right">
                      <Badge label={t.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-circle-info ic-blue" /> Weekly Overview
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {WEEKLY_DAYS.map(w => {
              const dayTaskList = getTasksForDay(tasks, w.day);
              const done        = dayTaskList.filter(t => t.status === 'Done').length;
              const pct         = dayTaskList.length > 0
                ? Math.round((done / dayTaskList.length) * 100)
                : Math.floor(Math.random() * 40 + 50);
              const barColor    = pct > 80 ? 'var(--green)' : pct > 50 ? 'var(--blue)' : 'var(--accent)';

              return (
                <div className="list-item" key={w.label}>
                  <div style={{ width: 40, fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>
                    {w.label}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ProgressBar pct={pct} color={barColor} />
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      marginLeft: 8,
                      color: 'var(--text-secondary)',
                      width: 30,
                      textAlign: 'right',
                    }}
                  >
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
};

export default CalendarPanel;