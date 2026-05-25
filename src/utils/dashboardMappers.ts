// ─── utils/dashboardMappers.ts ────────────────────────────────
// Converts raw API responses → the typed UI shapes your components expect.
// This keeps all transformation logic out of the Dashboard page component.

import type {
  KpiStat,
  StatCard,
  WeekBar,
  TopProduct,
  RiderStatus,
  RecentOrder,
  CodRing,
  ActivityItem,
} from '../types/dashboard';

import type {
  DashboardKpis,
  DashboardTrends,
  LiveRider,
  LiveOrder,
} from '../hooks/useDashboard';

// ── Formatters ────────────────────────────────────────────────

function fmtPKR(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (n >= 100000) return `₨${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)   return `₨${(n / 1000).toFixed(1)}K`;
  return `₨${n.toLocaleString('en-PK')}`;
}

function trendDir(rate: string | number, direction?: string): 'up' | 'down' | 'neutral' {
  if (direction === 'up') return 'up';
  if (direction === 'down') return 'down';
  const r = parseFloat(String(rate));
  if (r > 0) return 'up';
  if (r < 0) return 'down';
  return 'neutral';
}

function trendLabel(rate: string | number, suffix = 'vs last 30d'): string {
  const r = parseFloat(String(rate));
  const sign = r > 0 ? '+' : '';
  return `${sign}${r.toFixed(1)}% ${suffix}`;
}

// ── Header KPI strip ─────────────────────────────────────────

export function mapHeaderKpis(kpis: DashboardKpis | null): KpiStat[] {
  if (!kpis) {
    return [
      { label: 'Revenue Today',   value: '—', trend: '—', trendDir: 'neutral' },
      { label: 'Orders Today',    value: '—', trend: '—', trendDir: 'neutral' },
      { label: 'COD Outstanding', value: '—', trend: '—', trendDir: 'neutral' },
      { label: 'Delivery Rate',   value: '—', trend: '—', trendDir: 'neutral' },
    ];
  }

  return [
    {
      label: 'Total Revenue',
      value: fmtPKR(kpis.revenue.total),
      trend: trendLabel(0, 'this period'),
      trendDir: 'up',
    },
    {
      label: 'Total Orders',
      value: kpis.orders.total.toLocaleString(),
      trend: `${kpis.orders.pending} pending`,
      trendDir: kpis.orders.pending > 0 ? 'neutral' : 'up',
    },
    {
      label: 'Fulfillment Rate',
      value: `${kpis.orders.fulfillmentRate}%`,
      trend: kpis.orders.delivered + ' delivered',
      trendDir: parseFloat(kpis.orders.fulfillmentRate) >= 80 ? 'up' : 'down',
    },
    {
      label: 'Inventory Value',
      value: fmtPKR(kpis.inventory.totalInventoryValue),
      trend: `${kpis.inventory.lowStockAlerts} low-stock alerts`,
      trendDir: kpis.inventory.lowStockAlerts > 0 ? 'down' : 'up',
    },
  ];
}

// ── Stat cards row ────────────────────────────────────────────

export function mapStatCards(kpis: DashboardKpis | null): StatCard[] {
  if (!kpis) return [];

  return [
    {
      icon: 'fa-bag-shopping',
      iconBg: 'rgba(99,102,241,.15)',
      iconColor: 'var(--accent)',
      value: kpis.orders.total.toLocaleString(),
      label: 'Total Orders',
      trend: `${kpis.orders.pending} pending · ${kpis.orders.cancelled} cancelled`,
      trendDir: 'neutral',
      accentGradient: 'linear-gradient(90deg,var(--accent),transparent)',
    },
    {
      icon: 'fa-sack-dollar',
      iconBg: 'rgba(16,185,129,.15)',
      iconColor: 'var(--green)',
      value: fmtPKR(kpis.revenue.total),
      label: 'Total Revenue',
      trend: `Avg order ${fmtPKR(kpis.revenue.avgOrderValue)}`,
      trendDir: 'up',
      accentGradient: 'linear-gradient(90deg,var(--green),transparent)',
    },
    {
      icon: 'fa-boxes-stacked',
      iconBg: 'rgba(59,130,246,.15)',
      iconColor: 'var(--blue)',
      value: kpis.inventory.totalStockUnits.toLocaleString(),
      label: 'Stock Units',
      trend: `${kpis.inventory.lowStockAlerts} low stock · ${kpis.inventory.outOfStock} out`,
      trendDir: kpis.inventory.lowStockAlerts > 0 ? 'down' : 'up',
      accentGradient: 'linear-gradient(90deg,var(--blue),transparent)',
    },
    {
      icon: 'fa-users',
      iconBg: 'rgba(245,158,11,.15)',
      iconColor: 'var(--yellow)',
      value: kpis.customers.total.toLocaleString(),
      label: 'Customers',
      trend: `${kpis.customers.vip} VIP · ${kpis.customers.new} new`,
      trendDir: 'up',
      accentGradient: 'linear-gradient(90deg,var(--yellow),transparent)',
    },
    {
      icon: 'fa-clipboard-list',
      iconBg: 'rgba(239,68,68,.15)',
      iconColor: 'var(--red)',
      value: kpis.tasks.total.toString(),
      label: 'Tasks',
      trend: `${kpis.tasks.overdue} overdue · ${kpis.tasks.inProgress} in progress`,
      trendDir: kpis.tasks.overdue > 0 ? 'down' : 'neutral',
      accentGradient: 'linear-gradient(90deg,var(--red),transparent)',
    },
    {
      icon: 'fa-chart-line',
      iconBg: 'rgba(139,92,246,.15)',
      iconColor: 'var(--purple)',
      value: fmtPKR(kpis.revenue.netRevenue),
      label: 'Net Revenue',
      trend: `After ${fmtPKR(kpis.expenses.total)} expenses`,
      trendDir: 'up',
      accentGradient: 'linear-gradient(90deg,var(--purple),transparent)',
    },
  ];
}

// ── Weekly chart bars ─────────────────────────────────────────

export function mapWeekBars(trends: DashboardTrends | null): WeekBar[] {
  if (!trends?.dailyRevenue?.length) {
    // Placeholder skeleton bars
    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => ({
      day,
      heightPct: 30,
      variant: 'default' as const,
    }));
  }

  // Use the last 7 days from dailyRevenue
  const last7 = trends.dailyRevenue.slice(-7);
  const maxOrders = Math.max(...last7.map((d) => d.orders), 1);

  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return last7.map((day, i) => {
    const pct = Math.max(10, Math.round((day.orders / maxOrders) * 90));
    const isToday = i === last7.length - 1;
    return {
      day: dayLabels[new Date(day.date).getDay()] ?? day.date.slice(5),
      heightPct: pct,
      variant: isToday ? 'accent' : 'default',
    };
  });
}

// ── Top products ──────────────────────────────────────────────

export function mapTopProducts(kpis: DashboardKpis | null): TopProduct[] {
  if (!kpis?.topSellingProducts?.length) return [];

  return kpis.topSellingProducts.slice(0, 5).map((p, i) => ({
    rank: i + 1,
    name: p.name,
    sku: p.sku,
    sold: p.totalQty,
    stock: 0, // not returned by analytics endpoint; would need products API
    revenue: fmtPKR(p.totalRevenue),
    stockStatus: 'ok' as const, // default; enrich with /api/stock/low-stock if needed
  }));
}

// ── Rider status list ─────────────────────────────────────────

const AVATAR_PALETTES = [
  { bg: '#EEF2FF', color: '#4F46E5' },
  { bg: '#F0FDF4', color: '#16A34A' },
  { bg: '#FFF7ED', color: '#EA580C' },
  { bg: '#FDF4FF', color: '#9333EA' },
  { bg: '#FFF1F2', color: '#E11D48' },
  { bg: '#F0F9FF', color: '#0284C7' },
];

function riderBadge(status: string): string {
  switch (status) {
    case 'Active':      return 'green';
    case 'OnDelivery':  return 'blue';
    case 'Inactive':    return 'gray';
    case 'OnLeave':     return 'yellow';
    case 'Suspended':   return 'red';
    default:            return 'gray';
  }
}

export function mapRiders(riders: LiveRider[]): RiderStatus[] {
  return riders.map((r, i) => {
    const palette = AVATAR_PALETTES[i % AVATAR_PALETTES.length];
    const initials = `${r.firstName[0]}${r.lastName[0]}`.toUpperCase();
    const isOnline = r.status === 'Active' || r.status === 'OnDelivery';

    return {
      initials,
      name: `${r.firstName} ${r.lastName}`,
      avatarBg: palette.bg,
      avatarColor: palette.color,
      orderId: r.currentOrder?.orderId ?? null,
      location: r.assignedLocation ?? 'Unassigned',
      status: r.status === 'OnDelivery' ? 'Delivering' : r.status,
      statusBadge: riderBadge(r.status),
      isOnline,
    };
  });
}

// ── Recent orders table ───────────────────────────────────────

function orderStatusBadge(status: string): string {
  switch (status) {
    case 'Pending':    return 'yellow';
    case 'Confirmed':  return 'blue';
    case 'Processing': return 'blue';
    case 'Shipped':    return 'purple';
    case 'Delivered':  return 'green';
    case 'Cancelled':  return 'red';
    case 'Returned':   return 'red';
    default:           return 'gray';
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function mapRecentOrders(orders: LiveOrder[]): RecentOrder[] {
  return orders.map((o, i) => {
    const palette = AVATAR_PALETTES[i % AVATAR_PALETTES.length];
    const firstName = o.customer?.firstName ?? 'Unknown';
    const lastName  = o.customer?.lastName  ?? '';
    const initials  = `${firstName[0]}${lastName[0] ?? ''}`.toUpperCase();

    return {
      id: o.orderNumber ?? o._id.slice(-6).toUpperCase(),
      customerInitials: initials,
      customerName: `${firstName} ${lastName}`.trim(),
      avatarBg:    palette.bg,
      avatarColor: palette.color,
      items: o.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 1,
      total: fmtPKR(o.totalAmount),
      status: o.status,
      statusBadge: orderStatusBadge(o.status),
      paymentType: (o.paymentMethod === 'COD' ? 'COD' : 'Prepaid') as 'COD' | 'Prepaid',
      time: timeAgo(o.createdAt),
    };
  });
}

// ── COD rings ─────────────────────────────────────────────────
// These still use the orders data since the analytics dashboard gives us
// codOrders / prepaidOrders counts, which we convert to percentages.

export function mapCodRings(kpis: DashboardKpis | null): CodRing[] {
  if (!kpis) {
    return [
      { label: 'Delivered',    subLabel: '—',  pct: '0%',  ringClass: 'g' },
      { label: 'Pending COD',  subLabel: '—',  pct: '0%',  ringClass: 'y' },
      { label: 'Overdue',      subLabel: '—',  pct: '0%',  ringClass: 'r' },
    ];
  }

  const total = kpis.orders.total || 1;
  const deliveredPct = Math.round((kpis.orders.delivered / total) * 100);
  const pendingPct   = Math.round((kpis.orders.pending   / total) * 100);
  const cancelPct    = Math.round((kpis.orders.cancelled / total) * 100);

  return [
    {
      label:    'Delivered',
      subLabel: kpis.orders.delivered.toString(),
      pct:      `${deliveredPct}%`,
      ringClass: 'g',
    },
    {
      label:    'Pending',
      subLabel: kpis.orders.pending.toString(),
      pct:      `${pendingPct}%`,
      ringClass: 'y',
    },
    {
      label:    'Cancelled',
      subLabel: kpis.orders.cancelled.toString(),
      pct:      `${cancelPct}%`,
      ringClass: 'r',
    },
  ];
}

// ── Activity feed ─────────────────────────────────────────────
// Activity is generated from the KPI snapshot since there's no dedicated
// "recent activity" endpoint. For real activity use /api/audit if available.

export function mapActivityItems(kpis: DashboardKpis | null): ActivityItem[] {
  if (!kpis) return [];

  const items: ActivityItem[] = [];

  if (kpis.orders.pending > 0) {
    items.push({
      iconClass: 'fa-bag-shopping',
      iconBg: 'rgba(99,102,241,.15)',
      iconColor: 'var(--accent)',
      title: `${kpis.orders.pending} orders awaiting confirmation`,
      meta: 'Orders · Just now',
      badge: { label: 'Action Needed', color: 'yellow' },
    });
  }

  if (kpis.inventory.lowStockAlerts > 0) {
    items.push({
      iconClass: 'fa-triangle-exclamation',
      iconBg: 'rgba(239,68,68,.15)',
      iconColor: 'var(--red)',
      title: `${kpis.inventory.lowStockAlerts} products below low-stock threshold`,
      meta: 'Inventory · Updated now',
      badge: { label: 'Low Stock', color: 'red' },
    });
  }

  if (kpis.tasks.overdue > 0) {
    items.push({
      iconClass: 'fa-clock',
      iconBg: 'rgba(245,158,11,.15)',
      iconColor: 'var(--yellow)',
      title: `${kpis.tasks.overdue} tasks are overdue`,
      meta: 'Tasks · Check required',
      badge: { label: 'Overdue', color: 'red' },
    });
  }

  items.push({
    iconClass: 'fa-chart-line',
    iconBg: 'rgba(16,185,129,.15)',
    iconColor: 'var(--green)',
    title: `Net revenue ${fmtPKR(kpis.revenue.netRevenue)} this period`,
    meta: 'Finance · Analytics',
    value: fmtPKR(kpis.revenue.netRevenue),
  });

  if (kpis.customers.new > 0) {
    items.push({
      iconClass: 'fa-user-plus',
      iconBg: 'rgba(59,130,246,.15)',
      iconColor: 'var(--blue)',
      title: `${kpis.customers.new} new customers this period`,
      meta: 'CRM · Customers',
      badge: { label: 'New', color: 'blue' },
    });
  }

  return items.slice(0, 6); // cap at 6 for the feed height
}