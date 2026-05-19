// CODPanel.tsx
import React, { useState } from 'react';
import { COD_PENDING, COD_SUMMARY, fmt, Badge, CPagination, InnerTabs, EmptyState } from './shared';

const CODPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('pending');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const total = COD_PENDING.length;
  const start = (page - 1) * PER_PAGE + 1;
  const end   = Math.min(page * PER_PAGE, total);
  const pageItems = COD_PENDING.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">COD Reconciliation</div>
      <div className="panel-desc">
        Track, verify, and reconcile COD payments owed by each courier. Mark collections, flag
        overdue remittances, and view disputes.
      </div>

      <InnerTabs
        tabs={[
          { id: 'pending',   label: 'Pending Collection'    },
          { id: 'collected', label: 'Collected'             },
          { id: 'disputes',  label: 'Disputes'              },
          { id: 'summary',   label: 'Summary by Courier'    },
        ]}
        active={innerTab}
        onChange={t => { setInnerTab(t); setPage(1); }}
      />

      {/* ── PENDING ── */}
      {innerTab === 'pending' && (
        <>
          <div className="mini-stats">
            <div className="mini-stat"><div className="ms-label">Total Pending COD</div><div className="ms-value">₨84K</div><div className="ms-trend down">Due from couriers</div></div>
            <div className="mini-stat"><div className="ms-label">TCS Pending</div><div className="ms-value">₨38K</div><div className="ms-trend down">14 deliveries</div></div>
            <div className="mini-stat"><div className="ms-label">Leopards Pending</div><div className="ms-value">₨29K</div><div className="ms-trend">11 deliveries</div></div>
            <div className="mini-stat"><div className="ms-label">Overdue (&gt;7 days)</div><div className="ms-value">₨12K</div><div className="ms-trend down">Escalate</div></div>
          </div>

          <div className="card">
            <div className="c-toolbar">
              <div className="c-toolbar-left">
                <div className="c-search">
                  <i className="fa-solid fa-magnifying-glass" />
                  <input placeholder="Search order or courier..." />
                </div>
                <button className="c-btn active">All</button>
                <button className="c-btn" style={{ color: 'var(--red)' }}>Overdue</button>
              </div>
              <div className="c-toolbar-right">
                <button className="c-btn primary">
                  <i className="fa-solid fa-check-double" /> Mark Selected Collected
                </button>
              </div>
            </div>

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Order</th><th>Courier</th><th>Customer</th><th>Delivered On</th>
                    <th>COD Amount</th><th>Days Outstanding</th><th>Settlement Due</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(c => (
                    <tr key={c.order}>
                      <td><input type="checkbox" /></td>
                      <td><strong>{c.order}</strong></td>
                      <td><span className="tag">{c.courier}</span></td>
                      <td>{c.customer}</td>
                      <td>{c.delivered}</td>
                      <td><strong>{fmt(c.amount)}</strong></td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: c.days >= 7 ? 'var(--red)' : c.days >= 5 ? 'var(--yellow)' : 'var(--text-primary)',
                        }}>
                          {c.days} days
                        </span>
                      </td>
                      <td>{c.due}</td>
                      <td>
                        <button className="c-btn primary" style={{ height: 23, fontSize: 9.5 }}>
                          <i className="fa-solid fa-check" /> Mark Collected
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CPagination
              current={page} total={Math.ceil(total / PER_PAGE)}
              totalItems={total} start={start} end={end}
              onChange={setPage}
            />
          </div>
        </>
      )}

      {innerTab === 'collected' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-coins" title="Collected COD" desc="₨2,14,000 collected in total this month." />
          </div>
        </div>
      )}

      {innerTab === 'disputes' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-scale-balanced" title="COD Disputes" desc="2 disputes under review — amounts don't match courier records." />
          </div>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {innerTab === 'summary' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-table" /> COD Summary by Courier</div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Courier</th><th>Total Delivered</th><th>COD Amount</th><th>Collected</th>
                  <th>Pending</th><th>Overdue</th><th>Settlement Freq.</th>
                  <th>Last Settlement</th><th>Next Due</th>
                </tr>
              </thead>
              <tbody>
                {COD_SUMMARY.map(c => (
                  <tr key={c.courier}>
                    <td><strong>{c.courier}</strong></td>
                    <td>{c.delivered}</td>
                    <td>{c.codAmt}</td>
                    <td style={{ color: 'var(--green)' }}>{c.collected}</td>
                    <td style={{ color: c.pending !== '₨0' ? 'var(--yellow)' : 'var(--text-primary)' }}>{c.pending}</td>
                    <td style={{ color: c.overdue !== '₨0' ? 'var(--red)' : 'var(--green)' }}>{c.overdue}</td>
                    <td>{c.freq}</td>
                    <td>{c.last}</td>
                    <td>{c.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default CODPanel;