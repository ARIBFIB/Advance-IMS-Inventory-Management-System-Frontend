// ContactsPanel.tsx
import React, { useState } from 'react';
import { CONTACTS, COURIERS } from './shared';

const ContactsPanel: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="panel-heading">Contacts &amp; Rates</div>
      <div className="panel-desc">
        Directory of all courier contact persons, account managers, and their agreed rate structures.
      </div>

      {/* ── CONTACTS TABLE ── */}
      <div className="card">
        <div className="c-toolbar">
          <div className="c-toolbar-left">
            <div className="c-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input placeholder="Search contact..." />
            </div>
          </div>
          <div className="c-toolbar-right">
            <button className="c-btn primary" onClick={() => setDrawerOpen(true)}>
              <i className="fa-solid fa-plus" /> Add Contact
            </button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Courier</th>
                <th>Contact Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {CONTACTS.map(c => (
                <tr key={c.name}>
                  <td>{c.courier}</td>
                  <td><strong>{c.name}</strong></td>
                  <td><span className="tag">{c.role}</span></td>
                  <td>{c.phone}</td>
                  <td>
                    <span style={{ color: 'var(--blue)', fontSize: 10.5 }}>
                      {c.email}
                    </span>
                  </td>
                  <td>{c.city}</td>
                  <td>{c.last}</td>
                  <td>
                    <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      className="c-btn"
                      style={{ height: 23, fontSize: 9.5, marginLeft: 3, color: 'var(--red)' }}
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

      {/* ── BACKDROP ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.18)',
            zIndex: 500,
          }}
        />
      )}

      {/* ── RIGHT DRAWER ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          zIndex: 501,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
              <i className="fa-solid fa-user-plus" style={{ marginRight: 7, color: 'var(--accent)' }} />
              Add New Contact
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>
              Fill in the details below and save.
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width: 30,
              height: 30,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Courier Company *</div>
            <select className="c-form-select" style={{ width: '100%' }}>
              <option value="">— Select Courier —</option>
              {COURIERS.map(c => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Contact Name *</div>
            <input
              className="c-form-input"
              style={{ width: '100%' }}
              placeholder="e.g. Ahmed Khan"
            />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Role / Designation</div>
            <select className="c-form-select" style={{ width: '100%' }}>
              <option>Account Manager</option>
              <option>Sales Rep</option>
              <option>Ops Manager</option>
              <option>Key Account</option>
              <option>Support</option>
            </select>
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">City</div>
            <input
              className="c-form-input"
              style={{ width: '100%' }}
              placeholder="e.g. Lahore"
            />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Phone *</div>
            <input
              className="c-form-input"
              style={{ width: '100%' }}
              placeholder="03XX-XXXXXXX"
            />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Email</div>
            <input
              className="c-form-input"
              style={{ width: '100%' }}
              type="email"
              placeholder="contact@courier.com"
            />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Last Contact Date</div>
            <input
              className="c-form-input"
              style={{ width: '100%' }}
              type="date"
            />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Notes</div>
            <textarea
              className="c-form-textarea"
              style={{ width: '100%', height: 80 }}
              placeholder="Any additional notes about this contact..."
            />
          </div>

        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            flexShrink: 0,
            background: 'var(--card)',
          }}
        >
          <button
            className="c-btn primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <i className="fa-solid fa-check" /> Save Contact
          </button>
          <button
            className="c-btn"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setDrawerOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactsPanel;