// RulesPanel.tsx
import React, { useState } from 'react';
import { RULES, COURIERS, Badge, InnerTabs, EmptyState } from './shared';

const RulesPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('list');

  return (
    <>
      <div className="panel-heading">Assignment Rules</div>
      <div className="panel-desc">
        Automated courier assignment logic. Rules are evaluated top-to-bottom — first match wins.
      </div>

      <InnerTabs
        tabs={[
          { id: 'list',     label: 'Active Rules'    },
          { id: 'add',      label: 'Add Rule'        },
          { id: 'priority', label: 'Priority Order'  },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── LIST ── */}
      {innerTab === 'list' && (
        <>
          <div className="alert-strip info">
            <i className="fa-solid fa-circle-info" />
            Rules are evaluated top-to-bottom. First matching rule wins. Use Priority Order to reorder.
          </div>
          <div className="card">
            <div className="c-toolbar">
              <div className="c-toolbar-left">
                <div className="c-search">
                  <i className="fa-solid fa-magnifying-glass" />
                  <input placeholder="Search rules..." />
                </div>
              </div>
              <div className="c-toolbar-right">
                <button className="c-btn primary" onClick={() => setInnerTab('add')}>
                  <i className="fa-solid fa-plus" /> Add Rule
                </button>
              </div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Priority</th><th>Rule Name</th><th>Condition</th><th>Assign To</th>
                    <th>Fallback</th><th>Status</th><th>Applied (MTD)</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {RULES.map(r => (
                    <tr key={r.priority}>
                      <td>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>
                          #{r.priority}
                        </span>
                      </td>
                      <td><strong>{r.name}</strong></td>
                      <td><code className="sku">{r.condition}</code></td>
                      <td>{r.assign}</td>
                      <td>{r.fallback}</td>
                      <td><Badge label={r.status} /></td>
                      <td>{r.applied}</td>
                      <td>
                        <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3, color: 'var(--red)' }}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── ADD ── */}
      {innerTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-plus-circle" /> New Assignment Rule</div>
          </div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Rule Name *</div>
                <input className="c-form-input" placeholder="e.g. Karachi — Trax" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Priority</div>
                <input className="c-form-input" type="number" placeholder="1 = highest" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Condition Type</div>
                <select className="c-form-select">
                  <option>City / Destination</option>
                  <option>Order Weight</option>
                  <option>COD Amount</option>
                  <option>Payment Type</option>
                  <option>Product Category</option>
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Condition Value</div>
                <input className="c-form-input" placeholder="e.g. Karachi, >5kg" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Assign To Courier</div>
                <select className="c-form-select">
                  {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Fallback Courier</div>
                <select className="c-form-select">
                  <option>None</option>
                  {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Rule</button>
              <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRIORITY ── */}
      {innerTab === 'priority' && (
        <div className="card">
          <div className="card-body">
            <EmptyState
              icon="fa-list-ol"
              title="Drag to Reorder Rules"
              desc="Rule priority determines which courier is assigned first when multiple rules match."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RulesPanel;