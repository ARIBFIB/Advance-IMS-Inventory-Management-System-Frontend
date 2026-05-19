// ZonesPanel.tsx
import React, { useState } from 'react';
import { RIDERS, ZONES_DATA, ToggleSwitch, InnerTabs, EmptyState } from './shared';

const ZonesPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('list');
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Delivery Zones</div>
      <div className="panel-desc">
        Define geographic delivery zones, map areas to primary riders, and set delivery
        time targets per zone.
      </div>

      <InnerTabs
        tabs={[
          { id: 'list',  label: 'Zone List'    },
          { id: 'add',   label: 'Add Zone'     },
          { id: 'areas', label: 'Area Mapping' },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── ZONE LIST ── */}
      {innerTab === 'list' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search zone..." />
              </div>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn primary" onClick={() => setInnerTab('add')}>
                <i className="fa-solid fa-plus" /> Add Zone
              </button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Zone Name</th><th>Areas / Neighbourhoods</th><th>Primary Rider</th>
                  <th>Backup Rider</th><th>Avg. Delivery Time</th><th>Active Orders</th>
                  <th>Active</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ZONES_DATA.map(z => (
                  <tr key={z.name}>
                    <td><strong>{z.name}</strong></td>
                    <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>{z.areas}</td>
                    <td>{z.primary}</td>
                    <td>{z.backup}</td>
                    <td>{z.time}</td>
                    <td><span className="badge orange">{z.active}</span></td>
                    <td><ToggleSwitch defaultChecked /></td>
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
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

      {/* ── ADD ZONE ── */}
      {innerTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-map-pin" /> Add Delivery Zone</div>
          </div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Zone Name *</div>
                <input className="c-form-input" placeholder="e.g. DHA / Cantt" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Zone Code</div>
                <input className="c-form-input" placeholder="DHA" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Primary Rider</div>
                <select className="c-form-select">
                  {activeRiders.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Backup Rider</div>
                <select className="c-form-select">
                  <option>None</option>
                  {activeRiders.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
            <div className="c-form-row triple">
              <div className="c-form-group">
                <div className="c-form-label">Min Delivery Time (min)</div>
                <input className="c-form-input" type="number" defaultValue={20} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Max Delivery Time (min)</div>
                <input className="c-form-input" type="number" defaultValue={60} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Delivery Charge (₨)</div>
                <input className="c-form-input" type="number" defaultValue={0} />
              </div>
            </div>
            <div className="c-form-row single">
              <div className="c-form-group">
                <div className="c-form-label">Areas / Neighbourhoods</div>
                <textarea
                  className="c-form-textarea"
                  placeholder="e.g. DHA Phase 1, DHA Phase 2, Cantonment, Walton..."
                />
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Zone</button>
              <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AREA MAPPING ── */}
      {innerTab === 'areas' && (
        <div className="card">
          <div className="card-body">
            <EmptyState
              icon="fa-map"
              title="Area Mapping"
              desc="Map specific areas and postal codes to their delivery zones."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ZonesPanel;