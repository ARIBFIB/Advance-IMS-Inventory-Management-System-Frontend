import React, { useState, useCallback } from 'react';
import './SecurityPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type SecTab = 'overview' | 'auth' | 'sessions' | 'ip' | 'backup' | 'export' | 'danger';

interface SessionEntry {
  user: string;
  role: string;
  ip: string;
  device: string;
  time: string;
  location: string;
  current: boolean;
  suspicious?: boolean;
  terminated?: boolean;
}

interface BlockedIP {
  ip: string;
  reason: string;
  blocked: string;
  attempts: number;
}

interface WhitelistEntry {
  ip: string;
  label: string;
  addedBy: string;
  added: string;
  status: 'Active' | 'Inactive';
}

interface BackupEntry {
  date: string;
  size: string;
  duration: string;
  status: 'Success' | 'Failed';
  type: 'Scheduled' | 'Manual';
}

interface ExportEntry {
  time: string;
  type: string;
  format: string;
  records: string;
  by: string;
  status: 'Ready' | 'Processing' | 'Failed';
}

interface SecurityCheck {
  label: string;
  desc: string;
  done: boolean;
  critical: boolean;
}

interface SecEvent {
  event: string;
  user: string;
  time: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

interface ModalState {
  open: boolean;
  title: string;
  body: string;
  confirmWord: string;
  onConfirm: () => void;
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const AVATAR_COLORS = ['#FF6A00', '#16A34A', '#2563EB', '#EC4899', '#059669', '#D97706', '#7C3AED', '#0891B2', '#DC2626'];

const INITIAL_SESSIONS: SessionEntry[] = [
  { user: 'Admin Khan',     role: 'Administrator',  ip: '192.168.1.5',   device: 'Chrome 124 / Windows 11', time: 'Today 09:02', location: 'Lahore, PK',  current: true  },
  { user: 'Sara Khan',      role: 'Ops Manager',    ip: '192.168.1.8',   device: 'Chrome 124 / Windows 10', time: 'Today 09:10', location: 'Lahore, PK',  current: false },
  { user: 'Bilal Raza',     role: 'Inventory Mgr',  ip: '10.0.0.14',     device: 'Safari 17 / iPhone 15',   time: 'Today 09:15', location: 'Lahore, PK',  current: false },
  { user: 'Amna Siddiqui',  role: 'Sales Operator', ip: '192.168.1.22',  device: 'Chrome 124 / Android',    time: 'Today 09:30', location: 'Lahore, PK',  current: false },
  { user: 'Fatima Noor',    role: 'Accounts',        ip: '192.168.1.12',  device: 'Firefox 126 / Windows 10',time: 'Today 09:45', location: 'Lahore, PK',  current: false },
  { user: 'Tariq Mehmood',  role: 'Sales Operator', ip: '203.55.41.12',  device: 'Chrome 124 / Android',    time: 'Today 10:00', location: 'Unknown',     current: false, suspicious: true },
  { user: 'Hamza Iqbal',    role: 'Courier Handler',ip: '192.168.1.18',  device: 'Chrome 124 / Windows 11', time: 'Today 10:10', location: 'Lahore, PK',  current: false },
  { user: 'Hassan Ali',     role: 'Rider',           ip: '10.0.0.22',     device: 'Chrome 124 / Android',    time: 'Today 10:30', location: 'Lahore, PK',  current: false },
  { user: 'Omar Farooq',    role: 'Rider',           ip: '10.0.0.35',     device: 'Samsung Internet / Android',time:'Today 11:00',location: 'Lahore, PK',  current: false },
];

const INITIAL_BLOCKED_IPS: BlockedIP[] = [
  { ip: '203.55.41.12',    reason: '5 failed login attempts',     blocked: '11 May 2026 10:05', attempts: 5 },
  { ip: '185.220.101.33',  reason: 'Known proxy / VPN exit node', blocked: '08 May 2026 14:22', attempts: 2 },
];

const INITIAL_WHITELIST: WhitelistEntry[] = [
  { ip: '192.168.1.0/24', label: 'Office LAN — Lahore HQ',       addedBy: 'Admin Khan',  added: '01 Jan 2026', status: 'Active' },
  { ip: '203.55.11.10',   label: 'Admin Home — Static IP',        addedBy: 'Admin Khan',  added: '15 Jan 2026', status: 'Active' },
  { ip: '10.0.0.0/24',    label: 'Warehouse Network',             addedBy: 'Ops Manager', added: '01 Feb 2026', status: 'Active' },
];

const INITIAL_BACKUPS: BackupEntry[] = [
  { date: '11 May 2026, 08:00', size: '4.2 MB', duration: '12s', status: 'Success', type: 'Scheduled' },
  { date: '10 May 2026, 08:00', size: '4.1 MB', duration: '11s', status: 'Success', type: 'Scheduled' },
  { date: '09 May 2026, 08:00', size: '4.0 MB', duration: '13s', status: 'Success', type: 'Scheduled' },
  { date: '08 May 2026, 08:00', size: '3.9 MB', duration: '10s', status: 'Success', type: 'Scheduled' },
  { date: '07 May 2026, 08:00', size: '3.8 MB', duration: '14s', status: 'Failed',  type: 'Scheduled' },
  { date: '06 May 2026, 08:00', size: '3.8 MB', duration: '11s', status: 'Success', type: 'Scheduled' },
  { date: '05 May 2026, 14:30', size: '3.7 MB', duration: '9s',  status: 'Success', type: 'Manual'    },
];

const EXPORT_HISTORY: ExportEntry[] = [
  { time: '11 May 2026, 14:00', type: 'Orders (All)',        format: 'CSV',   records: '1,284', by: 'Admin Khan',  status: 'Ready' },
  { time: '11 May 2026, 10:30', type: 'Customer Data',       format: 'Excel', records: '3,142', by: 'Sara Khan',   status: 'Ready' },
  { time: '10 May 2026, 17:00', type: 'Full System Export',  format: 'JSON',  records: '—',     by: 'Admin Khan',  status: 'Ready' },
  { time: '09 May 2026, 09:00', type: 'Financial Records',   format: 'Excel', records: '892',   by: 'Fatima Noor', status: 'Ready' },
  { time: '01 May 2026, 08:30', type: 'Audit Logs',          format: 'CSV',   records: '4,820', by: 'Admin Khan',  status: 'Ready' },
];

const SECURITY_CHECKS: SecurityCheck[] = [
  { label: 'Two-Factor Authentication',  desc: 'Protect admin accounts with 2FA',             done: false, critical: true  },
  { label: 'Strong Password Policy',     desc: 'Min. 8 chars, uppercase + number required',   done: true,  critical: false },
  { label: 'Session Timeout Active',     desc: 'Auto-logout after 60 minutes',                done: true,  critical: false },
  { label: 'IP Whitelist Configured',    desc: '3 trusted IP ranges added',                   done: true,  critical: false },
  { label: 'Automatic Daily Backups',    desc: 'Scheduled backups running',                   done: true,  critical: false },
  { label: 'Backup Encryption',          desc: 'AES-256 encryption enabled',                  done: true,  critical: false },
  { label: 'Failed Login Alerts',        desc: 'Notify admin on lockouts',                    done: true,  critical: false },
  { label: 'Audit Logging Enabled',      desc: 'All critical actions logged',                 done: true,  critical: false },
];

const RECENT_EVENTS: SecEvent[] = [
  { event: 'Successful Login',  user: 'Admin Khan', time: 'Today 09:02', severity: 'Info'     },
  { event: 'Failed Login (x3)', user: 'Unknown',    time: 'Today 10:00', severity: 'Critical' },
  { event: 'IP Auto-blocked',   user: 'System',     time: 'Today 10:05', severity: 'Warning'  },
  { event: 'Role Changed',      user: 'Admin Khan', time: 'Today 10:30', severity: 'Warning'  },
  { event: 'Backup Completed',  user: 'System',     time: 'Today 08:00', severity: 'Info'     },
];

const DANGER_ACTIONS = [
  {
    title: 'Clear All Order History',
    desc:  'Permanently deletes all orders, shipments, and COD records. Products and customers are retained. Cannot be undone.',
    icon:  'fa-trash',
    label: 'Clear Orders',
    word:  'CONFIRM',
    critical: false,
  },
  {
    title: 'Reset All Inventory Counts to Zero',
    desc:  'Sets all product stock quantities to 0. Use before a full physical recount. Does not delete products.',
    icon:  'fa-rotate-left',
    label: 'Reset Stock',
    word:  'CONFIRM',
    critical: false,
  },
  {
    title: 'Delete All Customer Records',
    desc:  'Permanently removes all customer profiles and their order history associations. Orders are anonymised.',
    icon:  'fa-users-slash',
    label: 'Delete Customers',
    word:  'CONFIRM',
    critical: false,
  },
  {
    title: 'Purge Audit Logs',
    desc:  'Permanently deletes all system activity logs. This cannot be reversed and may affect compliance reporting.',
    icon:  'fa-file-slash',
    label: 'Purge Logs',
    word:  'CONFIRM',
    critical: false,
  },
  {
    title: 'Factory Reset — Wipe All Data',
    desc:  'Completely resets the system to its initial state. ALL data including products, orders, customers, staff, and logs will be permanently deleted.',
    icon:  'fa-bomb',
    label: 'Factory Reset',
    word:  'DELETE EVERYTHING',
    critical: true,
  },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

function badgeClass(s: string): string {
  const m: Record<string, string> = {
    Active: 'green', Inactive: 'gray', Success: 'green', Failed: 'red',
    Ready: 'green', Info: 'blue', Warning: 'yellow', Critical: 'red',
    Current: 'green', Suspicious: 'red', Processing: 'yellow',
  };
  return m[s] || 'gray';
}

// ═══════════════════════════════════════════════════════════
// MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${badgeClass(label)}`}>{label}</span>
);

const ToggleSwitch: React.FC<{ defaultChecked?: boolean; onChange?: (v: boolean) => void }> = ({ defaultChecked = false, onChange }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={on} onChange={e => { setOn(e.target.checked); onChange?.(e.target.checked); }} />
      <span className="toggle-track" />
    </label>
  );
};

const InnerTabs: React.FC<{ tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }> = ({ tabs, active, onChange }) => (
  <div className="inner-tabs">
    {tabs.map(t => (
      <div key={t.id} className={`itab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
        {t.label}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
// CONFIRM MODAL
// ═══════════════════════════════════════════════════════════

const ConfirmModal: React.FC<{ modal: ModalState; onClose: () => void }> = ({ modal, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleConfirm = () => {
    if (inputVal === modal.confirmWord) {
      modal.onConfirm();
      onClose();
      setInputVal('');
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  if (!modal.open) return null;

  return (
    <div className="sec-modal-backdrop open">
      <div className="sec-modal">
        <div className="sec-modal-title">⚠ Confirm: {modal.title}</div>
        <div className="sec-modal-body">{modal.body}</div>
        <div className="sec-modal-hint">
          Type <strong>{modal.confirmWord}</strong> to proceed:
        </div>
        <input
          className={`form-input sec-modal-input ${inputError ? 'error' : ''}`}
          placeholder="Type confirmation word..."
          value={inputVal}
          onChange={e => { setInputVal(e.target.value); setInputError(false); }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="t-btn danger" style={{ flex: 1, justifyContent: 'center' }} onClick={handleConfirm}>Proceed</button>
          <button className="t-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { onClose(); setInputVal(''); setInputError(false); }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: OVERVIEW
// ═══════════════════════════════════════════════════════════

const OverviewPanel: React.FC<{ onNav: (t: SecTab) => void }> = ({ onNav }) => (
  <>
    <div className="detail-grid-3">
      {/* Security Health */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-shield-halved" /> Security Health</div>
        </div>
        <div className="card-body">
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--yellow)' }}>64%</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Security Score</div>
            <div style={{ margin: '10px auto', maxWidth: 140 }}>
              <div className="prog-bar" style={{ height: 7 }}>
                <div className="prog-fill" style={{ width: '64%', background: 'var(--yellow)' }} />
              </div>
            </div>
          </div>
          {SECURITY_CHECKS.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
              <i
                className={`fa-solid fa-${c.done ? 'circle-check' : 'circle-xmark'}`}
                style={{ color: c.done ? 'var(--green)' : c.critical ? 'var(--red)' : 'var(--yellow)', fontSize: 12, flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10.5px', fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{c.desc}</div>
              </div>
              {!c.done && <Badge label={c.critical ? 'Critical' : 'Recommended'} />}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Events</div>
          <button className="t-btn" onClick={() => onNav('sessions')}>View All</button>
        </div>
        <div className="card-body" style={{ padding: '8px 14px' }}>
          {RECENT_EVENTS.map((e, i) => {
            const iconMap: Record<string, string> = { Critical: 'fa-ban ic-red', Warning: 'fa-triangle-exclamation ic-yellow', Info: 'fa-circle-check ic-blue' };
            const bgMap: Record<string, string> = { Critical: 'var(--red-bg)', Warning: 'var(--yellow-bg)', Info: 'var(--blue-bg)' };
            return (
              <div className="list-item" key={i}>
                <div className="list-icon" style={{ background: bgMap[e.severity] }}>
                  <i className={`fa-solid ${iconMap[e.severity]}`} style={{ fontSize: 10 }} />
                </div>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 11 }}>{e.event}</div>
                  <div className="list-meta">{e.user} · {e.time}</div>
                </div>
                <div className="list-right"><Badge label={e.severity} /></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup Status */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-database" /> Backup Status</div>
          <button className="t-btn" onClick={() => onNav('backup')}>Manage</button>
        </div>
        <div className="card-body">
          <div className="status-indicator good" style={{ marginBottom: 10 }}>
            <div className="status-dot good" /> Backup system operating normally
          </div>
          {[
            ['Last Backup',     '11 May 2026 · 08:00'],
            ['Size',            '4.2 MB'],
            ['Encryption',      <Badge label="Active" />],
            ['Destination',     'Local Server'],
            ['Next Scheduled',  '12 May · 08:00'],
          ].map(([k, v], i) => (
            <div className="detail-row" key={i}>
              <div className="detail-key">{k}</div>
              <div className="detail-val">{v}</div>
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <button className="t-btn primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNav('backup')}>
              <i className="fa-solid fa-database" /> Manage Backups
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Security Checklist */}
    <div className="card" style={{ marginTop: 14 }}>
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-list-check" /> Security Checklist</div>
      </div>
      <div className="card-body" style={{ padding: '10px 14px' }}>
        <div className="checklist-grid">
          {SECURITY_CHECKS.map((c, i) => (
            <div className="checklist-item" key={i}>
              <i
                className={`fa-solid fa-${c.done ? 'circle-check' : 'circle-xmark'}`}
                style={{ color: c.done ? 'var(--green)' : c.critical ? 'var(--red)' : 'var(--yellow)', fontSize: 13, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 11, fontWeight: 500 }}>{c.label}</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// PANEL: AUTHENTICATION
// ═══════════════════════════════════════════════════════════

const AuthPanel: React.FC = () => (
  <>
    <div className="settings-grid">
      <div className="settings-section">
        <div className="settings-section-head"><i className="fa-solid fa-mobile-screen" /> Two-Factor Authentication (2FA)</div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Require 2FA for Administrators</div><div className="stg-desc">Enforce 2FA on all admin-level logins</div></div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Require 2FA for Managers</div><div className="stg-desc">Ops Manager, Inventory Manager, Accounts</div></div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Require 2FA for All Staff</div><div className="stg-desc">Applies to all system users</div></div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">2FA Method</div><div className="stg-desc">Preferred second-factor channel</div></div>
            <select className="stg-select"><option>Authenticator App (TOTP)</option><option>SMS OTP</option><option>Email OTP</option></select>
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Remember Device (days)</div><div className="stg-desc">Skip 2FA on trusted devices</div></div>
            <input type="number" defaultValue={30} className="stg-input" />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-head"><i className="fa-solid fa-key" /> Password Policy</div>
        <div className="settings-section-body">
          <div className="stg-row"><div><div className="stg-key">Minimum Password Length</div></div><input type="number" defaultValue={8} className="stg-input" /></div>
          <div className="stg-row"><div><div className="stg-key">Require Uppercase Letter</div></div><ToggleSwitch defaultChecked /></div>
          <div className="stg-row"><div><div className="stg-key">Require Number</div></div><ToggleSwitch defaultChecked /></div>
          <div className="stg-row"><div><div className="stg-key">Require Special Character</div></div><ToggleSwitch /></div>
          <div className="stg-row">
            <div><div className="stg-key">Password Expiry (days)</div><div className="stg-desc">Force change after N days (0 = never)</div></div>
            <input type="number" defaultValue={0} className="stg-input" placeholder="0 = never" />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Prevent Last N Passwords</div><div className="stg-desc">Disallow reuse of recent passwords</div></div>
            <input type="number" defaultValue={5} className="stg-input" />
          </div>
          <div className="stg-row"><div><div className="stg-key">Force Change on First Login</div></div><ToggleSwitch defaultChecked /></div>
        </div>
      </div>
    </div>

    <div className="settings-grid">
      <div className="settings-section">
        <div className="settings-section-head"><i className="fa-solid fa-ban" /> Login Lockout Policy</div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Max Failed Attempts</div><div className="stg-desc">Before temporary lockout</div></div>
            <input type="number" defaultValue={5} className="stg-input" />
          </div>
          <div className="stg-row"><div><div className="stg-key">Lockout Duration (minutes)</div></div><input type="number" defaultValue={30} className="stg-input" /></div>
          <div className="stg-row"><div><div className="stg-key">Alert Admin on Lockout</div></div><ToggleSwitch defaultChecked /></div>
          <div className="stg-row">
            <div><div className="stg-key">Auto-block IP After Lockouts</div><div className="stg-desc">Permanently block after 3 lockouts</div></div>
            <ToggleSwitch defaultChecked />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-head"><i className="fa-solid fa-clock" /> Session Policy</div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Session Timeout (minutes)</div><div className="stg-desc">Auto-logout after inactivity</div></div>
            <input type="number" defaultValue={60} className="stg-input" />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Single Device Login</div><div className="stg-desc">Terminate previous session on new login</div></div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Alert on New Device Login</div><div className="stg-desc">Notify user when logging in from new device</div></div>
            <ToggleSwitch defaultChecked />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Max Concurrent Sessions Per User</div></div>
            <select className="stg-select"><option>1 (Strict)</option><option>2</option><option>3</option><option>Unlimited</option></select>
          </div>
        </div>
      </div>
    </div>

    <button className="t-btn primary"><i className="fa-solid fa-check" /> Save Authentication Settings</button>
  </>
);

// ═══════════════════════════════════════════════════════════
// PANEL: ACTIVE SESSIONS
// ═══════════════════════════════════════════════════════════

const SessionsPanel: React.FC = () => {
  const [sessions, setSessions] = useState<SessionEntry[]>(INITIAL_SESSIONS);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(INITIAL_BLOCKED_IPS);
  const [allTerminated, setAllTerminated] = useState(false);

  const terminateSession = (user: string) => {
    setSessions(prev => prev.map(s => s.user === user ? { ...s, terminated: true } : s));
  };

  const terminateAll = () => {
    setSessions(prev => prev.map(s => s.current ? s : { ...s, terminated: true }));
    setAllTerminated(true);
  };

  const unblockIP = (ip: string) => {
    setBlockedIPs(prev => prev.filter(b => b.ip !== ip));
  };

  return (
    <>
      <div className="mini-stats cols-3">
        <div className="mini-stat">
          <div className="ms-label">Active Sessions</div>
          <div className="ms-value">{sessions.filter(s => !s.terminated).length}</div>
          <div className="ms-trend">Right now</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Devices Online</div>
          <div className="ms-value">{sessions.filter(s => !s.terminated).length}</div>
          <div className="ms-trend">6 Windows · 2 Android · 1 iPhone</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Suspicious Logins (24h)</div>
          <div className="ms-value" style={{ color: 'var(--red)' }}>1</div>
          <div className="ms-trend down"><i className="fa-solid fa-triangle-exclamation" /> Unknown IP detected</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-desktop" /> All Active Sessions</div>
          <button className="t-btn danger" onClick={terminateAll} disabled={allTerminated}>
            <i className="fa-solid fa-ban" /> {allTerminated ? 'All Ended' : 'Terminate All Other Sessions'}
          </button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Role</th><th>IP Address</th>
                <th>Device / Browser</th><th>Login Time</th>
                <th>Location</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr
                  key={s.user}
                  style={{
                    background: s.suspicious ? 'var(--red-bg)' : s.current ? 'var(--green-bg)' : undefined,
                    opacity: s.terminated ? 0.4 : 1,
                  }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div className="row-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 26, height: 26, fontSize: 9 }}>
                        {initials(s.user)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 11 }}>{s.user}</div>
                        {s.current    && <span style={{ fontSize: 9, color: 'var(--green)' }}>● Your session</span>}
                        {s.suspicious && <span style={{ fontSize: 9, color: 'var(--red)' }}>⚠ Suspicious</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="tag">{s.role}</span></td>
                  <td><code className="ref">{s.ip}</code></td>
                  <td style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{s.device}</td>
                  <td style={{ fontSize: '10.5px' }}>{s.time}</td>
                  <td style={{ fontSize: '10.5px', color: s.suspicious ? 'var(--red)' : 'var(--text-secondary)' }}>{s.location}</td>
                  <td>
                    {s.suspicious ? <Badge label="Suspicious" /> : s.current ? <Badge label="Current" /> : s.terminated ? <Badge label="Inactive" /> : <Badge label="Active" />}
                  </td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    {!s.current && !s.terminated && (
                      <button className="t-btn danger" style={{ height: 22, fontSize: 9.5 }} onClick={() => terminateSession(s.user)}>
                        <i className="fa-solid fa-ban" /> End
                      </button>
                    )}
                    {s.current && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>—</span>}
                    {s.terminated && !s.current && <span style={{ fontSize: 10, color: 'var(--green)' }}>Ended</span>}
                    {s.suspicious && (
                      <button className="t-btn" style={{ height: 22, fontSize: 9.5, borderColor: 'var(--red)', color: 'var(--red)' }}>
                        <i className="fa-solid fa-shield-halved" /> Block IP
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-circle-xmark ic-red" /> Blocked IPs</div>
          <button className="t-btn primary"><i className="fa-solid fa-plus" /> Block IP Manually</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>IP Address</th><th>Reason</th><th>Blocked At</th><th>Failed Attempts</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {blockedIPs.map(b => (
                <tr key={b.ip}>
                  <td><code className="ref">{b.ip}</code></td>
                  <td style={{ fontSize: '10.5px' }}>{b.reason}</td>
                  <td style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{b.blocked}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--red)' }}>{b.attempts}</td>
                  <td>
                    <button className="t-btn" style={{ height: 22, fontSize: 9.5 }} onClick={() => unblockIP(b.ip)}>
                      <i className="fa-solid fa-unlock" /> Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: IP WHITELIST
// ═══════════════════════════════════════════════════════════

const IPWhitelistPanel: React.FC = () => {
  const [whitelist, setWhitelist]     = useState<WhitelistEntry[]>(INITIAL_WHITELIST);
  const [newIP, setNewIP]             = useState('');
  const [newLabel, setNewLabel]       = useState('');
  const [enforced, setEnforced]       = useState(false);
  const [addedBy, setAddedBy]         = useState('Admin Khan');
  const [newStatus, setNewStatus]     = useState<'Active' | 'Inactive'>('Active');

  const addEntry = () => {
    if (!newIP.trim() || !newLabel.trim()) { alert('Please enter both IP and label.'); return; }
    setWhitelist(prev => [{ ip: newIP.trim(), label: newLabel.trim(), addedBy, added: 'Just now', status: newStatus }, ...prev]);
    setNewIP(''); setNewLabel('');
  };

  const removeEntry = (ip: string) => setWhitelist(prev => prev.filter(w => w.ip !== ip));

  return (
    <>
      <div className={`alert-strip ${enforced ? 'success' : 'info'}`}>
        <i className={`fa-solid fa-${enforced ? 'circle-check' : 'circle-info'}`} />
        {enforced
          ? <span>IP Whitelist is now <strong>active</strong>. Only whitelisted IPs can access the panel.</span>
          : 'When IP Whitelist is enabled, only the listed IP addresses or ranges will be allowed to access the admin panel. Leave empty to allow all IPs.'
        }
      </div>

      <div className="detail-grid-2">
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
                  <tr><th>IP / CIDR Range</th><th>Label</th><th>Added By</th><th>Added</th><th>Status</th><th>Actions</th></tr>
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
                        <button className="t-btn danger" style={{ height: 22, fontSize: 9.5 }} onClick={() => removeEntry(w.ip)}>
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

        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-plus-circle ic-orange" /> Add IP / Range</div>
            </div>
            <div className="card-body">
              <div className="form-row single">
                <div className="form-group">
                  <div className="form-label">IP Address or CIDR Range *</div>
                  <input className="form-input" placeholder="e.g. 192.168.1.0/24 or 203.55.11.10" value={newIP} onChange={e => setNewIP(e.target.value)} />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <div className="form-label">Label / Description *</div>
                  <input className="form-input" placeholder="e.g. Office Network — Lahore HQ" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Added By</div>
                  <select className="form-select" value={addedBy} onChange={e => setAddedBy(e.target.value)}>
                    <option>Admin Khan</option><option>Ops Manager</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="form-label">Status</div>
                  <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value as 'Active' | 'Inactive')}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
              <button className="t-btn primary" onClick={addEntry}><i className="fa-solid fa-plus" /> Add to Whitelist</button>
            </div>
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-header"><div className="card-title"><i className="fa-solid fa-circle-info ic-blue" /> IP Format Guide</div></div>
            <div className="card-body">
              {[['Single IP', '203.55.11.10'], ['IP Range (CIDR)', '192.168.1.0/24'], ['Subnet Mask', '10.0.0.0/8'], ['Wildcard Range', '192.168.1.*']].map(([k, v]) => (
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

// ═══════════════════════════════════════════════════════════
// PANEL: BACKUP
// ═══════════════════════════════════════════════════════════

const BackupPanel: React.FC = () => {
  const [backups, setBackups] = useState<BackupEntry[]>(INITIAL_BACKUPS);
  const [running, setRunning] = useState(false);
  const [runDone, setRunDone] = useState(false);

  const runNow = () => {
    setRunning(true); setRunDone(false);
    setTimeout(() => {
      setRunning(false); setRunDone(true);
      const now = new Date();
      const label = `${now.getDate()} May 2026, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setBackups(prev => [{ date: label, size: '4.3 MB', duration: '11s', status: 'Success', type: 'Manual' }, ...prev]);
      setTimeout(() => setRunDone(false), 3000);
    }, 2000);
  };

  return (
    <>
      <div className="mini-stats">
        {[
          { label: 'Last Successful Backup', value: '11 May',  sub: '08:00 AM · 4.2 MB',  subClass: 'up'      },
          { label: 'Backups Stored',          value: '30',      sub: 'Retained 30 days',    subClass: ''        },
          { label: 'Storage Used',            value: '126 MB',  sub: 'of unlimited',         subClass: ''        },
          { label: 'Next Scheduled',          value: '12 May',  sub: '08:00 AM · Auto',      subClass: ''        },
        ].map(s => (
          <div className="mini-stat" key={s.label}>
            <div className="ms-label">{s.label}</div>
            <div className="ms-value" style={{ fontSize: s.value.length > 4 ? 14 : undefined }}>{s.value}</div>
            <div className={`ms-trend ${s.subClass}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="detail-grid-2">
        <div>
          <div className="card">
            <div className="card-header"><div className="card-title"><i className="fa-solid fa-gear" /> Backup Configuration</div></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Frequency</div>
                  <select className="form-select"><option>Daily</option><option>Twice Daily</option><option>Weekly</option><option>Manual Only</option></select>
                </div>
                <div className="form-group">
                  <div className="form-label">Backup Time</div>
                  <input className="form-input" type="time" defaultValue="08:00" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Retention Period (days)</div>
                  <input className="form-input" type="number" defaultValue={30} />
                </div>
                <div className="form-group">
                  <div className="form-label">Format</div>
                  <select className="form-select"><option>Compressed ZIP</option><option>SQL Dump</option><option>JSON Export</option></select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Storage Destination</div>
                  <select className="form-select"><option>Local Server</option><option>Google Drive</option><option>AWS S3</option><option>Dropbox</option></select>
                </div>
                <div className="form-group">
                  <div className="form-label">Notify On</div>
                  <select className="form-select"><option>Failure Only</option><option>Always</option><option>Never</option></select>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div className="stg-row">
                  <div><div className="stg-key">Include Product Images</div><div className="stg-desc">Significantly increases backup size</div></div>
                  <ToggleSwitch />
                </div>
                <div className="stg-row">
                  <div><div className="stg-key">Encrypt Backup (AES-256)</div></div>
                  <ToggleSwitch defaultChecked />
                </div>
                <div className="stg-row">
                  <div><div className="stg-key">Auto-delete After Retention Period</div></div>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="t-btn primary"><i className="fa-solid fa-check" /> Save Backup Config</button>
                <button className="t-btn" onClick={runNow} disabled={running}>
                  {running
                    ? <><i className="fa-solid fa-spinner fa-spin" /> Running...</>
                    : runDone
                    ? <><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }} /> Done!</>
                    : <><i className="fa-solid fa-play" /> Run Now</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Backup History</div>
              <button className="t-btn"><i className="fa-solid fa-file-export" /> Export Log</button>
            </div>
            <div className="card-body" style={{ padding: '6px 14px' }}>
              {backups.map((b, i) => (
                <div className="list-item" key={i}>
                  <div className="list-icon" style={{ background: b.status === 'Success' ? 'var(--green-bg)' : 'var(--red-bg)' }}>
                    <i className={`fa-solid fa-${b.status === 'Success' ? 'circle-check ic-green' : 'circle-xmark ic-red'}`} style={{ fontSize: 11 }} />
                  </div>
                  <div className="list-content">
                    <div className="list-title" style={{ fontSize: 11 }}>{b.date}</div>
                    <div className="list-meta">{b.size} · {b.duration} · <span className="tag">{b.type}</span></div>
                  </div>
                  <div className="list-right">
                    {b.status === 'Success'
                      ? <button className="t-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button>
                      : <button className="t-btn danger" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-rotate" /></button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: DATA EXPORT
// ═══════════════════════════════════════════════════════════

const ExportPanel: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const triggerExport = () => {
    setExporting(true); setExportDone(false);
    setTimeout(() => {
      setExporting(false); setExportDone(true);
      setTimeout(() => setExportDone(false), 4000);
    }, 2000);
  };

  return (
    <>
      <div className="alert-strip info">
        <i className="fa-solid fa-circle-info" />
        All data exports are logged in the Audit Trail. Large exports are queued and a download notification is sent when ready. Only Admins and Managers can initiate exports.
      </div>

      <div className="detail-grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-file-export ic-orange" /> Generate Export</div></div>
          <div className="card-body">
            <div className="form-row single">
              <div className="form-group">
                <div className="form-label">Export Type</div>
                <select className="form-select">
                  <option>Full System Export</option>
                  <option>Products &amp; Inventory</option>
                  <option>Orders (All)</option>
                  <option>Customer Data</option>
                  <option>Financial Records</option>
                  <option>Staff &amp; Activity Logs</option>
                  <option>Audit Logs</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><div className="form-label">Date From</div><input className="form-input" type="date" /></div>
              <div className="form-group"><div className="form-label">Date To</div><input className="form-input" type="date" /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">File Format</div>
                <select className="form-select"><option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>JSON</option><option>PDF</option></select>
              </div>
              <div className="form-group">
                <div className="form-label">Include Sensitive Data</div>
                <select className="form-select"><option>No (Redacted)</option><option>Yes (Admin only)</option></select>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
            <button
              className="t-btn primary"
              style={{
                width: '100%', justifyContent: 'center',
                background: exportDone ? 'var(--green)' : undefined,
                borderColor: exportDone ? 'var(--green)' : undefined,
              }}
              onClick={triggerExport}
              disabled={exporting}
            >
              {exporting
                ? <><i className="fa-solid fa-spinner fa-spin" /> Preparing export...</>
                : exportDone
                ? <><i className="fa-solid fa-circle-check" /> Ready — Click to Download</>
                : <><i className="fa-solid fa-file-export" /> Export Data</>
              }
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Export History</div></div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Timestamp</th><th>Type</th><th>Format</th><th>Records</th><th>By</th><th>Status</th><th>Download</th></tr>
              </thead>
              <tbody>
                {EXPORT_HISTORY.map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{e.time}</td>
                    <td style={{ fontWeight: 500 }}>{e.type}</td>
                    <td><span className="tag">{e.format}</span></td>
                    <td style={{ textAlign: 'center' }}>{e.records}</td>
                    <td>{e.by}</td>
                    <td><Badge label={e.status} /></td>
                    <td><button className="t-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: DANGER ZONE
// ═══════════════════════════════════════════════════════════

const DangerPanel: React.FC<{ onDangerAction: (action: typeof DANGER_ACTIONS[0]) => void; completedActions: Set<string> }> = ({ onDangerAction, completedActions }) => (
  <>
    <div className="alert-strip danger">
      <i className="fa-solid fa-skull-crossbones" />
      <strong>Warning:</strong>&nbsp;All actions in this section are irreversible. A full backup will be created automatically before any destructive action is performed.
    </div>
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-triangle-exclamation ic-red" /> Irreversible Actions</div>
      </div>
      <div className="card-body">
        {DANGER_ACTIONS.map(action => {
          const done = completedActions.has(action.title);
          return (
            <div className={`danger-box ${action.critical ? 'critical' : ''}`} key={action.title}>
              <div>
                <div className="danger-box-title" style={action.critical ? { color: '#991B1B' } : undefined}>{action.title}</div>
                <div className="danger-box-desc">{action.desc}</div>
              </div>
              <button
                className="t-btn danger"
                style={{
                  flexShrink: 0,
                  ...(action.critical ? { borderColor: '#991B1B', color: '#991B1B' } : {}),
                  ...(done ? { color: 'var(--green)', borderColor: 'var(--green)' } : {}),
                }}
                onClick={() => !done && onDangerAction(action)}
                disabled={done}
              >
                <i className={`fa-solid ${done ? 'fa-circle-check' : action.icon}`} />
                {done ? 'Done' : action.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SecTab>('overview');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);
  const [modal, setModal] = useState<ModalState>({ open: false, title: '', body: '', confirmWord: '', onConfirm: () => {} });
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const openDangerModal = useCallback((action: typeof DANGER_ACTIONS[0]) => {
    setModal({
      open: true,
      title: action.title,
      body: `This action is irreversible. A backup will be created automatically before proceeding. Are you absolutely sure you want to ${action.title.toLowerCase()}?`,
      confirmWord: action.word,
      onConfirm: () => {
        setCompletedActions(prev => new Set(Array.from(prev).concat(action.title)));
      },
    });
  }, []);

  const TABS: { id: SecTab; label: string }[] = [
    { id: 'overview',  label: 'Overview'        },
    { id: 'auth',      label: 'Authentication'  },
    { id: 'sessions',  label: 'Active Sessions' },
    { id: 'ip',        label: 'IP Whitelist'    },
    { id: 'backup',    label: 'Backup'          },
    { id: 'export',    label: 'Data Export'     },
    { id: 'danger',    label: 'Danger Zone'     },
  ];

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewPanel onNav={setActiveTab} />;
      case 'auth':      return <AuthPanel />;
      case 'sessions':  return <SessionsPanel />;
      case 'ip':        return <IPWhitelistPanel />;
      case 'backup':    return <BackupPanel />;
      case 'export':    return <ExportPanel />;
      case 'danger':    return <DangerPanel onDangerAction={openDangerModal} completedActions={completedActions} />;
      default:          return null;
    }
  };

  return (
    <div id="page-security">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="page-hero-title">Security &amp; Backup</div>
        <div className="page-hero-sub">Manage system security policies, active sessions, IP whitelisting, backup configuration, and data export controls.</div>
      </div>

      {/* SECURITY HEALTH STRIP */}
      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div><strong>2FA is not enabled</strong> for any accounts. Enable two-factor authentication to improve security posture.</div>
        <button className="t-btn primary" style={{ marginLeft: 'auto' }} onClick={() => setActiveTab('auth')}>
          <i className="fa-solid fa-shield-halved" /> Enable 2FA
        </button>
      </div>

      {/* STATS */}
      <div className="mini-stats">
        <div className="mini-stat">
          <div className="ms-label">Security Score</div>
          <div className="ms-value" style={{ color: 'var(--yellow)' }}>64%</div>
          <div className="ms-trend down"><i className="fa-solid fa-triangle-exclamation" /> 2FA not enabled</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Active Sessions</div>
          <div className="ms-value">9</div>
          <div className="ms-trend"><i className="fa-solid fa-desktop" /> Across 9 users</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Failed Logins (24h)</div>
          <div className="ms-value" style={{ color: 'var(--red)' }}>3</div>
          <div className="ms-trend down"><i className="fa-solid fa-circle-xmark" /> 1 blocked IP</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Last Backup</div>
          <div className="ms-value" style={{ fontSize: 14 }}>11 May</div>
          <div className="ms-trend up"><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }} /> 08:00 AM · Success</div>
        </div>
      </div>

      {/* TABS */}
      <InnerTabs tabs={TABS} active={activeTab} onChange={id => switchTab(id as SecTab)} />

      {/* PANEL */}
      {renderPanel()}

      {/* CONFIRM MODAL */}
      <ConfirmModal modal={modal} onClose={() => setModal(m => ({ ...m, open: false }))} />
    </div>
  );
};

export default SecurityPage;