// SettingsPanel.tsx
import React, { useState } from 'react';
import { COURIERS, InnerTabs, ToggleSwitch } from './shared';

const SettingsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('general');

  return (
    <>
      <div className="panel-heading">Courier Settings</div>
      <div className="panel-desc">
        System-wide courier defaults — dispatch rules, cut-off times, COD settings, tracking
        options, and notification preferences.
      </div>

      <InnerTabs
        tabs={[
          { id: 'general',  label: 'General'       },
          { id: 'dispatch', label: 'Dispatch'       },
          { id: 'notif',    label: 'Notifications'  },
          { id: 'cod',      label: 'COD Settings'   },
          { id: 'tracking', label: 'Tracking'       },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── GENERAL ── */}
      {innerTab === 'general' && (
        <>
          <div className="settings-grid">
            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-sliders" /> General Defaults</div>
              <div className="settings-section-body">
                <div className="stg-row">
                  <div><div className="stg-key">Default Courier</div><div className="stg-desc">Auto-assigned when no rule matches</div></div>
                  <select className="stg-select">{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select>
                </div>
                <div className="stg-row">
                  <div><div className="stg-key">Default Payment Type</div><div className="stg-desc">COD or Prepaid default</div></div>
                  <select className="stg-select"><option>COD</option><option>Prepaid</option></select>
                </div>
                <div className="stg-row">
                  <div><div className="stg-key">Currency</div></div>
                  <input type="text" defaultValue="PKR (₨)" className="stg-input" />
                </div>
                <div className="stg-row">
                  <div><div className="stg-key">Auto-create Shipment</div><div className="stg-desc">Create on order confirm</div></div>
                  <ToggleSwitch defaultChecked />
                </div>
                <div className="stg-row">
                  <div><div className="stg-key">Allow Manual Override</div></div>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-weight-hanging" /> Weight &amp; Packaging</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Default Weight (kg)</div></div><input type="number" defaultValue={0.5} className="stg-input" style={{ width: 70 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Dimensional Weight Factor</div></div><input type="number" defaultValue={5000} className="stg-input" style={{ width: 70 }} /></div>
                <div className="stg-row">
                  <div><div className="stg-key">Bill on</div></div>
                  <select className="stg-select"><option>Higher of Both</option><option>Actual Only</option><option>Volumetric Only</option></select>
                </div>
                <div className="stg-row"><div><div className="stg-key">Packaging Cost (₨)</div></div><input type="number" defaultValue={25} className="stg-input" style={{ width: 70 }} /></div>
              </div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save General Settings</button>
        </>
      )}

      {/* ── DISPATCH ── */}
      {innerTab === 'dispatch' && (
        <>
          <div className="settings-grid">
            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-truck" /> Dispatch Rules</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Auto-assign Courier</div></div><ToggleSwitch defaultChecked /></div>
                <div className="stg-row"><div><div className="stg-key">Dispatch Cut-off Time</div></div><input type="time" defaultValue="14:00" className="stg-input" /></div>
                <div className="stg-row">
                  <div><div className="stg-key">Preferred Weekend Courier</div></div>
                  <select className="stg-select"><option>Leopards</option><option>TCS</option><option>Same as Weekday</option></select>
                </div>
                <div className="stg-row"><div><div className="stg-key">High Value COD Threshold (₨)</div></div><input type="number" defaultValue={10000} className="stg-input" /></div>
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-redo" /> Re-attempt Settings</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Max Delivery Attempts</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Re-attempt After (hours)</div></div><input type="number" defaultValue={24} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Auto-RTO After Attempts</div></div><ToggleSwitch defaultChecked /></div>
                <div className="stg-row"><div><div className="stg-key">Contact Customer on Fail</div></div><ToggleSwitch defaultChecked /></div>
              </div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Dispatch Settings</button>
        </>
      )}

      {/* ── NOTIFICATIONS ── */}
      {innerTab === 'notif' && (
        <>
          <div className="settings-section" style={{ marginBottom: 14 }}>
            <div className="settings-section-head"><i className="fa-solid fa-bell" /> Notification Settings</div>
            <div className="settings-section-body">
              {[
                'Dispatched — Notify Ops Manager',
                'Delivered — Notify Accounts',
                'RTO Received — Notify Inventory',
                'Failed Delivery — Notify Admin',
                'COD Collected — Notify Accounts',
                'Daily Dispatch Summary',
              ].map(k => (
                <div key={k} className="stg-row">
                  <div><div className="stg-key">{k}</div></div>
                  <ToggleSwitch defaultChecked />
                </div>
              ))}
              <div className="stg-row">
                <div><div className="stg-key">Delay Alert Threshold (Days)</div></div>
                <input type="number" defaultValue={1} className="stg-input" style={{ width: 60 }} />
              </div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Notification Settings</button>
        </>
      )}

      {/* ── COD ── */}
      {innerTab === 'cod' && (
        <>
          <div className="settings-grid">
            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-coins" /> COD Collection</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Auto-mark COD on Delivery</div></div><ToggleSwitch defaultChecked /></div>
                <div className="stg-row"><div><div className="stg-key">Expected Settlement (Days)</div></div><input type="number" defaultValue={7} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Overdue Alert (Days)</div></div><input type="number" defaultValue={10} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">COD Shortfall Alert</div></div><ToggleSwitch defaultChecked /></div>
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-percent" /> Charges &amp; Deductions</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Default COD Fee (%)</div></div><input type="number" defaultValue={1.5} className="stg-input" style={{ width: 70 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Auto-deduct COD Fee</div></div><ToggleSwitch defaultChecked /></div>
                <div className="stg-row"><div><div className="stg-key">Include Tax on COD Fee</div></div><ToggleSwitch /></div>
                <div className="stg-row"><div><div className="stg-key">Record COD in Financials</div></div><ToggleSwitch defaultChecked /></div>
              </div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save COD Settings</button>
        </>
      )}

      {/* ── TRACKING ── */}
      {innerTab === 'tracking' && (
        <>
          <div className="settings-section" style={{ marginBottom: 14 }}>
            <div className="settings-section-head"><i className="fa-solid fa-location-dot" /> Tracking Configuration</div>
            <div className="settings-section-body">
              <div className="stg-row"><div><div className="stg-key">Enable API Tracking</div></div><ToggleSwitch defaultChecked /></div>
              <div className="stg-row"><div><div className="stg-key">Manual Tracking Fallback</div></div><ToggleSwitch defaultChecked /></div>
              <div className="stg-row"><div><div className="stg-key">Show Tracking to Customers</div></div><ToggleSwitch /></div>
              <div className="stg-row"><div><div className="stg-key">Tracking History Depth</div></div><input type="number" defaultValue={50} className="stg-input" style={{ width: 60 }} /></div>
              <div className="stg-row"><div><div className="stg-key">Flag Stale Shipments After (Days)</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Tracking Settings</button>
        </>
      )}
    </>
  );
};

export default SettingsPanel;