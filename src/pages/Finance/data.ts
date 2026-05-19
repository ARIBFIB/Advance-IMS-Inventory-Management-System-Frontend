import type {
  CODOrder, CODLog, PrepaidOrder, Expense,
  ExpenseCategory, Supplier, SupplierPayment,
  MonthlyData, RecentReport, Integration,
} from './types';

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

export const COD_DATA: CODOrder[] = [
  { order: 'ORD-1045', customer: 'Amna Bibi',      rider: 'Usman Ahmed',    amount: 4200, delivered: '11 May, 09:22', codStatus: 'Collected',  submission: 'Submitted' },
  { order: 'ORD-1043', customer: 'Rabia Ahmed',     rider: 'Bilal Raza',     amount: 6800, delivered: '11 May, 09:48', codStatus: 'Collected',  submission: 'Submitted' },
  { order: 'ORD-1040', customer: 'Nadia Malik',     rider: 'Asad Khan',      amount: 9200, delivered: '11 May, 10:05', codStatus: 'Collected',  submission: 'Pending'   },
  { order: 'ORD-1039', customer: 'Hira Baig',       rider: 'Hamza Iqbal',    amount: 3500, delivered: '11 May, 10:30', codStatus: 'Collected',  submission: 'Pending'   },
  { order: 'ORD-1052', customer: 'Sadia Hussain',   rider: 'Usman Ahmed',    amount: 5700, delivered: '11 May, 11:00', codStatus: 'In Transit', submission: '—'         },
  { order: 'ORD-1053', customer: 'Bushra Nawaz',    rider: 'Bilal Raza',     amount: 2200, delivered: '11 May, 11:30', codStatus: 'In Transit', submission: '—'         },
  { order: 'ORD-1035', customer: 'Sara Khan',       rider: 'Asad Khan',      amount: 8100, delivered: '10 May, 15:00', codStatus: 'Collected',  submission: 'Submitted' },
  { order: 'ORD-1028', customer: 'Zara Sheikh',     rider: 'Faisal Mehmood', amount: 3900, delivered: '10 May, 14:30', codStatus: 'Collected',  submission: 'Pending'   },
  { order: 'ORD-1020', customer: 'Farah Naz',       rider: 'Tariq Saleem',   amount: 7200, delivered: '10 May, 13:00', codStatus: 'Collected',  submission: 'Submitted' },
  { order: 'ORD-1017', customer: 'Lubna Tanvir',    rider: 'Usman Ahmed',    amount: 2800, delivered: '09 May, 16:00', codStatus: 'Collected',  submission: 'Submitted' },
];

export const COD_LOG: CODLog[] = [
  { date: '11 May 2026', rider: 'Usman Ahmed',    orders: 6, amount: 28200, time: '18:30', received: 'Accounts Khan', status: 'Verified' },
  { date: '11 May 2026', rider: 'Bilal Raza',     orders: 5, amount: 22400, time: '18:45', received: 'Accounts Khan', status: 'Verified' },
  { date: '10 May 2026', rider: 'Asad Khan',      orders: 7, amount: 34100, time: '18:10', received: 'Accounts Khan', status: 'Verified' },
  { date: '10 May 2026', rider: 'Hamza Iqbal',    orders: 4, amount: 17600, time: '19:00', received: 'Accounts Khan', status: 'Verified' },
  { date: '09 May 2026', rider: 'Faisal Mehmood', orders: 5, amount: 19800, time: '18:30', received: 'Admin',         status: 'Verified' },
  { date: '09 May 2026', rider: 'Tariq Saleem',   orders: 3, amount: 12600, time: '19:15', received: 'Accounts Khan', status: 'Pending'  },
];

export const PREPAID_DATA: PrepaidOrder[] = [
  { order: 'ORD-1044', customer: 'Maira Usman',  amount: 8400, channel: 'Shopify',  method: 'Credit Card',   ref: 'TXN-8842XX', date: '11 May, 08:10', status: 'Verified'             },
  { order: 'ORD-1042', customer: 'Fatima Zara',  amount: 4200, channel: 'WhatsApp', method: 'JazzCash',      ref: 'JZ-221098',  date: '11 May, 09:00', status: 'Verified'             },
  { order: 'ORD-1041', customer: 'Ayesha Tariq', amount: 6100, channel: 'Shopify',  method: 'Credit Card',   ref: 'TXN-9921YY', date: '11 May, 09:30', status: 'Verified'             },
  { order: 'ORD-1038', customer: 'Tania Sid',    amount: 3800, channel: 'Manual',   method: 'Bank Transfer', ref: 'HBL-00482',  date: '10 May, 14:00', status: 'Pending Verification' },
  { order: 'ORD-1036', customer: 'Mariam Khan',  amount: 2200, channel: 'WhatsApp', method: 'EasyPaisa',     ref: 'EP-553421',  date: '10 May, 16:00', status: 'Verified'             },
  { order: 'ORD-1033', customer: 'Iram Sheikh',  amount: 5500, channel: 'Shopify',  method: 'Credit Card',   ref: 'TXN-8831ZZ', date: '09 May, 11:00', status: 'Verified'             },
];

