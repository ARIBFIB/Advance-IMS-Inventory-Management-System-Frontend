// EarningsPanel.tsx
import React, { useState } from 'react';
import { RIDERS, fmt, Badge, RiderAvatar, InnerTabs, EmptyState } from './shared';

const EarningsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('summary');
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Earnings &amp; Pay</div>
      <div className="panel-desc">
        Track per-delivery earnings, monthly pay calculations, bonuses, and pending payouts
        for each rider.
      </div>

      <InnerTabs
        tabs={[
          { id: 'summary', label: 'Pay Summary'         },
          { id: 'detail',  label: 'Delivery Breakdown'  },
          { id: 'payout',  label: 'Payouts'             },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── PAY SUMMARY ── */}
      {innerTab === 'summary' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-coins" /> Monthly Pay Summary — May 2026
            </div>
            <button className="c-btn primary">
              <i className="fa-solid fa-file-export" /> Export Payroll
            </button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rider</th><th>Pay Type</th><th>Deliveries</th><th>Base/Per Delivery</th>
                  <th>Earned</th><th>Bonus</th><th>Total Due</th><th>Paid</th>
                  <th>Balance</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeRiders.map(r => {
                  const balance = r.earned + r.bonus - r.paid;
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="td-flex">
                          <RiderAvatar rider={r} fontSize={9} />
                          <strong>{r.name}</strong>
                        </div>
                      </td>
                      <td><Badge label={r.pay} /></td>
                      <td>{r.deliveries}</td>
                      <td>{r.pay === 'Monthly Fixed' ? `${fmt(r.rate)}/mo` : `${fmt(r.rate)}/del`}</td>
                      <td><strong>{fmt(r.earned)}</strong></td>
                      <td style={{ color: 'var(--green)' }}>{r.bonus > 0 ? fmt(r.bonus) : '—'}</td>
                      <td><strong style={{ color: 'var(--accent)' }}>{fmt(r.earned + r.bonus)}</strong></td>
                      <td style={{ color: 'var(--green)' }}>{fmt(r.paid)}</td>
                      <td style={{ color: balance > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                        {fmt(balance)}
                      </td>
                      <td>
                        <button className="c-btn primary" style={{ height: 22, fontSize: 9.5 }}>
                          <i className="fa-solid fa-money-bill-transfer" /> Pay
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DELIVERY BREAKDOWN ── */}
      {innerTab === 'detail' && (
        <div className="card">
          <div className="card-body">
            <EmptyState
              icon="fa-list-ul"
              title="Delivery Breakdown"
              desc="Select a rider to view per-delivery earnings detail."
            />
          </div>
        </div>
      )}

      {/* ── RECORD PAYOUT ── */}
      {innerTab === 'payout' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-money-bill-transfer" /> Record Payout
            </div>
          </div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Rider</div>
                <select className="c-form-select">
                  {activeRiders.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Amount (₨)</div>
                <input className="c-form-input" type="number" placeholder="0" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Payment Method</div>
                <select className="c-form-select">
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>JazzCash</option>
                  <option>EasyPaisa</option>
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Date</div>
                <input className="c-form-input" type="date" />
              </div>
            </div>
            <div className="c-form-row single">
              <div className="c-form-group">
                <div className="c-form-label">Notes</div>
                <textarea className="c-form-textarea" placeholder="Optional payment notes..." />
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
            <button className="c-btn primary">
              <i className="fa-solid fa-check" /> Record Payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EarningsPanel;