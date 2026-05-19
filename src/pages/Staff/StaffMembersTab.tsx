// ═══════════════════════════════════════════════════════════
// StaffMembersTab.tsx — Tab 1: Staff Members table + panel
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { StaffMember, StaffFilter } from './staff.types';
import { STAFF_DATA, STAFF_PER_PAGE, completionPct, scoreFill } from './staffData';
import ThreeDot from './ThreeDot';
import ProgBar from './ProgBar';
import StatusBadge from './StatusBadge';
import StaffPanel from './StaffPanel';

const StaffMembersTab: React.FC = () => {
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState<StaffFilter>('all');
  const [page,       setPage]       = useState(1);
  const [panelStaff, setPanelStaff] = useState<StaffMember | null>(null);
  const [panelMode,  setPanelMode]  = useState<'view' | 'edit' | 'add'>('view');

  // ── Filtering ──────────────────────────────────────────
  const filtered = STAFF_DATA.filter(s => {
    if (filter === 'active'    && s.status !== 'Active')    return false;
    if (filter === 'offline'   && s.status !== 'Offline')   return false;
    if (filter === 'suspended' && s.status !== 'Suspended') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q)  ||
        s.role.toLowerCase().includes(q)  ||
        s.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total      = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / STAFF_PER_PAGE));
  const pageItems  = filtered.slice((page - 1) * STAFF_PER_PAGE, page * STAFF_PER_PAGE);

  // ── Filter buttons config ──────────────────────────────
  const filterBtns: { key: StaffFilter; label: string; icon?: React.ReactNode }[] = [
    { key: 'all',       label: 'All' },
    { key: 'active',    label: 'Active',    icon: <i className="fa-solid fa-circle" style={{ color: '#22C55E', fontSize: 7 }} /> },
    { key: 'offline',   label: 'Offline',   icon: <i className="fa-solid fa-circle" style={{ color: '#9CA3AF', fontSize: 7 }} /> },
    { key: 'suspended', label: 'Suspended', icon: <i className="fa-solid fa-ban" /> },
  ];

  // ── Panel handlers ─────────────────────────────────────
  const openPanel = (s: StaffMember, mode: 'view' | 'edit' = 'view') => {
    setPanelStaff(s);
    setPanelMode(mode);
  };
  const openAdd   = () => { setPanelStaff(null); setPanelMode('add'); };
  const closePanel = () => setPanelStaff(null);
  const showPanel  = panelStaff !== null || panelMode === 'add';

  return (
    <>
      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Total Staff</div>
            <div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-id-badge ic-orange" /></div>
          </div>
          <div className="stat-value">14</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +2 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Active Now</div>
            <div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-circle-check" style={{ color: '#22C55E' }} /></div>
          </div>
          <div className="stat-value">9</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 64.3% online</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Tasks Completed Today</div>
            <div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-list-check" style={{ color: '#3B82F6' }} /></div>
          </div>
          <div className="stat-value">37</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +12 vs yesterday</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Avg. Performance Score</div>
            <div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-star" style={{ color: '#F59E0B' }} /></div>
          </div>
          <div className="stat-value">87%</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +3% this week</div>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────── */}
      <div className="card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="table-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search name, role, email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            {filterBtns.map(f => (
              <button
                key={f.key}
                className={`t-filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => { setFilter(f.key); setPage(1); }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
          <div className="table-toolbar-right">
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button className="header-btn primary" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Staff</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 32 }}>
                  <input
                    type="checkbox"
                    onChange={e =>
                      document.querySelectorAll<HTMLInputElement>('.staff-cb')
                        .forEach(c => { c.checked = e.target.checked; })
                    }
                  />
                </th>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>
                  Performance
                  <span className="tooltip-wrap">
                    <span className="tooltip-icon"><i className="fa-solid fa-question" /></span>
                    <span className="tooltip-box">Average task completion rate this month</span>
                  </span>
                </th>
                <th>Tasks (MTD)</th>
                <th>Last Active</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(s => {
                const pct  = completionPct(s);
                const fill = scoreFill(s.score);
                return (
                  <tr key={s.id} onClick={() => openPanel(s, 'view')} style={{ cursor: 'pointer' }}>
                    <td onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="staff-cb" />
                    </td>
                    <td>
                      <div className="td-flex">
                        <div className="row-avatar" style={{ background: `${s.color}20`, color: s.color, fontSize: 9.5, fontWeight: 700 }}>
                          {s.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div className="td-sub">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="tag">{s.role}</span></td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.dept}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ProgBar pct={pct} fill={fill} />
                        <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <strong>{s.completed}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>/{s.tasks}</span>
                    </td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.lastActive}</span></td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.joined}</span></td>
                    <td><StatusBadge status={s.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <ThreeDot
                        id={`staff-dot-${s.id}`}
                        items={[
                          { label: 'View Profile',   icon: 'fa-eye',           onClick: () => openPanel(s, 'view') },
                          { label: 'Edit',           icon: 'fa-pen',           onClick: () => openPanel(s, 'edit') },
                          { label: 'Reset Password', icon: 'fa-key',           onClick: () => {} },
                          { label: 'Change Role',    icon: 'fa-shield-halved', onClick: () => {} },
                          { label: '---',            icon: '',                 onClick: () => {} },
                          ...(s.status === 'Suspended'
                            ? [{ label: 'Reactivate', icon: 'fa-circle-check', onClick: () => {} }]
                            : [{ label: 'Suspend',    icon: 'fa-ban', danger: true, onClick: () => {} }]
                          ),
                          { label: 'Remove', icon: 'fa-trash', danger: true, onClick: () => {} },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────── */}
        <div className="pagination">
          <div className="pagination-info">
            Showing <strong>{filtered.length}</strong> of <strong>{STAFF_DATA.length}</strong> staff
          </div>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Side Panel ────────────────────────────────────── */}
      {showPanel && (
        <StaffPanel
          staff={panelStaff}
          mode={panelMode}
          onClose={closePanel}
          onEdit={s => { setPanelStaff(s); setPanelMode('edit'); }}
        />
      )}
    </>
  );
};

export default StaffMembersTab;