export const EXPENSES: Expense[] = [
  { date: '11 May 2026', desc: 'Petrol — Rider Fleet',           category: 'Logistics',  amount: 4800,  method: 'Cash',          by: 'Accounts',       ref: '—'          },
  { date: '11 May 2026', desc: 'Packaging Bags & Tissue',        category: 'Operations', amount: 2200,  method: 'Cash',          by: 'Operations Mgr', ref: 'INV-0221'   },
  { date: '11 May 2026', desc: 'Facebook Ads — Summer Campaign', category: 'Marketing',  amount: 3500,  method: 'Bank Transfer', by: 'Admin',          ref: 'FB-ADS-011' },
  { date: '10 May 2026', desc: 'Electricity Bill — Warehouse',   category: 'Utilities',  amount: 6200,  method: 'Bank Transfer', by: 'Accounts',       ref: 'LESCO-0581' },
  { date: '10 May 2026', desc: 'Rider Salaries — Week 18',       category: 'Salaries',   amount: 12000, method: 'JazzCash',      by: 'Admin',          ref: 'PAY-W18'    },
  { date: '09 May 2026', desc: 'Bubble Wrap & Foam Sheets',      category: 'Operations', amount: 1800,  method: 'Cash',          by: 'Inventory Mgr',  ref: '—'          },
  { date: '09 May 2026', desc: 'Google Ads — Brand Keywords',    category: 'Marketing',  amount: 5000,  method: 'Bank Transfer', by: 'Admin',          ref: 'GAD-20526'  },
  { date: '08 May 2026', desc: 'Office Supplies & Stationery',   category: 'Operations', amount: 900,   method: 'Cash',          by: 'Operations Mgr', ref: '—'          },
  { date: '08 May 2026', desc: 'Courier Services — External',    category: 'Logistics',  amount: 7200,  method: 'Bank Transfer', by: 'Accounts',       ref: 'TCS-22104'  },
  { date: '07 May 2026', desc: 'Warehouse Rack Repair',          category: 'Operations', amount: 3500,  method: 'Cash',          by: 'Admin',          ref: '—'          },
];

export const CATEGORIES: ExpenseCategory[] = [
  { name: 'Logistics',  count: 12, amount: 38400, active: true, color: '#FF6A00' },
  { name: 'Operations', count: 18, amount: 44800, active: true, color: '#2563EB' },
  { name: 'Marketing',  count: 6,  amount: 22000, active: true, color: '#7C3AED' },
  { name: 'Salaries',   count: 4,  amount: 12000, active: true, color: '#16A34A' },
  { name: 'Utilities',  count: 3,  amount: 6200,  active: true, color: '#D97706' },
  { name: 'Other',      count: 5,  amount: 4800,  active: true, color: '#9CA3AF' },
];

export const SUPPLIERS: Supplier[] = [
  { name: 'Al-Karam Textile', purchased: 280000, paid: 238000, balance: 42000, lastPurchase: '28 Apr 2026', lastPayment: '01 Apr 2026', status: 'Overdue' },
  { name: 'Gul Ahmed',        purchased: 195000, paid: 181000, balance: 14000, lastPurchase: '05 May 2026', lastPayment: '30 Apr 2026', status: 'Pending' },
  { name: 'Nishat Textiles',  purchased: 340000, paid: 310000, balance: 30000, lastPurchase: '02 May 2026', lastPayment: '25 Apr 2026', status: 'Pending' },
  { name: 'Bonanza Satrangi', purchased: 128000, paid: 128000, balance: 0,     lastPurchase: '20 Apr 2026', lastPayment: '08 May 2026', status: 'Paid'    },
  { name: 'Junaid Jamshed',   purchased: 88000,  paid: 88000,  balance: 0,     lastPurchase: '15 Apr 2026', lastPayment: '01 May 2026', status: 'Paid'    },
];

