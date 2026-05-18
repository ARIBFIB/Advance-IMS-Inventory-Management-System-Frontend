import React, { useState, useEffect } from 'react';
import './InventoryPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type InventoryTab = 'stock' | 'movements' | 'alerts' | 'adjustments' | 'settings';
type HealthStatus = 'Critical' | 'Low' | 'Good';
type MovementType = 'In' | 'Out' | 'Adjust';
type AdjustmentType = 'Add Stock' | 'Remove Stock' | 'Set Exact Value';
type ReasonCode = 'Supplier Restock' | 'Damage Write-off' | 'Return Received' | 'Manual Correction';

interface InventoryItem {
  sku: string;
  name: string;
  stock: number;
  reserved: number;
  threshold: number;
  lastUpdated: string;
}

interface StockMovement {
  date: string;
  sku: string;
  product: string;
  type: MovementType;
  qty: number;
  stockAfter: number;
  reason: string;
  by: string;
}

interface StockAlert {
  sku: string;
  name: string;
  stock: number;
  threshold: number;
  severity: 'Critical' | 'Low';
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const INVENTORY_ITEMS: InventoryItem[] = [
  { sku: 'SKU-0041', name: 'Classic Lawn Suit',     stock: 3,  reserved: 1,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0028', name: 'Chiffon Dupatta White', stock: 7,  reserved: 1,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0017', name: 'Embroidered Kurta',     stock: 42, reserved: 6,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0055', name: 'Printed Lawn 3PC',      stock: 28, reserved: 4,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0063', name: 'Silk Kameez Navy',      stock: 15, reserved: 2,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0092', name: 'Embroidered Shawl',     stock: 8,  reserved: 1,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0078', name: 'Linen Trouser',         stock: 35, reserved: 5,  threshold: 15, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0101', name: 'Khaddar Suit',          stock: 20, reserved: 3,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0112', name: 'Block Print Dupatta',   stock: 50, reserved: 7,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0124', name: 'Organza Fancy Suit',    stock: 12, reserved: 2,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0135', name: 'Cotton Kurti',          stock: 66, reserved: 10, threshold: 20, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0148', name: 'Party Wear Shirt',      stock: 18, reserved: 3,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0159', name: 'Denim Jeans Ladies',    stock: 23, reserved: 4,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0167', name: 'Shalwar Kameez Set',    stock: 9,  reserved: 1,  threshold: 10, lastUpdated: '07 May 2026' },
  { sku: 'SKU-0172', name: 'Winter Shawl Brown',    stock: 31, reserved: 5,  threshold: 10, lastUpdated: '07 May 2026' },
];

const MOVEMENTS: StockMovement[] = [
  { date: '07 May 2026, 10:22', sku: 'SKU-0041', product: 'Classic Lawn Suit',     type: 'Out',    qty: -2, stockAfter: 3,  reason: 'Order ORD-1046',    by: 'System'     },
  { date: '07 May 2026, 09:15', sku: 'SKU-0135', product: 'Cotton Kurti',          type: 'In',     qty: 20, stockAfter: 66, reason: 'Supplier Restock',  by: 'Sara Khan'  },
  { date: '06 May 2026, 16:40', sku: 'SKU-0028', product: 'Chiffon Dupatta White', type: 'Out',    qty: -3, stockAfter: 7,  reason: 'Order ORD-1045',    by: 'System'     },
  { date: '06 May 2026, 14:00', sku: 'SKU-0055', product: 'Printed Lawn 3PC',      type: 'Adjust', qty: -1, stockAfter: 28, reason: 'Damage Write-off', by: 'Admin Khan' },
];

const ALERTS: StockAlert[] = [
  { sku: 'SKU-0041', name: 'Classic Lawn Suit',     stock: 3, threshold: 10, severity: 'Critical' },
  { sku: 'SKU-0028', name: 'Chiffon Dupatta White', stock: 7, threshold: 10, severity: 'Low'      },
  { sku: 'SKU-0092', name: 'Embroidered Shawl',     stock: 8, threshold: 10, severity: 'Low'      },
];

const ITEMS_PER_PAGE = 15;

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getHealthStatus(item: InventoryItem): HealthStatus {
  if (item.stock < item.threshold / 2) return 'Critical';
  if (item.stock < item.threshold)     return 'Low';
  return 'Good';
}

function statusBadgeClass(s: string): string {
  const m: Record<string, string> = {
    'Good':     'green',
    'Low':      'yellow',
    'Critical': 'red',
    'In':       'green',
    'Out':      'red',
    'Adjust':   'yellow',
    'Active':   'green',
    'Inactive': 'gray',
  };
  return m[s] || 'gray';
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

/* ── Badge ── */
const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${statusBadgeClass(label)}`}>{label}</span>
);

/* ── Three-Dot Menu ── */
interface ThreeDotItem {
  label: string;
  icon: string;
  danger?: boolean;
  onClick: () => void;
}
interface ThreeDotProps { id: string; items: ThreeDotItem[]; }

const ThreeDot: React.FC<ThreeDotProps> = ({ id, items }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.getElementById(id);
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [id]);
  return (
    <div id={id} className="three-dot" style={{ position: 'relative', display: 'inline-block' }}>
      <button className="three-dot-btn" onClick={e => { e.stopPropagation(); setOpen(v => !v); }}>
        <i className="fa-solid fa-ellipsis" />
      </button>
      {open && (
        <div className="three-dot-menu" style={{ display: 'block' }}>
          {items.map((item, idx) =>
            item.label === '---'
              ? <div key={idx} className="three-dot-menu-divider" />
              : (
                <div
                  key={item.label}
                  className={`three-dot-menu-item ${item.danger ? 'danger' : ''}`}
                  onClick={() => { item.onClick(); setOpen(false); }}
                >
                  <i className={`fa-solid ${item.icon}`} /> {item.label}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

/* ── Pagination ── */
interface PaginationProps {
  current: number;
  total: number;
  totalItems: number;
  perPage: number;
  start: number;
  end: number;
  onChange: (p: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ current, total, totalItems, start, end, onChange }) => {
  const pages: (number | '…')[] = [];
  if (total <= 7) {
    for (let p = 1; p <= total; p++) pages.push(p);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }
  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems}</strong> items
      </div>
      <div className="pagination-controls">
        <button className="page-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>
          <i className="fa-solid fa-chevron-left" style={{ fontSize: '9px' }} />
        </button>
        {pages.map((p, i) =>
          p === '…'
            ? <button key={`dots-${i}`} className="page-btn dots">…</button>
            : <button key={p} className={`page-btn ${p === current ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        )}
        <button className="page-btn" disabled={current === total || total === 0} onClick={() => onChange(current + 1)}>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: '9px' }} />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: STOCK LEVELS
