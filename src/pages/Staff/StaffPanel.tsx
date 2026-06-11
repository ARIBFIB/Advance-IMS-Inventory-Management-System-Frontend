// ═══════════════════════════════════════════════════════════
// StaffPanel.tsx — Slide-in panel: view / edit / add — API-connected
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { StaffMember, StaffPanelTab, ApiRole, ApiStatus, CreateUserPayload, UpdateUserPayload } from './staff.types';
import { statusDotClass, scoreColor, scoreFill, completionPct, PANEL_TASKS, PANEL_ACTIVITY, MODULE_PERMS } from './staffData';
import { usersAPI, authAPI } from '../../services/api';
import ProgBar from './ProgBar';
import Toggle from './Toggle';
import PermissionsPanel from './PermissionsPanel';

// ── Helpers ────────────────────────────────────────────────
const API_ROLES: { value: ApiRole; label: string }[] = [
  { value: 'Administrator',    label: 'Administrator'    },
  { value: 'OperationsManager',label: 'Ops Manager'      },
  { value: 'InventoryManager', label: 'Inventory Manager'},
  { value: 'SalesOperator',    label: 'Sales Operator'   },
  { value: 'Accounts',         label: 'Accounts'         },
  { value: 'CourierHandler',   label: 'Courier Handler'  },
  { value: 'Rider',            label: 'Rider'            },
];

const DEPTS = ['Management','Operations','Inventory','Sales','Finance','Logistics'];

const taskStatusIcon:  Record<string, string> = { Done:'fa-check', 'In Progress':'fa-spinner', Pending:'fa-clock' };
const taskStatusColor: Record<string, string> = { Done:'var(--green)', 'In Progress':'var(--blue)', Pending:'var(--yellow)' };
const taskStatusBg:    Record<string, string> = { Done:'var(--green-bg)', 'In Progress':'var(--blue-bg)', Pending:'var(--yellow-bg)' };

// ── Error banner ──────────────────────────────────────────
const ErrMsg: React.FC<{ msg: string }> = ({ msg }) => (
  <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, padding:'8px 12px', marginBottom:12, fontSize:12, color:'#dc2626', display:'flex', gap:8 }}>
    <i className="fa-solid fa-circle-exclamation" /> {msg}
  </div>
);

// ── Props ──────────────────────────────────────────────────
interface Props {
  staff: StaffMember | null;
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onEdit:  (s: StaffMember) => void;
  onSaved: () => void;
}