export const SUPPLIER_PAYMENTS: SupplierPayment[] = [
  { date: '08 May 2026', supplier: 'Bonanza Satrangi', amount: 28000, method: 'Bank Transfer', ref: 'HBL-448821', by: 'Accounts' },
  { date: '01 May 2026', supplier: 'Junaid Jamshed',   amount: 44000, method: 'Bank Transfer', ref: 'UBL-221093', by: 'Accounts' },
  { date: '25 Apr 2026', supplier: 'Nishat Textiles',  amount: 52000, method: 'Bank Transfer', ref: 'HBL-339901', by: 'Admin'    },
  { date: '08 Apr 2026', supplier: 'Gul Ahmed',        amount: 39000, method: 'Cheque',        ref: 'CHQ-00234',  by: 'Accounts' },
  { date: '01 Apr 2026', supplier: 'Al-Karam Textile', amount: 64000, method: 'Bank Transfer', ref: 'MCB-009812', by: 'Admin'    },
];

export const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jan 2026', revenue: 388000, cod: 244000, prepaid: 144000, expenses: 98000,  supPaid: 88000,  profit: 202000 },
  { month: 'Feb 2026', revenue: 412000, cod: 258000, prepaid: 154000, expenses: 104000, supPaid: 96000,  profit: 212000 },
  { month: 'Mar 2026', revenue: 448000, cod: 280000, prepaid: 168000, expenses: 112000, supPaid: 108000, profit: 228000 },
  { month: 'Apr 2026', revenue: 486000, cod: 302000, prepaid: 184000, expenses: 118000, supPaid: 124000, profit: 244000 },
  { month: 'May 2026', revenue: 512400, cod: 312400, prepaid: 184600, expenses: 128200, supPaid: 124000, profit: 260200 },
];

export const CHART_DAYS    = ['5 May', '6 May', '7 May', '8 May', '9 May', '10 May', '11 May'];
export const CHART_REVENUE  = [48000, 52000, 45000, 61000, 58000, 74000, 68400];
export const CHART_EXPENSES = [11200,  9800,  8400, 14200, 12600, 16800,  8240];

export const RECENT_REPORTS: RecentReport[] = [
  { name: 'Daily Summary — 10 May 2026',    type: 'Daily',    date: '10 May 2026', format: 'Excel', size: '28 KB' },
  { name: 'Weekly COD Report — Week 19',    type: 'COD',      date: '09 May 2026', format: 'Excel', size: '44 KB' },
  { name: 'Monthly Expenses — April 2026',  type: 'Expenses', date: '01 May 2026', format: 'PDF',   size: '18 KB' },
  { name: 'Supplier Payments — April 2026', type: 'Supplier', date: '01 May 2026', format: 'CSV',   size: '12 KB' },
];

export const INTEGRATIONS: Integration[] = [
  { name: 'Paymob',                desc: 'Accept online card payments. Automatically mark orders as prepaid on successful payment confirmation.',                             logoText: 'Paymob',    status: 'Not Connected', statusColor: 'yellow' },
  { name: 'JazzCash Business',     desc: 'Receive payments via JazzCash wallet. Auto-verify prepaid orders and log COD rider payouts.',                                       logoText: 'JazzCash',  logoBg: '#AA1F27', status: 'Not Connected', statusColor: 'yellow' },
  { name: 'EasyPaisa Business',    desc: 'Accept and verify EasyPaisa payments. Log digital COD submissions from riders automatically.',                                      logoText: 'EasyPaisa', logoBg: '#02a550', status: 'Not Connected', statusColor: 'yellow' },
  { name: 'Shopify',               desc: 'Sync Shopify order payments automatically. Prepaid Shopify orders appear verified instantly.',                                      logoText: 'SHOPIFY',   status: 'Not Connected', statusColor: 'yellow' },
  { name: 'QuickBooks',            desc: 'Export expenses, supplier payments, and revenue data to QuickBooks for full accounting integration.',                                logoText: 'QB',        status: 'Optional',      statusColor: 'orange' },
  { name: 'Microsoft Excel Export',desc: 'Export any financial dataset to formatted Excel sheets. Available for COD logs, expense reports, and P&L summaries.',              logoText: 'XLS',       logoBg: '#0078D4', status: 'Available',     statusColor: 'green'  },
  { name: 'Leopards Courier',      desc: 'Auto-import COD remittance data from Leopards courier portal. Match courier COD to order records for reconciliation.',             logoText: 'LCS',       status: 'Not Connected', statusColor: 'yellow' },
  { name: 'TCS Courier',           desc: 'Import TCS COD remittance reports. Auto-reconcile COD collected by TCS against pending order balances.',                           logoText: 'TCS',       status: 'Not Connected', statusColor: 'yellow' },
];