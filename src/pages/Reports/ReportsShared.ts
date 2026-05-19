// ═══════════════════════════════════════════════════════════
// ReportsShared.ts  —  Types · Static Data · Helpers
// Import everything from here in each tab file
// ═══════════════════════════════════════════════════════════

// ── TYPES ───────────────────────────────────────────────────

export type ReportTab     = 'sales' | 'inventory' | 'financial' | 'staff' | 'export';
export type RevenuePeriod = 'daily' | 'weekly' | 'monthly';
export type CODFilter     = 'pending' | 'collected' | 'all';

export interface DailySale {
  date: string; orders: number; units: number; revenue: number;
  cod: number; prepaid: number; returns: number; net: number;
}
export interface TopProduct {
  name: string; sku: string; sold: number; revenue: string; trend: 'up' | 'down';
}
export interface CategorySale   { name: string; val: number; color: string; }
export interface Channel        { name: string; pct: number; val: string; color: string; }
export interface ChartDataPoint { label: string; val: number; }
export interface LowStockItem {
  sku: string; name: string; cat: string; stock: number; thr: number;
  days: number; last: string; supplier: string; urgency: 'Critical' | 'High' | 'Medium';
}
export interface DeadStockItem  { sku: string; name: string; stock: number; last: string; days: number; val: string; }
export interface ValuationRow   { name: string; cost: string; retail: string; }
export interface StockHealthCat { name: string; instock: number; low: number; oos: number; }
export interface PLRow          { label: string; val: string; color: string; bold?: boolean; }
export interface ExpenseRow     { cat: string; val: number; color: string; }
export interface CODItem        { id: string; cust: string; amt: number; courier: string; disp: string; exp: string; days: number; }
export interface SupplierPayment { name: string; total: string; paid: string; out: string; last: string; due: string; status: 'Active' | 'Overdue' | 'Cleared'; }
export interface StaffMember    { name: string; role: string; avatar: string; color: string; tasks: number; done: number; orders: number; errors: number; score: number; }
export interface DeptTask       { name: string; assigned: number; done: number; color: string; }
export interface ExportHistoryItem { time: string; type: string; range: string; records: number; fmt: string; by: string; status: string; }

// ── HELPERS ─────────────────────────────────────────────────

export const fmt  = (n: number): string => '₨' + n.toLocaleString();
export const fmtL = (n: number): string =>
  n >= 100000 ? '₨' + (n / 100000).toFixed(1) + 'L' : fmt(n);

export function statusBadgeClass(s: string): string {
  const m: Record<string, string> = {
    Active: 'green', Overdue: 'orange', Cleared: 'green',
    Pending: 'yellow', Ready: 'green', Partial: 'yellow', Failed: 'red',
  };
  return m[s] || 'gray';
}

// ── STATIC DATA ─────────────────────────────────────────────

export const DAILY_SALES: DailySale[] = [
  { date: '11 May 2026', orders: 34, units: 61, revenue: 91800,  cod: 54200,  prepaid: 37600, returns: 2, net: 89400  },
  { date: '10 May 2026', orders: 28, units: 49, revenue: 74600,  cod: 44100,  prepaid: 30500, returns: 1, net: 73800  },
  { date: '09 May 2026', orders: 31, units: 55, revenue: 84200,  cod: 50400,  prepaid: 33800, returns: 3, net: 81600  },
  { date: '08 May 2026', orders: 22, units: 38, revenue: 60100,  cod: 36400,  prepaid: 23700, returns: 0, net: 60100  },
  { date: '07 May 2026', orders: 29, units: 52, revenue: 78400,  cod: 46200,  prepaid: 32200, returns: 2, net: 76800  },
  { date: '06 May 2026', orders: 35, units: 64, revenue: 95200,  cod: 56800,  prepaid: 38400, returns: 1, net: 93900  },
  { date: '05 May 2026', orders: 18, units: 30, revenue: 48600,  cod: 29100,  prepaid: 19500, returns: 0, net: 48600  },
  { date: '04 May 2026', orders: 14, units: 24, revenue: 37200,  cod: 22400,  prepaid: 14800, returns: 1, net: 36400  },
  { date: '03 May 2026', orders: 26, units: 45, revenue: 70800,  cod: 42400,  prepaid: 28400, returns: 2, net: 69100  },
  { date: '02 May 2026', orders: 32, units: 57, revenue: 86400,  cod: 51800,  prepaid: 34600, returns: 1, net: 85200  },
  { date: '01 May 2026', orders: 43, units: 78, revenue: 114200, cod: 68200,  prepaid: 46000, returns: 4, net: 110600 },
];

