import React, { useState, useEffect } from 'react';
import './CustomersPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';
// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type CustomerTab  = 'all' | 'vip' | 'segments' | 'settings';
type Segment      = 'VIP' | 'Regular' | 'Occasional' | 'New';
type CustomerFilter = 'all' | 'vip' | 'inactive';

interface Customer {
  name: string;
  phone: string;
  city: string;
  orders: number;
  spent: string;
  last: string;
  segment: Segment;
}

interface VipCustomer {
  initials: string;
  name: string;
  phone: string;
  orders: number;
  spent: string;
}

interface SegmentCard {
  value: number;
  label: string;
  sub: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const CUSTOMERS_DATA: Customer[] = [
  { name: 'Amna Bibi',      phone: '0300-1234567', city: 'Lahore',      orders: 12, spent: '₨28,400',  last: '07 May 2026', segment: 'Regular'   },
  { name: 'Fatima Zara',    phone: '0321-9876543', city: 'Karachi',     orders: 29, spent: '₨87,500',  last: '07 May 2026', segment: 'VIP'        },
  { name: 'Sara Khan',      phone: '0333-5552211', city: 'Islamabad',   orders: 5,  spent: '₨12,200',  last: '06 May 2026', segment: 'Regular'   },
  { name: 'Nadia Malik',    phone: '0311-4443322', city: 'Rawalpindi',  orders: 8,  spent: '₨19,600',  last: '06 May 2026', segment: 'Regular'   },
  { name: 'Rabia Ahmed',    phone: '0345-6677889', city: 'Faisalabad',  orders: 3,  spent: '₨7,400',   last: '05 May 2026', segment: 'Occasional' },
  { name: 'Hira Baig',      phone: '0312-1122334', city: 'Multan',      orders: 14, spent: '₨34,100',  last: '05 May 2026', segment: 'Regular'   },
  { name: 'Zainab Qureshi', phone: '0300-9988776', city: 'Lahore',      orders: 2,  spent: '₨4,800',   last: '04 May 2026', segment: 'Occasional' },
  { name: 'Mehwish Ali',    phone: '0321-5544332', city: 'Karachi',     orders: 38, spent: '₨112,000', last: '04 May 2026', segment: 'VIP'        },
  { name: 'Sadia Hussain',  phone: '0333-7766554', city: 'Peshawar',    orders: 1,  spent: '₨2,200',   last: '03 May 2026', segment: 'New'        },
  { name: 'Bushra Nawaz',   phone: '0311-8899001', city: 'Quetta',      orders: 6,  spent: '₨15,300',  last: '02 May 2026', segment: 'Regular'   },
];

const VIP_CUSTOMERS: VipCustomer[] = [
  { initials: 'AK', name: 'Amna Khan',   phone: '0300-1234567', orders: 38, spent: '₨112,000' },
  { initials: 'FZ', name: 'Fatima Zara', phone: '0321-9876543', orders: 29, spent: '₨87,500'  },
  { initials: 'SR', name: 'Sara Riaz',   phone: '0333-5552211', orders: 24, spent: '₨74,200'  },
];

const SEGMENT_CARDS: SegmentCard[] = [
  { value: 1842, label: 'Regular Buyers',    sub: '1–5 orders · Last 3 months',  color: 'var(--accent)'  },
  { value: 1176, label: 'Occasional Buyers', sub: '1–2 orders · Last 6 months',  color: 'var(--yellow)'  },
  { value: 124,  label: 'VIP / Loyal',       sub: '6+ orders · High spenders',   color: 'var(--red)'     },
];

const CUSTOMERS_PER_PAGE = 15;

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const segmentBadgeClass: Record<Segment, string> = {
  VIP:        'yellow',
  Regular:    'blue',
  Occasional: 'gray',
  New:        'green',
};

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

/* ── Badge ── */
const Badge: React.FC<{ label: string; cls?: string }> = ({ label, cls }) => (
  <span className={`badge ${cls ?? ''}`}>{label}</span>
);

/* ── Three-Dot Menu ── */
interface ThreeDotItem {
  label: string;
  icon: string;
  danger?: boolean;
  onClick: () => void;
}
const ThreeDot: React.FC<{ id: string; items: ThreeDotItem[] }> = ({ id, items }) => {
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
        Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems.toLocaleString()}</strong> customers
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
// TAB: ALL CUSTOMERS
// ═══════════════════════════════════════════════════════════

const AllCustomersTab: React.FC = () => {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<CustomerFilter>('all');
  const [page,   setPage]     = useState(1);

  const filtered = CUSTOMERS_DATA.filter(c => {
    if (filter === 'vip'      && c.segment !== 'VIP')        return false;
    if (filter === 'inactive' && c.orders > 1)               return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total      = filtered.length;
  const start      = (page - 1) * CUSTOMERS_PER_PAGE + 1;
  const end        = Math.min(page * CUSTOMERS_PER_PAGE, total);
  const totalPages = Math.ceil(total / CUSTOMERS_PER_PAGE);
  const pageItems  = filtered.slice((page - 1) * CUSTOMERS_PER_PAGE, page * CUSTOMERS_PER_PAGE);

  const filterLabels: Record<CustomerFilter, string> = {
    all:      'All',
    vip:      'VIP',
    inactive: 'Inactive',
  };
  const filterIcons: Partial<Record<CustomerFilter, string>> = {
    vip:      'fa-crown',
    inactive: 'fa-user-clock',
  };

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Total Customers</div>
            <div className="stat-icon" style={{ background: '#FFF5EE' }}>
              <i className="fa-solid fa-users ic-orange" />
            </div>
          </div>
          <div className="stat-value">3,142</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +48 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">New This Month</div>
            <div className="stat-icon" style={{ background: 'var(--green-bg)' }}>
              <i className="fa-solid fa-user-plus ic-green" />
            </div>
          </div>
          <div className="stat-value">48</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +12% growth</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">VIP Customers</div>
            <div className="stat-icon" style={{ background: 'var(--yellow-bg)' }}>
              <i className="fa-solid fa-crown ic-yellow" />
            </div>
          </div>
          <div className="stat-value">124</div>
          <div className="stat-trend neutral"><i className="fa-solid fa-minus" /> 3.9% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Avg. Orders/Customer</div>
            <div className="stat-icon" style={{ background: 'var(--blue-bg)' }}>
              <i className="fa-solid fa-repeat" style={{ color: 'var(--blue)' }} />
            </div>
          </div>
          <div className="stat-value">2.8</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +0.3 vs last month</div>
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
                placeholder="Search name, phone..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            {(['all', 'vip', 'inactive'] as CustomerFilter[]).map(f => (
              <button
                key={f}
                className={`t-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => { setFilter(f); setPage(1); }}
              >
                {filterIcons[f] && <i className={`fa-solid ${filterIcons[f]}`} />} {filterLabels[f]}
              </button>
            ))}
          </div>
          <div className="table-toolbar-right">
            <button className="t-filter-btn">
              <i className="fa-solid fa-file-export" /> Export
            </button>
            <button className="header-btn primary">
              <i className="fa-solid fa-plus" /> Add Customer
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 32 }}><input type="checkbox" /></th>
                <th className="sortable sorted">Customer</th>
                <th>Phone</th>
                <th>City</th>
                <th className="sortable">Total Orders</th>
                <th className="sortable">Total Spent</th>
                <th>Last Order</th>
                <th>Segment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c, i) => (
                <tr key={c.name + i}>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar">{initials(c.name)}</div>
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>{c.phone}</td>
                  <td>
                    <span className="tag">
                      <i className="fa-solid fa-location-dot" style={{ fontSize: 9 }} /> {c.city}
                    </span>
                  </td>
                  <td>{c.orders}</td>
                  <td><strong>{c.spent}</strong></td>
                  <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.last}</span></td>
                  <td>
                    <span className={`badge ${segmentBadgeClass[c.segment]}`}>
                      {c.segment === 'VIP' && <i className="fa-solid fa-crown" style={{ marginRight: 3 }} />}
                      {c.segment}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <ThreeDot
                      id={`cust-${i}`}
                      items={[
                        { label: 'View Profile',  icon: 'fa-eye',          onClick: () => {} },
                        { label: 'View Orders',   icon: 'fa-bag-shopping', onClick: () => {} },
                        { label: 'Mark as VIP',   icon: 'fa-crown',        onClick: () => {} },
                        { label: '---',           icon: '',                onClick: () => {} },
                        { label: 'Block Customer',icon: 'fa-ban', danger: true, onClick: () => {} },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          current={page}
          total={totalPages}
          totalItems={total}
          perPage={CUSTOMERS_PER_PAGE}
          start={start}
          end={end}
          onChange={setPage}
        />
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: VIP CUSTOMERS
// ═══════════════════════════════════════════════════════════

const VipCustomersTab: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">
        <i className="fa-solid fa-crown ic-yellow" /> VIP Customers
      </div>
    </div>
    <div className="card-body" style={{ padding: '0 16px' }}>
      {VIP_CUSTOMERS.map(v => (
        <div key={v.name} className="list-item">
          <div className="cust-vip-avatar">{v.initials}</div>
          <div className="list-content">
            <div className="list-title">{v.name}</div>
            <div className="list-meta">
              {v.phone} · {v.orders} orders · {v.spent} spent
            </div>
          </div>
          <div className="list-right">
            <span className="badge yellow">
              <i className="fa-solid fa-crown" style={{ marginRight: 3 }} /> VIP
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// TAB: SEGMENTS
// ═══════════════════════════════════════════════════════════

const SegmentsTab: React.FC = () => (
  <div className="grid-3">
    {SEGMENT_CARDS.map(s => (
      <div key={s.label} className="card">
        <div className="card-body" style={{ textAlign: 'center', padding: 20 }}>
          <div className="cust-segment-value" style={{ color: s.color }}>
            {s.value.toLocaleString()}
          </div>
          <div className="cust-segment-label">{s.label}</div>
          <div className="cust-segment-sub">{s.sub}</div>
        </div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
// TAB: SETTINGS
// ═══════════════════════════════════════════════════════════

const CustomerSettingsTab: React.FC = () => {
  const [vipOrders, setVipOrders] = useState(6);
  const [vipSpend,  setVipSpend]  = useState(50000);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <i className="fa-solid fa-gear" /> Customer Settings
        </div>
      </div>
      <div className="card-body">
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">VIP Threshold (Orders)</div>
            <input
              className="form-input"
              type="number"
              value={vipOrders}
              onChange={e => setVipOrders(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <div className="form-label">VIP Threshold (Spend ₨)</div>
            <input
              className="form-input"
              type="number"
              value={vipSpend}
              onChange={e => setVipSpend(Number(e.target.value))}
            />
          </div>
        </div>
        <hr />
        <button className="header-btn primary">
          <i className="fa-solid fa-check" /> Save Settings
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const CustomersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('all');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

  const tabs: { id: CustomerTab; icon: string; label: string }[] = [
    { id: 'all',      icon: 'fa-address-card', label: 'All Customers' },
    { id: 'vip',      icon: 'fa-star',         label: 'VIP Customers' },
    { id: 'segments', icon: 'fa-chart-line',   label: 'Segments'      },
    { id: 'settings', icon: 'fa-gear',         label: 'Settings'      },
  ];

  return (
    <div id="page-customers">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      <div className="section-heading">Customer Management</div>
      <div className="section-subheading">
        View, search, and manage all customers, VIPs, and segments.
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
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'all'      && <AllCustomersTab />}
      {activeTab === 'vip'      && <VipCustomersTab />}
      {activeTab === 'segments' && <SegmentsTab />}
      {activeTab === 'settings' && <CustomerSettingsTab />}
    </div>
  );
};

export default CustomersPage;