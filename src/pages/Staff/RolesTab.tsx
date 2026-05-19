// ═══════════════════════════════════════════════════════════
// RolesTab.tsx — Tab 2: Roles & Access
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { AccessLevel } from './staff.types';
import { ROLES_DATA, MATRIX_MODULES, levelBadgeClass } from './staffData';
import ThreeDot from './ThreeDot';
import Toggle from './Toggle';
import PermissionsPanel from './PermissionsPanel';

const MATRIX_COLS = ['Admin', 'Ops Manager', 'Inventory Mgr', 'Sales Operator', 'Accounts', 'Courier Handler', 'Rider'];

// ── Role Form Side Panel ───────────────────────────────────
interface RolePanelProps {
  editRoleName: string | null;
  onClose: () => void;
}

const RoleFormPanel: React.FC<RolePanelProps> = ({ editRoleName, onClose }) => (
  <>
    <div id="staff-backdrop" className="open" onClick={onClose} />
    <div id="staff-detail-panel" className="open">
      <div className="staff-panel-header">
        <div className="staff-panel-title">{editRoleName ? `Edit Role: ${editRoleName}` : 'Add New Role'}</div>
        <button className="staff-panel-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
      </div>
      <div id="staff-panel-body">
        <div className="staff-panel-form">
          <div className="form-group" style={{ marginBottom: 10 }}>
            <div className="form-label">Role Name *</div>
            <input className="form-input" defaultValue={editRoleName ?? ''} placeholder="e.g. Warehouse Staff" style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <div className="form-label">Description</div>
            <input className="form-input" placeholder="Brief description of this role..." style={{ width: '100%' }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Access Level</div>
              <select className="form-select">
                {(['Full', 'High', 'Medium', 'Limited', 'Minimal'] as AccessLevel[]).map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Status</div>
              <select className="form-select">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="panel-section-label" style={{ margin: '12px 0 8px' }}>Module Permissions</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
            Toggle which modules this role can access.
          </div>
          {['Dashboard','Products','Orders','Inventory','Customers','Couriers','Riders','Finance','Tasks','Staff','Reports','Settings'].map(mod => (
            <div className="perm-row" key={mod}>
              <div className="perm-label">
                {mod}
                <small>Grant access to {mod} module</small>
              </div>
              <Toggle checked={['Dashboard', 'Orders', 'Tasks'].includes(mod)} />
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="header-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
              <i className="fa-solid fa-check" /> {editRoleName ? 'Save Changes' : 'Create Role'}
            </button>
            <button className="header-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </>
);

// ── Main Tab ───────────────────────────────────────────────
const RolesTab: React.FC = () => {
  const [selectedRole,   setSelectedRole]   = useState<{ name: string; idx: number } | null>(null);
  const [showRolePanel,  setShowRolePanel]  = useState(false);
  const [editRoleName,   setEditRoleName]   = useState<string | null>(null);

  return (
    <>
      {/* Info Banner */}
      <div className="info-banner">
        <i className="fa-solid fa-circle-info" />
        <div className="info-banner-text">
          Role-based access control (RBAC) restricts system access based on each user's assigned role.
          Changes to permissions apply immediately to all staff with that role.{' '}
          <strong>Admin role cannot be modified.</strong>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        {/* ── Roles Table ───────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-shield-halved" /> System Roles</div>
            <div className="card-actions">
              <button className="header-btn primary" onClick={() => { setEditRoleName(null); setShowRolePanel(true); }}>
                <i className="fa-solid fa-plus" /> Add Role
              </button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Members</th>
                  <th>Access Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ROLES_DATA.map((r, i) => (
                  <tr key={r.name} onClick={() => setSelectedRole({ name: r.name, idx: i })} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="td-flex">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{r.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td><strong>{r.members}</strong></td>
                    <td><span className={`badge ${levelBadgeClass[r.level]}`}>{r.level}</span></td>
                    <td><span className="badge green">Active</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <ThreeDot
                        id={`role-dot-${i}`}
                        items={[
                          { label: 'View Permissions', icon: 'fa-eye',   onClick: () => setSelectedRole({ name: r.name, idx: i }) },
                          ...(r.name !== 'Administrator'
                            ? [
                                { label: 'Edit Role',   icon: 'fa-pen',   onClick: () => { setEditRoleName(r.name); setShowRolePanel(true); } },
                                { label: '---',         icon: '',          onClick: () => {} },
                                { label: 'Delete Role', icon: 'fa-trash', danger: true, onClick: () => {} },
                              ]
                            : []
                          ),
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Role Detail / Permissions ──────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-sliders" />{' '}
              {selectedRole ? selectedRole.name : 'Select a role to view permissions'}
            </div>
          </div>
          <div className="card-body">
            {!selectedRole ? (
              <div className="empty-state">
                <i className="fa-solid fa-hand-pointer" />
                <h4>Click a role to view its permissions</h4>
                <p>Select any role from the left panel to inspect or modify its access rights.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    {ROLES_DATA[selectedRole.idx].desc}
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <span className="tag">
                      {ROLES_DATA[selectedRole.idx].members} member{ROLES_DATA[selectedRole.idx].members !== 1 ? 's' : ''}
                    </span>
                    <span className="tag">Access: {ROLES_DATA[selectedRole.idx].level}</span>
                  </div>
                </div>
                <PermissionsPanel role={selectedRole.name} />
                <hr />
                {selectedRole.name !== 'Administrator'
                  ? <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Permissions</button>
                  : (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      <i className="fa-solid fa-lock" style={{ marginRight: 4 }} />
                      Admin permissions cannot be modified.
                    </div>
                  )
                }
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Permissions Matrix ─────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-table-columns" /> Permissions Matrix</div>
          <div className="card-actions">
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Overview of all roles vs modules</span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                {MATRIX_COLS.map(c => <th key={c} style={{ textAlign: 'center' }}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {MATRIX_MODULES.map(m => (
                <tr key={m.mod}>
                  <td><strong style={{ fontSize: 12 }}>{m.mod}</strong></td>
                  {m.perms.map((p, i) => (
                    <td key={i} style={{ textAlign: 'center' }}>
                      {p
                        ? <i className="fa-solid fa-circle-check" style={{ color: '#22C55E', fontSize: 13 }} />
                        : <i className="fa-solid fa-circle-xmark" style={{ color: '#E5E7EB', fontSize: 13 }} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Role Panel ──────────────────────── */}
      {showRolePanel && (
        <RoleFormPanel
          editRoleName={editRoleName}
          onClose={() => setShowRolePanel(false)}
        />
      )}
    </>
  );
};

export default RolesTab;