export const WEEKLY_DATA: ChartDataPoint[] = [
  { label: 'W1 Apr', val: 320000 }, { label: 'W2 Apr', val: 410000 },
  { label: 'W3 Apr', val: 380000 }, { label: 'W4 Apr', val: 520000 },
  { label: 'W1 May', val: 460000 }, { label: 'W2 May', val: 590000 },
  { label: 'W3 May', val: 540000 }, { label: 'W4 May', val: 640000 },
];

export const DAILY_DATA: ChartDataPoint[] = [
  { label: '28 Apr', val: 72000  }, { label: '29 Apr', val: 68000  }, { label: '30 Apr', val: 88000  },
  { label: '01 May', val: 114200 }, { label: '02 May', val: 86400  }, { label: '03 May', val: 70800  },
  { label: '04 May', val: 37200  }, { label: '05 May', val: 48600  }, { label: '06 May', val: 95200  },
  { label: '07 May', val: 78400  }, { label: '08 May', val: 60100  }, { label: '09 May', val: 84200  },
  { label: '10 May', val: 74600  }, { label: '11 May', val: 91800  },
];

export const MONTHLY_DATA: ChartDataPoint[] = [
  { label: 'Dec 25', val: 2800000 }, { label: 'Jan 26', val: 3200000 },
  { label: 'Feb 26', val: 2900000 }, { label: 'Mar 26', val: 3600000 },
  { label: 'Apr 26', val: 4100000 }, { label: 'May 26', val: 840000  },
];

export const CHANNELS: Channel[] = [
  { name: 'WhatsApp', pct: 58, val: '₨4.87L', color: '#25D366' },
  { name: 'Shopify',  pct: 27, val: '₨2.27L', color: '#96BF48' },
  { name: 'Manual',   pct: 15, val: '₨1.26L', color: '#FF6A00' },
];

export const TOP_PRODUCTS: TopProduct[] = [
  { name: 'Cotton Kurti',        sku: 'SKU-0135', sold: 207, revenue: '₨1,55,250', trend: 'up'   },
  { name: 'Lawn Kurti Printed',  sku: 'SKU-0191', sold: 189, revenue: '₨1,22,850', trend: 'up'   },
  { name: 'Block Print Dupatta', sku: 'SKU-0112', sold: 120, revenue: '₨60,000',   trend: 'up'   },
  { name: 'Classic Lawn Suit',   sku: 'SKU-0041', sold: 142, revenue: '₨2,55,600', trend: 'up'   },
  { name: 'Chiffon Dupatta',     sku: 'SKU-0028', sold: 98,  revenue: '₨58,800',   trend: 'down' },
  { name: 'Linen Trouser',       sku: 'SKU-0078', sold: 88,  revenue: '₨79,200',   trend: 'up'   },
];

export const CATEGORY_SALES: CategorySale[] = [
  { name: 'Suits',    val: 384000, color: 'var(--accent)'  },
  { name: 'Kurtas',   val: 212000, color: '#8B5CF6'        },
  { name: 'Sarees',   val: 224000, color: '#EC4899'        },
  { name: 'Dupattas', val: 96000,  color: '#0891B2'        },
  { name: 'Shawls',   val: 140000, color: 'var(--green)'   },
  { name: 'Bottoms',  val: 162000, color: '#F59E0B'        },
  { name: 'Shirts',   val: 108000, color: '#7C3AED'        },
];

export const STOCK_HEALTH_CATS: StockHealthCat[] = [
  { name: 'Suits',    instock: 48, low: 8, oos: 2 },
  { name: 'Kurtas',   instock: 38, low: 4, oos: 1 },
  { name: 'Dupattas', instock: 30, low: 4, oos: 1 },
  { name: 'Shawls',   instock: 24, low: 3, oos: 1 },
  { name: 'Bottoms',  instock: 20, low: 2, oos: 0 },
  { name: 'Shirts',   instock: 16, low: 2, oos: 0 },
];

