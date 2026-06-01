// ContactsPanel.tsx — dynamic courier dropdown + static contacts table
import React, { useState, useEffect } from 'react';
import { CONTACTS, ApiCourier, EmptyState } from './shared';
import { couriersAPI } from '../../services/api';

const ContactsPanel: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [couriers,   setCouriers]   = useState<ApiCourier[]>([]);
  const [search,     setSearch]     = useState('');
  const [editTarget, setEditTarget] = useState<typeof CONTACTS[0] | null>(null);

  // Form state for the drawer
  const [form, setForm] = useState({
    courier: '', name: '', role: 'Account Manager',
    city: '', phone: '', email: '', lastContact: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    couriersAPI.getAll({ limit: 50 })
      .then(r => setCouriers(r.data?.data?.couriers ?? []))
      .catch(() => {});
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ courier: '', name: '', role: 'Account Manager', city: '', phone: '', email: '', lastContact: '', notes: '' });
    setDrawerOpen(true);
  };

  const openEdit = (c: typeof CONTACTS[0]) => {
    setEditTarget(c);
    setForm({ courier: c.courier, name: c.name, role: c.role, city: c.city, phone: c.phone, email: c.email, lastContact: c.last, notes: '' });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    // No backend endpoint — simulate save with a brief delay
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setDrawerOpen(false);
  };

  const filtered = CONTACTS.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.courier.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  // Build courier name list: API results first, fall back to static list from contacts
  const courierNames = couriers.length > 0
    ? couriers.map(c => c.name)
    : [...new Set(CONTACTS.map(c => c.courier))];

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
              <input
                placeholder="Search name, courier, role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="c-toolbar-right">
            <button className="c-btn primary" onClick={openAdd}>
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
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <EmptyState icon="fa-address-book" title="No contacts found" desc="No contacts match your search." />
                </td></tr>
              ) : filtered.map(c => (
                <tr key={c.name}>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8, width: 26, height: 26 }}>
                        {c.courier.slice(0, 3).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{c.courier}</span>
                    </div>
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td><span className="tag">{c.role}</span></td>
                  <td style={{ fontSize: 11 }}>{c.phone}</td>
                  <td>
                    <a href={`mailto:${c.email}`} style={{ color: 'var(--blue)', fontSize: 10.5, textDecoration: 'none' }}>
                      {c.email}
                    </a>
                  </td>
                  <td>{c.city}</td>
                  <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{c.last}</td>
                  <td>
                    <button className="c-btn" style={{ height: 23, fontSize: 9.5 }} onClick={() => openEdit(c)}>
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 500 }}
        />
      )}

      {/* ── RIGHT DRAWER ── */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
          background: 'var(--card)', borderLeft: '1px solid var(--border)',
          zIndex: 501, display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
              <i className={`fa-solid ${editTarget ? 'fa-pen' : 'fa-user-plus'}`} style={{ marginRight: 7, color: 'var(--accent)' }} />
              {editTarget ? 'Edit Contact' : 'Add New Contact'}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>
              {editTarget ? `Editing ${editTarget.name}` : 'Fill in the details below and save.'}
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ width: 30, height: 30, border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Courier Company *</div>
            <select
              className="c-form-select" style={{ width: '100%' }}
              value={form.courier}
              onChange={e => setForm(f => ({ ...f, courier: e.target.value }))}
            >
              <option value="">— Select Courier —</option>
              {courierNames.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Contact Name *</div>
            <input className="c-form-input" style={{ width: '100%' }} placeholder="e.g. Ahmed Khan"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Role / Designation</div>
            <select className="c-form-select" style={{ width: '100%' }}
              value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option>Account Manager</option>
              <option>Sales Rep</option>
              <option>Ops Manager</option>
              <option>Key Account</option>
              <option>Support</option>
            </select>
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">City</div>
            <input className="c-form-input" style={{ width: '100%' }} placeholder="e.g. Lahore"
              value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Phone *</div>
            <input className="c-form-input" style={{ width: '100%' }} placeholder="03XX-XXXXXXX"
              value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Email</div>
            <input className="c-form-input" style={{ width: '100%' }} type="email" placeholder="contact@courier.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Last Contact Date</div>
            <input className="c-form-input" style={{ width: '100%' }} type="date"
              value={form.lastContact} onChange={e => setForm(f => ({ ...f, lastContact: e.target.value }))} />
          </div>

          <div className="c-form-group" style={{ marginBottom: 12 }}>
            <div className="c-form-label">Notes</div>
            <textarea
              className="c-form-textarea" style={{ width: '100%', height: 80 }}
              placeholder="Any additional notes about this contact..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0, background: 'var(--card)' }}>
          <button
            className="c-btn primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.phone.trim()}
          >
            <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-check'}`} />
            {saving ? 'Saving…' : editTarget ? 'Update Contact' : 'Save Contact'}
          </button>
          <button className="c-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDrawerOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactsPanel;