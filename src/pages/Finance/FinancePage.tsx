import React, { useState, useCallback } from "react";
import "./FinancePage.css";
import TopLoadingBar from "../../components/ui/TopLoadingBar";
import { useTabLoading } from "../../hooks/useTabLoading";

import type { NavPanel, OverlayState } from "./types";

import OverviewPanel from "./OverviewPanel";
import CODPanel from "./CODPanel";
import CODLogPanel from "./CODLogPanel";
import PrepaidPanel from "./PrepaidPanel";
import ExpensesPanel from "./ExpensesPanel";
import LogExpensePanel from "./LogExpensePanel";
import CategoriesPanel from "./CategoriesPanel";
import SuppliersPanel from "./SuppliersPanel";
import SupplierPaymentsPanel from "./SupplierPaymentsPanel";
import RecordPaymentPanel from "./RecordPaymentPanel";
import ReportsPanel from "./ReportsPanel";
import PLPanel from "./PLPanel";
import IntegrationsPanel from "./IntegrationsPanel";
import SettingsPanel from "./SettingsPanel";

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const FinancePage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<NavPanel>("overview");
  const { isLoading, loadingProgress, switchTab } = useTabLoading(
    setActivePanel,
    activePanel,
  );

  const [overlay, setOverlay] = useState<OverlayState>({
    open: false,
    title: "",
    content: null,
  });

  const openOverlay = useCallback((title: string, content: React.ReactNode) => {
    setOverlay({ open: true, title, content });
  }, []);

  const closeOverlay = () => setOverlay((v) => ({ ...v, open: false }));

  type NavEntry = {
    panel: NavPanel;
    icon: string;
    label: string;
    badge?: number | string;
    badgeColor?: string;
  };
  type NavSection = { heading: string; items: NavEntry[] };

  const navSections: NavSection[] = [
    {
      heading: "Overview",
      items: [{ panel: "overview", icon: "fa-gauge", label: "Overview" }],
    },
    {
      heading: "COD",
      items: [
        {
          panel: "cod",
          icon: "fa-money-bills",
          label: "COD Tracking",
          badge: 14,
        },
        { panel: "cod-log", icon: "fa-clipboard-check", label: "COD Log" },
        { panel: "prepaid", icon: "fa-credit-card", label: "Prepaid Orders" },
      ],
    },
    {
      heading: "Expenses",
      items: [
        { panel: "expenses", icon: "fa-receipt", label: "All Expenses" },
        { panel: "exp-add", icon: "fa-circle-plus", label: "Log Expense" },
        { panel: "exp-categories", icon: "fa-tags", label: "Categories" },
      ],
    },
    {
      heading: "Suppliers",
      items: [
        {
          panel: "suppliers",
          icon: "fa-truck-ramp-box",
          label: "Supplier Balances",
        },
        { panel: "sup-payments", icon: "fa-handshake", label: "Payments Made" },
        { panel: "sup-add", icon: "fa-circle-plus", label: "Record Payment" },
      ],
    },
    {
      heading: "Reports",
      items: [
        {
          panel: "reports",
          icon: "fa-file-invoice-dollar",
          label: "Financial Reports",
        },
        { panel: "pl", icon: "fa-chart-line", label: "P&L Summary" },
      ],
    },
    {
      heading: "Integrations",
      items: [
        { panel: "integrations", icon: "fa-plug", label: "Integrations" },
      ],
    },
    {
      heading: "Settings",
      items: [{ panel: "settings", icon: "fa-gear", label: "Settings" }],
    },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case "overview":
        return (
          <OverviewPanel onNav={setActivePanel} onOpenOverlay={openOverlay} />
        );
      case "cod":
        return <CODPanel onOpenOverlay={openOverlay} />;
      case "cod-log":
        return <CODLogPanel />;
      case "prepaid":
        return <PrepaidPanel />;
      case "expenses":
        return (
          <ExpensesPanel onNav={setActivePanel} onOpenOverlay={openOverlay} />
        );
      case "exp-add":
        return <LogExpensePanel onNav={setActivePanel} />;
      case "exp-categories":
        return <CategoriesPanel />;
      case "suppliers":
        return (
          <SuppliersPanel onNav={setActivePanel} onOpenOverlay={openOverlay} />
        );
      case "sup-payments":
        return <SupplierPaymentsPanel />;
      case "sup-add":
        return <RecordPaymentPanel onNav={setActivePanel} />;
      case "reports":
        return <ReportsPanel />;
      case "pl":
        return <PLPanel />;
      case "integrations":
        return <IntegrationsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div id="page-finance">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      <div className="page-hero">
        <div className="page-hero-title">Financial Management</div>
        <div className="page-hero-sub">
          Track COD collections, log expenses, manage supplier balances, and
          generate financial reports.
        </div>
      </div>

      <div className="finance-layout">
        {/* Vertical Nav */}
        <div className="vnav">
          {navSections.map((section) => (
            <React.Fragment key={section.heading}>
              <div className="vnav-section-label">{section.heading}</div>
              {section.items.map((item) => (
                <div
                  key={item.panel}
                  className={`vnav-item ${activePanel === item.panel ? "active" : ""}`}
                  onClick={() => switchTab(item.panel)}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  {item.label}
                  {item.badge !== undefined && (
                    <span className={`vnav-badge ${item.badgeColor || ""}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
              <div className="vnav-divider" />
            </React.Fragment>
          ))}
        </div>

        {/* Content Panels */}
        <div className="finance-content">{renderPanel()}</div>
      </div>

      {/* Overlay */}
      <div
        className={`finance-backdrop ${overlay.open ? "open" : ""}`}
        onClick={closeOverlay}
      />
      <div className={`finance-overlay ${overlay.open ? "open" : ""}`}>
        <div className="overlay-header">
          <div className="overlay-title">{overlay.title}</div>
          <button className="close-btn" onClick={closeOverlay}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="overlay-body">{overlay.content}</div>
      </div>
    </div>
  );
};

export default FinancePage;

// import React, { useState, useCallback } from 'react';
// import './FinancePage.css';
// import TopLoadingBar from '../../components/ui/TopLoadingBar';
// import { useTabLoading } from '../../hooks/useTabLoading';

// // ═══════════════════════════════════════════════════════════
// // TYPES
// // ═══════════════════════════════════════════════════════════

// type NavPanel =
//   | 'overview' | 'cod' | 'cod-log' | 'prepaid'
//   | 'expenses' | 'exp-add' | 'exp-categories'
//   | 'suppliers' | 'sup-payments' | 'sup-add'
//   | 'reports' | 'pl'
//   | 'integrations' | 'settings';

// interface CODOrder {
//   order: string; customer: string; rider: string; amount: number;
//   delivered: string; codStatus: string; submission: string;
// }
// interface CODLog {
//   date: string; rider: string; orders: number; amount: number;
//   time: string; received: string; status: string;
// }
// interface PrepaidOrder {
//   order: string; customer: string; amount: number; channel: string;
//   method: string; ref: string; date: string; status: string;
// }
// interface Expense {
//   date: string; desc: string; category: string; amount: number;
//   method: string; by: string; ref: string;
// }
// interface ExpenseCategory {
//   name: string; count: number; amount: number; active: boolean; color: string;
// }
// interface Supplier {
//   name: string; purchased: number; paid: number; balance: number;
//   lastPurchase: string; lastPayment: string; status: string;
// }
// interface SupplierPayment {
//   date: string; supplier: string; amount: number; method: string;
//   ref: string; by: string;
// }
// interface MonthlyData {
//   month: string; revenue: number; cod: number; prepaid: number;
//   expenses: number; supPaid: number; profit: number;
// }
// interface RecentReport {
//   name: string; type: string; date: string; format: string; size: string;
// }
// interface Integration {
//   name: string; desc: string; logoText: string; logoBg?: string; status: string; statusColor: string;
// }
// interface OverlayState { open: boolean; title: string; content: React.ReactNode; }

// // ═══════════════════════════════════════════════════════════
// // STATIC DATA
// // ═══════════════════════════════════════════════════════════

// const COD_DATA: CODOrder[] = [
//   { order: 'ORD-1045', customer: 'Amna Bibi',      rider: 'Usman Ahmed',   amount: 4200, delivered: '11 May, 09:22', codStatus: 'Collected',  submission: 'Submitted' },
//   { order: 'ORD-1043', customer: 'Rabia Ahmed',     rider: 'Bilal Raza',    amount: 6800, delivered: '11 May, 09:48', codStatus: 'Collected',  submission: 'Submitted' },
//   { order: 'ORD-1040', customer: 'Nadia Malik',     rider: 'Asad Khan',     amount: 9200, delivered: '11 May, 10:05', codStatus: 'Collected',  submission: 'Pending'   },
//   { order: 'ORD-1039', customer: 'Hira Baig',       rider: 'Hamza Iqbal',   amount: 3500, delivered: '11 May, 10:30', codStatus: 'Collected',  submission: 'Pending'   },
//   { order: 'ORD-1052', customer: 'Sadia Hussain',   rider: 'Usman Ahmed',   amount: 5700, delivered: '11 May, 11:00', codStatus: 'In Transit', submission: '—'         },
//   { order: 'ORD-1053', customer: 'Bushra Nawaz',    rider: 'Bilal Raza',    amount: 2200, delivered: '11 May, 11:30', codStatus: 'In Transit', submission: '—'         },
//   { order: 'ORD-1035', customer: 'Sara Khan',       rider: 'Asad Khan',     amount: 8100, delivered: '10 May, 15:00', codStatus: 'Collected',  submission: 'Submitted' },
//   { order: 'ORD-1028', customer: 'Zara Sheikh',     rider: 'Faisal Mehmood',amount: 3900, delivered: '10 May, 14:30', codStatus: 'Collected',  submission: 'Pending'   },
//   { order: 'ORD-1020', customer: 'Farah Naz',       rider: 'Tariq Saleem',  amount: 7200, delivered: '10 May, 13:00', codStatus: 'Collected',  submission: 'Submitted' },
//   { order: 'ORD-1017', customer: 'Lubna Tanvir',    rider: 'Usman Ahmed',   amount: 2800, delivered: '09 May, 16:00', codStatus: 'Collected',  submission: 'Submitted' },
// ];

// const COD_LOG: CODLog[] = [
//   { date: '11 May 2026', rider: 'Usman Ahmed',   orders: 6, amount: 28200, time: '18:30', received: 'Accounts Khan', status: 'Verified' },
//   { date: '11 May 2026', rider: 'Bilal Raza',    orders: 5, amount: 22400, time: '18:45', received: 'Accounts Khan', status: 'Verified' },
//   { date: '10 May 2026', rider: 'Asad Khan',     orders: 7, amount: 34100, time: '18:10', received: 'Accounts Khan', status: 'Verified' },
//   { date: '10 May 2026', rider: 'Hamza Iqbal',   orders: 4, amount: 17600, time: '19:00', received: 'Accounts Khan', status: 'Verified' },
//   { date: '09 May 2026', rider: 'Faisal Mehmood',orders: 5, amount: 19800, time: '18:30', received: 'Admin',         status: 'Verified' },
//   { date: '09 May 2026', rider: 'Tariq Saleem',  orders: 3, amount: 12600, time: '19:15', received: 'Accounts Khan', status: 'Pending'  },
// ];

// const PREPAID_DATA: PrepaidOrder[] = [
//   { order: 'ORD-1044', customer: 'Maira Usman',  amount: 8400, channel: 'Shopify',  method: 'Credit Card',  ref: 'TXN-8842XX', date: '11 May, 08:10', status: 'Verified'             },
//   { order: 'ORD-1042', customer: 'Fatima Zara',  amount: 4200, channel: 'WhatsApp', method: 'JazzCash',     ref: 'JZ-221098',  date: '11 May, 09:00', status: 'Verified'             },
//   { order: 'ORD-1041', customer: 'Ayesha Tariq', amount: 6100, channel: 'Shopify',  method: 'Credit Card',  ref: 'TXN-9921YY', date: '11 May, 09:30', status: 'Verified'             },
//   { order: 'ORD-1038', customer: 'Tania Sid',    amount: 3800, channel: 'Manual',   method: 'Bank Transfer', ref: 'HBL-00482',  date: '10 May, 14:00', status: 'Pending Verification' },
//   { order: 'ORD-1036', customer: 'Mariam Khan',  amount: 2200, channel: 'WhatsApp', method: 'EasyPaisa',    ref: 'EP-553421',  date: '10 May, 16:00', status: 'Verified'             },
//   { order: 'ORD-1033', customer: 'Iram Sheikh',  amount: 5500, channel: 'Shopify',  method: 'Credit Card',  ref: 'TXN-8831ZZ', date: '09 May, 11:00', status: 'Verified'             },
// ];

// const EXPENSES: Expense[] = [
//   { date: '11 May 2026', desc: 'Petrol — Rider Fleet',          category: 'Logistics',   amount: 4800,  method: 'Cash',          by: 'Accounts',      ref: '—'          },
//   { date: '11 May 2026', desc: 'Packaging Bags & Tissue',       category: 'Operations',  amount: 2200,  method: 'Cash',          by: 'Operations Mgr',ref: 'INV-0221'   },
//   { date: '11 May 2026', desc: 'Facebook Ads — Summer Campaign', category: 'Marketing',   amount: 3500,  method: 'Bank Transfer', by: 'Admin',         ref: 'FB-ADS-011' },
//   { date: '10 May 2026', desc: 'Electricity Bill — Warehouse',  category: 'Utilities',   amount: 6200,  method: 'Bank Transfer', by: 'Accounts',      ref: 'LESCO-0581' },
//   { date: '10 May 2026', desc: 'Rider Salaries — Week 18',      category: 'Salaries',    amount: 12000, method: 'JazzCash',      by: 'Admin',         ref: 'PAY-W18'    },
//   { date: '09 May 2026', desc: 'Bubble Wrap & Foam Sheets',     category: 'Operations',  amount: 1800,  method: 'Cash',          by: 'Inventory Mgr', ref: '—'          },
//   { date: '09 May 2026', desc: 'Google Ads — Brand Keywords',   category: 'Marketing',   amount: 5000,  method: 'Bank Transfer', by: 'Admin',         ref: 'GAD-20526'  },
//   { date: '08 May 2026', desc: 'Office Supplies & Stationery',  category: 'Operations',  amount: 900,   method: 'Cash',          by: 'Operations Mgr',ref: '—'          },
//   { date: '08 May 2026', desc: 'Courier Services — External',   category: 'Logistics',   amount: 7200,  method: 'Bank Transfer', by: 'Accounts',      ref: 'TCS-22104'  },
//   { date: '07 May 2026', desc: 'Warehouse Rack Repair',         category: 'Operations',  amount: 3500,  method: 'Cash',          by: 'Admin',         ref: '—'          },
// ];

// const CATEGORIES: ExpenseCategory[] = [
//   { name: 'Logistics',  count: 12, amount: 38400, active: true, color: '#FF6A00' },
//   { name: 'Operations', count: 18, amount: 44800, active: true, color: '#2563EB' },
//   { name: 'Marketing',  count: 6,  amount: 22000, active: true, color: '#7C3AED' },
//   { name: 'Salaries',   count: 4,  amount: 12000, active: true, color: '#16A34A' },
//   { name: 'Utilities',  count: 3,  amount: 6200,  active: true, color: '#D97706' },
//   { name: 'Other',      count: 5,  amount: 4800,  active: true, color: '#9CA3AF' },
// ];

// const SUPPLIERS: Supplier[] = [
//   { name: 'Al-Karam Textile', purchased: 280000, paid: 238000, balance: 42000, lastPurchase: '28 Apr 2026', lastPayment: '01 Apr 2026', status: 'Overdue' },
//   { name: 'Gul Ahmed',        purchased: 195000, paid: 181000, balance: 14000, lastPurchase: '05 May 2026', lastPayment: '30 Apr 2026', status: 'Pending' },
//   { name: 'Nishat Textiles',  purchased: 340000, paid: 310000, balance: 30000, lastPurchase: '02 May 2026', lastPayment: '25 Apr 2026', status: 'Pending' },
//   { name: 'Bonanza Satrangi', purchased: 128000, paid: 128000, balance: 0,     lastPurchase: '20 Apr 2026', lastPayment: '08 May 2026', status: 'Paid'    },
//   { name: 'Junaid Jamshed',   purchased: 88000,  paid: 88000,  balance: 0,     lastPurchase: '15 Apr 2026', lastPayment: '01 May 2026', status: 'Paid'    },
// ];

// const SUPPLIER_PAYMENTS: SupplierPayment[] = [
//   { date: '08 May 2026', supplier: 'Bonanza Satrangi', amount: 28000, method: 'Bank Transfer', ref: 'HBL-448821', by: 'Accounts' },
//   { date: '01 May 2026', supplier: 'Junaid Jamshed',   amount: 44000, method: 'Bank Transfer', ref: 'UBL-221093', by: 'Accounts' },
//   { date: '25 Apr 2026', supplier: 'Nishat Textiles',  amount: 52000, method: 'Bank Transfer', ref: 'HBL-339901', by: 'Admin'    },
//   { date: '08 Apr 2026', supplier: 'Gul Ahmed',        amount: 39000, method: 'Cheque',        ref: 'CHQ-00234',  by: 'Accounts' },
//   { date: '01 Apr 2026', supplier: 'Al-Karam Textile', amount: 64000, method: 'Bank Transfer', ref: 'MCB-009812', by: 'Admin'    },
// ];

// const MONTHLY_DATA: MonthlyData[] = [
//   { month: 'Jan 2026', revenue: 388000, cod: 244000, prepaid: 144000, expenses: 98000,  supPaid: 88000,  profit: 202000 },
//   { month: 'Feb 2026', revenue: 412000, cod: 258000, prepaid: 154000, expenses: 104000, supPaid: 96000,  profit: 212000 },
//   { month: 'Mar 2026', revenue: 448000, cod: 280000, prepaid: 168000, expenses: 112000, supPaid: 108000, profit: 228000 },
//   { month: 'Apr 2026', revenue: 486000, cod: 302000, prepaid: 184000, expenses: 118000, supPaid: 124000, profit: 244000 },
//   { month: 'May 2026', revenue: 512400, cod: 312400, prepaid: 184600, expenses: 128200, supPaid: 124000, profit: 260200 },
// ];

// const CHART_DAYS = ['5 May', '6 May', '7 May', '8 May', '9 May', '10 May', '11 May'];
// const CHART_REVENUE  = [48000, 52000, 45000, 61000, 58000, 74000, 68400];
// const CHART_EXPENSES = [11200,  9800,  8400, 14200, 12600, 16800,  8240];

// const RECENT_REPORTS: RecentReport[] = [
//   { name: 'Daily Summary — 10 May 2026',    type: 'Daily',    date: '10 May 2026', format: 'Excel', size: '28 KB' },
//   { name: 'Weekly COD Report — Week 19',    type: 'COD',      date: '09 May 2026', format: 'Excel', size: '44 KB' },
//   { name: 'Monthly Expenses — April 2026',  type: 'Expenses', date: '01 May 2026', format: 'PDF',   size: '18 KB' },
//   { name: 'Supplier Payments — April 2026', type: 'Supplier', date: '01 May 2026', format: 'CSV',   size: '12 KB' },
// ];

// const INTEGRATIONS: Integration[] = [
//   { name: 'Paymob',               desc: 'Accept online card payments. Automatically mark orders as prepaid on successful payment confirmation.',                              logoText: 'Paymob',    status: 'Not Connected', statusColor: 'yellow' },
//   { name: 'JazzCash Business',    desc: 'Receive payments via JazzCash wallet. Auto-verify prepaid orders and log COD rider payouts.',                                        logoText: 'JazzCash',  logoBg: '#AA1F27', status: 'Not Connected', statusColor: 'yellow' },
//   { name: 'EasyPaisa Business',   desc: 'Accept and verify EasyPaisa payments. Log digital COD submissions from riders automatically.',                                       logoText: 'EasyPaisa', logoBg: '#02a550', status: 'Not Connected', statusColor: 'yellow' },
//   { name: 'Shopify',              desc: 'Sync Shopify order payments automatically. Prepaid Shopify orders appear verified instantly.',                                       logoText: 'SHOPIFY',   status: 'Not Connected', statusColor: 'yellow' },
//   { name: 'QuickBooks',           desc: 'Export expenses, supplier payments, and revenue data to QuickBooks for full accounting integration.',                                 logoText: 'QB',        status: 'Optional',      statusColor: 'orange' },
//   { name: 'Microsoft Excel Export',desc: 'Export any financial dataset to formatted Excel sheets. Available for COD logs, expense reports, and P&L summaries.',               logoText: 'XLS',       logoBg: '#0078D4', status: 'Available',     statusColor: 'green'  },
//   { name: 'Leopards Courier',     desc: 'Auto-import COD remittance data from Leopards courier portal. Match courier COD to order records for reconciliation.',              logoText: 'LCS',       status: 'Not Connected', statusColor: 'yellow' },
//   { name: 'TCS Courier',          desc: 'Import TCS COD remittance reports. Auto-reconcile COD collected by TCS against pending order balances.',                            logoText: 'TCS',       status: 'Not Connected', statusColor: 'yellow' },
// ];

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// const fmt = (n: number) => '₨' + Number(n).toLocaleString();

// function badgeClass(s: string): string {
//   const m: Record<string, string> = {
//     'Collected': 'green', 'In Transit': 'yellow', 'Pending': 'yellow',
//     'Pending Submission': 'orange', 'Submitted': 'blue',
//     'Pending Verification': 'yellow', 'Verified': 'green',
//     'Overdue': 'red', 'Paid': 'green', 'Active': 'green', 'Inactive': 'gray',
//     'Available': 'green', 'Not Connected': 'yellow', 'Optional': 'orange',
//   };
//   return m[s] || 'gray';
// }

// // ═══════════════════════════════════════════════════════════
// // REUSABLE MICRO-COMPONENTS
// // ═══════════════════════════════════════════════════════════

// const Badge: React.FC<{ label: string }> = ({ label }) => (
//   <span className={`badge ${badgeClass(label)}`}>{label}</span>
// );

// const EmptyState: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
//   <div className="empty-state">
//     <i className={`fa-solid ${icon}`} />
//     <h4>{title}</h4>
//     <p>{desc}</p>
//   </div>
// );

// const ToggleSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => {
//   const [on, setOn] = useState(defaultChecked);
//   return (
//     <label className="toggle-switch">
//       <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
//       <span className="toggle-track" />
//     </label>
//   );
// };

// /* ── FPagination ── */
// interface FPagProps { current: number; total: number; totalItems: number; start: number; end: number; onChange: (p: number) => void; }
// const FPagination: React.FC<FPagProps> = ({ current, total, totalItems, start, end, onChange }) => {
//   const pages: (number | '…')[] = [];
//   if (total <= 7) { for (let p = 1; p <= total; p++) pages.push(p); }
//   else {
//     pages.push(1);
//     if (current > 3) pages.push('…');
//     for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
//     if (current < total - 2) pages.push('…');
//     pages.push(total);
//   }
//   return (
//     <div className="f-pagination">
//       <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
//         Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems}</strong>
//       </div>
//       <div className="f-pag-controls">
//         <button className="f-pag-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>‹</button>
//         {pages.map((p, i) => p === '…'
//           ? <button key={`d${i}`} className="f-pag-btn" style={{ pointerEvents: 'none' }}>…</button>
//           : <button key={p} className={`f-pag-btn ${p === current ? 'active' : ''}`} onClick={() => onChange(p as number)}>{p}</button>
//         )}
//         <button className="f-pag-btn" disabled={current === total || total === 0} onClick={() => onChange(current + 1)}>›</button>
//       </div>
//     </div>
//   );
// };

// /* ── InnerTabs ── */
// interface InnerTabsProps { tabs: { id: string; label: React.ReactNode }[]; active: string; onChange: (id: string) => void; }
// const InnerTabs: React.FC<InnerTabsProps> = ({ tabs, active, onChange }) => (
//   <div className="inner-tabs">
//     {tabs.map(t => (
//       <div key={t.id} className={`itab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
//         {t.label}
//       </div>
//     ))}
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: OVERVIEW
// // ═══════════════════════════════════════════════════════════

// const OverviewPanel: React.FC<{ onNav: (p: NavPanel) => void; onOpenOverlay: (title: string, content: React.ReactNode) => void; }> = ({ onNav, onOpenOverlay }) => {
//   const maxVal = Math.max(...CHART_REVENUE, ...CHART_EXPENSES);

//   return (
//     <>
//       <div className="panel-heading">Financial Overview</div>
//       <div className="panel-desc">Live snapshot of today's cash position — COD pending, expenses logged, supplier dues, and net cash flow.</div>

//       <div className="alert-strip warn">
//         <i className="fa-solid fa-triangle-exclamation" />
//         <div><strong>₨42,800</strong> in COD collected by riders but not yet submitted to accounts.</div>
//         <button className="f-btn" style={{ marginLeft: 'auto' }} onClick={() => onNav('cod')}>
//           <i className="fa-solid fa-eye" /> Review COD
//         </button>
//       </div>

//       <div className="balance-card">
//         <div className="balance-card-label">Net Cash Position — May 2026</div>
//         <div className="balance-card-amount">₨3,84,200</div>
//         <div className="balance-card-row">
//           <div className="balance-card-item"><div className="balance-card-item-label">Total Revenue</div><div className="balance-card-item-val">₨5,12,400</div></div>
//           <div className="balance-card-item"><div className="balance-card-item-label">Total Expenses</div><div className="balance-card-item-val">₨1,28,200</div></div>
//           <div className="balance-card-item"><div className="balance-card-item-label">Supplier Due</div><div className="balance-card-item-val">₨86,000</div></div>
//           <div className="balance-card-item"><div className="balance-card-item-label">COD Pending</div><div className="balance-card-item-val" style={{ color: '#FB923C' }}>₨42,800</div></div>
//         </div>
//       </div>

//       <div className="mini-stats">
//         <div className="mini-stat"><div className="ms-label">COD Collected (Today)</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨68,400</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +12% vs yesterday</div></div>
//         <div className="mini-stat"><div className="ms-label">COD Pending Submission</div><div className="ms-value" style={{ color: 'var(--accent)' }}>₨42,800</div><div className="ms-trend down"><i className="fa-solid fa-triangle-exclamation" /> 14 riders holding cash</div></div>
//         <div className="mini-stat"><div className="ms-label">Expenses (Today)</div><div className="ms-value" style={{ color: 'var(--red)' }}>₨8,240</div><div className="ms-trend"><i className="fa-solid fa-minus" /> Within budget</div></div>
//         <div className="mini-stat"><div className="ms-label">Supplier Balance Due</div><div className="ms-value" style={{ color: 'var(--yellow)' }}>₨86,000</div><div className="ms-trend down"><i className="fa-solid fa-arrow-trend-up" /> 3 suppliers pending</div></div>
//       </div>

//       <div className="detail-grid-3">
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-money-bills" style={{ color: 'var(--green)' }} /> COD Summary</div>
//             <button className="f-btn" onClick={() => onNav('cod')}>View All</button>
//           </div>
//           <div className="card-body" style={{ padding: '10px 14px' }}>
//             {COD_DATA.slice(0, 4).map(c => (
//               <div className="list-item" key={c.order} style={{ cursor: 'pointer' }}
//                 onClick={() => onOpenOverlay(`${c.order} — COD Detail`, <CODDetailContent c={c} />)}>
//                 <div className="list-content">
//                   <div className="list-title" style={{ fontSize: 10.5 }}>{c.order} · {c.customer}</div>
//                   <div className="list-meta">{c.rider}</div>
//                 </div>
//                 <div className="list-right">
//                   <div style={{ fontWeight: 700, fontSize: 11 }}>{fmt(c.amount)}</div>
//                   <Badge label={c.codStatus} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-receipt" style={{ color: 'var(--red)' }} /> Today's Expenses</div>
//             <button className="f-btn" onClick={() => onNav('exp-add')}><i className="fa-solid fa-plus" /> Log</button>
//           </div>
//           <div className="card-body" style={{ padding: '10px 14px' }}>
//             {EXPENSES.slice(0, 4).map((e, i) => (
//               <div className="list-item" key={i}>
//                 <div className="list-icon" style={{ background: 'var(--red-bg)' }}>
//                   <i className="fa-solid fa-receipt" style={{ fontSize: 10, color: 'var(--red)' }} />
//                 </div>
//                 <div className="list-content">
//                   <div className="list-title" style={{ fontSize: 10.5 }}>{e.desc}</div>
//                   <div className="list-meta">{e.category}</div>
//                 </div>
//                 <div className="list-right">
//                   <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--red)' }}>{fmt(e.amount)}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-truck-ramp-box" style={{ color: 'var(--yellow)' }} /> Supplier Dues</div>
//             <button className="f-btn" onClick={() => onNav('suppliers')}>View All</button>
//           </div>
//           <div className="card-body" style={{ padding: '10px 14px' }}>
//             {SUPPLIERS.filter(s => s.balance > 0).map(s => (
//               <div className="list-item" key={s.name}>
//                 <div className="list-icon" style={{ background: 'var(--yellow-bg)' }}>
//                   <i className="fa-solid fa-truck-ramp-box" style={{ fontSize: 10, color: 'var(--yellow)' }} />
//                 </div>
//                 <div className="list-content">
//                   <div className="list-title" style={{ fontSize: 10.5 }}>{s.name}</div>
//                   <div className="list-meta">Last paid: {s.lastPayment}</div>
//                 </div>
//                 <div className="list-right">
//                   <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--yellow)' }}>{fmt(s.balance)}</div>
//                   <Badge label={s.status} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Revenue vs Expenses Chart */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-chart-bar" /> Revenue vs Expenses — Last 7 Days</div>
//           <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
//         </div>
//         <div className="card-body">
//           <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80, padding: '0 2px' }}>
//             {CHART_DAYS.map((_, i) => (
//               <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
//                 <div style={{ width: '45%', background: 'var(--green)', borderRadius: '3px 3px 0 0', height: `${(CHART_REVENUE[i] / maxVal) * 100}%`, minHeight: 2 }} title={fmt(CHART_REVENUE[i])} />
//                 <div style={{ width: '45%', background: 'var(--red)', borderRadius: '3px 3px 0 0', height: `${(CHART_EXPENSES[i] / maxVal) * 100}%`, minHeight: 2 }} title={fmt(CHART_EXPENSES[i])} />
//               </div>
//             ))}
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--text-muted)' }}>
//             {CHART_DAYS.map(d => <span key={d}>{d}</span>)}
//           </div>
//           <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 10 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)' }} /> Revenue</div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--red)' }} /> Expenses</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // COD DETAIL OVERLAY CONTENT
// // ═══════════════════════════════════════════════════════════

// const CODDetailContent: React.FC<{ c: CODOrder }> = ({ c }) => (
//   <div>
//     <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
//       <Badge label={c.codStatus} />
//       <Badge label={c.submission === '—' ? 'Not Submitted' : c.submission} />
//     </div>
//     {[
//       ['Order ID', <code className="ref">{c.order}</code>],
//       ['Customer', c.customer], ['Rider', c.rider],
//       ['COD Amount', <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--green)' }}>{fmt(c.amount)}</span>],
//       ['Delivery Time', c.delivered],
//       ['COD Status', <Badge label={c.codStatus} />],
//       ['Submission', <Badge label={c.submission === '—' ? 'Pending' : c.submission} />],
//     ].map(([k, v], i) => (
//       <div className="detail-row" key={i}>
//         <div className="detail-key">{k}</div>
//         <div className="detail-val">{v}</div>
//       </div>
//     ))}
//     <hr />
//     <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
//       {c.codStatus === 'Collected' && c.submission === 'Pending' && (
//         <button className="f-btn primary"><i className="fa-solid fa-check" /> Mark Submitted</button>
//       )}
//       <button className="f-btn"><i className="fa-solid fa-file-invoice" /> View Order</button>
//     </div>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: COD TRACKING
// // ═══════════════════════════════════════════════════════════

// const CODPanel: React.FC<{ onOpenOverlay: (title: string, content: React.ReactNode) => void }> = ({ onOpenOverlay }) => {
//   const [innerTab, setInnerTab] = useState('all');
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 6;

//   const filtered = COD_DATA.filter(c => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return c.order.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q) || c.rider.toLowerCase().includes(q);
//   });

//   const total = filtered.length;
//   const start = (page - 1) * PER_PAGE + 1;
//   const end = Math.min(page * PER_PAGE, total);
//   const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
//   const pending = COD_DATA.filter(c => c.codStatus === 'In Transit' || c.submission === 'Pending');

//   return (
//     <>
//       <div className="panel-heading">COD Tracking</div>
//       <div className="panel-desc">Monitor cash-on-delivery collections per order and per rider. Submit collections to accounts and reconcile pending amounts.</div>

//       <div className="alert-strip warn">
//         <i className="fa-solid fa-coins" />
//         <div><strong>14 riders</strong> holding a combined <strong>₨42,800</strong> in uncollected COD cash — submit to accounts immediately.</div>
//         <button className="f-btn primary" style={{ marginLeft: 'auto', fontSize: 9.5 }}><i className="fa-solid fa-check-double" /> Bulk Submit</button>
//       </div>

//       <div className="mini-stats">
//         <div className="mini-stat"><div className="ms-label">Total COD Today</div><div className="ms-value">₨1,11,200</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> 48 orders</div></div>
//         <div className="mini-stat"><div className="ms-label">Collected</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨68,400</div><div className="ms-trend up"><i className="fa-solid fa-circle-check" /> 34 orders</div></div>
//         <div className="mini-stat"><div className="ms-label">Pending Collection</div><div className="ms-value" style={{ color: 'var(--accent)' }}>₨42,800</div><div className="ms-trend">14 orders in transit</div></div>
//         <div className="mini-stat"><div className="ms-label">Submitted to Accounts</div><div className="ms-value" style={{ color: 'var(--blue)' }}>₨61,200</div><div className="ms-trend up">28 orders reconciled</div></div>
//       </div>

//       <InnerTabs
//         tabs={[
//           { id: 'all', label: 'All Orders' },
//           { id: 'pending', label: <span>Pending <span style={{ background: 'var(--yellow-bg)', color: 'var(--yellow)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>{pending.length}</span></span> },
//           { id: 'collected', label: 'Collected' },
//           { id: 'submitted', label: 'Submitted' },
//         ]}
//         active={innerTab} onChange={id => { setInnerTab(id); setPage(1); }}
//       />

//       {innerTab === 'all' && (
//         <div className="card">
//           <div className="f-toolbar">
//             <div className="f-toolbar-left">
//               <div className="f-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order or rider..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
//               <button className="f-btn"><i className="fa-solid fa-calendar" /> Date</button>
//             </div>
//             <div className="f-toolbar-right">
//               <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
//               <button className="f-btn primary"><i className="fa-solid fa-check-double" /> Bulk Submit</button>
//             </div>
//           </div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr>
//                 <th><input type="checkbox" /></th>
//                 <th>Order ID</th><th>Customer</th><th>Rider</th>
//                 <th>Amount</th><th>Delivered At</th>
//                 <th>COD Status</th><th>Submission</th><th>Actions</th>
//               </tr></thead>
//               <tbody>
//                 {pageItems.map(c => (
//                   <tr key={c.order} onClick={() => onOpenOverlay(`${c.order} — COD Detail`, <CODDetailContent c={c} />)}>
//                     <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
//                     <td><code className="ref">{c.order}</code></td>
//                     <td>{c.customer}</td><td>{c.rider}</td>
//                     <td><strong>{fmt(c.amount)}</strong></td>
//                     <td style={{ fontSize: 10 }}>{c.delivered}</td>
//                     <td><Badge label={c.codStatus} /></td>
//                     <td><Badge label={c.submission === '—' ? 'Pending' : c.submission} /></td>
//                     <td onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 3 }}>
//                       {c.codStatus === 'Collected' && c.submission === 'Pending' && (
//                         <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Submit</button>
//                       )}
//                       <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <FPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
//         </div>
//       )}

//       {innerTab === 'pending' && (
//         <div className="card">
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th><input type="checkbox" /></th><th>Order ID</th><th>Customer</th><th>Rider</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {pending.map(c => (
//                   <tr key={c.order}>
//                     <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
//                     <td><code className="ref">{c.order}</code></td>
//                     <td>{c.customer}</td><td>{c.rider}</td>
//                     <td><strong>{fmt(c.amount)}</strong></td>
//                     <td><Badge label={c.codStatus} /></td>
//                     <td>
//                       {c.codStatus === 'Collected'
//                         ? <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Submit</button>
//                         : <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-phone" /> Contact Rider</button>
//                       }
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {innerTab === 'collected' && <div className="card"><div className="card-body"><EmptyState icon="fa-circle-check" title="34 Orders Collected" desc="COD cash received by riders, pending submission to accounts." /></div></div>}
//       {innerTab === 'submitted' && <div className="card"><div className="card-body"><EmptyState icon="fa-vault" title="28 Orders Reconciled" desc="COD fully submitted and matched to accounts." /></div></div>}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: COD LOG
// // ═══════════════════════════════════════════════════════════

// const CODLogPanel: React.FC = () => {
//   const [search, setSearch] = useState('');
//   const filtered = COD_LOG.filter(l => !search || l.rider.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <>
//       <div className="panel-heading">COD Collection Log</div>
//       <div className="panel-desc">Daily log of all COD cash submissions from riders to accounts. Verify amounts and mark as reconciled.</div>
//       <div className="card">
//         <div className="f-toolbar">
//           <div className="f-toolbar-left">
//             <div className="f-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
//             <button className="f-btn"><i className="fa-solid fa-calendar" /> Date Range</button>
//           </div>
//           <div className="f-toolbar-right"><button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//         </div>
//         <div className="tbl-wrap">
//           <table>
//             <thead><tr>
//               <th>Date</th><th>Rider</th><th>Orders</th>
//               <th>Amount (₨)</th><th>Submitted At</th><th>Received By</th><th>Status</th><th>Notes</th>
//             </tr></thead>
//             <tbody>
//               {filtered.map((l, i) => (
//                 <tr key={i}>
//                   <td>{l.date}</td>
//                   <td><strong>{l.rider}</strong></td>
//                   <td>{l.orders}</td>
//                   <td><strong style={{ color: 'var(--green)' }}>{fmt(l.amount)}</strong></td>
//                   <td>{l.time}</td>
//                   <td>{l.received}</td>
//                   <td><Badge label={l.status} /></td>
//                   <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>—</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: PREPAID ORDERS
// // ═══════════════════════════════════════════════════════════

// const PrepaidPanel: React.FC = () => {
//   const [search, setSearch] = useState('');
//   const filtered = PREPAID_DATA.filter(p => !search || p.order.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <>
//       <div className="panel-heading">Prepaid Orders</div>
//       <div className="panel-desc">Track online and bank-transfer prepaid order payments. Verify payment received before dispatching orders.</div>
//       <div className="mini-stats cols-3">
//         <div className="mini-stat"><div className="ms-label">Prepaid Revenue (MTD)</div><div className="ms-value" style={{ color: 'var(--blue)' }}>₨1,84,600</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +18% vs last month</div></div>
//         <div className="mini-stat"><div className="ms-label">Payment Verified</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨1,72,400</div><div className="ms-trend up"><i className="fa-solid fa-circle-check" /> 61 orders</div></div>
//         <div className="mini-stat"><div className="ms-label">Pending Verification</div><div className="ms-value" style={{ color: 'var(--yellow)' }}>₨12,200</div><div className="ms-trend">4 orders awaiting</div></div>
//       </div>
//       <div className="card">
//         <div className="f-toolbar">
//           <div className="f-toolbar-left">
//             <div className="f-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order..." value={search} onChange={e => setSearch(e.target.value)} /></div>
//             <button className="f-btn active">All</button>
//             <button className="f-btn">Pending Verification</button>
//           </div>
//           <div className="f-toolbar-right"><button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//         </div>
//         <div className="tbl-wrap">
//           <table>
//             <thead><tr>
//               <th>Order ID</th><th>Customer</th><th>Amount</th>
//               <th>Channel</th><th>Payment Method</th><th>Transaction Ref</th>
//               <th>Date</th><th>Status</th><th>Actions</th>
//             </tr></thead>
//             <tbody>
//               {filtered.map(p => (
//                 <tr key={p.order}>
//                   <td><code className="ref">{p.order}</code></td>
//                   <td>{p.customer}</td>
//                   <td><strong>{fmt(p.amount)}</strong></td>
//                   <td><span className="f-tag">{p.channel}</span></td>
//                   <td>{p.method}</td>
//                   <td><code className="ref">{p.ref}</code></td>
//                   <td style={{ fontSize: 10 }}>{p.date}</td>
//                   <td><Badge label={p.status} /></td>
//                   <td>
//                     {p.status === 'Pending Verification'
//                       ? <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Verify</button>
//                       : <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
//                     }
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: ALL EXPENSES
// // ═══════════════════════════════════════════════════════════

// const ExpensesPanel: React.FC<{ onNav: (p: NavPanel) => void; onOpenOverlay: (title: string, content: React.ReactNode) => void }> = ({ onNav, onOpenOverlay }) => {
//   const [search, setSearch] = useState('');
//   const [chip, setChip] = useState('All Categories');
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 6;

//   const chips = ['All Categories', 'Logistics', 'Operations', 'Marketing', 'Salaries', 'Utilities', 'Other'];
//   const filtered = EXPENSES.filter(e => {
//     if (chip !== 'All Categories' && e.category !== chip) return false;
//     if (!search) return true;
//     return e.desc.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
//   });

//   const total = filtered.length;
//   const start = (page - 1) * PER_PAGE + 1;
//   const end = Math.min(page * PER_PAGE, total);
//   const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   return (
//     <>
//       <div className="panel-heading">All Expenses</div>
//       <div className="panel-desc">Full record of all logged business expenses. Filter by category, date range, or amount.</div>

//       <div className="mini-stats">
//         <div className="mini-stat"><div className="ms-label">Total (This Month)</div><div className="ms-value" style={{ color: 'var(--red)' }}>₨1,28,200</div><div className="ms-trend down">+8% vs last month</div></div>
//         <div className="mini-stat"><div className="ms-label">Logistics</div><div className="ms-value">₨38,400</div><div className="ms-trend">30% of expenses</div></div>
//         <div className="mini-stat"><div className="ms-label">Operations</div><div className="ms-value">₨44,800</div><div className="ms-trend">35% of expenses</div></div>
//         <div className="mini-stat"><div className="ms-label">Marketing</div><div className="ms-value">₨22,000</div><div className="ms-trend">17% of expenses</div></div>
//       </div>

//       <div className="chip-group">
//         {chips.map(c => (
//           <div key={c} className={`chip ${chip === c ? 'active' : ''}`} onClick={() => { setChip(c); setPage(1); }}>
//             {c === 'All Categories' && <i className="fa-solid fa-list" />}
//             {c}
//           </div>
//         ))}
//       </div>

//       <div className="card">
//         <div className="f-toolbar">
//           <div className="f-toolbar-left">
//             <div className="f-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search expense..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
//             <button className="f-btn"><i className="fa-solid fa-calendar" /> Date</button>
//           </div>
//           <div className="f-toolbar-right">
//             <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
//             <button className="f-btn primary" onClick={() => onNav('exp-add')}><i className="fa-solid fa-plus" /> Log Expense</button>
//           </div>
//         </div>
//         <div className="tbl-wrap">
//           <table>
//             <thead><tr>
//               <th>Date</th><th>Description</th><th>Category</th>
//               <th>Amount</th><th>Payment Method</th><th>Logged By</th><th>Reference</th><th>Actions</th>
//             </tr></thead>
//             <tbody>
//               {pageItems.map((e, i) => (
//                 <tr key={i} onClick={() => onOpenOverlay('Expense Detail', <ExpenseDetailContent e={e} />)}>
//                   <td style={{ fontSize: 10 }}>{e.date}</td>
//                   <td><strong>{e.desc}</strong></td>
//                   <td><span className="f-tag">{e.category}</span></td>
//                   <td><strong style={{ color: 'var(--red)' }}>{fmt(e.amount)}</strong></td>
//                   <td>{e.method}</td>
//                   <td>{e.by}</td>
//                   <td><code className="ref">{e.ref}</code></td>
//                   <td onClick={ev => ev.stopPropagation()} style={{ display: 'flex', gap: 3 }}>
//                     <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button>
//                     <button className="f-btn danger" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-trash" /></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <FPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
//       </div>
//     </>
//   );
// };

// const ExpenseDetailContent: React.FC<{ e: Expense }> = ({ e }) => (
//   <div>
//     {[
//       ['Description', e.desc],
//       ['Category', <span className="f-tag">{e.category}</span>],
//       ['Amount', <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--red)' }}>{fmt(e.amount)}</span>],
//       ['Date', e.date], ['Payment Method', e.method], ['Logged By', e.by],
//       ['Reference', <code className="ref">{e.ref}</code>],
//     ].map(([k, v], i) => (
//       <div className="detail-row" key={i}>
//         <div className="detail-key">{k}</div>
//         <div className="detail-val">{v}</div>
//       </div>
//     ))}
//     <hr />
//     <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
//       <button className="f-btn primary"><i className="fa-solid fa-pen" /> Edit</button>
//       <button className="f-btn danger"><i className="fa-solid fa-trash" /> Delete</button>
//     </div>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: LOG EXPENSE
// // ═══════════════════════════════════════════════════════════

// const LogExpensePanel: React.FC<{ onNav: (p: NavPanel) => void }> = ({ onNav }) => (
//   <>
//     <div className="panel-heading">Log Expense</div>
//     <div className="panel-desc">Record a new business expense. Provide category, amount, and payment method for accurate financial tracking.</div>
//     <div className="detail-grid-2" style={{ alignItems: 'start' }}>
//       <div className="card" style={{ marginBottom: 0 }}>
//         <div className="card-header"><div className="card-title"><i className="fa-solid fa-circle-plus" style={{ color: 'var(--accent)' }} /> New Expense Entry</div></div>
//         <div className="card-body">
//           <div className="f-form-row single"><div className="f-form-group"><div className="f-form-label">Description *</div><input className="f-form-input" placeholder="e.g. Petrol for delivery riders — May Week 2" /></div></div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Category *</div>
//               <select className="f-form-select"><option>Logistics</option><option>Operations</option><option>Marketing</option><option>Salaries</option><option>Utilities</option><option>Packaging</option><option>Repairs &amp; Maintenance</option><option>Other</option></select>
//             </div>
//             <div className="f-form-group"><div className="f-form-label">Amount (₨) *</div><input className="f-form-input" type="number" placeholder="0" /></div>
//           </div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Date *</div><input className="f-form-input" type="date" /></div>
//             <div className="f-form-group"><div className="f-form-label">Payment Method</div>
//               <select className="f-form-select"><option>Cash</option><option>Bank Transfer</option><option>JazzCash</option><option>EasyPaisa</option><option>Cheque</option></select>
//             </div>
//           </div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Reference / Invoice No.</div><input className="f-form-input" placeholder="Optional ref. number" /></div>
//             <div className="f-form-group"><div className="f-form-label">Logged By</div>
//               <select className="f-form-select"><option>Accounts (Self)</option><option>Admin</option><option>Operations Manager</option></select>
//             </div>
//           </div>
//           <div className="f-form-row single"><div className="f-form-group"><div className="f-form-label">Notes</div><textarea className="f-form-textarea" placeholder="Any additional notes about this expense..." /></div></div>
//           <hr />
//           <div style={{ display: 'flex', gap: 8 }}>
//             <button className="f-btn primary"><i className="fa-solid fa-check" /> Save Expense</button>
//             <button className="f-btn" onClick={() => onNav('expenses')}>Cancel</button>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div className="summary-box">
//           <div className="summary-box-title">This Month's Expense Summary</div>
//           {[['Logistics', 38400], ['Operations', 44800], ['Marketing', 22000], ['Salaries', 12000], ['Utilities', 6200], ['Other', 4800]].map(([k, v]) => (
//             <div className="summary-row" key={k as string}><span>{k}</span><span style={{ fontWeight: 600 }}>{fmt(v as number)}</span></div>
//           ))}
//           <div className="summary-row total"><span>Total</span><span className="summary-val" style={{ color: 'var(--red)' }}>₨1,28,200</span></div>
//         </div>
//         <div className="card" style={{ marginBottom: 0 }}>
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Entries</div></div>
//           <div className="card-body" style={{ padding: '6px 14px' }}>
//             {EXPENSES.slice(0, 4).map((e, i) => (
//               <div className="list-item" key={i}>
//                 <div className="list-content">
//                   <div className="list-title" style={{ fontSize: 10.5 }}>{e.desc}</div>
//                   <div className="list-meta">{e.category} · {e.date}</div>
//                 </div>
//                 <div className="list-right"><strong style={{ color: 'var(--red)', fontSize: 11 }}>{fmt(e.amount)}</strong></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: EXPENSE CATEGORIES
// // ═══════════════════════════════════════════════════════════

// const CategoriesPanel: React.FC = () => {
//   const total = CATEGORIES.reduce((s, c) => s + c.amount, 0);
//   const gradient = CATEGORIES.map((c, i, arr) => {
//     const pct = (c.amount / total) * 100;
//     const start = arr.slice(0, i).reduce((s, x) => s + (x.amount / total) * 100, 0);
//     return `${c.color} ${start.toFixed(1)}% ${(start + pct).toFixed(1)}%`;
//   }).join(',');

//   return (
//     <>
//       <div className="panel-heading">Expense Categories</div>
//       <div className="panel-desc">Manage expense categories. Add, rename, or deactivate categories to keep your financial records organised.</div>
//       <div className="detail-grid-2">
//         <div className="card" style={{ marginBottom: 0 }}>
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-tags" /> Category List</div><button className="f-btn primary"><i className="fa-solid fa-plus" /> Add Category</button></div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Category</th><th>Expenses (MTD)</th><th>Amount (MTD)</th><th>Active</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {CATEGORIES.map(c => (
//                   <tr key={c.name}>
//                     <td>
//                       <div className="td-flex">
//                         <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
//                         <strong>{c.name}</strong>
//                       </div>
//                     </td>
//                     <td>{c.count}</td>
//                     <td><strong>{fmt(c.amount)}</strong></td>
//                     <td><ToggleSwitch defaultChecked={c.active} /></td>
//                     <td><button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="card" style={{ marginBottom: 0 }}>
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-pie" /> Expense Breakdown</div></div>
//           <div className="card-body">
//             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
//               <div style={{ width: 110, height: 110, borderRadius: '50%', background: `conic-gradient(${gradient})`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                   <div style={{ fontSize: 14, fontWeight: 900 }}>₨1.28L</div>
//                   <div style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>Total MTD</div>
//                 </div>
//               </div>
//             </div>
//             <div className="donut-legend">
//               {CATEGORIES.map(c => (
//                 <div className="donut-legend-item" key={c.name}>
//                   <div className="donut-dot" style={{ background: c.color }} />
//                   <span style={{ flex: 1 }}>{c.name}</span>
//                   <strong>{fmt(c.amount)}</strong>
//                   <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: 9.5 }}>{((c.amount / total) * 100).toFixed(1)}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: SUPPLIER BALANCES
// // ═══════════════════════════════════════════════════════════

// const SuppliersPanel: React.FC<{ onNav: (p: NavPanel) => void; onOpenOverlay: (title: string, content: React.ReactNode) => void }> = ({ onNav, onOpenOverlay }) => {
//   const [search, setSearch] = useState('');
//   const filtered = SUPPLIERS.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <>
//       <div className="panel-heading">Supplier Balances</div>
//       <div className="panel-desc">View outstanding balances owed to each supplier. Track purchase history, payments made, and overdue amounts.</div>

//       <div className="alert-strip warn">
//         <i className="fa-solid fa-triangle-exclamation" />
//         <div><strong>Al-Karam Textile</strong> invoice overdue by 12 days — total outstanding: <strong>₨42,000</strong>.</div>
//         <button className="f-btn primary" style={{ marginLeft: 'auto', fontSize: 9.5 }} onClick={() => onNav('sup-add')}><i className="fa-solid fa-money-bill-transfer" /> Pay Now</button>
//       </div>

//       <div className="mini-stats cols-3">
//         <div className="mini-stat"><div className="ms-label">Total Supplier Dues</div><div className="ms-value" style={{ color: 'var(--yellow)' }}>₨86,000</div><div className="ms-trend down">3 suppliers outstanding</div></div>
//         <div className="mini-stat"><div className="ms-label">Paid This Month</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨1,24,000</div><div className="ms-trend up"><i className="fa-solid fa-circle-check" /> 5 payments made</div></div>
//         <div className="mini-stat"><div className="ms-label">Overdue (&gt;30 days)</div><div className="ms-value" style={{ color: 'var(--red)' }}>₨42,000</div><div className="ms-trend down"><i className="fa-solid fa-circle-exclamation" /> 1 supplier</div></div>
//       </div>

//       <div className="card">
//         <div className="f-toolbar">
//           <div className="f-toolbar-left">
//             <div className="f-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search supplier..." value={search} onChange={e => setSearch(e.target.value)} /></div>
//           </div>
//           <div className="f-toolbar-right">
//             <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
//             <button className="f-btn primary" onClick={() => onNav('sup-add')}><i className="fa-solid fa-plus" /> Record Payment</button>
//           </div>
//         </div>
//         <div className="tbl-wrap">
//           <table>
//             <thead><tr>
//               <th>Supplier</th><th>Total Purchased</th><th>Total Paid</th>
//               <th>Balance Due</th><th>Last Purchase</th><th>Last Payment</th><th>Status</th><th>Actions</th>
//             </tr></thead>
//             <tbody>
//               {filtered.map(s => (
//                 <tr key={s.name} onClick={() => onOpenOverlay(s.name, <SupplierDetailContent s={s} onNav={onNav} />)}>
//                   <td><strong>{s.name}</strong></td>
//                   <td>{fmt(s.purchased)}</td>
//                   <td style={{ color: 'var(--green)' }}>{fmt(s.paid)}</td>
//                   <td><strong style={{ color: s.balance > 0 ? 'var(--red)' : 'var(--green)' }}>{s.balance > 0 ? fmt(s.balance) : '—'}</strong></td>
//                   <td style={{ fontSize: 10 }}>{s.lastPurchase}</td>
//                   <td style={{ fontSize: 10 }}>{s.lastPayment}</td>
//                   <td><Badge label={s.status} /></td>
//                   <td onClick={ev => ev.stopPropagation()} style={{ display: 'flex', gap: 3 }}>
//                     {s.balance > 0 && (
//                       <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }} onClick={() => onNav('sup-add')}><i className="fa-solid fa-money-bill-transfer" /> Pay</button>
//                     )}
//                     <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// const SupplierDetailContent: React.FC<{ s: Supplier; onNav: (p: NavPanel) => void }> = ({ s, onNav }) => (
//   <div>
//     <div style={{ marginBottom: 14 }}><Badge label={s.status} /></div>
//     {[
//       ['Total Purchased', fmt(s.purchased)],
//       ['Total Paid', <span style={{ color: 'var(--green)' }}>{fmt(s.paid)}</span>],
//       ['Balance Due', <span style={{ fontSize: 16, fontWeight: 900, color: s.balance > 0 ? 'var(--red)' : 'var(--green)' }}>{s.balance > 0 ? fmt(s.balance) : 'Cleared'}</span>],
//       ['Last Purchase', s.lastPurchase],
//       ['Last Payment', s.lastPayment],
//     ].map(([k, v], i) => (
//       <div className="detail-row" key={i}>
//         <div className="detail-key">{k}</div>
//         <div className="detail-val">{v}</div>
//       </div>
//     ))}
//     <hr />
//     <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
//       {s.balance > 0 && (
//         <button className="f-btn primary" onClick={() => onNav('sup-add')}><i className="fa-solid fa-money-bill-transfer" /> Record Payment</button>
//       )}
//       <button className="f-btn"><i className="fa-solid fa-clock-rotate-left" /> Payment History</button>
//     </div>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: SUPPLIER PAYMENTS
// // ═══════════════════════════════════════════════════════════

// const SupplierPaymentsPanel: React.FC = () => {
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 5;

//   const filtered = SUPPLIER_PAYMENTS.filter(p => !search || p.supplier.toLowerCase().includes(search.toLowerCase()));
//   const total = filtered.length;
//   const start = (page - 1) * PER_PAGE + 1;
//   const end = Math.min(page * PER_PAGE, total);
//   const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   return (
//     <>
//       <div className="panel-heading">Supplier Payments Made</div>
//       <div className="panel-desc">Complete history of all payments made to suppliers. Filter by supplier or date range.</div>
//       <div className="card">
//         <div className="f-toolbar">
//           <div className="f-toolbar-left">
//             <div className="f-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search supplier..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
//           </div>
//           <div className="f-toolbar-right"><button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//         </div>
//         <div className="tbl-wrap">
//           <table>
//             <thead><tr>
//               <th>Date</th><th>Supplier</th><th>Amount</th>
//               <th>Method</th><th>Reference</th><th>Paid By</th><th>Notes</th><th>Actions</th>
//             </tr></thead>
//             <tbody>
//               {pageItems.map((p, i) => (
//                 <tr key={i}>
//                   <td>{p.date}</td>
//                   <td><strong>{p.supplier}</strong></td>
//                   <td><strong style={{ color: 'var(--green)' }}>{fmt(p.amount)}</strong></td>
//                   <td><span className="f-tag">{p.method}</span></td>
//                   <td><code className="ref">{p.ref}</code></td>
//                   <td>{p.by}</td>
//                   <td style={{ color: 'var(--text-muted)' }}>—</td>
//                   <td><button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <FPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: RECORD PAYMENT
// // ═══════════════════════════════════════════════════════════

// const RecordPaymentPanel: React.FC<{ onNav: (p: NavPanel) => void }> = ({ onNav }) => (
//   <>
//     <div className="panel-heading">Record Supplier Payment</div>
//     <div className="panel-desc">Log a payment made to a supplier. This will automatically update the outstanding balance for that supplier.</div>
//     <div className="detail-grid-2" style={{ alignItems: 'start' }}>
//       <div className="card" style={{ marginBottom: 0 }}>
//         <div className="card-header"><div className="card-title"><i className="fa-solid fa-money-bill-transfer" style={{ color: 'var(--green)' }} /> Payment Details</div></div>
//         <div className="card-body">
//           <div className="f-form-row single"><div className="f-form-group"><div className="f-form-label">Supplier *</div>
//             <select className="f-form-select">{SUPPLIERS.map(s => <option key={s.name}>{s.name}</option>)}</select>
//           </div></div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Amount (₨) *</div><input className="f-form-input" type="number" placeholder="0" /></div>
//             <div className="f-form-group"><div className="f-form-label">Payment Date *</div><input className="f-form-input" type="date" /></div>
//           </div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Payment Method</div>
//               <select className="f-form-select"><option>Bank Transfer</option><option>Cash</option><option>Cheque</option><option>JazzCash</option><option>EasyPaisa</option></select>
//             </div>
//             <div className="f-form-group"><div className="f-form-label">Bank / Account</div><input className="f-form-input" placeholder="e.g. HBL, UBL" /></div>
//           </div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Transaction Reference</div><input className="f-form-input" placeholder="Transfer ref. or cheque no." /></div>
//             <div className="f-form-group"><div className="f-form-label">Paid By</div>
//               <select className="f-form-select"><option>Accounts</option><option>Admin</option><option>Owner</option></select>
//             </div>
//           </div>
//           <div className="f-form-row single"><div className="f-form-group"><div className="f-form-label">Linked Invoice / Purchase</div><input className="f-form-input" placeholder="Invoice number or PO reference" /></div></div>
//           <div className="f-form-row single"><div className="f-form-group"><div className="f-form-label">Notes</div><textarea className="f-form-textarea" placeholder="Optional payment notes..." /></div></div>
//           <hr />
//           <div style={{ display: 'flex', gap: 8 }}>
//             <button className="f-btn primary"><i className="fa-solid fa-check" /> Record Payment</button>
//             <button className="f-btn" onClick={() => onNav('suppliers')}>Cancel</button>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div className="summary-box">
//           <div className="summary-box-title">Outstanding Supplier Balances</div>
//           {SUPPLIERS.map(s => (
//             <div className="summary-row" key={s.name}>
//               <span>{s.name}</span>
//               <span style={{ fontWeight: 600, color: s.balance > 0 ? 'var(--red)' : 'var(--green)' }}>
//                 {s.balance > 0 ? fmt(s.balance) : 'Cleared'}
//                 {s.status === 'Overdue' && <span className="badge red" style={{ marginLeft: 5 }}>Overdue</span>}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: FINANCIAL REPORTS
// // ═══════════════════════════════════════════════════════════

// const ReportsPanel: React.FC = () => (
//   <>
//     <div className="panel-heading">Financial Reports</div>
//     <div className="panel-desc">Generate and download detailed financial reports by date range, type, or category.</div>

//     <div className="detail-grid-2">
//       <div className="card" style={{ marginBottom: 0 }}>
//         <div className="card-header"><div className="card-title"><i className="fa-solid fa-file-chart-column" /> Generate Report</div></div>
//         <div className="card-body">
//           <div className="f-form-row single"><div className="f-form-group"><div className="f-form-label">Report Type</div>
//             <select className="f-form-select">
//               <option>Daily Financial Summary</option>
//               <option>Weekly COD Report</option>
//               <option>Monthly Expense Report</option>
//               <option>Supplier Payment History</option>
//               <option>Revenue vs Expenses</option>
//               <option>Profit &amp; Loss Statement</option>
//               <option>COD Reconciliation Report</option>
//               <option>Prepaid Orders Report</option>
//             </select>
//           </div></div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Date From</div><input className="f-form-input" type="date" /></div>
//             <div className="f-form-group"><div className="f-form-label">Date To</div><input className="f-form-input" type="date" /></div>
//           </div>
//           <div className="f-form-row">
//             <div className="f-form-group"><div className="f-form-label">Group By</div><select className="f-form-select"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
//             <div className="f-form-group"><div className="f-form-label">Format</div><select className="f-form-select"><option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>PDF</option></select></div>
//           </div>
//           <hr />
//           <button className="f-btn primary" style={{ width: '100%', justifyContent: 'center' }}><i className="fa-solid fa-file-export" /> Generate &amp; Download</button>
//         </div>
//       </div>
//       <div className="card" style={{ marginBottom: 0 }}>
//         <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Reports</div></div>
//         <div className="card-body" style={{ padding: '6px 14px' }}>
//           {RECENT_REPORTS.map(r => (
//             <div className="list-item" key={r.name}>
//               <div className="list-icon" style={{ background: 'var(--green-bg)' }}>
//                 <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: 11, color: 'var(--green)' }} />
//               </div>
//               <div className="list-content">
//                 <div className="list-title" style={{ fontSize: 10.5 }}>{r.name}</div>
//                 <div className="list-meta">{r.date} · {r.format} · {r.size}</div>
//               </div>
//               <div className="list-right">
//                 <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//     <div className="card" style={{ marginTop: 14 }}>
//       <div className="card-header">
//         <div className="card-title"><i className="fa-solid fa-table" /> Monthly Summary Table</div>
//         <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
//       </div>
//       <div className="tbl-wrap">
//         <table>
//           <thead><tr>
//             <th>Month</th><th>Revenue</th><th>COD Collected</th><th>Prepaid</th>
//             <th>Expenses</th><th>Supplier Paid</th><th>Net Profit</th><th>Margin</th>
//           </tr></thead>
//           <tbody>
//             {MONTHLY_DATA.map(m => {
//               const margin = ((m.profit / m.revenue) * 100).toFixed(1);
//               return (
//                 <tr key={m.month}>
//                   <td><strong>{m.month}</strong></td>
//                   <td style={{ color: 'var(--green)' }}>{fmt(m.revenue)}</td>
//                   <td>{fmt(m.cod)}</td>
//                   <td>{fmt(m.prepaid)}</td>
//                   <td style={{ color: 'var(--red)' }}>{fmt(m.expenses)}</td>
//                   <td>{fmt(m.supPaid)}</td>
//                   <td><strong style={{ color: 'var(--green)' }}>{fmt(m.profit)}</strong></td>
//                   <td>
//                     <div className="perf-cell" style={{ minWidth: 70 }}>
//                       <div className="perf-bar"><div className="perf-fill" style={{ width: `${margin}%`, background: 'var(--green)' }} /></div>
//                       <div className="perf-pct" style={{ color: 'var(--green)' }}>{margin}%</div>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: P&L SUMMARY
// // ═══════════════════════════════════════════════════════════

// const PLPanel: React.FC = () => (
//   <>
//     <div className="panel-heading">Profit &amp; Loss Summary</div>
//     <div className="panel-desc">High-level P&L view for the current period. Breakdown of all revenue streams against expenses to show net profitability.</div>

//     <div className="mini-stats">
//       <div className="mini-stat"><div className="ms-label">Gross Revenue (MTD)</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨5,12,400</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +14% vs last month</div></div>
//       <div className="mini-stat"><div className="ms-label">COGS (Stock Cost)</div><div className="ms-value">₨2,64,000</div><div className="ms-trend">51.5% of revenue</div></div>
//       <div className="mini-stat"><div className="ms-label">Gross Profit</div><div className="ms-value" style={{ color: 'var(--blue)' }}>₨2,48,400</div><div className="ms-trend up">48.5% margin</div></div>
//       <div className="mini-stat"><div className="ms-label">Net Profit</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨1,20,200</div><div className="ms-trend up">23.5% net margin</div></div>
//     </div>

//     <div className="detail-grid-2">
//       <div className="summary-box" style={{ marginBottom: 0 }}>
//         <div className="summary-box-title">Revenue Breakdown</div>
//         {[['COD Orders', 312400], ['Prepaid / Online Orders', 184600], ['WhatsApp / Manual', 15400]].map(([k, v]) => (
//           <div className="summary-row" key={k as string}><span>{k}</span><span style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(v as number)}</span></div>
//         ))}
//         <div className="summary-row total"><span>Total Revenue</span><span className="summary-val" style={{ color: 'var(--green)' }}>₨5,12,400</span></div>
//       </div>
//       <div className="summary-box" style={{ marginBottom: 0 }}>
//         <div className="summary-box-title">Expense Breakdown</div>
//         {[['Logistics & Delivery', 38400], ['Operations', 44800], ['Marketing', 22000], ['Salaries', 12000], ['Utilities & Other', 11000]].map(([k, v]) => (
//           <div className="summary-row" key={k as string}><span>{k}</span><span style={{ fontWeight: 600, color: 'var(--red)' }}>{fmt(v as number)}</span></div>
//         ))}
//         <div className="summary-row total"><span>Total Expenses</span><span className="summary-val" style={{ color: 'var(--red)' }}>₨1,28,200</span></div>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: INTEGRATIONS
// // ═══════════════════════════════════════════════════════════

// const IntegrationsPanel: React.FC = () => {
//   const paymentGateways = INTEGRATIONS.slice(0, 3);
//   const ecommerce = INTEGRATIONS.slice(3, 4);
//   const accounting = INTEGRATIONS.slice(4, 6);
//   const banking = INTEGRATIONS.slice(6);

//   const IntegCard: React.FC<{ int: Integration }> = ({ int }) => (
//     <div className="integration-card">
//       <div className="integration-logo" style={int.logoBg ? { background: int.logoBg, borderColor: int.logoBg } : undefined}>
//         <span style={{ fontSize: 9, fontWeight: 800, color: int.logoBg ? '#fff' : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{int.logoText}</span>
//       </div>
//       <div>
//         <div className="integration-name">{int.name}</div>
//         <div className="integration-desc">{int.desc}</div>
//       </div>
//       <div className="integration-right">
//         <Badge label={int.status} />
//         <button className={`f-btn ${int.status === 'Available' ? 'primary' : int.status === 'Optional' ? '' : 'primary'}`} style={{ fontSize: 10 }}>
//           <i className={`fa-solid fa-${int.status === 'Available' ? 'file-export' : int.status === 'Optional' ? 'circle-info' : 'plug'}`} />
//           {int.status === 'Available' ? 'Export Now' : int.status === 'Optional' ? 'Learn More' : 'Connect'}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="panel-heading">Financial Integrations</div>
//       <div className="panel-desc">Connect payment gateways, e-commerce platforms, and accounting tools to automate financial data flow.</div>
//       <div className="alert-strip info"><i className="fa-solid fa-circle-info" />Connecting payment gateways enables automatic reconciliation of prepaid orders and COD updates in real time.</div>

//       <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Payment Gateways</div>
//       {paymentGateways.map(i => <IntegCard key={i.name} int={i} />)}

//       <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 0 10px' }}>E-Commerce &amp; Order Sources</div>
//       {ecommerce.map(i => <IntegCard key={i.name} int={i} />)}

//       <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 0 10px' }}>Accounting Software</div>
//       {accounting.map(i => <IntegCard key={i.name} int={i} />)}

//       <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 0 10px' }}>Bank &amp; Courier Finance</div>
//       {banking.map(i => <IntegCard key={i.name} int={i} />)}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: SETTINGS
// // ═══════════════════════════════════════════════════════════

// const SettingsPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('general');

//   return (
//     <>
//       <div className="panel-heading">Financial Settings</div>
//       <div className="panel-desc">Configure default payment terms, COD limits, report schedules, and automated reconciliation rules.</div>
//       <InnerTabs
//         tabs={[{ id: 'general', label: 'General' }, { id: 'cod', label: 'COD Rules' }, { id: 'supplier', label: 'Supplier Terms' }, { id: 'notif', label: 'Notifications' }]}
//         active={innerTab} onChange={setInnerTab}
//       />

//       {innerTab === 'general' && (
//         <>
//           <div className="settings-grid-2">
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-sliders" /> General Defaults</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Default Currency</div><div className="stg-desc">Used across all financial records</div></div><select className="stg-select"><option>PKR (₨)</option><option>USD ($)</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Fiscal Month Start</div></div><select className="stg-select"><option>1st of month</option><option>15th of month</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Auto-generate Daily Summary</div><div className="stg-desc">Generate end-of-day financial snapshot</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Require Notes on All Expenses</div></div><ToggleSwitch /></div>
//                 <div className="stg-row"><div><div className="stg-key">Require Approval Above (₨)</div><div className="stg-desc">Expense needs manager approval</div></div><input type="number" defaultValue={10000} className="stg-input" /></div>
//               </div>
//             </div>
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-file-invoice-dollar" /> Report Automation</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Auto Daily Report</div><div className="stg-desc">Email or notify managers daily</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Weekly Report Day</div></div><select className="stg-select"><option>Sunday</option><option>Monday</option><option>Saturday</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Monthly Report On</div></div><input type="number" defaultValue={1} className="stg-input" style={{ width: 60 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Send Report To</div></div><select className="stg-select"><option>Administrator</option><option>Operations Manager</option><option>Owner</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Export Format Default</div></div><select className="stg-select"><option>Excel (.xlsx)</option><option>CSV</option><option>PDF</option></select></div>
//               </div>
//             </div>
//           </div>
//           <button className="f-btn primary"><i className="fa-solid fa-check" /> Save General Settings</button>
//         </>
//       )}

//       {innerTab === 'cod' && (
//         <>
//           <div className="settings-section">
//             <div className="settings-section-head"><i className="fa-solid fa-money-bills" /> COD Configuration</div>
//             <div className="settings-section-body">
//               <div className="stg-row"><div><div className="stg-key">Max COD Per Order (₨)</div><div className="stg-desc">Orders above this need manager approval</div></div><input type="number" defaultValue={20000} className="stg-input" /></div>
//               <div className="stg-row"><div><div className="stg-key">Max COD Per Rider (₨)</div><div className="stg-desc">Total cash a rider can hold before submitting</div></div><input type="number" defaultValue={15000} className="stg-input" /></div>
//               <div className="stg-row"><div><div className="stg-key">COD Submission Deadline</div></div><select className="stg-select"><option>End of shift</option><option>Next morning 10 AM</option><option>Daily 6 PM</option></select></div>
//               <div className="stg-row"><div><div className="stg-key">Auto-Alert on COD Limit Breach</div></div><ToggleSwitch defaultChecked /></div>
//               <div className="stg-row"><div><div className="stg-key">Require Accounts Sign-off on Submission</div></div><ToggleSwitch defaultChecked /></div>
//               <div className="stg-row"><div><div className="stg-key">COD Deduction for Failed Delivery</div><div className="stg-desc">Deduct rider pay for unexplained shortfall</div></div><ToggleSwitch /></div>
//             </div>
//           </div>
//           <button className="f-btn primary"><i className="fa-solid fa-check" /> Save COD Settings</button>
//         </>
//       )}

//       {innerTab === 'supplier' && (
//         <>
//           <div className="settings-section">
//             <div className="settings-section-head"><i className="fa-solid fa-handshake" /> Supplier Payment Terms</div>
//             <div className="settings-section-body">
//               <div className="stg-row"><div><div className="stg-key">Default Payment Terms (Days)</div><div className="stg-desc">e.g. Net 30 means payment due in 30 days</div></div><input type="number" defaultValue={30} className="stg-input" style={{ width: 60 }} /></div>
//               <div className="stg-row"><div><div className="stg-key">Overdue Alert After (Days)</div></div><input type="number" defaultValue={7} className="stg-input" style={{ width: 60 }} /></div>
//               <div className="stg-row"><div><div className="stg-key">Auto-Flag Overdue Balances</div></div><ToggleSwitch defaultChecked /></div>
//               <div className="stg-row"><div><div className="stg-key">Require PO Reference on Payment</div></div><ToggleSwitch /></div>
//               <div className="stg-row"><div><div className="stg-key">Notify Manager on Large Payments Above (₨)</div></div><input type="number" defaultValue={50000} className="stg-input" /></div>
//             </div>
//           </div>
//           <button className="f-btn primary"><i className="fa-solid fa-check" /> Save Supplier Settings</button>
//         </>
//       )}

//       {innerTab === 'notif' && (
//         <>
//           <div className="settings-section">
//             <div className="settings-section-head"><i className="fa-solid fa-bell" /> Financial Notifications</div>
//             <div className="settings-section-body">
//               {[
//                 ['Daily P&L Summary to Admin', true],
//                 ['Alert on COD Submission Delay', true],
//                 ['Alert on Supplier Balance Overdue', true],
//                 ['Alert on High Expense Entry', true],
//                 ['Weekly Financial Report to Manager', true],
//                 ['Alert on Unusual COD Amount', true],
//               ].map(([k, v]) => (
//                 <div className="stg-row" key={k as string}>
//                   <div><div className="stg-key">{k}</div></div>
//                   <ToggleSwitch defaultChecked={v as boolean} />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <button className="f-btn primary"><i className="fa-solid fa-check" /> Save Notification Settings</button>
//         </>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // MAIN PAGE COMPONENT
// // ═══════════════════════════════════════════════════════════

// const FinancePage: React.FC = () => {
//   const [activePanel, setActivePanel] = useState<NavPanel>('overview');
//   const { isLoading, loadingProgress, switchTab } = useTabLoading(setActivePanel, activePanel);

//   const [overlay, setOverlay] = useState<OverlayState>({ open: false, title: '', content: null });

//   const openOverlay = useCallback((title: string, content: React.ReactNode) => {
//     setOverlay({ open: true, title, content });
//   }, []);

//   const closeOverlay = () => setOverlay(v => ({ ...v, open: false }));

//   type NavEntry = { panel: NavPanel; icon: string; label: string; badge?: number | string; badgeColor?: string };
//   type NavSection = { heading: string; items: NavEntry[] };

//   const navSections: NavSection[] = [
//     { heading: 'Overview', items: [{ panel: 'overview', icon: 'fa-gauge', label: 'Overview' }] },
//     { heading: 'COD', items: [
//       { panel: 'cod',     icon: 'fa-money-bills',    label: 'COD Tracking', badge: 14 },
//       { panel: 'cod-log', icon: 'fa-clipboard-check', label: 'COD Log'      },
//       { panel: 'prepaid', icon: 'fa-credit-card',     label: 'Prepaid Orders'},
//     ]},
//     { heading: 'Expenses', items: [
//       { panel: 'expenses',       icon: 'fa-receipt',      label: 'All Expenses'  },
//       { panel: 'exp-add',        icon: 'fa-circle-plus',  label: 'Log Expense'   },
//       { panel: 'exp-categories', icon: 'fa-tags',         label: 'Categories'    },
//     ]},
//     { heading: 'Suppliers', items: [
//       { panel: 'suppliers',     icon: 'fa-truck-ramp-box', label: 'Supplier Balances'},
//       { panel: 'sup-payments',  icon: 'fa-handshake',      label: 'Payments Made'    },
//       { panel: 'sup-add',       icon: 'fa-circle-plus',    label: 'Record Payment'   },
//     ]},
//     { heading: 'Reports', items: [
//       { panel: 'reports', icon: 'fa-file-invoice-dollar', label: 'Financial Reports'},
//       { panel: 'pl',      icon: 'fa-chart-line',          label: 'P&L Summary'      },
//     ]},
//     { heading: 'Integrations', items: [
//       { panel: 'integrations', icon: 'fa-plug', label: 'Integrations' },
//     ]},
//     { heading: 'Settings', items: [
//       { panel: 'settings', icon: 'fa-gear', label: 'Settings' },
//     ]},
//   ];

//   const renderPanel = () => {
//     switch (activePanel) {
//       case 'overview':       return <OverviewPanel onNav={setActivePanel} onOpenOverlay={openOverlay} />;
//       case 'cod':            return <CODPanel onOpenOverlay={openOverlay} />;
//       case 'cod-log':        return <CODLogPanel />;
//       case 'prepaid':        return <PrepaidPanel />;
//       case 'expenses':       return <ExpensesPanel onNav={setActivePanel} onOpenOverlay={openOverlay} />;
//       case 'exp-add':        return <LogExpensePanel onNav={setActivePanel} />;
//       case 'exp-categories': return <CategoriesPanel />;
//       case 'suppliers':      return <SuppliersPanel onNav={setActivePanel} onOpenOverlay={openOverlay} />;
//       case 'sup-payments':   return <SupplierPaymentsPanel />;
//       case 'sup-add':        return <RecordPaymentPanel onNav={setActivePanel} />;
//       case 'reports':        return <ReportsPanel />;
//       case 'pl':             return <PLPanel />;
//       case 'integrations':   return <IntegrationsPanel />;
//       case 'settings':       return <SettingsPanel />;
//       default:               return null;
//     }
//   };

//   return (
//     <div id="page-finance">
//       <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
//       <div className="page-hero">
//         <div className="page-hero-title">Financial Management</div>
//         <div className="page-hero-sub">Track COD collections, log expenses, manage supplier balances, and generate financial reports.</div>
//       </div>

//       <div className="finance-layout">
//         {/* Vertical Nav */}
//         <div className="vnav">
//           {navSections.map(section => (
//             <React.Fragment key={section.heading}>
//               <div className="vnav-section-label">{section.heading}</div>
//               {section.items.map(item => (
//                 <div
//                   key={item.panel}
//                   className={`vnav-item ${activePanel === item.panel ? 'active' : ''}`}
//                   onClick={() => switchTab(item.panel)}
//                 >
//                   <i className={`fa-solid ${item.icon}`} />
//                   {item.label}
//                   {item.badge !== undefined && (
//                     <span className={`vnav-badge ${item.badgeColor || ''}`}>{item.badge}</span>
//                   )}
//                 </div>
//               ))}
//               <div className="vnav-divider" />
//             </React.Fragment>
//           ))}
//         </div>

//         {/* Content Panels */}
//         <div className="finance-content">
//           {renderPanel()}
//         </div>
//       </div>

//       {/* Overlay */}
//       <div className={`finance-backdrop ${overlay.open ? 'open' : ''}`} onClick={closeOverlay} />
//       <div className={`finance-overlay ${overlay.open ? 'open' : ''}`}>
//         <div className="overlay-header">
//           <div className="overlay-title">{overlay.title}</div>
//           <button className="close-btn" onClick={closeOverlay}><i className="fa-solid fa-xmark" /></button>
//         </div>
//         <div className="overlay-body">{overlay.content}</div>
//       </div>
//     </div>
//   );
// };

// export default FinancePage;
