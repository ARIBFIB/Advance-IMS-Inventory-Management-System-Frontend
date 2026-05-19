// ContractsPanel.tsx
import React, { useState } from 'react';
import { CONTRACTS, COURIERS, Badge, InnerTabs, EmptyState } from './shared';

const ContractsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('active');

  return (
    <>
      {/* ── Header row with title + Add button ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="panel-heading">Contracts &amp; Terms</div>
          <div className="panel-desc">
            Formal agreements, SLAs, and payment terms with each courier. Track expiry dates and
            auto-renewal settings.
          </div>
        </div>

        <button
          className="c-btn primary"
          style={{ flexShrink: 0, marginTop: 4 }}
          onClick={() => setInnerTab('add')}
        >
          <i className="fa-solid fa-plus" /> Add Contract
        </button>
      </div>

      <InnerTabs
        tabs={[
          { id: 'active',  label: 'Active Contracts' },
          { id: 'expired', label: 'Expired'           },
          { id: 'add',     label: 'New Contract'      },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── ACTIVE ── */}
      {innerTab === 'active' && (
        <div className="card">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Courier</th><th>Contract #</th><th>Start Date</th><th>End Date</th>
                  <th>SLA (Days)</th><th>Penalty/Day</th><th>COD Settlement</th>
                  <th>Auto-renew</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACTS.map(c => (
                  <tr key={c.ref}>
                    <td><strong>{c.courier}</strong></td>
                    <td><code className="sku">{c.ref}</code></td>
                    <td>{c.start}</td>
                    <td>{c.end}</td>
                    <td>{c.sla} days</td>
                    <td>₨{c.penalty}/day</td>
                    <td>{c.codDays} days</td>
                    <td>{c.autoRenew}</td>
                    <td><Badge label={c.status} /></td>
                    <td>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3 }}>
                        <i className="fa-solid fa-pen" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EXPIRED ── */}
      {innerTab === 'expired' && (
        <div className="card">
          <div className="card-body">
            <EmptyState
              icon="fa-file-circle-xmark"
              title="No Expired Contracts"
              desc="All contracts are currently active."
            />
          </div>
        </div>
      )}

      {/* ── ADD ── */}
      {innerTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-pen" /> New Contract</div>
          </div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Courier Company</div>
                <select className="c-form-select">
                  {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Contract Reference #</div>
                <input className="c-form-input" placeholder="CTR-2026-XXX" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Start Date</div>
                <input className="c-form-input" type="date" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">End Date</div>
                <input className="c-form-input" type="date" />
              </div>
            </div>
            <div className="c-form-row triple">
              <div className="c-form-group">
                <div className="c-form-label">SLA (Days)</div>
                <input className="c-form-input" type="number" placeholder="3" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Penalty/Day (₨)</div>
                <input className="c-form-input" type="number" placeholder="50" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">COD Settlement (Days)</div>
                <input className="c-form-input" type="number" placeholder="7" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Auto-renew</div>
                <select className="c-form-select">
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Renewal Notice (Days)</div>
                <input className="c-form-input" type="number" placeholder="30" />
              </div>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Contract</button>
              <button className="c-btn" onClick={() => setInnerTab('active')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractsPanel;