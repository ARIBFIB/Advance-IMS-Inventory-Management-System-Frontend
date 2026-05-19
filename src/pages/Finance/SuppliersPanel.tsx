import React, { useState } from 'react';
import type { NavPanel, Supplier } from './types';
import { Badge, fmt } from './helpers';
import { SUPPLIERS } from './data';

// ── Supplier Detail Overlay ──
export const SupplierDetailContent: React.FC<{ s: Supplier; onNav: (p: NavPanel) => void }> = ({ s, onNav }) => (
  <div>
    <div style={{ marginBottom: 14 }}><Badge label={s.status} /></div>
    {([
      ['Total Purchased', fmt(s.purchased)],
      ['Total Paid',      <span style={{ color: 'var(--green)' }}>{fmt(s.paid)}</span>],
      ['Balance Due',     <span style={{ fontSize: 16, fontWeight: 900, color: s.balance > 0 ? 'var(--red)' : 'var(--green)' }}>{s.balance > 0 ? fmt(s.balance) : 'Cleared'}</span>],
      ['Last Purchase',   s.lastPurchase],
      ['Last Payment',    s.lastPayment],
    ] as [string, React.ReactNode][]).map(([k, v], i) => (
      <div className="detail-row" key={i}>
        <div className="detail-key">{k}</div>
        <div className="detail-val">{v}</div>
      </div>
    ))}
    <hr />
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
      {s.balance > 0 && (
        <button className="f-btn primary" onClick={() => onNav('sup-add')}>
          <i className="fa-solid fa-money-bill-transfer" /> Record Payment
        </button>
      )}
      <button className="f-btn"><i className="fa-solid fa-clock-rotate-left" /> Payment History</button>
    </div>
  </div>
);

// ── SuppliersPanel ──
interface Props {
  onNav: (p: NavPanel) => void;
  onOpenOverlay: (title: string, content: React.ReactNode) => void;
}

const SuppliersPanel: React.FC<Props> = ({ onNav, onOpenOverlay }) => {
  const [search, setSearch] = useState('');

  const filtered = SUPPLIERS.filter(
    s => !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="panel-heading">Supplier Balances</div>
      <div className="panel-desc">
        View outstanding balances owed to each supplier. Track purchase history, payments made, and overdue amounts.
      </div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div><strong>Al-Karam Textile</strong> invoice overdue by 12 days — total outstanding: <strong>₨42,000</strong>.</div>
        <button className="f-btn primary" style={{ marginLeft: 'auto', fontSize: 9.5 }} onClick={() => onNav('sup-add')}>
          <i className="fa-solid fa-money-bill-transfer" /> Pay Now
        </button>
      </div>

      <div className="mini-stats cols-3">
        <div className="mini-stat"><div className="ms-label">Total Supplier Dues</div><div className="ms-value" style={{ color: 'var(--yellow)' }}>₨86,000</div><div className="ms-trend down">3 suppliers outstanding</div></div>
        <div className="mini-stat"><div className="ms-label">Paid This Month</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨1,24,000</div><div className="ms-trend up"><i className="fa-solid fa-circle-check" /> 5 payments made</div></div>
        <div className="mini-stat"><div className="ms-label">Overdue (&gt;30 days)</div><div className="ms-value" style={{ color: 'var(--red)' }}>₨42,000</div><div className="ms-trend down"><i className="fa-solid fa-circle-exclamation" /> 1 supplier</div></div>
      </div>

      <div className="card">
        <div className="f-toolbar">
          <div className="f-toolbar-left">
            <div className="f-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input placeholder="Search supplier..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="f-toolbar-right">
            <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button className="f-btn primary" onClick={() => onNav('sup-add')}><i className="fa-solid fa-plus" /> Record Payment</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Supplier</th><th>Total Purchased</th><th>Total Paid</th>
                <th>Balance Due</th><th>Last Purchase</th><th>Last Payment</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.name} onClick={() => onOpenOverlay(s.name, <SupplierDetailContent s={s} onNav={onNav} />)}>
                  <td><strong>{s.name}</strong></td>
                  <td>{fmt(s.purchased)}</td>
                  <td style={{ color: 'var(--green)' }}>{fmt(s.paid)}</td>
                  <td><strong style={{ color: s.balance > 0 ? 'var(--red)' : 'var(--green)' }}>{s.balance > 0 ? fmt(s.balance) : '—'}</strong></td>
                  <td style={{ fontSize: 10 }}>{s.lastPurchase}</td>
                  <td style={{ fontSize: 10 }}>{s.lastPayment}</td>
                  <td><Badge label={s.status} /></td>
                  <td onClick={ev => ev.stopPropagation()} style={{ display: 'flex', gap: 3 }}>
                    {s.balance > 0 && (
                      <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }} onClick={() => onNav('sup-add')}>
                        <i className="fa-solid fa-money-bill-transfer" /> Pay
                      </button>
                    )}
                    <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SuppliersPanel;