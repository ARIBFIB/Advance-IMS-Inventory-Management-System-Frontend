import React, { useState } from 'react';
import type { NavPanel, Expense } from './types';
import { Badge, FPagination, fmt } from './helpers';
import { EXPENSES } from './data';

// ── Expense Detail Overlay ──
export const ExpenseDetailContent: React.FC<{ e: Expense }> = ({ e }) => (
  <div>
    {([
      ['Description',     e.desc],
      ['Category',        <span className="f-tag">{e.category}</span>],
      ['Amount',          <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--red)' }}>{fmt(e.amount)}</span>],
      ['Date',            e.date],
      ['Payment Method',  e.method],
      ['Logged By',       e.by],
      ['Reference',       <code className="ref">{e.ref}</code>],
    ] as [string, React.ReactNode][]).map(([k, v], i) => (
      <div className="detail-row" key={i}>
        <div className="detail-key">{k}</div>
        <div className="detail-val">{v}</div>
      </div>
    ))}
    <hr />
    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
      <button className="f-btn primary"><i className="fa-solid fa-pen" /> Edit</button>
      <button className="f-btn danger"><i className="fa-solid fa-trash" /> Delete</button>
    </div>
  </div>
);

// ── ExpensesPanel ──
interface Props {
  onNav: (p: NavPanel) => void;
  onOpenOverlay: (title: string, content: React.ReactNode) => void;
}

const CHIPS = ['All Categories', 'Logistics', 'Operations', 'Marketing', 'Salaries', 'Utilities', 'Other'];

const ExpensesPanel: React.FC<Props> = ({ onNav, onOpenOverlay }) => {
  const [search, setSearch] = useState('');
  const [chip, setChip]     = useState('All Categories');
  const [page, setPage]     = useState(1);
  const PER_PAGE = 6;

  const filtered = EXPENSES.filter(e => {
    if (chip !== 'All Categories' && e.category !== chip) return false;
    if (!search) return true;
    return (
      e.desc.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">All Expenses</div>
      <div className="panel-desc">Full record of all logged business expenses. Filter by category, date range, or amount.</div>

      <div className="mini-stats">
        <div className="mini-stat"><div className="ms-label">Total (This Month)</div><div className="ms-value" style={{ color: 'var(--red)' }}>₨1,28,200</div><div className="ms-trend down">+8% vs last month</div></div>
        <div className="mini-stat"><div className="ms-label">Logistics</div><div className="ms-value">₨38,400</div><div className="ms-trend">30% of expenses</div></div>
        <div className="mini-stat"><div className="ms-label">Operations</div><div className="ms-value">₨44,800</div><div className="ms-trend">35% of expenses</div></div>
        <div className="mini-stat"><div className="ms-label">Marketing</div><div className="ms-value">₨22,000</div><div className="ms-trend">17% of expenses</div></div>
      </div>

      <div className="chip-group">
        {CHIPS.map(c => (
          <div
            key={c}
            className={`chip ${chip === c ? 'active' : ''}`}
            onClick={() => { setChip(c); setPage(1); }}
          >
            {c === 'All Categories' && <i className="fa-solid fa-list" />}
            {c}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="f-toolbar">
          <div className="f-toolbar-left">
            <div className="f-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search expense..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button className="f-btn"><i className="fa-solid fa-calendar" /> Date</button>
          </div>
          <div className="f-toolbar-right">
            <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button className="f-btn primary" onClick={() => onNav('exp-add')}><i className="fa-solid fa-plus" /> Log Expense</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Category</th>
                <th>Amount</th><th>Payment Method</th><th>Logged By</th><th>Reference</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((e, i) => (
                <tr key={i} onClick={() => onOpenOverlay('Expense Detail', <ExpenseDetailContent e={e} />)}>
                  <td style={{ fontSize: 10 }}>{e.date}</td>
                  <td><strong>{e.desc}</strong></td>
                  <td><span className="f-tag">{e.category}</span></td>
                  <td><strong style={{ color: 'var(--red)' }}>{fmt(e.amount)}</strong></td>
                  <td>{e.method}</td>
                  <td>{e.by}</td>
                  <td><code className="ref">{e.ref}</code></td>
                  <td onClick={ev => ev.stopPropagation()} style={{ display: 'flex', gap: 3 }}>
                    <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button>
                    <button className="f-btn danger" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <FPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
      </div>
    </>
  );
};

export default ExpensesPanel;