export const LOW_STOCK_ITEMS: LowStockItem[] = [
  { sku: 'SKU-0041', name: 'Classic Lawn Suit',     cat: 'Suits',    stock: 3, thr: 10, days: 2, last: '02 May', supplier: 'Al-Karam',  urgency: 'Critical' },
  { sku: 'SKU-0028', name: 'Chiffon Dupatta White', cat: 'Dupattas', stock: 7, thr: 10, days: 4, last: '28 Apr', supplier: 'Gul Ahmed', urgency: 'High'     },
  { sku: 'SKU-0092', name: 'Embroidered Shawl',     cat: 'Shawls',   stock: 8, thr: 10, days: 5, last: '01 May', supplier: 'Orient',    urgency: 'High'     },
  { sku: 'SKU-0167', name: 'Shalwar Kameez Set',    cat: 'Suits',    stock: 9, thr: 10, days: 6, last: '03 May', supplier: 'Al-Karam',  urgency: 'Medium'   },
  { sku: 'SKU-0205', name: 'Velvet Jacket Ladies',  cat: 'Jackets',  stock: 6, thr: 8,  days: 3, last: '30 Apr', supplier: 'Bonanza',   urgency: 'High'     },
  { sku: 'SKU-0183', name: 'Chiffon Saree Pink',    cat: 'Sarees',   stock: 0, thr: 5,  days: 0, last: '15 Apr', supplier: 'Nishat',    urgency: 'Critical' },
];

export const DEAD_STOCK: DeadStockItem[] = [
  { sku: 'SKU-0099', name: 'Velvet Shawl Maroon', stock: 18, last: '28 Jan 2026', days: 103, val: '₨25,200' },
  { sku: 'SKU-0077', name: 'Georgette Dupatta',   stock: 12, last: '15 Feb 2026', days: 85,  val: '₨8,400'  },
  { sku: 'SKU-0062', name: 'Winter Kurta XL',     stock: 9,  last: '01 Feb 2026', days: 99,  val: '₨22,500' },
  { sku: 'SKU-0144', name: 'Lawn Set (2019)',      stock: 6,  last: '10 Jan 2026', days: 121, val: '₨10,800' },
  { sku: 'SKU-0033', name: 'Old Print Shalwar',   stock: 4,  last: '05 Feb 2026', days: 95,  val: '₨5,600'  },
];

export const INV_VALUATION: ValuationRow[] = [
  { name: 'Suits',    cost: '₨5,20,000', retail: '₨8,40,000'  },
  { name: 'Kurtas',   cost: '₨2,80,000', retail: '₨4,60,000'  },
  { name: 'Sarees',   cost: '₨1,80,000', retail: '₨4,20,000'  },
  { name: 'Shawls',   cost: '₨1,20,000', retail: '₨2,40,000'  },
  { name: 'Dupattas', cost: '₨64,000',   retail: '₨1,12,000'  },
  { name: 'Bottoms',  cost: '₨84,000',   retail: '₨1,89,000'  },
];

export const PL_ROWS: PLRow[] = [
  { label: 'Gross Revenue',        val: '₨8,41,500',    color: 'var(--text-primary)', bold: true  },
  { label: 'Cost of Goods Sold',   val: '− ₨5,31,000', color: 'var(--red)'                       },
  { label: 'Gross Profit',         val: '₨3,10,500',    color: 'var(--green)',        bold: true  },
  { label: 'Shipping & Courier',   val: '− ₨42,000',   color: 'var(--red)'                       },
  { label: 'Operational Expenses', val: '− ₨38,000',   color: 'var(--red)'                       },
  { label: 'Staff Costs',          val: '− ₨40,000',   color: 'var(--red)'                       },
  { label: 'Net Profit',           val: '₨1,90,500',    color: 'var(--accent)',       bold: true  },
];

export const EXPENSES: ExpenseRow[] = [
  { cat: 'Shipping & Courier', val: 42000, color: 'var(--accent)' },
  { cat: 'Staff Salaries',     val: 40000, color: '#8B5CF6'       },
  { cat: 'Packaging',          val: 18000, color: '#0891B2'       },
  { cat: 'Marketing',          val: 12000, color: '#EC4899'       },
  { cat: 'Utilities',          val: 8000,  color: '#F59E0B'       },
];

