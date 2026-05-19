import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const AVATAR_COLORS = ['#FF6A00', '#16A34A', '#2563EB', '#EC4899', '#059669', '#D97706', '#7C3AED', '#0891B2', '#DC2626'];

const INITIAL_SESSIONS: SessionEntry[] = [
  { user: 'Admin Khan',     role: 'Administrator',   ip: '192.168.1.5',   device: 'Chrome 124 / Windows 11',      time: 'Today 09:02', location: 'Lahore, PK', current: true  },
  { user: 'Sara Khan',      role: 'Ops Manager',     ip: '192.168.1.8',   device: 'Chrome 124 / Windows 10',      time: 'Today 09:10', location: 'Lahore, PK', current: false },
  { user: 'Bilal Raza',     role: 'Inventory Mgr',   ip: '10.0.0.14',     device: 'Safari 17 / iPhone 15',        time: 'Today 09:15', location: 'Lahore, PK', current: false },
  { user: 'Amna Siddiqui',  role: 'Sales Operator',  ip: '192.168.1.22',  device: 'Chrome 124 / Android',         time: 'Today 09:30', location: 'Lahore, PK', current: false },
  { user: 'Fatima Noor',    role: 'Accounts',        ip: '192.168.1.12',  device: 'Firefox 126 / Windows 10',     time: 'Today 09:45', location: 'Lahore, PK', current: false },
  { user: 'Tariq Mehmood',  role: 'Sales Operator',  ip: '203.55.41.12',  device: 'Chrome 124 / Android',         time: 'Today 10:00', location: 'Unknown',    current: false, suspicious: true },
  { user: 'Hamza Iqbal',    role: 'Courier Handler', ip: '192.168.1.18',  device: 'Chrome 124 / Windows 11',      time: 'Today 10:10', location: 'Lahore, PK', current: false },
  { user: 'Hassan Ali',     role: 'Rider',           ip: '10.0.0.22',     device: 'Chrome 124 / Android',         time: 'Today 10:30', location: 'Lahore, PK', current: false },
  { user: 'Omar Farooq',    role: 'Rider',           ip: '10.0.0.35',     device: 'Samsung Internet / Android',   time: 'Today 11:00', location: 'Lahore, PK', current: false },
];

const INITIAL_BLOCKED_IPS: BlockedIP[] = [
  { ip: '203.55.41.12',   reason: '5 failed login attempts',     blocked: '11 May 2026 10:05', attempts: 5 },
  { ip: '185.220.101.33', reason: 'Known proxy / VPN exit node', blocked: '08 May 2026 14:22', attempts: 2 },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

function badgeClass(s: string): string {
  const m: Record<string, string> = {
    Active: 'green', Inactive: 'gray', Current: 'green', Suspicious: 'red',
  };
  return m[s] || 'gray';
}

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${badgeClass(label)}`}>{label}</span>
);

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

const SessionsPanel: React.FC = () => {
  const [sessions, setSessions]       = useState<SessionEntry[]>(INITIAL_SESSIONS);
  const [blockedIPs, setBlockedIPs]   = useState<BlockedIP[]>(INITIAL_BLOCKED_IPS);
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
      {/* Stats */}
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
          <div className="ms-trend down">
            <i className="fa-solid fa-triangle-exclamation" /> Unknown IP detected
          </div>
        </div>
      </div>

      {/* Sessions Table */}
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
                <th>User</th>
                <th>Role</th>
                <th>IP Address</th>
                <th>Device / Browser</th>
                <th>Login Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
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
                      <div
                        className="row-avatar"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 26, height: 26, fontSize: 9 }}
                      >
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
                    {s.suspicious   ? <Badge label="Suspicious" />
                    : s.current     ? <Badge label="Current" />
                    : s.terminated  ? <Badge label="Inactive" />
                    :                 <Badge label="Active" />}
                  </td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    {!s.current && !s.terminated && (
                      <button
                        className="t-btn danger"
                        style={{ height: 22, fontSize: 9.5 }}
                        onClick={() => terminateSession(s.user)}
                      >
                        <i className="fa-solid fa-ban" /> End
                      </button>
                    )}
                    {s.current    && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>—</span>}
                    {s.terminated && !s.current && <span style={{ fontSize: 10, color: 'var(--green)' }}>Ended</span>}
                    {s.suspicious && (
                      <button
                        className="t-btn"
                        style={{ height: 22, fontSize: 9.5, borderColor: 'var(--red)', color: 'var(--red)' }}
                      >
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

      {/* Blocked IPs */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-circle-xmark ic-red" /> Blocked IPs</div>
          <button className="t-btn primary"><i className="fa-solid fa-plus" /> Block IP Manually</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Reason</th>
                <th>Blocked At</th>
                <th>Failed Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedIPs.map(b => (
                <tr key={b.ip}>
                  <td><code className="ref">{b.ip}</code></td>
                  <td style={{ fontSize: '10.5px' }}>{b.reason}</td>
                  <td style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{b.blocked}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--red)' }}>{b.attempts}</td>
                  <td>
                    <button
                      className="t-btn"
                      style={{ height: 22, fontSize: 9.5 }}
                      onClick={() => unblockIP(b.ip)}
                    >
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

export default SessionsPanel;