// ═══════════════════════════════════════════════════════════

const StockLevelsTab: React.FC = () => {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'all' | 'low'>('all');
  const [page,   setPage]     = useState(1);

  const filtered = INVENTORY_ITEMS.filter(item => {
    if (filter === 'low' && getHealthStatus(item) === 'Good') return false;
    if (search) {
      const q = search.toLowerCase();
      return item.sku.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    }
    return true;
  });

  const total      = filtered.length;
  const start      = (page - 1) * ITEMS_PER_PAGE + 1;
  const end        = Math.min(page * ITEMS_PER_PAGE, total);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const pageItems  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Total SKUs</div>
            <div className="stat-icon" style={{ background: '#FFF5EE' }}>
              <i className="fa-solid fa-box ic-orange" />
            </div>
          </div>
          <div className="stat-value">248</div>
          <div className="stat-trend neutral"><i className="fa-solid fa-minus" /> No change today</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">In Stock</div>
            <div className="stat-icon" style={{ background: 'var(--green-bg)' }}>
              <i className="fa-solid fa-circle-check ic-green" />
            </div>
          </div>
          <div className="stat-value">212</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 85.5% healthy</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Low Stock</div>
            <div className="stat-icon" style={{ background: 'var(--yellow-bg)' }}>
              <i className="fa-solid fa-triangle-exclamation ic-yellow" />
            </div>
          </div>
          <div className="stat-value">33</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Critical / OOS</div>
            <div className="stat-icon" style={{ background: 'var(--red-bg)' }}>
              <i className="fa-solid fa-circle-exclamation ic-red" />
            </div>
          </div>
          <div className="stat-value">3</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Restock ASAP</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="table-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search stock..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button
              className={`t-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => { setFilter('all'); setPage(1); }}
            >
              All Items
            </button>
            <button
              className={`t-filter-btn ${filter === 'low' ? 'active' : ''}`}
              onClick={() => { setFilter('low'); setPage(1); }}
            >
              <i className="fa-solid fa-triangle-exclamation" /> Low Stock Only
            </button>
          </div>
          <div className="table-toolbar-right">
            <button className="header-btn primary">
              <i className="fa-solid fa-plus" /> Stock In
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th className="sortable">Product</th>
                <th className="sortable sorted">
                  Stock <i className="fa-solid fa-sort-up sort-icon" />
                </th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Threshold</th>
                <th>Stock Health</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, i) => {
                const available = item.stock - item.reserved;
                const health    = getHealthStatus(item);
                const fillCls   = health === 'Critical' ? 'red' : health === 'Low' ? 'yellow' : 'green';
                const fillPct   = Math.min(100, (available / 60) * 100);

                return (
                  <tr key={item.sku}>
                    <td>
                      <code className="inv-code-chip">{item.sku}</code>
                    </td>
                    <td><strong>{item.name}</strong></td>
                    <td><strong style={{ fontSize: 13 }}>{item.stock}</strong></td>
                    <td><span style={{ color: 'var(--text-muted)' }}>{item.reserved}</span></td>
                    <td><strong style={{ color: 'var(--green)' }}>{available}</strong></td>
                    <td>{item.threshold}</td>
                    <td>
                      <div className="inv-stock-health">
                        <Badge label={health} />
                        <div className="prog-bar" style={{ width: 70 }}>
                          <div className={`prog-fill ${fillCls}`} style={{ width: `${fillPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.lastUpdated}</span>
                    </td>
                    <td>
                      <ThreeDot
                        id={`inv-${i}`}
                        items={[
                          { label: 'Add Stock',     icon: 'fa-plus',              onClick: () => {} },
                          { label: 'Remove Stock',  icon: 'fa-minus',             onClick: () => {} },
                          { label: 'View History',  icon: 'fa-clock-rotate-left', onClick: () => {} },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          current={page}
          total={totalPages}
          totalItems={total}
          perPage={ITEMS_PER_PAGE}
          start={start}
          end={end}
          onChange={setPage}
        />
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: MOVEMENTS
// ═══════════════════════════════════════════════════════════

const MovementsTab: React.FC = () => {
  const [page, setPage] = useState(1);

  const moveBg: Record<MovementType, string> = {
    In:     'var(--green-bg)',
    Out:    'var(--red-bg)',
    Adjust: 'var(--yellow-bg)',
  };
  const moveIcon: Record<MovementType, string> = {
    In:     'fa-arrow-down ic-green',
    Out:    'fa-arrow-up ic-red',
    Adjust: 'fa-arrows-up-down ic-yellow',
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <i className="fa-solid fa-arrows-left-right" /> Stock Movements
        </div>
        <button className="header-btn primary">
          <i className="fa-solid fa-plus" /> Log Movement
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>SKU</th>
              <th>Product</th>
              <th>Type</th>
              <th>Qty Change</th>
              <th>Stock After</th>
              <th>Reason</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {MOVEMENTS.map((m, i) => (
              <tr key={i}>
                <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.date}</span></td>
                <td><code className="inv-code-chip">{m.sku}</code></td>
                <td><strong>{m.product}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="inv-move-icon" style={{ background: moveBg[m.type] }}>
                      <i className={`fa-solid ${moveIcon[m.type]}`} style={{ fontSize: 10 }} />
                    </div>
                    <Badge label={m.type} />
                  </div>
                </td>
                <td>
                  <strong style={{ color: m.qty > 0 ? 'var(--green)' : m.qty < 0 ? 'var(--red)' : 'var(--yellow)' }}>
                    {m.qty > 0 ? `+${m.qty}` : m.qty}
                  </strong>
                </td>
                <td>{m.stockAfter}</td>
                <td>{m.reason}</td>
                <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.by}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing <strong>1–10</strong> of <strong>312</strong> movements
        </div>
        <div className="pagination-controls">
          <button className="page-btn" disabled>
            <i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} />
          </button>
          {[1, 2, 3].map(p => (
            <button
              key={p}
              className={`page-btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button className="page-btn dots">…</button>
          <button className="page-btn">32</button>
          <button className="page-btn">
            <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: ALERTS
// ═══════════════════════════════════════════════════════════

const AlertsTab: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">
        <i className="fa-solid fa-triangle-exclamation ic-red" /> Low Stock Alerts
      </div>
    </div>
    <div className="card-body" style={{ padding: '0 16px' }}>
      {ALERTS.map(alert => {
        const isCritical = alert.severity === 'Critical';
        return (
          <div key={alert.sku} className="list-item">
            <div
              className="list-icon"
              style={{ background: isCritical ? 'var(--red-bg)' : 'var(--yellow-bg)' }}
            >
              <i
                className={`fa-solid fa-box ${isCritical ? 'ic-red' : 'ic-yellow'}`}
                style={{ fontSize: 12 }}
              />
            </div>
            <div className="list-content">
              <div className="list-title">{alert.name} — {alert.sku}</div>
              <div className="list-meta">
                {alert.stock} unit{alert.stock !== 1 ? 's' : ''} remaining · Threshold: {alert.threshold}
              </div>
            </div>
            <div className="list-right">
              <Badge label={alert.severity} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// TAB: ADJUSTMENTS
// ═══════════════════════════════════════════════════════════

const AdjustmentsTab: React.FC = () => {
  const [selectedSku,    setSelectedSku]    = useState('SKU-0041 — Classic Lawn Suit');
  const [adjustType,     setAdjustType]     = useState<AdjustmentType>('Add Stock');
  const [quantity,       setQuantity]       = useState(0);
  const [reasonCode,     setReasonCode]     = useState<ReasonCode>('Supplier Restock');
  const [notes,          setNotes]          = useState('');

  const skuOptions = INVENTORY_ITEMS.map(i => `${i.sku} — ${i.name}`);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <i className="fa-solid fa-sliders" /> Stock Adjustments
        </div>
        <button className="header-btn primary">
          <i className="fa-solid fa-plus" /> New Adjustment
        </button>
      </div>
      <div className="card-body">
        <div className="info-banner">
          <i className="fa-solid fa-circle-info" />
          <div className="info-banner-text">
            All manual adjustments are logged with reason codes for audit purposes.
          </div>
        </div>

        <div className="inv-adj-form" style={{ marginTop: 14 }}>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Select Product (SKU)</div>
              <select
                className="form-select"
                value={selectedSku}
                onChange={e => setSelectedSku(e.target.value)}
              >
                {skuOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Adjustment Type</div>
              <select
                className="form-select"
                value={adjustType}
                onChange={e => setAdjustType(e.target.value as AdjustmentType)}
              >
                <option>Add Stock</option>
                <option>Remove Stock</option>
                <option>Set Exact Value</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Quantity</div>
              <input
                className="form-input"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="form-group">
              <div className="form-label">Reason Code</div>
              <select
                className="form-select"
                value={reasonCode}
                onChange={e => setReasonCode(e.target.value as ReasonCode)}
              >
                <option>Supplier Restock</option>
                <option>Damage Write-off</option>
                <option>Return Received</option>
                <option>Manual Correction</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Notes (optional)</div>
            <input
              className="form-input"
              placeholder="Additional notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <hr />
          <button className="header-btn primary">
            <i className="fa-solid fa-check" /> Apply Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: SETTINGS
// ═══════════════════════════════════════════════════════════

const InventorySettingsTab: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">
        <i className="fa-solid fa-gear" /> Inventory Settings
      </div>
    </div>
    <div className="card-body">
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Auto-deduct on Order Confirm</div>
          <select className="form-select">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Alert Notification To</div>
          <select className="form-select">
            <option>Inventory Manager</option>
            <option>Admin</option>
            <option>Both</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Allow Negative Stock</div>
          <select className="form-select">
            <option>No — Block orders</option>
            <option>Yes — Allow oversell</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Reserve Stock on Pending</div>
          <select className="form-select">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Default Low Stock Threshold</div>
          <input className="form-input" type="number" defaultValue={10} />
        </div>
        <div className="form-group">
          <div className="form-label">Alert Frequency</div>
          <select className="form-select">
            <option>Real-time</option>
            <option>Daily digest</option>
            <option>Weekly digest</option>
          </select>
        </div>
      </div>

      <hr />
      <button className="header-btn primary">
        <i className="fa-solid fa-check" /> Save Settings
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('stock');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

  const tabs: { id: InventoryTab; icon: string; label: string; badge?: number }[] = [
    { id: 'stock',       icon: 'fa-cubes',                label: 'Stock Levels'  },
    { id: 'movements',   icon: 'fa-arrows-left-right',    label: 'Movements'     },
    { id: 'alerts',      icon: 'fa-triangle-exclamation', label: 'Alerts', badge: ALERTS.length },
    { id: 'adjustments', icon: 'fa-sliders',              label: 'Adjustments'   },
    { id: 'settings',    icon: 'fa-gear',                 label: 'Settings'      },
  ];

  return (
    <div id="page-inventory">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      <div className="section-heading">Inventory Management</div>
      <div className="section-subheading">
        Real-time stock levels, movements, alerts, and manual adjustments.
      </div>

      {/* Horizontal Tabs */}
      <div className="h-tabs">
        {tabs.map(t => (
          <div
            key={t.id}
            className={`h-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => switchTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
            {t.badge !== undefined && (
              <span className="badge red" style={{ marginLeft: 4 }}>{t.badge}</span>
            )}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'stock'       && <StockLevelsTab />}
      {activeTab === 'movements'   && <MovementsTab />}
      {activeTab === 'alerts'      && <AlertsTab />}
      {activeTab === 'adjustments' && <AdjustmentsTab />}
      {activeTab === 'settings'    && <InventorySettingsTab />}
    </div>
  );
};

export default InventoryPage;