export const COD_ITEMS: CODItem[] = [
  { id: 'ORD-1048', cust: 'Amna Bibi',      amt: 3600, courier: 'TCS',      disp: '07 May', exp: '10 May', days: 4  },
  { id: 'ORD-1045', cust: 'Sara Khan',       amt: 5800, courier: 'Leopards', disp: '06 May', exp: '09 May', days: 5  },
  { id: 'ORD-1042', cust: 'Zainab Qureshi', amt: 2800, courier: 'TCS',      disp: '05 May', exp: '08 May', days: 6  },
  { id: 'ORD-1039', cust: 'Bushra Nawaz',   amt: 4200, courier: 'M&P',      disp: '04 May', exp: '07 May', days: 7  },
  { id: 'ORD-1036', cust: 'Lubna Tanvir',   amt: 1800, courier: 'TCS',      disp: '03 May', exp: '06 May', days: 8  },
  { id: 'ORD-1033', cust: 'Nadia Iqbal',    amt: 7500, courier: 'Leopards', disp: '02 May', exp: '05 May', days: 9  },
  { id: 'ORD-1030', cust: 'Rafia Usman',    amt: 2600, courier: 'TCS',      disp: '01 May', exp: '04 May', days: 10 },
  { id: 'ORD-1027', cust: 'Hira Malik',     amt: 9000, courier: 'M&P',      disp: '30 Apr', exp: '03 May', days: 11 },
  { id: 'ORD-1024', cust: 'Fareeha Sana',   amt: 3400, courier: 'TCS',      disp: '29 Apr', exp: '02 May', days: 12 },
  { id: 'ORD-1021', cust: 'Kiran Baig',     amt: 4800, courier: 'Leopards', disp: '28 Apr', exp: '01 May', days: 13 },
];

export const SUPPLIER_PAYMENTS: SupplierPayment[] = [
  { name: 'Al-Karam Textile', total: '₨8,40,000', paid: '₨7,95,000', out: '₨45,000', last: '02 May', due: '15 May', status: 'Active'  },
  { name: 'Nishat Textiles',  total: '₨5,20,000', paid: '₨4,40,000', out: '₨80,000', last: '28 Apr', due: '12 May', status: 'Overdue' },
  { name: 'Gul Ahmed',        total: '₨4,10,000', paid: '₨4,10,000', out: '₨0',      last: '06 May', due: '—',      status: 'Cleared' },
  { name: 'Bonanza Satrangi', total: '₨2,80,000', paid: '₨2,58,000', out: '₨22,000', last: '01 May', due: '20 May', status: 'Active'  },
  { name: 'Orient Textiles',  total: '₨1,90,000', paid: '₨1,90,000', out: '₨0',      last: '25 Apr', due: '—',      status: 'Cleared' },
];

export const STAFF_DATA: StaffMember[] = [
  { name: 'Admin Khan',    role: 'Administrator',     avatar: 'AK', color: '#FF6A00', tasks: 52, done: 51, orders: 0,   errors: 0,  score: 98  },
  { name: 'Sara Khan',     role: 'Ops Manager',       avatar: 'SK', color: '#8B5CF6', tasks: 44, done: 43, orders: 124, errors: 2,  score: 97  },
  { name: 'Bilal Raza',    role: 'Inventory Manager', avatar: 'BR', color: '#2563EB', tasks: 38, done: 35, orders: 0,   errors: 3,  score: 92  },
  { name: 'Fatima Noor',   role: 'Accounts',          avatar: 'FN', color: '#059669', tasks: 29, done: 27, orders: 0,   errors: 1,  score: 93  },
  { name: 'Omar Farooq',   role: 'Rider',             avatar: 'OF', color: '#16A34A', tasks: 22, done: 22, orders: 112, errors: 2,  score: 100 },
  { name: 'Amna Siddiqui', role: 'Sales Operator',    avatar: 'AS', color: '#EC4899', tasks: 61, done: 54, orders: 310, errors: 8,  score: 88  },
  { name: 'Tariq Mehmood', role: 'Sales Operator',    avatar: 'TM', color: '#0891B2', tasks: 58, done: 49, orders: 278, errors: 11, score: 84  },
  { name: 'Hassan Ali',    role: 'Courier Handler',   avatar: 'HA', color: '#7C3AED', tasks: 33, done: 28, orders: 89,  errors: 4,  score: 85  },
];

