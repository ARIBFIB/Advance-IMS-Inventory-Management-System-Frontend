// ZonesPanel.tsx
import React, { useState } from 'react';
import { ZONES, CITY_MAP, COURIERS, ToggleSwitch, InnerTabs } from './shared';

const ZonesPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('list');

  return (
    <>
      <div className="panel-heading">Zones &amp; Coverage</div>
      <div className="panel-desc">
        Define delivery zones, map cities to their primary and backup couriers, and set rate
        multipliers for remote areas.
      </div>

      <InnerTabs
        tabs={[
          { id: 'list',   label: 'Zone List'    },
          { id: 'cities', label: 'City Mapping' },
          { id: 'add',    label: 'Add Zone'     },
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
                  <th>Zone Name</th><th>Cities Covered</th><th>Primary Courier</th>
                  <th>Backup Courier</th><th>Avg. Delivery Days</th><th>Rate Multiplier</th>
                  <th>Active</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map(z => (
                  <tr key={z.name}>
                    <td><strong>{z.name}</strong></td>
                    <td><span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{z.cities}</span></td>
                    <td>{z.primary}</td>
                    <td>{z.backup}</td>
                    <td>{z.days}d</td>
                    <td>{z.mult}x</td>
                    <td><ToggleSwitch defaultChecked /></td>
                    <td>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
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

      {/* ── CITY MAPPING ── */}
      {innerTab === 'cities' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-city" /> City to Courier Mapping</div>
            <button className="c-btn primary"><i className="fa-solid fa-plus" /> Add City</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>City</th><th>Province</th><th>Zone</th><th>Primary Courier</th>
                  <th>Backup</th><th>Delivery Days</th><th>Serviceable</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {CITY_MAP.map(c => (
                  <tr key={c.city}>
                    <td><strong>{c.city}</strong></td>
                    <td>{c.province}</td>
                    <td>{c.zone}</td>
                    <td>{c.primary}</td>
                    <td>{c.backup}</td>
                    <td>{c.days}d</td>
                    <td><span className="badge green">Yes</span></td>
                    <td>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
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
            <div className="card-title"><i className="fa-solid fa-map-pin" /> Add New Zone</div>
          </div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Zone Name *</div>
                <input className="c-form-input" placeholder="e.g. Karachi Metro" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Zone Code</div>
                <input className="c-form-input" placeholder="KHI" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Primary Courier</div>
                <select className="c-form-select">
                  {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Backup Courier</div>
                <select className="c-form-select">
                  <option>None</option>
                  {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="c-form-row triple">
              <div className="c-form-group">
                <div className="c-form-label">Min Delivery Days</div>
                <input className="c-form-input" type="number" defaultValue={1} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Max Delivery Days</div>
                <input className="c-form-input" type="number" defaultValue={3} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Rate Multiplier</div>
                <input className="c-form-input" type="number" defaultValue={1.0} step={0.1} />
              </div>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Zone</button>
              <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ZonesPanel;