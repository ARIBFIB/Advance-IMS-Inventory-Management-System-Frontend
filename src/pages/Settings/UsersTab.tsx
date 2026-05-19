import React from 'react';
import { StgToggleRow } from './SettingsShared';

// ── Types ──────────────────────────────────────────────────

interface UserOverview {
  name: string;
  role: string;
  lastLogin: string;
  device: string;
  status: 'Active' | 'Suspended';
}

// ── Static Data ────────────────────────────────────────────

const USERS_OVERVIEW: UserOverview[] = [
  { name: 'Admin Khan',    role: 'Administrator',  lastLogin: 'Just now',    device: 'Chrome / Windows',  status: 'Active'    },
  { name: 'Sara Khan',     role: 'Ops Manager',    lastLogin: '5 min ago',   device: 'Chrome / Windows',  status: 'Active'    },
  { name: 'Bilal Raza',    role: 'Inventory Mgr',  lastLogin: '20 min ago',  device: 'Safari / iPhone',   status: 'Active'    },
  { name: 'Amna Siddiqui', role: 'Sales Operator', lastLogin: '1 hr ago',    device: 'Chrome / Android',  status: 'Active'    },
  { name: 'Fatima Noor',   role: 'Accounts',       lastLogin: '45 min ago',  device: 'Firefox / Windows', status: 'Active'    },
  { name: 'Rabia Tanvir',  role: 'Sales Operator', lastLogin: '1 week ago',  device: 'Chrome / Android',  status: 'Suspended' },
];

const AVATAR_COLORS = ['#FF6A00', '#8B5CF6', '#2563EB', '#EC4899', '#059669', '#6B7280'];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('');
}

// ── UsersTab ───────────────────────────────────────────────

const UsersTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        Manage who can access the system and what they can do. Role-based access control restricts modules per user role.
      </div>
    </div>

    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Access Policies */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-user-gear" /> Access Policies</div>
        </div>
        <div className="card-body" style={{ padding: '10px 14px' }}>
          <StgToggleRow label="Enforce Role-Based Access Control (RBAC)" desc="Users can only access modules assigned to their role" defaultChecked />
          <StgToggleRow label="Allow Staff to View Own Performance Only" desc="Hide other staff metrics from non-admin users" defaultChecked />
          <StgToggleRow label="Hide Cost Price from Sales Operators" defaultChecked />
          <StgToggleRow label="Hide Financial Reports from Non-Finance Roles" defaultChecked />
          <StgToggleRow label="Require Manager Approval for Stock Adjustments" defaultChecked />
          <StgToggleRow label="Allow Staff to Self Check-In (Attendance)" defaultChecked />
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Access Policies</button>
        </div>
      </div>

      {/* Password Policy */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-key" /> Password & Login Policy</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Minimum Password Length</div>
              <input className="form-input" type="number" defaultValue={8} />
            </div>
            <div className="form-group">
              <div className="form-label">Password Expiry (days)</div>
              <input className="form-input" type="number" placeholder="Never" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Max Failed Login Attempts</div>
              <input className="form-input" type="number" defaultValue={5} />
            </div>
            <div className="form-group">
              <div className="form-label">Lockout Duration (minutes)</div>
              <input className="form-input" type="number" defaultValue={30} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
            <StgToggleRow label="Require Uppercase Letter in Password" defaultChecked />
            <StgToggleRow label="Require Number in Password" defaultChecked />
            <StgToggleRow label="Require Special Character" />
            <StgToggleRow label="Force Password Change on First Login" defaultChecked />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Password Policy</button>
        </div>
      </div>
    </div>

    {/* Active Users */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-users" /> Active Users Overview</div>
        <button className="header-btn">
          <i className="fa-solid fa-arrow-up-right-from-square" /> Manage Staff
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Staff Member</th><th>Role</th><th>Last Login</th><th>Login Device</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {USERS_OVERVIEW.map((u, i) => {
              const initials = getInitials(u.name);
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <tr key={i}>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar" style={{ background: `${color}20`, color, fontSize: 9.5, fontWeight: 700 }}>
                        {initials}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td><span className="tag">{u.role}</span></td>
                  <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{u.lastLogin}</span></td>
                  <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{u.device}</span></td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'green' : 'orange'}`}>{u.status}</span>
                  </td>
                  <td>
                    <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', marginRight: 4 }}>
                      <i className="fa-solid fa-key" /> Reset PW
                    </button>
                    {u.status === 'Active'
                      ? <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', color: 'var(--red)' }}>
                          <i className="fa-solid fa-ban" />
                        </button>
                      : <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', color: 'var(--green)' }}>
                          <i className="fa-solid fa-circle-check" />
                        </button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default UsersTab;