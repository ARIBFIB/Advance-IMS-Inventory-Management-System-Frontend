import React from 'react';
import { StgToggleRow, StgRow } from './SettingsShared';

// ── Types ──────────────────────────────────────────────────

interface SecurityEvent {
  time: string;
  event: string;
  user: string;
  ip: string;
  device: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

// ── Static Data ────────────────────────────────────────────

const SECURITY_LOG: SecurityEvent[] = [
  { time: '11 May 09:12', event: 'Successful Login',  user: 'Admin Khan',  ip: '192.168.1.5',   device: 'Chrome / Windows',  severity: 'Info'     },
  { time: '11 May 09:30', event: 'Password Changed',  user: 'Sara Khan',   ip: '192.168.1.8',   device: 'Chrome / Windows',  severity: 'Info'     },
  { time: '11 May 10:00', event: 'Failed Login (x3)', user: 'Unknown',     ip: '203.55.41.12',  device: 'Unknown',            severity: 'Critical' },
  { time: '11 May 10:15', event: 'IP Blocked',        user: 'System',      ip: '203.55.41.12',  device: '—',                  severity: 'Warning'  },
  { time: '11 May 11:30', event: 'Role Changed',      user: 'Admin Khan',  ip: '192.168.1.5',   device: 'Chrome / Windows',  severity: 'Warning'  },
  { time: '10 May 18:00', event: 'Successful Login',  user: 'Bilal Raza',  ip: '10.0.0.14',     device: 'Safari / iPhone',   severity: 'Info'     },
  { time: '10 May 16:30', event: 'Export Triggered',  user: 'Fatima Noor', ip: '192.168.1.12',  device: 'Firefox / Windows', severity: 'Info'     },
];

function severityBadgeColor(s: SecurityEvent['severity']): string {
  const map: Record<string, string> = { Info: 'blue', Warning: 'yellow', Critical: 'red' };
  return map[s] || 'gray';
}

// ── SecurityTab ────────────────────────────────────────────

const SecurityTab: React.FC = () => (
  <>
    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Security Settings */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-shield-halved" /> Security Settings</div>
        </div>
        <div className="card-body" style={{ padding: '10px 14px' }}>
          <StgToggleRow label="Two-Factor Authentication (2FA)" desc="Require 2FA for Admin and Manager logins" />
          <StgRow label="Session Timeout (minutes)">
            <input type="number" defaultValue={60} className="form-input" style={{ width: 70, height: 26, fontSize: 11 }} />
          </StgRow>
          <StgToggleRow label="Single Device Login" desc="Log out previous session on new login" />
          <StgToggleRow label="Restrict Login to Office IP" desc="Block logins from unknown IP addresses" />
          <StgToggleRow label="Alert on Login from New Device" defaultChecked />
          <StgToggleRow label="Log All Admin Actions to Audit Trail" defaultChecked />
          <StgRow label="Audit Log Retention (days)">
            <input type="number" defaultValue={90} className="form-input" style={{ width: 70, height: 26, fontSize: 11 }} />
          </StgRow>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Security Settings</button>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-network-wired" /> IP Whitelist</div>
          <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add IP</button>
        </div>
        <div className="card-body">
          <div className="alert-strip info" style={{ marginBottom: 10 }}>
            <i className="fa-solid fa-circle-info" />
            Only whitelisted IPs can access the admin panel. Leave empty to allow all IPs.
          </div>
          <div className="list-item">
            <div className="list-content">
              <div className="list-title"><code className="ip-code">192.168.1.0/24</code></div>
              <div className="list-meta">Office LAN — Lahore HQ</div>
            </div>
            <div className="list-right"><span className="badge green">Active</span></div>
          </div>
          <div className="list-item">
            <div className="list-content">
              <div className="list-title"><code className="ip-code">203.55.11.10</code></div>
              <div className="list-meta">Admin Home — Static IP</div>
            </div>
            <div className="list-right"><span className="badge green">Active</span></div>
          </div>
          <hr />
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">IP Address / Range</div>
              <input className="form-input" placeholder="e.g. 192.168.1.100" />
            </div>
            <div className="form-group">
              <div className="form-label">Label</div>
              <input className="form-input" placeholder="e.g. Office Network" />
            </div>
          </div>
          <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add to Whitelist</button>
        </div>
      </div>
    </div>

    {/* Security Events */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Security Events</div>
        <button className="header-btn"><i className="fa-solid fa-file-export" /> Export Log</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Timestamp</th><th>Event</th><th>User</th><th>IP Address</th><th>Device</th><th>Severity</th></tr>
          </thead>
          <tbody>
            {SECURITY_LOG.map((l, i) => (
              <tr key={i}>
                <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l.time}</span></td>
                <td><strong style={{ fontSize: 11.5 }}>{l.event}</strong></td>
                <td>{l.user}</td>
                <td>
                  <code style={{ fontSize: 10, fontFamily: 'monospace', background: 'var(--bg)', padding: '1px 4px', borderRadius: 3 }}>
                    {l.ip}
                  </code>
                </td>
                <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{l.device}</span></td>
                <td><span className={`badge ${severityBadgeColor(l.severity)}`}>{l.severity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default SecurityTab;