export const DEPT_TASKS: DeptTask[] = [
  { name: 'Sales',      assigned: 159, done: 137, color: '#EC4899' },
  { name: 'Operations', assigned: 44,  done: 43,  color: '#8B5CF6' },
  { name: 'Inventory',  assigned: 69,  done: 61,  color: '#2563EB' },
  { name: 'Logistics',  assigned: 55,  done: 50,  color: '#16A34A' },
  { name: 'Finance',    assigned: 54,  done: 47,  color: '#059669' },
  { name: 'Management', assigned: 52,  done: 51,  color: '#FF6A00' },
];

export const EXPORT_HISTORY: ExportHistoryItem[] = [
  { time: '11 May 2026 14:30', type: 'Sales Data',      range: 'May 2026',      records: 312,  fmt: 'CSV',   by: 'Sara Khan',   status: 'Ready' },
  { time: '11 May 2026 10:00', type: 'Inventory Data',  range: 'Snapshot',      records: 248,  fmt: 'Excel', by: 'Bilal Raza',  status: 'Ready' },
  { time: '10 May 2026 17:15', type: 'Customer Data',   range: 'All Customers', records: 1842, fmt: 'CSV',   by: 'Admin Khan',  status: 'Ready' },
  { time: '09 May 2026 09:30', type: 'Financial Data',  range: 'Apr 2026',      records: 892,  fmt: 'Excel', by: 'Fatima Noor', status: 'Ready' },
  { time: '07 May 2026 16:45', type: 'Audit Logs',      range: 'Last 30 Days',  records: 4820, fmt: 'CSV',   by: 'Admin Khan',  status: 'Ready' },
  { time: '05 May 2026 11:00', type: 'Staff Report',    range: 'Apr 2026',      records: 14,   fmt: 'Excel', by: 'Sara Khan',   status: 'Ready' },
  { time: '01 May 2026 08:30', type: 'Sales Data',      range: 'Apr 2026',      records: 421,  fmt: 'CSV',   by: 'Admin Khan',  status: 'Ready' },
];

export const EXPORT_CARDS = [
  {
    type: 'Sales Data',     icon: 'fa-chart-line',  bgColor: '#FFF5EE', iconColor: '#FF6A00',
    subtitle: 'Orders, revenue, channels',
    description: 'Export all sales transactions including order details, payment methods, customers, and revenue breakdown.',
    filterLabel: 'Date Range',
    filterOptions: ['This Month', 'Last Month', 'Last 3 Months', 'Custom Range'],
  },
  {
    type: 'Inventory Data', icon: 'fa-warehouse',   bgColor: '#EFF6FF', iconColor: 'var(--blue)',
    subtitle: 'Stock levels, movements, alerts',
    description: 'Export current stock levels, product variants, stock movement history, and low stock alerts.',
    filterLabel: 'Data Type',
    filterOptions: ['Current Stock Snapshot', 'Stock Movement Log', 'Low Stock Only', 'Full Product Catalog'],
  },
  {
    type: 'Financial Data', icon: 'fa-coins',       bgColor: '#F0FDF4', iconColor: 'var(--green)',
    subtitle: 'COD, expenses, payments',
    description: 'Export COD collection records, expenses by category, supplier payments, and profit & loss summary.',
    filterLabel: 'Date Range',
    filterOptions: ['This Month', 'Last Month', 'Last 3 Months', 'Custom Range'],
  },
  {
    type: 'Customer Data',  icon: 'fa-users',       bgColor: '#FFFBEB', iconColor: 'var(--yellow)',
    subtitle: 'Profiles, order history, segments',
    description: 'Export customer profiles including contact info, order history, total spend, and segment classifications.',
    filterLabel: 'Segment Filter',
    filterOptions: ['All Customers', 'VIP Only', 'New (30 days)', 'Inactive (90d+)'],
  },
  {
    type: 'Staff Report',   icon: 'fa-id-badge',    bgColor: '#F5F3FF', iconColor: '#7C3AED',
    subtitle: 'Performance, tasks, activity',
    description: 'Export staff performance metrics, task completion rates, activity logs, and role-wise breakdowns.',
    filterLabel: 'Date Range',
    filterOptions: ['This Month', 'Last Month', 'Custom Range'],
  },
  {
    type: 'Audit Logs',     icon: 'fa-file-alt',    bgColor: '#F1F5F9', iconColor: '#475569',
    subtitle: 'System activity, logins, changes',
    description: 'Export a complete audit trail of all system actions, user logins, data modifications, and critical events.',
    filterLabel: 'Date Range',
    filterOptions: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'],
  },
];