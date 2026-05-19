// ═══════════════════════════════════════════════════════════
// PerformanceTab.tsx — Tab 3: Performance leaderboard & stats
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { PerfPeriod } from './staff.types';
import { STAFF_DATA, DEPT_PERFORMANCE, scoreColor, scoreFill, completionPct } from './staffData';
import ProgBar from './ProgBar';

const MEDALS = ['🥇', '🥈', '🥉'];

const PerformanceTab: React.FC = () => {
  const [period, setPeriod] = useState<PerfPeriod>('month');
  const sorted = [...STAFF_DATA].sort((a, b) => b.score - a.score);

  return (
    <>
      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Top Performer</div>
            <div className="stat-icon" style={{ background: '#FFFBEB' }}>
              <i className="fa-solid fa-trophy" style={{ color: '#F59E0B' }} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: 14 }}>Sara Khan</div>
          <div className="stat-trend up"><i className="fa-solid fa-star" /> 97% completion rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Total Tasks MTD</div>
            <div className="stat-icon" style={{ background: '#EFF6FF' }}>
              <i className="fa-solid fa-clipboard-list" style={{ color: '#3B82F6' }} />
            </div>
          </div>
          <div className="stat-value">412</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +48 vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Avg Completion Rate</div>
            <div className="stat-icon" style={{ background: '#F0FDF4' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#22C55E' }} />
            </div>
          </div>
          <div className="stat-value">87%</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +3% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Overdue Tasks</div>
            <div className="stat-icon" style={{ background: '#FFF5EE' }}>
              <i className="fa-solid fa-triangle-exclamation ic-orange" />
            </div>
          </div>
          <div className="stat-value">7</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs attention</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        {/* ── Leaderboard ───────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-ranking-star ic-orange" /> Performance Leaderboard</div>
            <div className="card-actions">
              <select
                className="form-select"
                style={{ height: 26, fontSize: 11 }}
                value={period}
                onChange={e => setPeriod(e.target.value as PerfPeriod)}
              >
                <option value="month">This Month</option>
                <option value="week">This Week</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            {sorted.slice(0, 8).map((s, i) => {
              const sc = scoreColor(s.score);
              return (
                <div className="leaderboard-row" key={s.id}>
                  <div className="leaderboard-rank">
                    {i < 3
                      ? MEDALS[i]
                      : <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</span>
                    }
                  </div>
                  <div className="leaderboard-avatar" style={{ background: `${s.color}20`, color: s.color }}>
                    {s.avatar}
                  </div>
                  <div className="leaderboard-info">
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.role}</div>
                  </div>
                  <div className="leaderboard-score">
                    <div style={{ fontSize: 13, fontWeight: 800, color: sc }}>{s.score}%</div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{s.completed}/{s.tasks} tasks</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Department Performance ─────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Department Performance</div>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {DEPT_PERFORMANCE.map(d => (
              <div className="dept-perf-row" key={d.dept}>
                <div className="dept-perf-label">{d.dept}</div>
                <div className="prog-bar" style={{ flex: 1, height: 10 }}>
                  <div
                    className="prog-fill"
                    style={{
                      width: `${d.score}%`,
                      background: d.score >= 90 ? 'var(--green)' : d.score >= 75 ? 'var(--accent)' : '#DC2626',
                      borderRadius: 2,
                    }}
                  />
                </div>
                <div className="dept-perf-val">{d.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Individual Performance Table ────────────────── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-user-chart" /> Individual Performance Breakdown</div>
          <div className="card-actions">
            <select className="form-select" style={{ height: 26, fontSize: 11 }}>
              <option>May 2026</option>
              <option>April 2026</option>
              <option>March 2026</option>
            </select>
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Tasks Assigned</th>
                <th>Completed</th>
                <th>Overdue</th>
                <th>Completion Rate</th>
                <th>Orders Processed</th>
                <th>Errors</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                const pct        = completionPct(s);
                const overdue    = s.tasks - s.completed;
                const fill       = scoreFill(s.score);
                const scoreBadge = s.score >= 90 ? 'green' : s.score >= 75 ? 'yellow' : 'red';
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="td-flex">
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: `${s.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: s.color,
                        }}>
                          {s.avatar}
                        </div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                      </div>
                    </td>
                    <td><span className="tag">{s.role}</span></td>
                    <td style={{ textAlign: 'center' }}>{s.tasks}</td>
                    <td style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 600 }}>{s.completed}</td>
                    <td style={{ textAlign: 'center', color: overdue > 5 ? 'var(--red)' : 'var(--text-muted)' }}>{overdue}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ProgBar pct={pct} fill={fill} width={50} />
                        <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{s.orders || '—'}</td>
                    <td style={{ textAlign: 'center', color: s.errors > 5 ? 'var(--red)' : 'var(--text-muted)' }}>{s.errors}</td>
                    <td><span className={`badge ${scoreBadge}`}>{s.score}%</span></td>
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

export default PerformanceTab;