import React, { useState, useEffect, useCallback } from 'react';
import { ToggleSwitch, fmt, ErrorBanner } from './helpers';
import { expensesAPI } from '../../services/api';

interface CategoryRow {
  name: string;
  count: number;
  amount: number;
  color: string;
}

const COLORS: Record<string, string> = {
  Shipping:   '#FF6A00',
  Marketing:  '#7C3AED',
  Utilities:  '#D97706',
  Salaries:   '#16A34A',
  Supplies:   '#2563EB',
  Software:   '#0891B2',
  Other:      '#9CA3AF',
};

const ReportsPanel: React.FC = () => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await expensesAPI.getAnalytics({ groupBy: 'category' });
      const breakdown: any[] = res.data.data?.categoryBreakdown || [];
      const rows: CategoryRow[] = breakdown.map(b => ({
        name:   b.category,
        count:  b.count,
        amount: Number(b.total),
        color:  COLORS[b.category] || COLORS.Other,
      }));
      setCategories(rows);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const total = categories.reduce((s, c) => s + c.amount, 0);

  const gradient = categories.length > 0
    ? categories.map((c, i, arr) => {
        const pct   = (c.amount / total) * 100;
        const start = arr.slice(0, i).reduce((s, x) => s + (x.amount / total) * 100, 0);
        return `${c.color} ${start.toFixed(1)}% ${(start + pct).toFixed(1)}%`;
      }).join(',')
    : 'var(--divider) 0% 100%';

  return (
    <>
      <div className="panel-heading">Expense Categories</div>
      <div className="panel-desc">
        Manage expense categories. Add, rename, or deactivate categories to keep your financial records organised.
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

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
                  <th>Category</th><th>Expenses</th><th>Amount</th>
                  <th>Active</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j}>
                          <div style={{ height: 10, borderRadius: 3, background: 'var(--divider)', width: j === 0 ? '70%' : '50%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 11 }}>
                      No category data found.
                    </td>
                  </tr>
                ) : categories.map(c => (
                  <tr key={c.name}>
                    <td>
                      <div className="td-flex">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td>{c.count}</td>
                    <td><strong>{fmt(c.amount)}</strong></td>
                    <td><ToggleSwitch defaultChecked /></td>
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
                  <div style={{ fontSize: 12, fontWeight: 900 }}>{loading ? '…' : `₨${(total / 1000).toFixed(0)}k`}</div>
                  <div style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>Total</div>
                </div>
              </div>
            </div>
            <div className="donut-legend">
              {categories.map(c => (
                <div className="donut-legend-item" key={c.name}>
                  <div className="donut-dot" style={{ background: c.color }} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <strong>{fmt(c.amount)}</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: 9.5 }}>
                    {total > 0 ? ((c.amount / total) * 100).toFixed(1) : '0'}%
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

export default ReportsPanel;