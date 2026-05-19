import React from 'react';
import { ToggleSwitch, fmt } from './helpers';
import { CATEGORIES } from './data';

const CategoriesPanel: React.FC = () => {
  const total    = CATEGORIES.reduce((s, c) => s + c.amount, 0);
  const gradient = CATEGORIES.map((c, i, arr) => {
    const pct   = (c.amount / total) * 100;
    const start = arr.slice(0, i).reduce((s, x) => s + (x.amount / total) * 100, 0);
    return `${c.color} ${start.toFixed(1)}% ${(start + pct).toFixed(1)}%`;
  }).join(',');

  return (
    <>
      <div className="panel-heading">Expense Categories</div>
      <div className="panel-desc">
        Manage expense categories. Add, rename, or deactivate categories to keep your financial records organised.
      </div>

      <div className="detail-grid-2">
        {/* Category List */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-tags" /> Category List</div>
            <button className="f-btn primary"><i className="fa-solid fa-plus" /> Add Category</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th><th>Expenses (MTD)</th><th>Amount (MTD)</th>
                  <th>Active</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map(c => (
                  <tr key={c.name}>
                    <td>
                      <div className="td-flex">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td>{c.count}</td>
                    <td><strong>{fmt(c.amount)}</strong></td>
                    <td><ToggleSwitch defaultChecked={c.active} /></td>
                    <td>
                      <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-pen" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-pie" /> Expense Breakdown</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{
                width: 110, height: 110, borderRadius: '50%',
                background: `conic-gradient(${gradient})`,
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%', background: 'var(--card)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 900 }}>₨1.28L</div>
                  <div style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>Total MTD</div>
                </div>
              </div>
            </div>
            <div className="donut-legend">
              {CATEGORIES.map(c => (
                <div className="donut-legend-item" key={c.name}>
                  <div className="donut-dot" style={{ background: c.color }} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <strong>{fmt(c.amount)}</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: 9.5 }}>
                    {((c.amount / total) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPanel;