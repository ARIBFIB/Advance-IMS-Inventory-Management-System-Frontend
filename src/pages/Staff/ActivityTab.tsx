// ═══════════════════════════════════════════════════════════
// ActivityTab.tsx — Tab 4: Staff Activity Log
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { ACTIVITY_LOG, severityBadgeClass } from './staffData';

const ActivityTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        All critical actions performed by staff are automatically logged here. This includes logins, order updates,
        stock changes, and settings modifications. Logs are retained for <strong>90 days</strong> and can be exported at any time.
      </div>
    </div>

    <div className="card">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <div className="table-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Search by staff, action, module..." />
          </div>
          <select className="form-select" style={{ height: 28, fontSize: 11 }}>
            <option>All Staff</option>
            {['Sara Khan', 'Admin Khan', 'Bilal Raza'].map(n => <option key={n}>{n}</option>)}
          </select>
          <select className="form-select" style={{ height: 28, fontSize: 11 }}>
            <option>All Modules</option>
            {['Orders', 'Inventory', 'Products', 'Customers', 'Finance', 'Settings'].map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="form-select" style={{ height: 28, fontSize: 11 }}>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom range</option>
          </select>
        </div>
        <div className="table-toolbar-right">
          <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export Log</button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Staff Member</th>
              <th>Action</th>
              <th>Module</th>
              <th>Details</th>
              <th>IP Address</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_LOG.map((a, i) => (
              <tr key={i}>
                <td style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.time}</td>
                <td><strong style={{ fontSize: 11.5 }}>{a.staff}</strong></td>
                <td style={{ fontSize: 11.5 }}>{a.action}</td>
                <td>
                  <span className="tag">
                    <i className="fa-solid fa-cube" style={{ fontSize: 8 }} /> {a.module}
                  </span>
                </td>
                <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{a.detail}</td>
                <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                  192.168.1.{(i * 7 + 11) % 254 + 1}
                </td>
                <td>
                  <span className={`badge ${severityBadgeClass[a.severity]}`}>{a.severity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────── */}
      <div className="pagination">
        <div className="pagination-info">
          Showing <strong>1–20</strong> of <strong>348</strong> logs
        </div>
        <div className="pagination-controls">
          {[1, 2, 3, '…', 18].map((p, i) => (
            <button key={i} className={`page-btn ${p === 1 ? 'active' : ''}`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default ActivityTab;