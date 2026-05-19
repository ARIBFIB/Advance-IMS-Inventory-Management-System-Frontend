// AvailabilityPanel.tsx
import React, { useState } from 'react';
import {
  AVAILABILITY_DATA, SCHEDULE_DATA, AVATAR_COLORS,
  initials,
  Badge, DayBadge, InnerTabs, EmptyState,
} from './shared';

const AvailabilityPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('today');

  return (
    <>
      <div className="panel-heading">Rider Availability</div>
      <div className="panel-desc">
        View and manage rider shifts, day-off schedules, and real-time availability. Ensure adequate
        coverage for each zone.
      </div>

      <InnerTabs
        tabs={[
          { id: 'today',    label: 'Today'          },
          { id: 'week',     label: 'This Week'      },
          { id: 'schedule', label: 'Shift Schedule' },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── TODAY ── */}
      {innerTab === 'today' && (
        <>
          <div className="mini-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="mini-stat">
              <div className="ms-label">On Duty</div>
              <div className="ms-value" style={{ color: 'var(--green)' }}>6</div>
              <div className="ms-trend">Currently active</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">Day Off</div>
              <div className="ms-value" style={{ color: 'var(--text-muted)' }}>1</div>
              <div className="ms-trend">Scheduled off</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">Absent / Sick</div>
              <div className="ms-value" style={{ color: 'var(--red)' }}>1</div>
              <div className="ms-trend down">Unplanned absence</div>
            </div>
          </div>

          <div className="card">
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rider</th><th>Shift</th><th>Check-In</th><th>Zone</th>
                    <th>Current Task</th><th>Availability</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {AVAILABILITY_DATA.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <div className="td-flex">
                          <div className="row-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], fontSize: 9 }}>
                            {initials(a.rider)}
                          </div>
                          <strong>{a.rider}</strong>
                        </div>
                      </td>
                      <td><span className="tag">{a.shift}</span></td>
                      <td>{a.checkin}</td>
                      <td>{a.zone}</td>
                      <td>{a.task !== '—' ? <code className="sku">{a.task}</code> : '—'}</td>
                      <td><Badge label={a.avail} /></td>
                      <td>
                        <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                          <i className="fa-solid fa-pen" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── WEEK ── */}
      {innerTab === 'week' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-calendar-week" title="Weekly Schedule" desc="Weekly view of rider shift assignments and off days." />
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {innerTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-calendar-alt" /> Shift Schedule Configuration</div>
            <button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Shift</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rider</th><th>Mon</th><th>Tue</th><th>Wed</th>
                  <th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_DATA.map(s => (
                  <tr key={s.rider}>
                    <td><strong>{s.rider.split(' ')[0]}</strong></td>
                    {s.days.map((d, i) => (
                      <td key={i} style={{ textAlign: 'center' }}><DayBadge d={d} /></td>
                    ))}
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-pen" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailabilityPanel;