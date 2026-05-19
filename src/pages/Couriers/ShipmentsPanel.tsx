// ShipmentsPanel.tsx
import React, { useState } from 'react';
import { SHIPMENTS, COURIERS, fmt, Badge, CPagination } from './shared';

/* ─── Drawer styles (injected once) ─────────────────────────────────── */
const drawerStyles = `
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    z-index: 400;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .drawer-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 420px;
    max-width: 95vw;
    background: var(--card-bg, #fff);
    box-shadow: -8px 0 40px rgba(0,0,0,0.18);
    z-index: 401;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
  .drawer.open {
    transform: translateX(0);
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    flex-shrink: 0;
  }
  .drawer-header-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-main, #111);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .drawer-close {
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-muted, #888);
    font-size: 14px;
    padding: 4px 6px;
    border-radius: 4px;
    transition: background 0.15s;
  }
  .drawer-close:hover {
    background: var(--hover-bg, #f3f4f6);
    color: var(--text-main, #111);
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .drawer-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--border-color, #e5e7eb);
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    background: var(--card-bg, #fff);
  }

  .drawer .c-form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .drawer .c-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .drawer .c-form-row.single {
    grid-template-columns: 1fr;
  }
  .drawer .c-form-row.triple {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .drawer-section-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted, #888);
    margin-top: 4px;
  }
`;

/* ─── Create Shipment Drawer ─────────────────────────────────────────── */
const CreateShipmentDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <>
    <style>{drawerStyles}</style>

    {/* Backdrop */}
    <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />

    {/* Drawer panel */}
    <div className={`drawer ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-header-title">
          <i className="fa-solid fa-truck-fast" style={{ color: 'var(--primary, #6366f1)' }} />
          Create New Shipment
        </div>
        <button className="drawer-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <div className="drawer-body">
        {/* Order Info */}
        <div className="drawer-section-title">Order Information</div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Order ID</div>
            <input className="c-form-input" placeholder="ORD-XXXX" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Customer Name</div>
            <input className="c-form-input" placeholder="Full name" />
          </div>
        </div>
        <div className="c-form-row single">
          <div className="c-form-group">
            <div className="c-form-label">Delivery Address</div>
            <input className="c-form-input" placeholder="Street, Area" />
          </div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">City</div>
            <input className="c-form-input" placeholder="e.g. Karachi" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Phone</div>
            <input className="c-form-input" placeholder="03XX-XXXXXXX" />
          </div>
        </div>

        {/* Courier & Dispatch */}
        <div className="drawer-section-title">Courier & Dispatch</div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Courier</div>
            <select className="c-form-select">
              {(COURIERS ?? [
                { id: 1, name: 'TCS' },
                { id: 2, name: 'Leopards' },
                { id: 3, name: 'PostEx' },
                { id: 4, name: 'Trax' },
              ]).map((c: any) => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Dispatch Date</div>
            <input className="c-form-input" type="date" />
          </div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Est. Delivery Date</div>
            <input className="c-form-input" type="date" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Weight (kg)</div>
            <input className="c-form-input" type="number" placeholder="0.5" step="0.1" />
          </div>
        </div>

        {/* COD */}
        <div className="drawer-section-title">COD & Payment</div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">COD Amount (₨)</div>
            <input className="c-form-input" type="number" placeholder="0" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">COD Status</div>
            <select className="c-form-select">
              <option>Pending</option>
              <option>Received</option>
              <option>Remitted</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="drawer-section-title">Additional Notes</div>
        <div className="c-form-group">
          <textarea
            className="c-form-input"
            rows={3}
            placeholder="Special handling instructions, fragile items, etc."
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div className="drawer-footer">
        <button className="c-btn primary" style={{ flex: 1 }}>
          <i className="fa-solid fa-check" /> Create Shipment
        </button>
        <button className="c-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </>
);

/* ─── Main Panel ─────────────────────────────────────────────────────── */
const ShipmentsPanel: React.FC = () => {
  const [search, setSearch]         = useState('');
  const [chipFilter, setChipFilter] = useState('all');
  const [page, setPage]             = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const PER_PAGE = 8;

  const chips = ['all', 'Pending', 'In Transit', 'Delivered', 'RTO', 'Failed'];
  const chipIcons: Record<string, string> = {
    Pending: 'fa-clock', 'In Transit': 'fa-truck-moving',
    Delivered: 'fa-circle-check', RTO: 'fa-rotate-left', Failed: 'fa-circle-xmark',
  };

  const filtered = SHIPMENTS.filter(s => {
    if (chipFilter !== 'all' && s.status !== chipFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.track.toLowerCase().includes(q) || s.order.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q);
    }
    return true;
  });

  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      {/* Drawer */}
      <CreateShipmentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="panel-heading">All Shipments</div>
      <div className="panel-desc">
        Complete list of every shipment dispatched through external couriers. Filter by status or
        courier, search by tracking number.
      </div>

      <div className="mini-stats">
        <div className="mini-stat"><div className="ms-label">Total Shipments</div><div className="ms-value">142</div><div className="ms-trend up">+18 this month</div></div>
        <div className="mini-stat"><div className="ms-label">Delivered</div><div className="ms-value">68</div><div className="ms-trend up">47.9% success</div></div>
        <div className="mini-stat"><div className="ms-label">In Transit</div><div className="ms-value">54</div><div className="ms-trend">38% of total</div></div>
        <div className="mini-stat"><div className="ms-label">RTO / Returns</div><div className="ms-value">6</div><div className="ms-trend down">4.2% return rate</div></div>
      </div>

      <div className="chip-group">
        {chips.map(c => (
          <div key={c} className={`chip ${chipFilter === c ? 'active' : ''}`} onClick={() => { setChipFilter(c); setPage(1); }}>
            {chipIcons[c] && <i className={`fa-solid ${chipIcons[c]}`} />}
            {c === 'all' ? 'All Status' : c}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="c-toolbar">
          <div className="c-toolbar-left">
            <div className="c-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search tracking, order, customer..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <div className="c-toolbar-right">
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>142 records</span>
            <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button
              className="c-btn primary"
              onClick={() => setDrawerOpen(true)}
            >
              <i className="fa-solid fa-plus" /> Create Shipment
            </button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Tracking No.</th><th>Order ID</th><th>Customer</th><th>Courier</th>
                <th>City</th><th>Weight</th><th>COD Amount</th><th>Status</th>
                <th>Dispatched</th><th>Est. Delivery</th><th>COD Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(s => (
                <tr key={s.track}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td><code className="sku">{s.track}</code></td>
                  <td><strong>{s.order}</strong></td>
                  <td>{s.customer}</td>
                  <td><span className="tag">{s.courier}</span></td>
                  <td>{s.city}</td>
                  <td>{s.weight} kg</td>
                  <td><strong>{fmt(s.cod)}</strong></td>
                  <td><Badge label={s.status} /></td>
                  <td>{s.dispatched}</td>
                  <td>{s.est}</td>
                  <td><Badge label={s.codStatus} /></td>
                  <td>
                    <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                      <i className="fa-solid fa-location-dot" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CPagination
          current={page} total={Math.ceil(total / PER_PAGE)}
          totalItems={total} start={start} end={end}
          onChange={setPage}
        />
      </div>
    </>
  );
};

export default ShipmentsPanel;