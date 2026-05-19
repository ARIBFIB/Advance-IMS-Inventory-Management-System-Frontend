import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface WhitelistEntry {
  ip: string;
  label: string;
  addedBy: string;
  added: string;
  status: 'Active' | 'Inactive';
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const INITIAL_WHITELIST: WhitelistEntry[] = [
  { ip: '192.168.1.0/24', label: 'Office LAN — Lahore HQ',  addedBy: 'Admin Khan',  added: '01 Jan 2026', status: 'Active' },
  { ip: '203.55.11.10',   label: 'Admin Home — Static IP',  addedBy: 'Admin Khan',  added: '15 Jan 2026', status: 'Active' },
  { ip: '10.0.0.0/24',    label: 'Warehouse Network',       addedBy: 'Ops Manager', added: '01 Feb 2026', status: 'Active' },
];

// ═══════════════════════════════════════════════════════════
// MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════

function badgeClass(s: string): string {
  const m: Record<string, string> = { Active: 'green', Inactive: 'gray' };
  return m[s] || 'gray';
}

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${badgeClass(label)}`}>{label}</span>
);

const ToggleSwitch: React.FC<{ defaultChecked?: boolean; onChange?: (v: boolean) => void }> = ({ defaultChecked = false, onChange }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={on}
        onChange={e => { setOn(e.target.checked); onChange?.(e.target.checked); }}
      />
      <span className="toggle-track" />
    </label>
  );
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

const IPWhitelistPanel: React.FC = () => {
  const [whitelist, setWhitelist]   = useState<WhitelistEntry[]>(INITIAL_WHITELIST);
  const [newIP, setNewIP]           = useState('');
  const [newLabel, setNewLabel]     = useState('');
  const [enforced, setEnforced]     = useState(false);
  const [addedBy, setAddedBy]       = useState('Admin Khan');
  const [newStatus, setNewStatus]   = useState<'Active' | 'Inactive'>('Active');

  const addEntry = () => {
    if (!newIP.trim() || !newLabel.trim()) {
      alert('Please enter both IP and label.');
      return;
    }
    setWhitelist(prev => [
      { ip: newIP.trim(), label: newLabel.trim(), addedBy, added: 'Just now', status: newStatus },
      ...prev,
    ]);
    setNewIP('');
    setNewLabel('');
  };

  const removeEntry = (ip: string) => {
    setWhitelist(prev => prev.filter(w => w.ip !== ip));
  };

  return (
    <>
      {/* Info Banner */}
      <div className={`alert-strip ${enforced ? 'success' : 'info'}`}>
        <i className={`fa-solid fa-${enforced ? 'circle-check' : 'circle-info'}`} />
        {enforced
          ? <span>IP Whitelist is now <strong>active</strong>. Only whitelisted IPs can access the panel.</span>
          : 'When IP Whitelist is enabled, only the listed IP addresses or ranges will be allowed to access the admin panel. Leave empty to allow all IPs.'
        }
      </div>

      <div className="detail-grid-2">
        {/* Whitelist Table */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-list-check" /> Whitelisted IPs</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10.5px' }}>
                Enforce Whitelist
                <ToggleSwitch defaultChecked={enforced} onChange={setEnforced} />
              </div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>IP / CIDR Range</th>
                    <th>Label</th>
                    <th>Added By</th>
                    <th>Added</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelist.map(w => (
                    <tr key={w.ip}>
                      <td><code className="ref">{w.ip}</code></td>
                      <td style={{ fontWeight: 500 }}>{w.label}</td>
                      <td style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{w.addedBy}</td>
                      <td style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{w.added}</td>
                      <td><Badge label={w.status} /></td>
                      <td>
                        <button
                          className="t-btn danger"
                          style={{ height: 22, fontSize: 9.5 }}
                          onClick={() => removeEntry(w.ip)}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add IP Form + Format Guide */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-plus-circle ic-orange" /> Add IP / Range</div>
            </div>
            <div className="card-body">
              <div className="form-row single">
                <div className="form-group">
                  <div className="form-label">IP Address or CIDR Range *</div>
                  <input
                    className="form-input"
                    placeholder="e.g. 192.168.1.0/24 or 203.55.11.10"
                    value={newIP}
                    onChange={e => setNewIP(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <div className="form-label">Label / Description *</div>
                  <input
                    className="form-input"
                    placeholder="e.g. Office Network — Lahore HQ"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Added By</div>
                  <select className="form-select" value={addedBy} onChange={e => setAddedBy(e.target.value)}>
                    <option>Admin Khan</option>
                    <option>Ops Manager</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="form-label">Status</div>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'Active' | 'Inactive')}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
              <button className="t-btn primary" onClick={addEntry}>
                <i className="fa-solid fa-plus" /> Add to Whitelist
              </button>
            </div>
          </div>

          {/* Format Guide */}
          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-circle-info ic-blue" /> IP Format Guide</div>
            </div>
            <div className="card-body">
              {[
                ['Single IP',       '203.55.11.10'],
                ['IP Range (CIDR)', '192.168.1.0/24'],
                ['Subnet Mask',     '10.0.0.0/8'],
                ['Wildcard Range',  '192.168.1.*'],
              ].map(([k, v]) => (
                <div className="detail-row" key={k}>
                  <div className="detail-key">{k}</div>
                  <div className="detail-val"><code className="ref">{v}</code></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IPWhitelistPanel;