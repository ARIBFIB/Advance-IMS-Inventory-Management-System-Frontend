// ═══════════════════════════════════════════════════════════
// StaffPanel.tsx — Slide-in detail / add / edit panel
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { StaffMember, StaffPanelTab } from './staff.types';
import { statusDotClass, scoreColor, scoreFill, completionPct, PANEL_TASKS, PANEL_ACTIVITY } from './staffData';
import ProgBar from './ProgBar';
import Toggle from './Toggle';
import PermissionsPanel from './PermissionsPanel';

// ── Task status helpers ────────────────────────────────────
const taskStatusIcon: Record<string, string> = {
  Done:         'fa-check',
  'In Progress':'fa-spinner',
  Pending:      'fa-clock',
};
const taskStatusColor: Record<string, string> = {
  Done:         'var(--green)',
  'In Progress':'var(--blue)',
  Pending:      'var(--yellow)',
};
const taskStatusBg: Record<string, string> = {
  Done:         'var(--green-bg)',
  'In Progress':'var(--blue-bg)',
  Pending:      'var(--yellow-bg)',
};

// ── Props ──────────────────────────────────────────────────
interface Props {
  staff: StaffMember | null;
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onEdit: (s: StaffMember) => void;
}

// ── Form (shared by add + edit) ────────────────────────────
const StaffForm: React.FC<{ staff: StaffMember | null; isAdd: boolean; onClose: () => void }> = ({ staff, isAdd, onClose }) => (
  <div className="staff-panel-form">
    <div className="form-row">
      <div className="form-group">
        <div className="form-label">First Name *</div>
        <input className="form-input" defaultValue={staff ? staff.name.split(' ')[0] : ''} placeholder="First name" />
      </div>
      <div className="form-group">
        <div className="form-label">Last Name *</div>
        <input className="form-input" defaultValue={staff ? staff.name.split(' ').slice(1).join(' ') : ''} placeholder="Last name" />
      </div>
    </div>
    <div className="form-group" style={{ marginBottom: 10 }}>
      <div className="form-label">Email Address *</div>
      <input className="form-input" type="email" defaultValue={staff?.email ?? ''} placeholder="email@company.pk" style={{ width: '100%' }} />
    </div>
    <div className="form-group" style={{ marginBottom: 10 }}>
      <div className="form-label">Phone Number</div>
      <input className="form-input" defaultValue={staff?.phone ?? ''} placeholder="03XX-XXXXXXX" style={{ width: '100%' }} />
    </div>
    <div className="form-row">
      <div className="form-group">
        <div className="form-label">Role *</div>
        <select className="form-select" defaultValue={staff?.role}>
          {['Administrator','Ops Manager','Inventory Manager','Sales Operator','Accounts','Courier Handler','Rider'].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <div className="form-label">Department</div>
        <select className="form-select" defaultValue={staff?.dept}>
          {['Management','Operations','Inventory','Sales','Finance','Logistics'].map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
    {isAdd && (
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Password *</div>
          <input className="form-input" type="password" placeholder="Min. 8 characters" />
        </div>
        <div className="form-group">
          <div className="form-label">Confirm Password *</div>
          <input className="form-input" type="password" placeholder="Repeat password" />
        </div>
      </div>
    )}
    <div className="form-row">
      <div className="form-group">
        <div className="form-label">Status</div>
        <select className="form-select" defaultValue={staff?.status ?? 'Active'}>
          <option>Active</option>
          <option>Offline</option>
          <option>Suspended</option>
        </select>
      </div>
      <div className="form-group">
        <div className="form-label">Joined Date</div>
        <input className="form-input" type="date" defaultValue={staff ? '2026-01-01' : ''} style={{ width: '100%' }} />
      </div>
    </div>
    <hr />
    <div style={{ display: 'flex', gap: 8 }}>
      <button className="header-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
        <i className="fa-solid fa-check" /> {isAdd ? 'Add Staff Member' : 'Save Changes'}
      </button>
      <button className="header-btn" onClick={onClose}>Cancel</button>
    </div>
  </div>
);

// ── Profile tab ────────────────────────────────────────────
const ProfileTab: React.FC<{ staff: StaffMember; onEdit: (s: StaffMember) => void }> = ({ staff, onEdit }) => {
  const pct  = completionPct(staff);
  const sc   = scoreColor(staff.score);
  const fill = scoreFill(staff.score);

  return (
    <div id="spt-profile" className="staff-panel-content active">
      {/* Profile Header */}
      <div className="panel-profile-header">
        <div className="panel-avatar" style={{ background: `${staff.color}20`, color: staff.color }}>{staff.avatar}</div>
        <div className="panel-profile-info">
          <div className="panel-profile-name">{staff.name}</div>
          <div className="panel-profile-sub">{staff.role} · {staff.dept}</div>
          <div className="panel-profile-status">
            <span className={`online-dot ${statusDotClass[staff.status]}`} style={{ width: 7, height: 7 }} />
            <span>{staff.status} · Last seen {staff.lastActive}</span>
          </div>
        </div>
        <div className="panel-score-box">
          <div className="panel-score-val" style={{ color: sc }}>{staff.score}%</div>
          <div className="panel-score-lbl">Score</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="panel-stats-row">
        {[
          { val: staff.tasks,          lbl: 'Tasks MTD' },
          { val: staff.orders || '—',  lbl: 'Orders'    },
          { val: staff.errors,         lbl: 'Errors'     },
        ].map(item => (
          <div className="panel-stat" key={item.lbl}>
            <div className="panel-stat-val">{item.val}</div>
            <div className="panel-stat-lbl">{item.lbl}</div>
          </div>
        ))}
      </div>

      {/* Completion Bar */}
      <div className="panel-completion">
        <div className="panel-completion-top">
          <span>Task Completion Rate</span>
          <span style={{ color: sc, fontWeight: 700 }}>{pct}%</span>
        </div>
        <ProgBar pct={pct} fill={fill} width={999} />
      </div>

      <div className="detail-row"><div className="detail-key">Email</div><div className="detail-val">{staff.email}</div></div>
      <div className="detail-row"><div className="detail-key">Phone</div><div className="detail-val">{staff.phone}</div></div>
      <div className="detail-row"><div className="detail-key">Role</div><div className="detail-val"><span className="tag">{staff.role}</span></div></div>
      <div className="detail-row"><div className="detail-key">Department</div><div className="detail-val">{staff.dept}</div></div>
      <div className="detail-row"><div className="detail-key">Joined</div><div className="detail-val">{staff.joined}</div></div>
      <div className="detail-row">
        <div className="detail-key">Staff ID</div>
        <div className="detail-val">
          <code className="staff-id-code">STF-{String(staff.id).padStart(4, '0')}</code>
        </div>
      </div>

      <hr />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="header-btn primary" onClick={() => onEdit(staff)}><i className="fa-solid fa-pen" /> Edit</button>
        <button className="header-btn"><i className="fa-solid fa-key" /> Reset Password</button>
        <button className="header-btn"><i className="fa-solid fa-shield-halved" /> Change Role</button>
        {staff.status !== 'Suspended'
          ? <button className="header-btn" style={{ color:'var(--red)', borderColor:'var(--red)' }}><i className="fa-solid fa-ban" /> Suspend</button>
          : <button className="header-btn" style={{ color:'var(--green)', borderColor:'var(--green)' }}><i className="fa-solid fa-circle-check" /> Reactivate</button>
        }
      </div>
    </div>
  );
};

// ── Tasks tab ──────────────────────────────────────────────
const TasksTab: React.FC = () => (
  <div className="staff-panel-content active">
    <div className="panel-section-label">Recent Tasks</div>
    {PANEL_TASKS.map((t, i) => (
      <div className="list-item" key={i} style={{ padding: '6px 0' }}>
        <div className="list-icon" style={{ background: taskStatusBg[t.status] }}>
          <i className={`fa-solid ${taskStatusIcon[t.status]}`} style={{ fontSize: 10, color: taskStatusColor[t.status] }} />
        </div>
        <div className="list-content">
          <div className="list-title">{t.title}</div>
          <div className="list-meta">
            Due: {t.due} · <span style={{ color: t.priority === 'High' ? 'var(--accent)' : 'var(--text-muted)' }}>{t.priority}</span>
          </div>
        </div>
        <div className="list-right">
          <span className={`badge ${t.status === 'Done' ? 'green' : t.status === 'In Progress' ? 'blue' : 'yellow'}`}>{t.status}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── Activity tab ───────────────────────────────────────────
const ActivityTab: React.FC = () => (
  <div className="staff-panel-content active">
    <div className="panel-section-label">Recent Activity</div>
    {PANEL_ACTIVITY.map((a, i) => (
      <div className="list-item" key={i} style={{ padding: '5px 0' }}>
        <div className="list-icon"><i className="fa-solid fa-circle-dot ic-orange" style={{ fontSize: 9 }} /></div>
        <div className="list-content">
          <div className="list-title" style={{ fontSize: 11.5 }}>{a.action}</div>
          <div className="list-meta">{a.module} · {a.time}</div>
        </div>
      </div>
    ))}
  </div>
);

// ── Main Panel ─────────────────────────────────────────────
const StaffPanel: React.FC<Props> = ({ staff, mode, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<StaffPanelTab>('profile');

  useEffect(() => { setActiveTab('profile'); }, [staff, mode]);

  const isAdd  = mode === 'add';
  const isEdit = mode === 'edit';

  const title = isAdd
    ? 'Add New Staff Member'
    : isEdit
    ? 'Edit Staff Member'
    : staff?.name ?? '';

  return (
    <>
      <div id="staff-backdrop" className="open" onClick={onClose} />
      <div id="staff-detail-panel" className="open">
        <div className="staff-panel-header">
          <div className="staff-panel-title">{title}</div>
          <button className="staff-panel-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>

        <div id="staff-panel-body">
          {/* Add / Edit → show form only */}
          {(isAdd || isEdit) && <StaffForm staff={staff} isAdd={isAdd} onClose={onClose} />}

          {/* View → show tabbed panel */}
          {mode === 'view' && staff && (
            <>
              <div className="staff-panel-tabs">
                {(['profile','permissions','tasks','activity'] as StaffPanelTab[]).map(t => (
                  <div
                    key={t}
                    className={`staff-panel-tab ${activeTab === t ? 'active' : ''}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </div>
                ))}
              </div>

              {activeTab === 'profile'     && <ProfileTab staff={staff} onEdit={onEdit} />}
              {activeTab === 'permissions' && (
                <div className="staff-panel-content active">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                    Permissions are inherited from the <strong>{staff.role}</strong> role. Individual overrides can be applied below.
                  </div>
                  <PermissionsPanel role={staff.role} />
                </div>
              )}
              {activeTab === 'tasks'    && <TasksTab />}
              {activeTab === 'activity' && <ActivityTab />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StaffPanel;