// PendingPanel.tsx
import React, { useState } from 'react';
import { PENDING_ORDERS, COURIERS } from './shared';

/* ─── Drawer Styles ──────────────────────────────────────────────────── */
const drawerStyles = `
  .bulk-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    z-index: 400;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .bulk-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .bulk-drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 400px;
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
  .bulk-drawer.open {
    transform: translateX(0);
  }

  .bulk-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    flex-shrink: 0;
  }
  .bulk-drawer-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-main, #111);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bulk-drawer-close {
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-muted, #888);
    font-size: 14px;
    padding: 4px 6px;
    border-radius: 4px;
    transition: background 0.15s;
  }
  .bulk-drawer-close:hover {
    background: var(--hover-bg, #f3f4f6);
    color: var(--text-main, #111);
  }

  .bulk-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bulk-drawer-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--border-color, #e5e7eb);
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    background: var(--card-bg, #fff);
  }

  .bulk-section-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted, #888);
  }

  .bulk-order-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 220px;
    overflow-y: auto;
  }
  .bulk-order-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 10px;
    border-radius: 6px;
    background: var(--hover-bg, #f9fafb);
    border: 1px solid var(--border-color, #e5e7eb);
    font-size: 11px;
  }
  .bulk-order-item .order-id {
    font-weight: 700;
    color: var(--text-main, #111);
  }
  .bulk-order-item .order-meta {
    color: var(--text-muted, #888);
    font-size: 10px;
  }
  .bulk-order-item .overdue-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--red, #ef4444);
    flex-shrink: 0;
  }
  .bulk-order-item .ok-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--green, #22c55e);
    flex-shrink: 0;
  }

  .bulk-courier-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .bulk-courier-card {
    border: 2px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 10px 12px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .bulk-courier-card:hover {
    border-color: var(--primary, #6366f1);
    background: var(--hover-bg, #f5f5ff);
  }
  .bulk-courier-card.selected {
    border-color: var(--primary, #6366f1);
    background: var(--hover-bg, #f5f5ff);
  }
  .bulk-courier-card .courier-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-main, #111);
  }
  .bulk-courier-card .courier-eta {
    font-size: 10px;
    color: var(--text-muted, #888);
  }

  .bulk-note-area {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 6px;
    font-size: 11.5px;
    font-family: inherit;
    background: var(--card-bg, #fff);
    color: var(--text-main, #111);
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
  }
  .bulk-note-area:focus {
    border-color: var(--primary, #6366f1);
  }

  .bulk-summary-box {
    background: var(--hover-bg, #f9fafb);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .bulk-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-secondary, #555);
  }
  .bulk-summary-row strong {
    color: var(--text-main, #111);
    font-weight: 600;
  }
`;

/* ─── Bulk Assign Drawer ─────────────────────────────────────────────── */
const BulkAssignDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);

  const activeCouriers = (COURIERS ?? [
    { id: 1, name: 'TCS',      status: 'Active', city: 'Nationwide' },
    { id: 2, name: 'Leopards', status: 'Active', city: 'Nationwide' },
    { id: 3, name: 'PostEx',   status: 'Active', city: 'Nationwide' },
    { id: 4, name: 'Trax',     status: 'Active', city: 'Nationwide' },
  ]).filter((c: any) => c.status === 'Active');

  const orders = PENDING_ORDERS ?? [];
  const overdue = orders.filter((p: any) => parseInt(p.waiting) > 24);

  return (
    <>
      <style>{drawerStyles}</style>

      <div className={`bulk-overlay ${open ? 'open' : ''}`} onClick={onClose} />

      <div className={`bulk-drawer ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="bulk-drawer-header">
          <div className="bulk-drawer-title">
            <i className="fa-solid fa-truck" style={{ color: 'var(--primary, #6366f1)' }} />
            Bulk Assign Courier
          </div>
          <button className="bulk-drawer-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="bulk-drawer-body">

          {/* Overdue alert */}
          {overdue.length > 0 && (
            <div className="alert-strip warn" style={{ margin: 0 }}>
              <i className="fa-solid fa-triangle-exclamation" />
              <strong>{overdue.length} overdue</strong> orders selected — assign immediately.
            </div>
          )}

          {/* Orders to dispatch */}
          <div>
            <div className="bulk-section-title" style={{ marginBottom: 8 }}>
              Orders to Dispatch ({orders.length})
            </div>
            <div className="bulk-order-list">
              {orders.map((p: any) => (
                <div className="bulk-order-item" key={p.order}>
                  <div>
                    <div className="order-id">{p.order}</div>
                    <div className="order-meta">{p.customer} · {p.city}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.waiting}</span>
                    <div className={parseInt(p.waiting) > 24 ? 'overdue-dot' : 'ok-dot'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Select courier */}
          <div>
            <div className="bulk-section-title" style={{ marginBottom: 8 }}>
              Select Courier
            </div>
            <div className="bulk-courier-grid">
              {activeCouriers.map((c: any) => (
                <div
                  key={c.id}
                  className={`bulk-courier-card ${selectedCourier === c.name ? 'selected' : ''}`}
                  onClick={() => setSelectedCourier(c.name)}
                >
                  <div className="courier-name">
                    {selectedCourier === c.name && (
                      <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary, #6366f1)', marginRight: 5 }} />
                    )}
                    {c.name}
                  </div>
                  <div className="courier-eta">SLA: 3 days</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch date */}
          <div>
            <div className="bulk-section-title" style={{ marginBottom: 8 }}>Dispatch Date</div>
            <input className="c-form-input" type="date" style={{ width: '100%' }} />
          </div>

          {/* Notes */}
          <div>
            <div className="bulk-section-title" style={{ marginBottom: 8 }}>Notes (optional)</div>
            <textarea
              className="bulk-note-area"
              rows={3}
              placeholder="Special handling instructions for all selected orders..."
            />
          </div>

          {/* Summary */}
          <div className="bulk-summary-box">
            <div className="bulk-section-title" style={{ marginBottom: 4 }}>Summary</div>
            <div className="bulk-summary-row">
              <span>Total orders</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="bulk-summary-row">
              <span>Overdue orders</span>
              <strong style={{ color: 'var(--red, #ef4444)' }}>{overdue.length}</strong>
            </div>
            <div className="bulk-summary-row">
              <span>Assigned courier</span>
              <strong>{selectedCourier ?? '—'}</strong>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bulk-drawer-footer">
          <button
            className="c-btn primary"
            style={{ flex: 1 }}
            disabled={!selectedCourier}
          >
            <i className="fa-solid fa-truck" /> Dispatch All
          </button>
          <button className="c-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
};

/* ─── Main Panel ─────────────────────────────────────────────────────── */
const PendingPanel: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <BulkAssignDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="panel-heading">Pending Dispatch</div>
      <div className="panel-desc">
        Orders confirmed but not yet dispatched. Assign a courier and dispatch — overdue orders
        (&gt;24h) are highlighted in red.
      </div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <strong>4 orders</strong> pending dispatch for more than 24 hours. Assign a courier immediately.
      </div>

      <div className="card">
        <div className="c-toolbar">
          <div className="c-toolbar-left">
            <div className="c-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input placeholder="Search order or customer..." />
            </div>
            <button className="c-btn active">All Pending</button>
            <button className="c-btn" style={{ color: 'var(--red)' }}>Overdue (&gt;24h)</button>
          </div>
          <div className="c-toolbar-right">
            <button className="c-btn primary" onClick={() => setDrawerOpen(true)}>
              <i className="fa-solid fa-truck" /> Bulk Assign
            </button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Order ID</th><th>Customer</th><th>City</th><th>Items</th>
                <th>Weight</th><th>COD Amount</th><th>Order Date</th>
                <th>Waiting</th><th>Assign Courier</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_ORDERS.map(p => (
                <tr key={p.order}>
                  <td><input type="checkbox" /></td>
                  <td><strong>{p.order}</strong></td>
                  <td>{p.customer}</td>
                  <td>{p.city}</td>
                  <td>{p.items}</td>
                  <td>{p.weight}</td>
                  <td><strong>{p.cod}</strong></td>
                  <td>{p.date}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: parseInt(p.waiting) > 24 ? 'var(--red)' : 'var(--text-secondary)',
                    }}>
                      {p.waiting}
                    </span>
                  </td>
                  <td>
                    <select className="c-form-select" style={{ height: 24, fontSize: 10, minWidth: 110 }}>
                      <option>— Assign —</option>
                      {COURIERS.filter(c => c.status === 'Active').map(c => (
                        <option key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="c-btn primary" style={{ height: 24, fontSize: 9.5 }}>
                      <i className="fa-solid fa-truck" /> Dispatch
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

export default PendingPanel;