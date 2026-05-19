// ═══════════════════════════════════════════════════════════
// InventoryReportsTab.tsx
// ═══════════════════════════════════════════════════════════
import React from 'react';
import {
  STOCK_HEALTH_CATS, LOW_STOCK_ITEMS, DEAD_STOCK, INV_VALUATION,
} from './ReportsShared';

const InventoryReportsTab: React.FC = () => {
  // Stock movement bar chart data
  const weeks    = ['W1', 'W2', 'W3', 'W4'];
  const stockIn  = [420, 310, 280, 380];
  const stockOut = [380, 340, 310, 420];
  const maxMov   = Math.max(...stockIn, ...stockOut);
  const movH     = 100;

  return (
    <>
      {/* KPI Row */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Total Stock Value</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-warehouse ic-orange" /></div></div>
          <div className="stat-value">₨14.2L</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +₨1.8L vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Stock Turnover Rate</div><div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-rotate" style={{ color: 'var(--blue)' }} /></div></div>
          <div className="stat-value">4.2x</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> Healthy range</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Low Stock Items</div><div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--yellow)' }} /></div></div>
          <div className="stat-value">33</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs restocking</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Dead Stock Items</div><div className="stat-icon" style={{ background: '#FEF2F2' }}><i className="fa-solid fa-box-archive" style={{ color: 'var(--red)' }} /></div></div>
          <div className="stat-value">8</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> No movement 30d+</div>
        </div>
      </div>

      {/* Stock Health + Movement */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Stock Health by Category</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {STOCK_HEALTH_CATS.map(c => {
              const total = c.instock + c.low + c.oos;
              const iP    = Math.round((c.instock / total) * 100);
              const lP    = Math.round((c.low    / total) * 100);
              const oP    = 100 - iP - lP;
              return (
                <div key={c.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{total} products</span>
                  </div>
                  <div className="stock-health-bar">
                    <div style={{ width: `${iP}%`, background: 'var(--green)', height: 8 }} />
                    <div style={{ width: `${lP}%`, background: 'var(--yellow)', height: 8 }} />
                    <div style={{ width: `${oP}%`, background: 'var(--red)', height: 8 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--green)'  }}>● {c.instock} OK</span>
                    <span style={{ fontSize: 9.5, color: 'var(--yellow)' }}>● {c.low} Low</span>
                    <span style={{ fontSize: 9.5, color: 'var(--red)'    }}>● {c.oos} OOS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-arrow-trend-up ic-orange" /> Stock Movement (Last 30 Days)</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 4, background: 'var(--green)', display: 'inline-block', borderRadius: 2 }} /> Stock In
              </span>
              <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 4, background: 'var(--accent)', display: 'inline-block', borderRadius: 2 }} /> Stock Out
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: movH }}>
              {weeks.map((w, i) => (
                <div key={w} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%', height: movH - 20 }}>
                    <div style={{ flex: 1, background: 'var(--green)',  borderRadius: '3px 3px 0 0', height: Math.round((stockIn[i]  / maxMov) * (movH - 20)), opacity: 0.85 }} />
                    <div style={{ flex: 1, background: 'var(--accent)', borderRadius: '3px 3px 0 0', height: Math.round((stockOut[i] / maxMov) * (movH - 20)), opacity: 0.85 }} />
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{w}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Table */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--yellow)' }} /> Low Stock Alert Report</div>
          <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Product</th><th>Category</th><th>Current Stock</th>
                <th>Threshold</th><th>Days Until Stockout</th><th>Last Restocked</th><th>Supplier</th><th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK_ITEMS.map(p => {
                const uBadge: Record<string, string> = { Critical: 'orange', High: 'yellow', Medium: 'blue' };
                return (
                  <tr key={p.sku}>
                    <td><code className="code-chip">{p.sku}</code></td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="tag">{p.cat}</span></td>
                    <td><strong style={{ color: p.stock === 0 ? 'var(--red)' : 'var(--yellow)' }}>{p.stock}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.thr}</td>
                    <td style={{ fontWeight: 600, color: p.days <= 2 ? 'var(--red)' : p.days <= 5 ? 'var(--yellow)' : 'var(--text-secondary)' }}>
                      {p.days === 0 ? 'Stockout' : `~${p.days}d`}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.last}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.supplier}</td>
                    <td><span className={`badge ${uBadge[p.urgency] || 'gray'}`}>{p.urgency}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dead Stock + Valuation */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-box-archive" style={{ color: 'var(--red)', fontSize: 12 }} /> Dead Stock Report</div>
            <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>SKU</th><th>Product</th><th>Stock</th><th>Last Sold</th><th>Days Idle</th><th>Value</th></tr></thead>
              <tbody>
                {DEAD_STOCK.map(d => (
                  <tr key={d.sku}>
                    <td><code className="code-chip">{d.sku}</code></td>
                    <td>{d.name}</td>
                    <td style={{ fontWeight: 600 }}>{d.stock}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{d.last}</td>
                    <td><span className="badge red">{d.days}d</span></td>
                    <td><strong style={{ color: 'var(--red)' }}>{d.val}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-coins ic-orange" /> Inventory Valuation</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cost / Retail</span>
            </div>
            {INV_VALUATION.map(v => (
              <div key={v.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{v.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.cost}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--green)' }}>{v.retail}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', marginTop: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₨11,48,000 cost</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>₨22,61,000 retail</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryReportsTab;