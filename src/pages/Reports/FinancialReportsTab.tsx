// ═══════════════════════════════════════════════════════════
// FinancialReportsTab.tsx
// ═══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import {
  CODFilter,
  PL_ROWS, EXPENSES, COD_ITEMS, SUPPLIER_PAYMENTS,
  fmt,
} from './ReportsShared';

const FinancialReportsTab: React.FC = () => {
  const [codFilter, setCodFilter] = useState<CODFilter>('pending');

  const expTotal = EXPENSES.reduce((a, e) => a + e.val, 0);
  const supBadge: Record<string, string> = { Active: 'blue', Overdue: 'orange', Cleared: 'green' };

  return (
    <>
      {/* KPI Row */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Gross Profit (MTD)</div><div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-hand-holding-dollar" style={{ color: 'var(--green)' }} /></div></div>
          <div className="stat-value">₨3.1L</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 36.9% margin</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Total Expenses (MTD)</div><div className="stat-icon" style={{ background: '#FEF2F2' }}><i className="fa-solid fa-money-bill-wave" style={{ color: 'var(--red)' }} /></div></div>
          <div className="stat-value">₨1.2L</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> -₨15K vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">COD Pending</div><div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-clock" style={{ color: 'var(--yellow)' }} /></div></div>
          <div className="stat-value">₨94,200</div>
          <div className="stat-trend neutral"><i className="fa-solid fa-minus" /> 34 orders pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Supplier Outstanding</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-file-invoice-dollar ic-orange" /></div></div>
          <div className="stat-value">₨1.47L</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Due this week</div>
        </div>
      </div>

      {/* P&L + Expense Breakdown */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-scale-balanced ic-orange" /> P&L Summary</div>
            <div className="card-actions">
              <select className="form-select" style={{ height: 26, fontSize: 11 }}>
                <option>May 2026</option><option>April 2026</option><option>Q1 2026</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {PL_ROWS.map((r, i) => (
              <div key={i} className={`pl-row${r.bold ? ' bold' : ''}`}>
                <span className="pl-label">{r.label}</span>
                <span className="pl-val" style={{ color: r.color }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Expense Breakdown</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {EXPENSES.map(e => (
              <div key={e.cat} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 500 }}>{e.cat}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {fmt(e.val)} <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>({Math.round((e.val / expTotal) * 100)}%)</span>
                  </span>
                </div>
                <div className="prog-bar" style={{ height: 7 }}>
                  <div className="prog-fill" style={{ width: `${(e.val / expTotal) * 100}%`, background: e.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 12 }}>Total</strong>
              <strong style={{ fontSize: 12, color: 'var(--red)' }}>{fmt(expTotal)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* COD Report */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-money-bills" /> COD Collection Report</div>
          <div className="card-actions">
            {(['pending', 'collected', 'all'] as CODFilter[]).map(f => (
              <button key={f} className={`t-filter-btn${codFilter === f ? ' active' : ''}`} onClick={() => setCodFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Courier</th><th>Dispatched</th><th>Expected By</th><th>Days Pending</th><th>Status</th></tr>
            </thead>
            <tbody>
              {COD_ITEMS.map(item => (
                <tr key={item.id}>
                  <td><code className="code-chip">{item.id}</code></td>
                  <td><strong>{item.cust}</strong></td>
                  <td><strong>{fmt(item.amt)}</strong></td>
                  <td><span className="tag">{item.courier}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.disp}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.exp}</td>
                  <td><span className={`badge ${item.days > 7 ? 'orange' : item.days > 4 ? 'yellow' : 'blue'}`}>{item.days}d</span></td>
                  <td><span className="badge yellow">Pending</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing <strong>1–10</strong> of <strong>34</strong> pending COD orders</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} /></button>
            {[1, 2, 3, 4].map(p => <button key={p} className={`page-btn${p === 1 ? ' active' : ''}`}>{p}</button>)}
            <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} /></button>
          </div>
        </div>
      </div>

      {/* Supplier Payments */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-handshake" /> Supplier Payment Summary</div>
          <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Supplier</th><th>Total Purchased</th><th>Paid</th><th>Outstanding</th><th>Last Payment</th><th>Due Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {SUPPLIER_PAYMENTS.map(s => (
                <tr key={s.name}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.total}</td>
                  <td style={{ color: 'var(--green)' }}>{s.paid}</td>
                  <td><strong style={{ color: s.out === '₨0' ? 'var(--green)' : 'var(--red)' }}>{s.out}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.last}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.due}</td>
                  <td><span className={`badge ${supBadge[s.status] || 'gray'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FinancialReportsTab;