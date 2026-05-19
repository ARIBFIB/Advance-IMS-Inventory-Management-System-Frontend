// PerformancePanel.tsx
import React, { useState } from 'react';
import {
  Rider, RIDERS,
  rColor,
  fmt,
  Badge, PerfBar, StarRating, RiderAvatar, InnerTabs, EmptyState,
} from './shared';

interface Props {
  onOpenRider: (r: Rider) => void;
}

const PerformancePanel: React.FC<Props> = ({ onOpenRider }) => {
  const [innerTab, setInnerTab] = useState('summary');
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Rider Performance</div>
      <div className="panel-desc">
        Comparative performance analytics across all riders — delivery completion rates,
        average times, on-time percentages, and customer ratings.
      </div>

      <InnerTabs
        tabs={[
          { id: 'summary', label: 'Summary'          },
          { id: 'detail',  label: 'Detailed Metrics' },
          { id: 'trends',  label: 'Trends'           },
          { id: 'kpi',     label: 'KPI Dashboard'    },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── SUMMARY ── */}
      {innerTab === 'summary' && (
        <>
          <div className="mini-stats">
            <div className="mini-stat">
              <div className="ms-label">Top Performer</div>
              <div className="ms-value" style={{ fontSize: 14 }}>Usman</div>
              <div className="ms-trend up">96% completion</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">Fastest Rider</div>
              <div className="ms-value" style={{ fontSize: 14 }}>Asad</div>
              <div className="ms-trend up">34 min avg.</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">Highest Rated</div>
              <div className="ms-value" style={{ fontSize: 14 }}>Bilal</div>
              <div className="ms-trend up">4.9 ★</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">Overall Completion</div>
              <div className="ms-value">91%</div>
              <div className="ms-trend up">+4% this month</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-trophy" /> Performance Scorecard</div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rider</th><th>Assigned</th><th>Delivered</th><th>Failed</th>
                    <th>Completion %</th><th>Avg. Time</th><th>On-Time %</th>
                    <th>COD Collected</th><th>Rating</th><th>Earnings (MTD)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRiders.map(r => {
                    const delivered = Math.round(r.deliveries * r.completion / 100);
                    const failed = r.deliveries - delivered;
                    return (
                      <tr key={r.id} onClick={() => onOpenRider(r)}>
                        <td>
                          <div className="td-flex">
                            <RiderAvatar rider={r} fontSize={9} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{r.name}</div>
                              <div className="td-sub">{r.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td>{r.deliveries}</td>
                        <td style={{ color: 'var(--green)', fontWeight: 600 }}>{delivered}</td>
                        <td style={{ color: 'var(--red)' }}>{failed}</td>
                        <td><PerfBar pct={r.completion} color={rColor(r.completion)} /></td>
                        <td>{r.avgTime > 0 ? `${r.avgTime} min` : '—'}</td>
                        <td>{r.onTime > 0 ? <PerfBar pct={r.onTime} color={rColor(r.onTime)} /> : '—'}</td>
                        <td>{fmt(Math.round(delivered * 80))}</td>
                        <td>{r.rating > 0 ? <StarRating rating={r.rating} /> : '—'}</td>
                        <td><strong style={{ color: 'var(--green)' }}>{fmt(r.earned + r.bonus)}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── DETAILED METRICS ── */}
      {innerTab === 'detail' && (
        <div className="card">
          <div className="card-body">
            <EmptyState
              icon="fa-chart-simple"
              title="Detailed Metrics"
              desc="Select a rider and date range to view breakdown."
            />
          </div>
        </div>
      )}

      {/* ── TRENDS ── */}
      {innerTab === 'trends' && (
        <div className="card">
          <div className="card-body">
            <EmptyState
              icon="fa-chart-line"
              title="Performance Trends"
              desc="Month-over-month completion and timing trends."
            />
          </div>
        </div>
      )}

      {/* ── KPI DASHBOARD ── */}
      {innerTab === 'kpi' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-gauge" /> KPI Overview — May 2026</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 14 }}>
              {activeRiders.slice(0, 4).map(r => (
                <div
                  key={r.id}
                  style={{
                    textAlign: 'center', padding: 12,
                    background: 'var(--bg)', borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <RiderAvatar rider={r} size={36} fontSize={11} />
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 8 }}>
                    {r.name.split(' ')[0]}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10, gap: 4 }}>
                    <div className="kpi-ring-wrap">
                      <div className={`kpi-ring ${r.completion >= 90 ? 'good' : r.completion >= 80 ? 'warn' : 'bad'}`}>
                        {r.completion}%
                      </div>
                      <div className="kpi-ring-label">Completion</div>
                    </div>
                    <div className="kpi-ring-wrap">
                      <div className={`kpi-ring ${r.onTime >= 90 ? 'good' : r.onTime >= 80 ? 'warn' : 'bad'}`}>
                        {r.onTime}%
                      </div>
                      <div className="kpi-ring-label">On-Time</div>
                    </div>
                    <div className="kpi-ring-wrap">
                      <div
                        className={`kpi-ring ${r.rating >= 4.5 ? 'good' : r.rating >= 3.5 ? 'warn' : 'bad'}`}
                        style={{ fontSize: 11 }}
                      >
                        {r.rating}★
                      </div>
                      <div className="kpi-ring-label">Rating</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformancePanel;