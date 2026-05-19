import React, { useState } from 'react';
import { Badge, EmptyState, FPagination, InnerTabs, fmt } from './helpers';
import { COD_DATA } from './data';
import { CODDetailContent } from './OverviewPanel';

interface Props {
  onOpenOverlay: (title: string, content: React.ReactNode) => void;
}

const CODPanel: React.FC<Props> = ({ onOpenOverlay }) => {
  const [innerTab, setInnerTab] = useState('all');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const PER_PAGE = 6;

  const filtered = COD_DATA.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.order.toLowerCase().includes(q) ||
      c.customer.toLowerCase().includes(q) ||
      c.rider.toLowerCase().includes(q)
    );
  });

  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pending   = COD_DATA.filter(c => c.codStatus === 'In Transit' || c.submission === 'Pending');

  return (
    <>
      <div className="panel-heading">COD Tracking</div>
      <div className="panel-desc">
        Monitor cash-on-delivery collections per order and per rider. Submit collections to accounts and reconcile pending amounts.
      </div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-coins" />
        <div><strong>14 riders</strong> holding a combined <strong>₨42,800</strong> in uncollected COD cash — submit to accounts immediately.</div>
        <button className="f-btn primary" style={{ marginLeft: 'auto', fontSize: 9.5 }}>
          <i className="fa-solid fa-check-double" /> Bulk Submit
        </button>
      </div>

      <div className="mini-stats">
        <div className="mini-stat"><div className="ms-label">Total COD Today</div><div className="ms-value">₨1,11,200</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> 48 orders</div></div>
        <div className="mini-stat"><div className="ms-label">Collected</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨68,400</div><div className="ms-trend up"><i className="fa-solid fa-circle-check" /> 34 orders</div></div>
        <div className="mini-stat"><div className="ms-label">Pending Collection</div><div className="ms-value" style={{ color: 'var(--accent)' }}>₨42,800</div><div className="ms-trend">14 orders in transit</div></div>
        <div className="mini-stat"><div className="ms-label">Submitted to Accounts</div><div className="ms-value" style={{ color: 'var(--blue)' }}>₨61,200</div><div className="ms-trend up">28 orders reconciled</div></div>
      </div>

      <InnerTabs
        tabs={[
          { id: 'all', label: 'All Orders' },
          {
            id: 'pending',
            label: (
              <span>
                Pending{' '}
                <span style={{ background: 'var(--yellow-bg)', color: 'var(--yellow)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>
                  {pending.length}
                </span>
              </span>
            ),
          },
          { id: 'collected', label: 'Collected' },
          { id: 'submitted', label: 'Submitted' },
        ]}
        active={innerTab}
        onChange={id => { setInnerTab(id); setPage(1); }}
      />

      {/* ALL ORDERS */}
      {innerTab === 'all' && (
        <div className="card">
          <div className="f-toolbar">
            <div className="f-toolbar-left">
              <div className="f-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  placeholder="Search order or rider..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button className="f-btn"><i className="fa-solid fa-calendar" /> Date</button>
            </div>
            <div className="f-toolbar-right">
              <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
              <button className="f-btn primary"><i className="fa-solid fa-check-double" /> Bulk Submit</button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Order ID</th><th>Customer</th><th>Rider</th>
                  <th>Amount</th><th>Delivered At</th>
                  <th>COD Status</th><th>Submission</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(c => (
                  <tr
                    key={c.order}
                    onClick={() => onOpenOverlay(`${c.order} — COD Detail`, <CODDetailContent c={c} />)}
                  >
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td><code className="ref">{c.order}</code></td>
                    <td>{c.customer}</td>
                    <td>{c.rider}</td>
                    <td><strong>{fmt(c.amount)}</strong></td>
                    <td style={{ fontSize: 10 }}>{c.delivered}</td>
                    <td><Badge label={c.codStatus} /></td>
                    <td><Badge label={c.submission === '—' ? 'Pending' : c.submission} /></td>
                    <td onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 3 }}>
                      {c.codStatus === 'Collected' && c.submission === 'Pending' && (
                        <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Submit</button>
                      )}
                      <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
        </div>
      )}

      {/* PENDING */}
      {innerTab === 'pending' && (
        <div className="card">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Order ID</th><th>Customer</th><th>Rider</th>
                  <th>Amount</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(c => (
                  <tr key={c.order}>
                    <td><input type="checkbox" /></td>
                    <td><code className="ref">{c.order}</code></td>
                    <td>{c.customer}</td>
                    <td>{c.rider}</td>
                    <td><strong>{fmt(c.amount)}</strong></td>
                    <td><Badge label={c.codStatus} /></td>
                    <td>
                      {c.codStatus === 'Collected'
                        ? <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Submit</button>
                        : <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-phone" /> Contact Rider</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {innerTab === 'collected' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-circle-check" title="34 Orders Collected" desc="COD cash received by riders, pending submission to accounts." />
          </div>
        </div>
      )}

      {innerTab === 'submitted' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-vault" title="28 Orders Reconciled" desc="COD fully submitted and matched to accounts." />
          </div>
        </div>
      )}
    </>
  );
};

export default CODPanel;