// ── Add / Edit Form ────────────────────────────────────────
const StaffForm: React.FC<{
  staff: StaffMember | null;
  isAdd: boolean;
  onClose: () => void;
  onSaved: () => void;
}> = ({ staff, isAdd, onClose, onSaved }) => {
  const [form, setForm] = useState({
    firstName:  staff?.name.split(' ')[0]       ?? '',
    lastName:   staff?.name.split(' ').slice(1).join(' ') ?? '',
    email:      staff?.email   ?? '',
    phone:      staff?.phone   ?? '',
    apiRole:    (staff?.apiRole ?? 'SalesOperator') as ApiRole,
    status:     (staff?.status ?? 'Active') as ApiStatus,
    password:   '',
    confirmPwd: '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setError('');
    if (!form.firstName || !form.lastName) return setError('First and last name are required.');
    if (!form.email)                        return setError('Email is required.');
    if (isAdd && !form.password)            return setError('Password is required.');
    if (isAdd && form.password !== form.confirmPwd) return setError('Passwords do not match.');

    setSaving(true);
    try {
      if (isAdd) {
        const username = form.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        const payload: CreateUserPayload = {
          username,
          email:     form.email,
          password:  form.password,
          firstName: form.firstName,
          lastName:  form.lastName,
          phone:     form.phone,
          role:      form.apiRole,
        };
        await authAPI.register(payload);
      } else if (staff) {
        const payload: UpdateUserPayload = {
          firstName: form.firstName,
          lastName:  form.lastName,
          phone:     form.phone,
          role:      form.apiRole,
          status:    form.status,
        };
        await usersAPI.update(staff.id, payload);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      const apiErrors = e?.response?.data?.errors;
      setError(apiErrors?.map((x: any) => x.message).join(', ') ?? e?.response?.data?.message ?? 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-panel-form">
      {error && <ErrMsg msg={error} />}

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">First Name *</div>
          <input name="firstName" className="form-input" value={form.firstName} onChange={handleChange} placeholder="First name" />
        </div>
        <div className="form-group">
          <div className="form-label">Last Name *</div>
          <input name="lastName" className="form-input" value={form.lastName} onChange={handleChange} placeholder="Last name" />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Email Address *</div>
        <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange}
          placeholder="email@company.pk" style={{ width: '100%' }} disabled={!isAdd} />
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Phone Number</div>
        <input name="phone" className="form-input" value={form.phone} onChange={handleChange}
          placeholder="03XX-XXXXXXX" style={{ width: '100%' }} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Role *</div>
          <select name="apiRole" className="form-select" value={form.apiRole} onChange={handleChange}>
            {API_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        {!isAdd && (
          <div className="form-group">
            <div className="form-label">Status</div>
            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        )}
      </div>

      {isAdd && (
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">Password *</div>
            <input name="password" type="password" className="form-input" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
          </div>
          <div className="form-group">
            <div className="form-label">Confirm Password *</div>
            <input name="confirmPwd" type="password" className="form-input" value={form.confirmPwd} onChange={handleChange} placeholder="Repeat password" />
          </div>
        </div>
      )}

      <hr />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="header-btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
          {saving
            ? <><i className="fa-solid fa-spinner fa-spin" /> Saving…</>
            : <><i className="fa-solid fa-check" /> {isAdd ? 'Add Staff Member' : 'Save Changes'}</>
          }
        </button>
        <button className="header-btn" onClick={onClose} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
};

// ── Profile tab ────────────────────────────────────────────
const ProfileTab: React.FC<{ staff: StaffMember; onEdit: (s: StaffMember) => void; onStatusChange: () => void }> = ({ staff, onEdit, onStatusChange }) => {
  const pct  = completionPct(staff);
  const sc   = scoreColor(staff.score);
  const fill = scoreFill(staff.score);

  const handleStatusToggle = async (newStatus: ApiStatus) => {
    try {
      await usersAPI.updateStatus(staff.id, newStatus);
      onStatusChange();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Status update failed.');
    }
  };

  return (
    <div className="staff-panel-content active">
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
        {staff.score > 0 && (
          <div className="panel-score-box">
            <div className="panel-score-val" style={{ color: sc }}>{staff.score}%</div>
            <div className="panel-score-lbl">Score</div>
          </div>
        )}
      </div>

      {staff.tasks > 0 && (
        <>
          <div className="panel-stats-row">
            {[
              { val: staff.tasks,          lbl: 'Tasks MTD' },
              { val: staff.orders || '—',  lbl: 'Orders'    },
              { val: staff.errors,         lbl: 'Cancelled'  },
            ].map(item => (
              <div className="panel-stat" key={item.lbl}>
                <div className="panel-stat-val">{item.val}</div>
                <div className="panel-stat-lbl">{item.lbl}</div>
              </div>
            ))}
          </div>

          <div className="panel-completion">
            <div className="panel-completion-top">
              <span>Task Completion Rate</span>
              <span style={{ color: sc, fontWeight: 700 }}>{pct}%</span>
            </div>
            <ProgBar pct={pct} fill={fill} width={999} />
          </div>
        </>
      )}

      <div className="detail-row"><div className="detail-key">Email</div><div className="detail-val">{staff.email}</div></div>
      <div className="detail-row"><div className="detail-key">Phone</div><div className="detail-val">{staff.phone}</div></div>
      <div className="detail-row"><div className="detail-key">Role</div><div className="detail-val"><span className="tag">{staff.role}</span></div></div>
      <div className="detail-row"><div className="detail-key">Department</div><div className="detail-val">{staff.dept}</div></div>
      <div className="detail-row"><div className="detail-key">Joined</div><div className="detail-val">{staff.joined}</div></div>
      <div className="detail-row">
        <div className="detail-key">Staff ID</div>
        <div className="detail-val"><code className="staff-id-code">{staff.id.slice(-8).toUpperCase()}</code></div>
      </div>

      <hr />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="header-btn primary" onClick={() => onEdit(staff)}><i className="fa-solid fa-pen" /> Edit</button>
        {staff.status !== 'Suspended'
          ? <button className="header-btn" style={{ color:'var(--red)', borderColor:'var(--red)' }} onClick={() => handleStatusToggle('Suspended')}>
              <i className="fa-solid fa-ban" /> Suspend
            </button>
          : <button className="header-btn" style={{ color:'var(--green)', borderColor:'var(--green)' }} onClick={() => handleStatusToggle('Active')}>
              <i className="fa-solid fa-circle-check" /> Reactivate
            </button>
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
const StaffPanel: React.FC<Props> = ({ staff, mode, onClose, onEdit, onSaved }) => {
  const [activeTab, setActiveTab] = useState<StaffPanelTab>('profile');

  useEffect(() => { setActiveTab('profile'); }, [staff, mode]);

  const isAdd  = mode === 'add';
  const isEdit = mode === 'edit';

  const title = isAdd ? 'Add New Staff Member'
    : isEdit           ? 'Edit Staff Member'
    : staff?.name      ?? '';

  return (
    <>
      <div id="staff-backdrop" className="open" onClick={onClose} />
      <div id="staff-detail-panel" className="open">
        <div className="staff-panel-header">
          <div className="staff-panel-title">{title}</div>
          <button className="staff-panel-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>

        <div id="staff-panel-body">
          {(isAdd || isEdit) && (
            <StaffForm staff={staff} isAdd={isAdd} onClose={onClose} onSaved={onSaved} />
          )}

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

              {activeTab === 'profile' && (
                <ProfileTab staff={staff} onEdit={onEdit} onStatusChange={() => { onSaved(); onClose(); }} />
              )}
              {activeTab === 'permissions' && (
                <div className="staff-panel-content active">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                    Permissions are inherited from the <strong>{staff.role}</strong> role.
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