import React from 'react';
import { fmt } from './helpers';
import { MONTHLY_DATA, RECENT_REPORTS } from './data';

const ReportsPanel: React.FC = () => (
  <>
    <div className="panel-heading">Financial Reports</div>
    <div className="panel-desc">Generate and download detailed financial reports by date range, type, or category.</div>

    <div className="detail-grid-2">
      {/* Generate Report Form */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-file-chart-column" /> Generate Report</div>
        </div>
        <div className="card-body">
          <div className="f-form-row single">
            <div className="f-form-group">
              <div className="f-form-label">Report Type</div>
              <select className="f-form-select">
                <option>Daily Financial Summary</option>
                <option>Weekly COD Report</option>
                <option>Monthly Expense Report</option>
                <option>Supplier Payment History</option>
                <option>Revenue vs Expenses</option>
                <option>Profit &amp; Loss Statement</option>
                <option>COD Reconciliation Report</option>
                <option>Prepaid Orders Report</option>
              </select>
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Date From</div>
              <input className="f-form-input" type="date" />
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Date To</div>
              <input className="f-form-input" type="date" />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Group By</div>
              <select className="f-form-select">
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Format</div>
              <select className="f-form-select">
                <option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>PDF</option>
              </select>
            </div>
          </div>
          <hr />
          <button className="f-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
            <i className="fa-solid fa-file-export" /> Generate &amp; Download
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Reports</div>
        </div>
        <div className="card-body" style={{ padding: '6px 14px' }}>
          {RECENT_REPORTS.map(r => (
            <div className="list-item" key={r.name}>
              <div className="list-icon" style={{ background: 'var(--green-bg)' }}>
                <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: 11, color: 'var(--green)' }} />
              </div>
              <div className="list-content">
                <div className="list-title" style={{ fontSize: 10.5 }}>{r.name}</div>
                <div className="list-meta">{r.date} · {r.format} · {r.size}</div>
              </div>
              <div className="list-right">
                <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}>
                  <i className="fa-solid fa-download" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Monthly Summary Table */}
    <div className="card" style={{ marginTop: 14 }}>
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-table" /> Monthly Summary Table</div>
        <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th><th>Revenue</th><th>COD Collected</th><th>Prepaid</th>
              <th>Expenses</th><th>Supplier Paid</th><th>Net Profit</th><th>Margin</th>
            </tr>
          </thead>
          <tbody>
            {MONTHLY_DATA.map(m => {
              const margin = ((m.profit / m.revenue) * 100).toFixed(1);
              return (
                <tr key={m.month}>
                  <td><strong>{m.month}</strong></td>
                  <td style={{ color: 'var(--green)' }}>{fmt(m.revenue)}</td>
                  <td>{fmt(m.cod)}</td>
                  <td>{fmt(m.prepaid)}</td>
                  <td style={{ color: 'var(--red)' }}>{fmt(m.expenses)}</td>
                  <td>{fmt(m.supPaid)}</td>
                  <td><strong style={{ color: 'var(--green)' }}>{fmt(m.profit)}</strong></td>
                  <td>
                    <div className="perf-cell" style={{ minWidth: 70 }}>
                      <div className="perf-bar">
                        <div className="perf-fill" style={{ width: `${margin}%`, background: 'var(--green)' }} />
                      </div>
                      <div className="perf-pct" style={{ color: 'var(--green)' }}>{margin}%</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default ReportsPanel;