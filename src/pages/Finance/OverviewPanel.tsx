import React from 'react';
import type { NavPanel } from './types';
import type { CODOrder } from './types';
import { fmt } from './helpers';
import { Badge } from './helpers';
import { COD_DATA, EXPENSES, SUPPLIERS, CHART_DAYS, CHART_REVENUE, CHART_EXPENSES } from './data';

// ── COD Detail Overlay (shared between Overview & COD panels) ──
export const CODDetailContent: React.FC<{ c: CODOrder }> = ({ c }) => (
  <div>
    <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
      <Badge label={c.codStatus} />
      <Badge label={c.submission === '—' ? 'Not Submitted' : c.submission} />
    </div>
    {([
      ['Order ID',     <code className="ref">{c.order}</code>],
      ['Customer',     c.customer],
      ['Rider',        c.rider],
      ['COD Amount',   <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--green)' }}>{fmt(c.amount)}</span>],
      ['Delivery Time',c.delivered],
      ['COD Status',   <Badge label={c.codStatus} />],
      ['Submission',   <Badge label={c.submission === '—' ? 'Pending' : c.submission} />],
    ] as [string, React.ReactNode][]).map(([k, v], i) => (
      <div className="detail-row" key={i}>
        <div className="detail-key">{k}</div>
        <div className="detail-val">{v}</div>
      </div>
    ))}
    <hr />
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
      {c.codStatus === 'Collected' && c.submission === 'Pending' && (
        <button className="f-btn primary"><i className="fa-solid fa-check" /> Mark Submitted</button>
      )}
      <button className="f-btn"><i className="fa-solid fa-file-invoice" /> View Order</button>
    </div>
  </div>
);

// ── OverviewPanel ──
interface Props {
  onNav: (p: NavPanel) => void;
  onOpenOverlay: (title: string, content: React.ReactNode) => void;
}

const OverviewPanel: React.FC<Props> = ({ onNav, onOpenOverlay }) => {
  const maxVal = Math.max(...CHART_REVENUE, ...CHART_EXPENSES);

  return (
    <>
      <div className="panel-heading">Financial Overview</div>
      <div className="panel-desc">
        Live snapshot of today's cash position — COD pending, expenses logged, supplier dues, and net cash flow.
      </div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div><strong>₨42,800</strong> in COD collected by riders but not yet submitted to accounts.</div>
        <button className="f-btn" style={{ marginLeft: 'auto' }} onClick={() => onNav('cod')}>
          <i className="fa-solid fa-eye" /> Review COD
        </button>
      </div>

      <div className="balance-card">
        <div className="balance-card-label">Net Cash Position — May 2026</div>
        <div className="balance-card-amount">₨3,84,200</div>
        <div className="balance-card-row">
          <div className="balance-card-item"><div className="balance-card-item-label">Total Revenue</div><div className="balance-card-item-val">₨5,12,400</div></div>
          <div className="balance-card-item"><div className="balance-card-item-label">Total Expenses</div><div className="balance-card-item-val">₨1,28,200</div></div>
          <div className="balance-card-item"><div className="balance-card-item-label">Supplier Due</div><div className="balance-card-item-val">₨86,000</div></div>
          <div className="balance-card-item"><div className="balance-card-item-label">COD Pending</div><div className="balance-card-item-val" style={{ color: '#FB923C' }}>₨42,800</div></div>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat"><div className="ms-label">COD Collected (Today)</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨68,400</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +12% vs yesterday</div></div>
        <div className="mini-stat"><div className="ms-label">COD Pending Submission</div><div className="ms-value" style={{ color: 'var(--accent)' }}>₨42,800</div><div className="ms-trend down"><i className="fa-solid fa-triangle-exclamation" /> 14 riders holding cash</div></div>
        <div className="mini-stat"><div className="ms-label">Expenses (Today)</div><div className="ms-value" style={{ color: 'var(--red)' }}>₨8,240</div><div className="ms-trend"><i className="fa-solid fa-minus" /> Within budget</div></div>
        <div className="mini-stat"><div className="ms-label">Supplier Balance Due</div><div className="ms-value" style={{ color: 'var(--yellow)' }}>₨86,000</div><div className="ms-trend down"><i className="fa-solid fa-arrow-trend-up" /> 3 suppliers pending</div></div>
      </div>

      <div className="detail-grid-3">
        {/* COD Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-money-bills" style={{ color: 'var(--green)' }} /> COD Summary</div>
            <button className="f-btn" onClick={() => onNav('cod')}>View All</button>
          </div>
          <div className="card-body" style={{ padding: '10px 14px' }}>
            {COD_DATA.slice(0, 4).map(c => (
              <div
                className="list-item" key={c.order} style={{ cursor: 'pointer' }}
                onClick={() => onOpenOverlay(`${c.order} — COD Detail`, <CODDetailContent c={c} />)}
              >
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{c.order} · {c.customer}</div>
                  <div className="list-meta">{c.rider}</div>
                </div>
                <div className="list-right">
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{fmt(c.amount)}</div>
                  <Badge label={c.codStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Expenses */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-receipt" style={{ color: 'var(--red)' }} /> Today's Expenses</div>
            <button className="f-btn" onClick={() => onNav('exp-add')}><i className="fa-solid fa-plus" /> Log</button>
          </div>
          <div className="card-body" style={{ padding: '10px 14px' }}>
            {EXPENSES.slice(0, 4).map((e, i) => (
              <div className="list-item" key={i}>
                <div className="list-icon" style={{ background: 'var(--red-bg)' }}>
                  <i className="fa-solid fa-receipt" style={{ fontSize: 10, color: 'var(--red)' }} />
                </div>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{e.desc}</div>
                  <div className="list-meta">{e.category}</div>
                </div>
                <div className="list-right">
                  <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--red)' }}>{fmt(e.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Dues */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-truck-ramp-box" style={{ color: 'var(--yellow)' }} /> Supplier Dues</div>
            <button className="f-btn" onClick={() => onNav('suppliers')}>View All</button>
          </div>
          <div className="card-body" style={{ padding: '10px 14px' }}>
            {SUPPLIERS.filter(s => s.balance > 0).map(s => (
              <div className="list-item" key={s.name}>
                <div className="list-icon" style={{ background: 'var(--yellow-bg)' }}>
                  <i className="fa-solid fa-truck-ramp-box" style={{ fontSize: 10, color: 'var(--yellow)' }} />
                </div>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{s.name}</div>
                  <div className="list-meta">Last paid: {s.lastPayment}</div>
                </div>
                <div className="list-right">
                  <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--yellow)' }}>{fmt(s.balance)}</div>
                  <Badge label={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-chart-bar" /> Revenue vs Expenses — Last 7 Days</div>
          <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80, padding: '0 2px' }}>
            {CHART_DAYS.map((_, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '45%', background: 'var(--green)', borderRadius: '3px 3px 0 0', height: `${(CHART_REVENUE[i] / maxVal) * 100}%`, minHeight: 2 }} title={fmt(CHART_REVENUE[i])} />
                <div style={{ width: '45%', background: 'var(--red)',   borderRadius: '3px 3px 0 0', height: `${(CHART_EXPENSES[i] / maxVal) * 100}%`, minHeight: 2 }} title={fmt(CHART_EXPENSES[i])} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--text-muted)' }}>
            {CHART_DAYS.map(d => <span key={d}>{d}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)' }} /> Revenue</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--red)' }} /> Expenses</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewPanel;