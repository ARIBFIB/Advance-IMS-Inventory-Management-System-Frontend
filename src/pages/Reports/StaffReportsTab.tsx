// ═══════════════════════════════════════════════════════════
// StaffReportsTab.tsx
// ═══════════════════════════════════════════════════════════
import React from 'react';
import { STAFF_DATA, DEPT_TASKS } from './ReportsShared';

const StaffReportsTab: React.FC = () => {
  const sortedStaff = [...STAFF_DATA].sort((a, b) => b.score - a.score);
  const top6        = sortedStaff.slice(0, 6);
  const maxAssigned = Math.max(...DEPT_TASKS.map(d => d.assigned));

  return (
    <>
      {/* KPI Row */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Total Tasks (MTD)</div><div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-list-check" style={{ color: 'var(--blue)' }} /></div></div>
          <div className="stat-value">412</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +48 vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Avg Completion Rate</div><div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }} /></div></div>
          <div className="stat-value">87%</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +3% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Orders Processed</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-bag-shopping ic-orange" /></div></div>
          <div className="stat-value">1,164</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> by sales team</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Error Rate</div><div className="stat-icon" style={{ background: '#FEF2F2' }}><i className="fa-solid fa-circle-exclamation" style={{ color: 'var(--red)' }} /></div></div>
          <div className="stat-value">4.2%</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> Down from 5.8%</div>
        </div>
      </div>

      {/* Performance Ranking + Dept Tasks */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-ranking-star ic-orange" /> Staff Performance Ranking</div>
            <div className="card-actions">
              <select className="form-select" style={{ height: 26, fontSize: 11 }}>
                <option>May 2026</option><option>April 2026</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            {top6.map((s, i) => {
              const medals  = ['🥇', '🥈', '🥉'];
              const medal   = medals[i] ?? null;
              const sColor  = s.score >= 90 ? 'var(--green)' : s.score >= 75 ? 'var(--accent)' : 'var(--red)';
              return (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                  <div className="medal-cell">
                    {medal
                      ? <span>{medal}</span>
                      : <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</span>}
                  </div>
                  <div className="staff-avatar-sm" style={{ background: `${s.color}20`, color: s.color }}>
                    {s.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{s.role}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: sColor }}>{s.score}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Tasks by Department</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {DEPT_TASKS.map(d => {
              const donePct = Math.round((d.done / d.assigned) * 100);
              return (
                <div key={d.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 500 }}>{d.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {d.done}/{d.assigned} · <strong style={{ color: donePct >= 90 ? 'var(--green)' : 'var(--accent)' }}>{donePct}%</strong>
                    </span>
                  </div>
                  <div className="prog-bar" style={{ height: 7 }}>
                    <div className="prog-fill" style={{ width: `${(d.done / maxAssigned) * 100}%`, background: d.color, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Staff Detail Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-table" /> Staff Performance Detail</div>
          <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff Member</th><th>Role</th><th>Tasks Assigned</th><th>Completed</th>
                <th>Completion %</th><th>Orders</th><th>Errors</th><th>Error Rate</th><th>Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedStaff.map(s => {
                const pct     = Math.round((s.done / s.tasks) * 100);
                const errRate = s.orders > 0 ? ((s.errors / s.orders) * 100).toFixed(1) + '%' : '—';
                const sB      = s.score >= 90 ? 'green' : s.score >= 75 ? 'yellow' : 'red';
                return (
                  <tr key={s.name}>
                    <td>
                      <div className="td-flex">
                        <div className="staff-avatar-sm" style={{ background: `${s.color}20`, color: s.color }}>{s.avatar}</div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                      </div>
                    </td>
                    <td><span className="tag">{s.role}</span></td>
                    <td style={{ textAlign: 'center' }}>{s.tasks}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--green)' }}>{s.done}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div className="prog-bar" style={{ width: 44 }}>
                          <div className={`prog-fill ${pct >= 90 ? 'green' : pct >= 70 ? 'yellow' : 'red'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{s.orders || '—'}</td>
                    <td style={{ textAlign: 'center', color: s.errors > 5 ? 'var(--red)' : 'var(--text-muted)' }}>{s.errors}</td>
                    <td style={{ textAlign: 'center' }}>{errRate}</td>
                    <td><span className={`badge ${sB}`}>{s.score}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffReportsTab;