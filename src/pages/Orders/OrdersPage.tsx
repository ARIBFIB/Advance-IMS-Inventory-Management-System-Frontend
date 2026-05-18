import React, { useState, useRef } from 'react';
import NewOrderPanel from './NewOrderPanel';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { usePageLoading } from '../../hooks/usePageLoading';

// ── Types ──────────────────────────────────────────────────
type OrderTab = 'all' | 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'returns' | 'settings';

interface OrderRow {
  id: string;
  customer: string;
  phone: string;
  items: number;
  value: string;
  status: string;
  payment: string;
  channel: string;
  date: string;
}

// ── Static mock rows ───────────────────────────────────────
const ordersData: OrderRow[] = [
  { id: 'ORD-1048', customer: 'Amna Bibi',      phone: '0300-1234567', items: 3, value: '₨4,200', status: 'Pending',   payment: 'COD',     channel: 'WhatsApp', date: '07 May 2026' },
  { id: 'ORD-1047', customer: 'Fatima Zara',     phone: '0321-9876543', items: 1, value: '₨1,800', status: 'Confirmed', payment: 'Prepaid', channel: 'Shopify',  date: '07 May 2026' },
  { id: 'ORD-1046', customer: 'Sara Khan',        phone: '0333-5552211', items: 2, value: '₨3,600', status: 'Packed',    payment: 'COD',     channel: 'WhatsApp', date: '07 May 2026' },
  { id: 'ORD-1045', customer: 'Nadia Malik',      phone: '0311-4443322', items: 4, value: '₨7,100', status: 'Shipped',   payment: 'COD',     channel: 'WhatsApp', date: '06 May 2026' },
  { id: 'ORD-1044', customer: 'Rabia Ahmed',      phone: '0345-6677889', items: 1, value: '₨2,200', status: 'Delivered', payment: 'Prepaid', channel: 'Shopify',  date: '06 May 2026' },
  { id: 'ORD-1043', customer: 'Hira Baig',        phone: '0312-1122334', items: 2, value: '₨3,900', status: 'Delivered', payment: 'COD',     channel: 'WhatsApp', date: '05 May 2026' },
  { id: 'ORD-1042', customer: 'Zainab Qureshi',  phone: '0300-9988776', items: 3, value: '₨5,400', status: 'Pending',   payment: 'COD',     channel: 'WhatsApp', date: '05 May 2026' },
  { id: 'ORD-1041', customer: 'Mehwish Ali',      phone: '0321-5544332', items: 1, value: '₨1,400', status: 'Confirmed', payment: 'COD',     channel: 'WhatsApp', date: '05 May 2026' },
  { id: 'ORD-1040', customer: 'Sadia Hussain',    phone: '0333-7766554', items: 5, value: '₨9,200', status: 'Shipped',   payment: 'Prepaid', channel: 'Shopify',  date: '04 May 2026' },
  { id: 'ORD-1039', customer: 'Bushra Nawaz',     phone: '0311-8899001', items: 2, value: '₨3,100', status: 'Delivered', payment: 'COD',     channel: 'WhatsApp', date: '04 May 2026' },
  { id: 'ORD-1038', customer: 'Asma Iqbal',       phone: '0345-0011223', items: 1, value: '₨2,800', status: 'Cancelled', payment: 'COD',     channel: 'WhatsApp', date: '03 May 2026' },
  { id: 'ORD-1037', customer: 'Maira Usman',      phone: '0312-3344556', items: 3, value: '₨5,700', status: 'Delivered', payment: 'COD',     channel: 'WhatsApp', date: '03 May 2026' },
  { id: 'ORD-1036', customer: 'Iram Sheikh',      phone: '0300-6677889', items: 2, value: '₨4,100', status: 'Pending',   payment: 'Prepaid', channel: 'Shopify',  date: '02 May 2026' },
  { id: 'ORD-1035', customer: 'Lubna Tanvir',     phone: '0321-2233445', items: 1, value: '₨1,600', status: 'Confirmed', payment: 'COD',     channel: 'WhatsApp', date: '02 May 2026' },
  { id: 'ORD-1034', customer: 'Tania Siddiqui',  phone: '0333-9900112', items: 4, value: '₨6,800', status: 'Shipped',   payment: 'COD',     channel: 'WhatsApp', date: '01 May 2026' },
];

// ── Helpers ────────────────────────────────────────────────
function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    Pending: 'yellow', Confirmed: 'blue', Packed: 'blue',
    Shipped: 'orange', Delivered: 'green', Cancelled: 'red', Returned: 'red',
  };
  return map[status] || 'gray';
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ── Status Badge ───────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
);

// ═══════════════════════════════════════════════════════════
// ORDER DETAIL / EDIT PANEL
// ═══════════════════════════════════════════════════════════

type PanelMode = 'view' | 'edit' | 'courier' | 'cancel';

interface OrderPanelProps {
  order: OrderRow | null;
  mode: PanelMode;
  onClose: () => void;
  onModeChange: (m: PanelMode) => void;
  onStatusChange: (id: string, status: string) => void;
}

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const MOCK_COURIERS = ['TCS', 'Leopards', 'M&P', 'Trax', 'PostEx', 'BlueEx'];

// Mock items per order
const getMockItems = (order: OrderRow) => {
  const pool = [
    { name: 'Classic Lawn Suit',   sku: 'SKU-0041', qty: 1, price: 1800 },
    { name: 'Embroidered Kurta',   sku: 'SKU-0017', qty: 1, price: 2800 },
    { name: 'Printed Lawn 3PC',    sku: 'SKU-0055', qty: 2, price: 3200 },
    { name: 'Cotton Kurti',        sku: 'SKU-0135', qty: 1, price: 750  },
    { name: 'Net Dupatta Gold',    sku: 'SKU-0218', qty: 1, price: 1100 },
    { name: 'Linen Trouser',       sku: 'SKU-0078', qty: 2, price: 900  },
  ];
  // deterministic slice based on order id
  const seed = parseInt(order.id.replace('ORD-', '')) % pool.length;
  return pool.slice(seed, seed + order.items).concat(
    order.items > pool.length - seed ? pool.slice(0, order.items - (pool.length - seed)) : []
  ).slice(0, order.items);
};

const OrderPanel: React.FC<OrderPanelProps> = ({ order, mode, onClose, onModeChange, onStatusChange }) => {
  const [editStatus, setEditStatus]   = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes]     = useState('');
  const [courier, setCourier]         = useState('TCS');
  const [tracking, setTracking]       = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  React.useEffect(() => {
    if (order) {
      setEditStatus(order.status);
      setEditPayment(order.payment);
      setEditAddress('House 12, Street 4, DHA Phase 5');
      setEditNotes('');
      setTracking('');
      setExpectedDate('');
      setCancelReason('');
    }
  }, [order, mode]);

  if (!order) return null;

  const isOpen = !!order;
  const items  = getMockItems(order);

  /* ── VIEW mode ── */
  const renderView = () => (
    <>
      {/* Header info */}
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '12px 14px', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{order.id}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{order.date}</div>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Customer */}
      <div className="section-divider" style={{ marginTop: 0 }}><span>Customer</span></div>
      <div className="detail-row"><div className="detail-key">Name</div><div className="detail-val"><strong>{order.customer}</strong></div></div>
      <div className="detail-row"><div className="detail-key">Phone</div><div className="detail-val">{order.phone}</div></div>
      <div className="detail-row"><div className="detail-key">Address</div><div className="detail-val">House 12, Street 4, DHA Phase 5, Lahore</div></div>
      <div className="detail-row"><div className="detail-key">Channel</div><div className="detail-val"><span className="tag">{order.channel}</span></div></div>

      {/* Items */}
      <div className="section-divider"><span>Order Items</span></div>
      {items.map((item, i) => (
        <div key={i} className="list-item" style={{ padding: '6px 0' }}>
          <div className="list-icon" style={{ background: '#FFF5EE' }}>
            <i className="fa-solid fa-bag-shopping ic-orange" style={{ fontSize: 11 }} />
          </div>
          <div className="list-content">
            <div className="list-title">{item.name}</div>
            <div className="list-meta">{item.sku} · Qty: {item.qty}</div>
          </div>
          <div className="list-right">
            <strong>₨{(item.qty * item.price).toLocaleString()}</strong>
          </div>
        </div>
      ))}

      {/* Payment */}
      <div className="section-divider"><span>Payment & Delivery</span></div>
      <div className="detail-row">
        <div className="detail-key">Payment</div>
        <div className="detail-val">
          <span className={`tag`} style={{ color: order.payment === 'Prepaid' ? 'var(--green)' : 'inherit' }}>
            <i className={`fa-solid ${order.payment === 'COD' ? 'fa-money-bill' : 'fa-credit-card'}`} style={{ fontSize: 9 }} /> {order.payment}
          </span>
        </div>
      </div>
      <div className="detail-row"><div className="detail-key">Total Value</div><div className="detail-val"><strong style={{ color: 'var(--accent)', fontSize: 14 }}>{order.value}</strong></div></div>
      <div className="detail-row"><div className="detail-key">Shipping Fee</div><div className="detail-val">₨200</div></div>
      <div className="detail-row"><div className="detail-key">Courier</div><div className="detail-val">TCS</div></div>
      <div className="detail-row"><div className="detail-key">Tracking No.</div><div className="detail-val" style={{ color: 'var(--text-muted)' }}>Not assigned yet</div></div>

      <hr />
      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="header-btn primary" onClick={() => onModeChange('edit')}>
          <i className="fa-solid fa-pen" /> Edit Order
        </button>
        <button className="header-btn" onClick={() => onModeChange('courier')}>
          <i className="fa-solid fa-truck" /> Assign Courier
        </button>
        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <button
            className="header-btn"
            style={{ color: 'var(--green)', borderColor: 'var(--green)' }}
            onClick={() => { onStatusChange(order.id, 'Delivered'); onClose(); }}
          >
            <i className="fa-solid fa-circle-check" /> Mark Delivered
          </button>
        )}
        {order.status !== 'Cancelled' && (
          <button
            className="header-btn"
            style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
            onClick={() => onModeChange('cancel')}
          >
            <i className="fa-solid fa-xmark" /> Cancel Order
          </button>
        )}
      </div>
    </>
  );

  /* ── EDIT mode ── */
  const renderEdit = () => (
    <>
      <div className="section-divider" style={{ marginTop: 0 }}><span>Edit Order — {order.id}</span></div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Customer Name</div>
        <input className="form-input" style={{ width: '100%' }} defaultValue={order.customer} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Phone</div>
          <input className="form-input" defaultValue={order.phone} />
        </div>
        <div className="form-group">
          <div className="form-label">Channel</div>
          <select className="form-select" defaultValue={order.channel}>
            <option>WhatsApp</option><option>Shopify</option><option>Walk-in</option><option>Instagram</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Delivery Address</div>
        <textarea
          className="form-input"
          style={{ height: 60, width: '100%', resize: 'vertical', paddingTop: 6 }}
          value={editAddress}
          onChange={e => setEditAddress(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Order Status</div>
          <select className="form-select" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
            {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Payment Type</div>
          <select className="form-select" value={editPayment} onChange={e => setEditPayment(e.target.value)}>
            <option>COD</option><option>Prepaid</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Order Notes</div>
        <input
          className="form-input"
          style={{ width: '100%' }}
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          placeholder="Any special instructions..."
        />
      </div>

      <hr />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="header-btn primary"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => {
            onStatusChange(order.id, editStatus);
            onClose();
          }}
        >
          <i className="fa-solid fa-check" /> Save Changes
        </button>
        <button className="header-btn" onClick={() => onModeChange('view')}>
          Back
        </button>
      </div>
    </>
  );

  /* ── COURIER mode ── */
  const renderCourier = () => (
    <>
      <div className="section-divider" style={{ marginTop: 0 }}><span>Assign Courier — {order.id}</span></div>

      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{order.customer}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.items} items · {order.value}</div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Courier Service *</div>
          <select className="form-select" value={courier} onChange={e => setCourier(e.target.value)}>
            {MOCK_COURIERS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Expected Delivery</div>
          <input
            className="form-input"
            type="date"
            value={expectedDate}
            onChange={e => setExpectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Tracking Number</div>
        <input
          className="form-input"
          style={{ width: '100%' }}
          value={tracking}
          onChange={e => setTracking(e.target.value)}
          placeholder="e.g. TCS-00123456789"
        />
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Pickup Address</div>
        <input className="form-input" style={{ width: '100%' }} defaultValue="Shop 4, Main Market, Lahore" />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <div className="form-label">Courier Notes</div>
        <input className="form-input" style={{ width: '100%' }} placeholder="Handle with care, fragile items..." />
      </div>

      <hr />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="header-btn primary"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => {
            onStatusChange(order.id, 'Shipped');
            onClose();
          }}
        >
          <i className="fa-solid fa-truck" /> Assign & Mark Shipped
        </button>
        <button className="header-btn" onClick={() => onModeChange('view')}>Back</button>
      </div>
    </>
  );

  /* ── CANCEL mode ── */
  const renderCancel = () => (
    <>
      <div style={{
        background: 'var(--red-bg, #FEF2F2)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--red, #EF4444)', padding: '14px',
        marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--red)', fontSize: 18, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>Cancel Order {order.id}?</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            This action cannot be undone. The order status will be set to Cancelled.
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{order.customer}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.items} items · {order.value} · {order.payment}</div>
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Cancellation Reason *</div>
        <select
          className="form-select"
          style={{ width: '100%' }}
          value={cancelReason}
          onChange={e => setCancelReason(e.target.value)}
        >
          <option value="">— Select reason —</option>
          <option>Customer requested cancellation</option>
          <option>Item out of stock</option>
          <option>Duplicate order</option>
          <option>Payment not received</option>
          <option>Wrong address / unreachable</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <div className="form-label">Additional Notes</div>
        <textarea
          className="form-input"
          style={{ height: 64, width: '100%', resize: 'vertical', paddingTop: 6 }}
          placeholder="Any additional context..."
        />
      </div>

      <hr />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="header-btn"
          style={{
            flex: 1, justifyContent: 'center',
            background: cancelReason ? 'var(--red)' : 'var(--border)',
            color: cancelReason ? '#fff' : 'var(--text-muted)',
            borderColor: cancelReason ? 'var(--red)' : 'var(--border)',
            cursor: cancelReason ? 'pointer' : 'not-allowed',
          }}
          disabled={!cancelReason}
          onClick={() => {
            onStatusChange(order.id, 'Cancelled');
            onClose();
          }}
        >
          <i className="fa-solid fa-xmark" /> Confirm Cancellation
        </button>
        <button className="header-btn" onClick={() => onModeChange('view')}>Back</button>
      </div>
    </>
  );

  const titles: Record<PanelMode, string> = {
    view:    `Order Details`,
    edit:    `Edit Order`,
    courier: `Assign Courier`,
    cancel:  `Cancel Order`,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`prod-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`prod-detail-panel ${isOpen ? 'open' : ''}`}>
        <div className="detail-header">
          <div className="detail-title">
            {mode === 'cancel' && <i className="fa-solid fa-xmark" style={{ color: 'var(--red)', marginRight: 6, fontSize: 12 }} />}
            {mode === 'courier' && <i className="fa-solid fa-truck" style={{ marginRight: 6, fontSize: 12 }} />}
            {mode === 'edit' && <i className="fa-solid fa-pen" style={{ marginRight: 6, fontSize: 12 }} />}
            {mode === 'view' && <i className="fa-solid fa-eye" style={{ marginRight: 6, fontSize: 12 }} />}
            {titles[mode]}
          </div>
          <button className="detail-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="detail-body" style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
          {mode === 'view'    && renderView()}
          {mode === 'edit'    && renderEdit()}
          {mode === 'courier' && renderCourier()}
          {mode === 'cancel'  && renderCancel()}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// THREE DOT MENU
// ═══════════════════════════════════════════════════════════

interface ThreeDotMenuProps {
  orderId: string;
  onAction: (action: string) => void;
}

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ orderId, onAction }) => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.getElementById(`menu-${orderId}`);
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [orderId]);

  return (
    <div id={`menu-${orderId}`} className="three-dot" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="three-dot-btn"
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
      >
        <i className="fa-solid fa-ellipsis" />
      </button>
      {open && (
        <div className="three-dot-menu" style={{ display: 'block' }}>
          <div className="three-dot-menu-item" onClick={() => { onAction('view');    setOpen(false); }}>
            <i className="fa-solid fa-eye" /> View Details
          </div>
          <div className="three-dot-menu-item" onClick={() => { onAction('edit');    setOpen(false); }}>
            <i className="fa-solid fa-pen" /> Edit Order
          </div>
          <div className="three-dot-menu-item" onClick={() => { onAction('courier'); setOpen(false); }}>
            <i className="fa-solid fa-truck" /> Assign Courier
          </div>
          <div className="three-dot-menu-item" onClick={() => { onAction('deliver'); setOpen(false); }}>
            <i className="fa-solid fa-circle-check" /> Mark Delivered
          </div>
          <div className="three-dot-menu-divider" />
          <div className="three-dot-menu-item danger" onClick={() => { onAction('cancel'); setOpen(false); }}>
            <i className="fa-solid fa-xmark" /> Cancel Order
          </div>
        </div>
      )}
    </div>
  );
};

// ── Stat Cards ─────────────────────────────────────────────
const OrderStats: React.FC = () => (
  <div className="stats-row" style={{ marginBottom: '14px' }}>
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-label">Total Orders</div>
        <div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-bag-shopping ic-orange" /></div>
      </div>
      <div className="stat-value">1,284</div>
      <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +5.2% this month</div>
    </div>
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-label">Confirmed Rate</div>
        <div className="stat-icon" style={{ background: 'var(--green-bg)' }}><i className="fa-solid fa-circle-check ic-green" /></div>
      </div>
      <div className="stat-value">87%</div>
      <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +2% vs last month</div>
    </div>
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-label">COD Orders</div>
        <div className="stat-icon" style={{ background: 'var(--blue-bg)' }}><i className="fa-solid fa-money-bills" style={{ color: 'var(--blue)' }} /></div>
      </div>
      <div className="stat-value">912</div>
      <div className="stat-trend neutral"><i className="fa-solid fa-minus" /> 71% of total</div>
    </div>
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-label">Avg. Order Value</div>
        <div className="stat-icon" style={{ background: 'var(--yellow-bg)' }}><i className="fa-solid fa-coins ic-yellow" /></div>
      </div>
      <div className="stat-value">₨1,740</div>
      <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +₨120 this week</div>
    </div>
  </div>
);

// ── Shimmer placeholder while tab loads ────────────────────
const TabShimmer: React.FC = () => (
  <div className="page-shimmer">
    <div className="shimmer-stats">
      <div className="shimmer-stat" />
      <div className="shimmer-stat" />
      <div className="shimmer-stat" />
      <div className="shimmer-stat" />
    </div>
    <div className="shimmer-card">
      {[1,2,3,4,5,6,7].map(i => (
        <div key={i} className={`shimmer-row ${i % 3 === 0 ? 'short' : i % 2 === 0 ? 'medium' : ''}`} />
      ))}
    </div>
  </div>
);

// ── All Orders Tab ─────────────────────────────────────────
const AllOrdersTab: React.FC = () => {
  const [search,       setSearch]       = useState('');
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [orders,       setOrders]       = useState<OrderRow[]>(ordersData);

  // Panel state
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [panelMode,     setPanelMode]     = useState<PanelMode>('view');

  // Loading for panel open
  const { isLoading, loadingProgress, startLoading } = usePageLoading();

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  // Open panel with loading shimmer
  const openPanel = (order: OrderRow, mode: PanelMode) => {
    startLoading(() => {
      setSelectedOrder(order);
      setPanelMode(mode);
    }, 300);
  };

  const handleAction = (action: string, orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    if (action === 'view')    openPanel(order, 'view');
    if (action === 'edit')    openPanel(order, 'edit');
    if (action === 'courier') openPanel(order, 'courier');
    if (action === 'cancel')  openPanel(order, 'cancel');
    if (action === 'deliver') {
      startLoading(() => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Delivered' } : o));
      }, 300);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <>
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      <OrderStats />
      <div className="card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="table-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search order ID, customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="t-filter-btn active"><i className="fa-solid fa-filter" /> All Status</button>
            <button className="t-filter-btn"><i className="fa-solid fa-calendar" /> Date Range</button>
            <button className="t-filter-btn"><i className="fa-solid fa-money-bill" /> Payment</button>
          </div>
          <div className="table-toolbar-right">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filtered.length} records</span>
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button className="header-btn primary" onClick={() => setNewOrderOpen(true)}>
              <i className="fa-solid fa-plus" /> New Order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
                <th className="sortable sorted">Order ID <i className="fa-solid fa-sort-down sort-icon" /></th>
                <th className="sortable">Customer</th>
                <th className="sortable">Items</th>
                <th className="sortable">Value <i className="fa-solid fa-sort sort-icon" /></th>
                <th>Status</th>
                <th>Payment</th>
                <th className="sortable">Channel</th>
                <th className="sortable">Date <i className="fa-solid fa-sort sort-icon" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openPanel(o, 'view')}
                >
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" />
                  </td>
                  <td><strong>{o.id}</strong></td>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar">{getInitials(o.customer)}</div>
                      <div>
                        <div>{o.customer}</div>
                        <div className="td-sub">{o.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>{o.items} items</td>
                  <td><strong>{o.value}</strong></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.payment === 'COD'
                      ? <span className="tag"><i className="fa-solid fa-money-bill" style={{ fontSize: '9px' }} /> COD</span>
                      : <span className="tag" style={{ color: 'var(--green)' }}><i className="fa-solid fa-credit-card" style={{ fontSize: '9px' }} /> Prepaid</span>
                    }
                  </td>
                  <td><span className="tag">{o.channel}</span></td>
                  <td>{o.date}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <ThreeDotMenu
                      orderId={o.id}
                      onAction={(action) => handleAction(action, o.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Showing <strong>1–{Math.min(15, filtered.length)}</strong> of <strong>{filtered.length}</strong> orders
          </div>
          <div className="pagination-controls">
            <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: '9px' }} /></button>
            {[1, 2, 3, 4, 5].map(p => (
              <button key={p} className={`page-btn ${p === 1 ? 'active' : ''}`}>{p}</button>
            ))}
            <button className="page-btn dots">…</button>
            <button className="page-btn">86</button>
            <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: '9px' }} /></button>
          </div>
        </div>
      </div>

      {/* New Order Panel */}
      <NewOrderPanel
        isOpen={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
      />

      {/* Order Detail / Edit Panel */}
      <OrderPanel
        order={selectedOrder}
        mode={panelMode}
        onClose={() => setSelectedOrder(null)}
        onModeChange={setPanelMode}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

// ── Simple placeholder tab ─────────────────────────────────
const PlaceholderTab: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="card">
    <div className="card-body">
      <div className="empty-state">
        <i className={`fa-solid ${icon}`} />
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  </div>
);

// ── Settings Tab ───────────────────────────────────────────
const SettingsTab: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-title"><i className="fa-solid fa-gear" /> Order Module Settings</div>
    </div>
    <div className="card-body">
      <div className="section-divider"><span>Order Statuses</span></div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Default New Order Status</div>
          <select className="form-select"><option>Pending</option><option>Confirmed</option></select>
        </div>
        <div className="form-group">
          <div className="form-label">Auto-confirm after (hours)</div>
          <input className="form-input" type="number" defaultValue={24} />
        </div>
      </div>
      <div className="section-divider"><span>Payment</span></div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Default Payment Type</div>
          <select className="form-select"><option>COD</option><option>Prepaid</option></select>
        </div>
        <div className="form-group">
          <div className="form-label">COD Collection Reminder</div>
          <select className="form-select"><option>On Delivery</option><option>After Delivery</option></select>
        </div>
      </div>
      <div className="section-divider"><span>Notifications</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked /> Send confirmation notification to Sales Op
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked /> Alert manager on order cancellation
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
          <input type="checkbox" /> Enable Shopify sync (Advanced)
        </label>
      </div>
      <hr />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="header-btn primary">Save Settings</button>
        <button className="header-btn">Cancel</button>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
const OrdersPage: React.FC = () => {
  const [activeTab,    setActiveTab]    = useState<OrderTab>('all');
  const [showShimmer,  setShowShimmer]  = useState(false);

  const { isLoading, loadingProgress, startLoading } = usePageLoading();

  const handleTabSwitch = (tabId: OrderTab) => {
    if (tabId === activeTab) return;
    startLoading(() => {
      setActiveTab(tabId);
      setShowShimmer(false);
    });
    setShowShimmer(true);
  };

  const tabs: { id: OrderTab; icon: string; label: string; badge?: number }[] = [
    { id: 'all',       icon: 'fa-list-check',   label: 'All Orders' },
    { id: 'pending',   icon: 'fa-clock',        label: 'Pending',   badge: 12 },
    { id: 'confirmed', icon: 'fa-check',        label: 'Confirmed' },
    { id: 'packed',    icon: 'fa-box',          label: 'Packed' },
    { id: 'shipped',   icon: 'fa-truck',        label: 'Shipped' },
    { id: 'delivered', icon: 'fa-circle-check', label: 'Delivered' },
    { id: 'returns',   icon: 'fa-rotate-left',  label: 'Returns' },
    { id: 'settings',  icon: 'fa-gear',         label: 'Settings' },
  ];

  return (
    <div id="page-orders">
      {/* Top loading bar — fixed at top of viewport */}
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      <div className="section-heading">Order Management</div>
      <div className="section-subheading">Manage, track, and update all customer orders across channels.</div>

      {/* Tabs */}
      <div className="h-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`h-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabSwitch(tab.id)}
          >
            <i className={`fa-solid ${tab.icon}`} /> {tab.label}
            {tab.badge && (
              <span className="badge orange" style={{ marginLeft: '4px' }}>{tab.badge}</span>
            )}
          </div>
        ))}
      </div>

      {/* Tab Panels — shimmer while switching */}
      {showShimmer ? (
        <TabShimmer />
      ) : (
        <>
          {activeTab === 'all'       && <AllOrdersTab />}
          {activeTab === 'pending'   && <PlaceholderTab icon="fa-clock"        title="Pending Orders"   desc="12 orders awaiting confirmation." />}
          {activeTab === 'confirmed' && <PlaceholderTab icon="fa-circle-check" title="Confirmed Orders"  desc="Filter active in All Orders tab with status = Confirmed." />}
          {activeTab === 'packed'    && <PlaceholderTab icon="fa-box"          title="Packed Orders"     desc="Orders marked as packed and ready for dispatch." />}
          {activeTab === 'shipped'   && <PlaceholderTab icon="fa-truck"        title="Shipped Orders"    desc="Tracking updates appear here for dispatched orders." />}
          {activeTab === 'delivered' && <PlaceholderTab icon="fa-circle-check" title="Delivered Orders"  desc="Completed deliveries with COD confirmation status." />}
          {activeTab === 'returns'   && <PlaceholderTab icon="fa-rotate-left"  title="Returns & Refunds" desc="Manage returned orders and refund requests." />}
          {activeTab === 'settings'  && <SettingsTab />}
        </>
      )}
    </div>
  );
};

export default OrdersPage;