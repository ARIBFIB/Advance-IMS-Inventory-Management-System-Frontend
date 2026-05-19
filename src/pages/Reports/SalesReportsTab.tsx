// ═══════════════════════════════════════════════════════════
// SalesReportsTab.tsx
// ═══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import {
  RevenuePeriod, ChartDataPoint,
  DAILY_DATA, WEEKLY_DATA, MONTHLY_DATA,
  CHANNELS, TOP_PRODUCTS, CATEGORY_SALES, DAILY_SALES,
  fmt, fmtL,
} from './ReportsShared';

// ── Revenue Bar Chart ────────────────────────────────────────
interface RevenueChartProps { period: RevenuePeriod; }

const RevenueChart: React.FC<RevenueChartProps> = ({ period }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const data: ChartDataPoint[] =
    period === 'daily'   ? DAILY_DATA   :
    period === 'monthly' ? MONTHLY_DATA :
    WEEKLY_DATA;

  const maxVal = Math.max(...data.map(d => d.val));
  const H      = 130;
  const barH   = (val: number) => Math.max(4, Math.round((val / maxVal) * (H - 24)));

  return (
    <div className="revenue-chart-container">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: H, paddingBottom: 20, position: 'relative' }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, height: '100%', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === i && (
              <div style={{
                position: 'absolute', background: '#1F2937', color: '#fff',
                fontSize: 9.5, padding: '3px 7px', borderRadius: 4, whiteSpace: 'nowrap',
                bottom: barH(d.val) + 24, zIndex: 10,
              }}>
                {fmtL(d.val)}
              </div>
            )}
            <div
              className="rep-bar"
              style={{
                width: '100%', height: barH(d.val),
                background: hovered === i ? '#E65C00' : '#FF6A00',
                borderRadius: '3px 3px 0 0',
              }}
            />
            <div style={{ fontSize: 8.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Tab ─────────────────────────────────────────────────
const SalesReportsTab: React.FC = () => {
  const [period,     setPeriod]     = useState<RevenuePeriod>('weekly');
  const [salesMonth, setSalesMonth] = useState('May 2026');

  return (
    <>
      {/* KPI Row */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Total Revenue (MTD)</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-sack-dollar ic-orange" /></div></div>
          <div className="stat-value">₨8.4L</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +18.3% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Total Orders (MTD)</div><div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-bag-shopping" style={{ color: 'var(--blue)' }} /></div></div>
          <div className="stat-value">312</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +42 vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Avg. Order Value</div><div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-receipt" style={{ color: 'var(--green)' }} /></div></div>
          <div className="stat-value">₨2,692</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +₨312 vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Conversion Rate</div><div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-bullseye" style={{ color: 'var(--yellow)' }} /></div></div>
          <div className="stat-value">74.2%</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +2.1% vs last month</div>
        </div>
      </div>

      {/* Revenue Trend + Sales by Channel */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-line ic-orange" /> Revenue Trend</div>
            <div className="card-actions">
              <select className="form-select" style={{ height: 26, fontSize: 11 }} value={period} onChange={e => setPeriod(e.target.value as RevenuePeriod)}>
                <option value="daily">Last 14 Days</option>
                <option value="weekly">Last 8 Weeks</option>
                <option value="monthly">Last 6 Months</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: '12px 16px' }}>
            <RevenueChart period={period} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-pie ic-orange" /> Sales by Channel</div></div>
          <div className="card-body" style={{ padding: '12px 16px' }}>
            {CHANNELS.map(c => (
              <div key={c.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="channel-dot" style={{ background: c.color }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{c.val}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>{c.pct}%</span>
                  </div>
                </div>
                <div className="prog-bar" style={{ height: 8 }}>
                  <div className="prog-fill" style={{ width: `${c.pct}%`, background: c.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products + Category Sales */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-fire ic-orange" /> Top Selling Products</div>
            <div className="card-actions">
              <select className="form-select" style={{ height: 26, fontSize: 11 }}>
                <option>This Month</option><option>Last Month</option><option>Last 3 Months</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: '0 16px' }}>
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.sku} className="list-item" style={{ padding: '7px 0' }}>
                <div style={{ width: 20, textAlign: 'center', fontSize: 11, fontWeight: 700, color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {i + 1}
                </div>
                <div className="list-content">
                  <div className="list-title">{p.name}</div>
                  <div className="list-meta">{p.sku}</div>
                </div>
                <div className="list-right">
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{p.revenue}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {p.sold} units · <i className={`fa-solid fa-arrow-trend-${p.trend}`} style={{ color: p.trend === 'up' ? 'var(--green)' : 'var(--red)', fontSize: 9 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-tags ic-orange" /> Sales by Category</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {(() => {
              const max = Math.max(...CATEGORY_SALES.map(c => c.val));
              return CATEGORY_SALES.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                  <div style={{ width: 58, fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{c.name}</div>
                  <div className="prog-bar" style={{ flex: 1, height: 9 }}>
                    <div className="prog-fill" style={{ width: `${(c.val / max) * 100}%`, background: c.color, borderRadius: 2 }} />
                  </div>
                  <div style={{ width: 52, textAlign: 'right', fontSize: 11, fontWeight: 600 }}>{fmtL(c.val)}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-table" /> Daily Sales Summary</div>
          <div className="card-actions">
            <select className="form-select" style={{ height: 26, fontSize: 11 }} value={salesMonth} onChange={e => setSalesMonth(e.target.value)}>
              <option>May 2026</option><option>April 2026</option><option>March 2026</option>
            </select>
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export CSV</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Orders</th><th>Units Sold</th><th>Revenue</th>
                <th>COD</th><th>Prepaid</th><th>Returns</th><th>Net Revenue</th><th>vs Prev Day</th>
              </tr>
            </thead>
            <tbody>
              {DAILY_SALES.map((d, i) => {
                const prev      = DAILY_SALES[i + 1];
                const diff      = prev ? d.revenue - prev.revenue : 0;
                const diffColor = diff >= 0 ? 'var(--green)' : 'var(--red)';
                const diffIcon  = diff >= 0 ? 'arrow-trend-up' : 'arrow-trend-down';
                return (
                  <tr key={d.date}>
                    <td style={{ fontWeight: 600 }}>{d.date}</td>
                    <td style={{ textAlign: 'center' }}>{d.orders}</td>
                    <td style={{ textAlign: 'center' }}>{d.units}</td>
                    <td><strong>{fmt(d.revenue)}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{fmt(d.cod)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{fmt(d.prepaid)}</td>
                    <td style={{ textAlign: 'center', color: d.returns > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{d.returns}</td>
                    <td><strong style={{ color: 'var(--green)' }}>{fmt(d.net)}</strong></td>
                    <td>
                      {prev ? (
                        <span style={{ color: diffColor, fontSize: 11, fontWeight: 600 }}>
                          <i className={`fa-solid fa-${diffIcon}`} style={{ fontSize: 9 }} /> {fmtL(Math.abs(diff))}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing <strong>1–11</strong> of <strong>11</strong> days</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReportsTab;