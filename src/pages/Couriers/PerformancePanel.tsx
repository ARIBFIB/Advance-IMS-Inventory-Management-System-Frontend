// PerformancePanel.tsx
import React, { useState } from 'react';
import { PERF_DATA, rColor, PerfBar, StarRating, InnerTabs, EmptyState } from './shared';

const PerformancePanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('summary');

  return (
    <>
      <div className="panel-heading">Courier Performance</div>
      <div className="panel-desc">
        Comparative analytics — delivery success rates, average delivery times, COD collection
        percentages, and SLA compliance scores.
      </div>

      <InnerTabs
        tabs={[
          { id: 'summary', label: 'Summary'           },
          { id: 'detail',  label: 'Detailed Metrics'  },
          { id: 'compare', label: 'Compare Couriers'  },
          { id: 'trends',  label: 'Trends'            },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {innerTab === 'summary' && (
        <>
          <div className="mini-stats">
            <div className="mini-stat"><div className="ms-label">Best Performer</div><div className="ms-value" style={{ fontSize: 14 }}>Leopards</div><div className="ms-trend up">94% delivery rate</div></div>
            <div className="mini-stat"><div className="ms-label">Fastest Delivery</div><div className="ms-value" style={{ fontSize: 14 }}>M&amp;P</div><div className="ms-trend up">1.8 days avg.</div></div>
            <div className="mini-stat"><div className="ms-label">Lowest RTO Rate</div><div className="ms-value" style={{ fontSize: 14 }}>TCS</div><div className="ms-trend up">2.1% RTO</div></div>
            <div className="mini-stat"><div className="ms-label">Overall Success</div><div className="ms-value">89%</div><div className="ms-trend up">+3% this month</div></div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-trophy" /> Courier Performance Scorecard</div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Courier</th><th>Assigned</th><th>Delivered</th><th>RTO</th><th>Failed</th>
                    <th>Delivery Rate</th><th>RTO Rate</th><th>Avg. Days</th>
                    <th>COD Collection</th><th>SLA Compliance</th><th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {PERF_DATA.map(p => (
                    <tr key={p.name}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.assigned}</td>
                      <td style={{ color: 'var(--green)', fontWeight: 600 }}>{p.delivered}</td>
                      <td style={{ color: 'var(--yellow)' }}>{p.rto}</td>
                      <td style={{ color: 'var(--red)' }}>{p.failed}</td>
                      <td><PerfBar pct={p.rate} color={rColor(p.rate)} /></td>
                      <td style={{ color: p.rtoRate > 10 ? 'var(--red)' : 'var(--text-secondary)' }}>{p.rtoRate}%</td>
                      <td>{p.avgDays}d</td>
                      <td><PerfBar pct={p.codCollPct} color="var(--green)" /></td>
                      <td><PerfBar pct={p.slaPct} color={rColor(p.slaPct)} /></td>
                      <td><StarRating rating={p.rating} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {innerTab === 'detail'  && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-simple" title="Detailed Metrics" desc="Select a courier and date range to view granular breakdown." /></div></div>}
      {innerTab === 'compare' && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-bar" title="Courier Comparison" desc="Side-by-side comparison of all metrics per courier." /></div></div>}
      {innerTab === 'trends'  && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-line" title="Performance Trends" desc="Month-over-month delivery rate and timing trends." /></div></div>}
    </>
  );
};

export default PerformancePanel;