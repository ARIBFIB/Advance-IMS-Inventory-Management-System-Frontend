// ═══════════════════════════════════════════════════════════
// ReportsPage.tsx  —  Shell only; each tab lives in its own file
// ═══════════════════════════════════════════════════════════
import React, { useState } from "react";
import "./ReportsPage.css";
import TopLoadingBar from "../../components/ui/TopLoadingBar";
import { usePageLoading } from "../../hooks/usePageLoading";
import { useTabLoading } from "../../hooks/useTabLoading";

import SalesReportsTab from "./SalesReportsTab";
import InventoryReportsTab from "./InventoryReportsTab";
import FinancialReportsTab from "./FinancialReportsTab";
import StaffReportsTab from "./StaffReportsTab";
import ExportDataTab from "./ExportDataTab";

import { ReportTab } from "./ReportsShared";

// ── Tab config ───────────────────────────────────────────────
const TABS: { id: ReportTab; icon: string; label: string }[] = [
  { id: "sales", icon: "fa-chart-line", label: "Sales Reports" },
  { id: "inventory", icon: "fa-boxes-stacked", label: "Inventory Reports" },
  { id: "financial", icon: "fa-coins", label: "Financial Reports" },
  { id: "staff", icon: "fa-users-gear", label: "Staff Reports" },
  { id: "export", icon: "fa-file-export", label: "Export Data" },
];

// ── Page ─────────────────────────────────────────────────────
const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>("sales");
  const { isLoading, loadingProgress, switchTab } = useTabLoading(
    setActiveTab,
    activeTab,
  );

  return (
    <div id="page-reports">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      <div className="section-heading">Reports &amp; Analytics</div>
      <div className="section-subheading">
        Track sales performance, monitor inventory health, review financials,
        and export data across all operations in real time.
      </div>

      {/* Horizontal Tabs */}
      <div className="h-tabs">
        {TABS.map((t) => (
          <div
            key={t.id}
            className={`h-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => switchTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "sales" && <SalesReportsTab />}
      {activeTab === "inventory" && <InventoryReportsTab />}
      {activeTab === "financial" && <FinancialReportsTab />}
      {activeTab === "staff" && <StaffReportsTab />}
      {activeTab === "export" && <ExportDataTab />}
    </div>
  );
};

export default ReportsPage;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import './ReportsPage.css';
// import TopLoadingBar from '../../components/ui/TopLoadingBar';
// import { usePageLoading } from '../../hooks/usePageLoading';
// import { useTabLoading } from '../../hooks/useTabLoading';
// // ═══════════════════════════════════════════════════════════
// // TYPES
// // ═══════════════════════════════════════════════════════════

// type ReportTab = 'sales' | 'inventory' | 'financial' | 'staff' | 'export';
// type RevenuePeriod = 'daily' | 'weekly' | 'monthly';
// type CODFilter = 'pending' | 'collected' | 'all';

// interface DailySale {
//   date: string;
//   orders: number;
//   units: number;
//   revenue: number;
//   cod: number;
//   prepaid: number;
//   returns: number;
//   net: number;
// }

// interface TopProduct {
//   name: string;
//   sku: string;
//   sold: number;
//   revenue: string;
//   trend: 'up' | 'down';
// }

// interface CategorySale {
//   name: string;
//   val: number;
//   color: string;
// }

// interface Channel {
//   name: string;
//   pct: number;
//   val: string;
//   color: string;
// }

// interface ChartDataPoint {
//   label: string;
//   val: number;
// }

// interface LowStockItem {
//   sku: string;
//   name: string;
//   cat: string;
//   stock: number;
//   thr: number;
//   days: number;
//   last: string;
//   supplier: string;
//   urgency: 'Critical' | 'High' | 'Medium';
// }

// interface DeadStockItem {
//   sku: string;
//   name: string;
//   stock: number;
//   last: string;
//   days: number;
//   val: string;
// }

// interface ValuationRow {
//   name: string;
//   cost: string;
//   retail: string;
// }

// interface StockHealthCat {
//   name: string;
//   instock: number;
//   low: number;
//   oos: number;
// }

// interface PLRow {
//   label: string;
//   val: string;
//   color: string;
//   bold?: boolean;
// }

// interface ExpenseRow {
//   cat: string;
//   val: number;
//   color: string;
// }

// interface CODItem {
//   id: string;
//   cust: string;
//   amt: number;
//   courier: string;
//   disp: string;
//   exp: string;
//   days: number;
// }

// interface SupplierPayment {
//   name: string;
//   total: string;
//   paid: string;
//   out: string;
//   last: string;
//   due: string;
//   status: 'Active' | 'Overdue' | 'Cleared';
// }

// interface StaffMember {
//   name: string;
//   role: string;
//   avatar: string;
//   color: string;
//   tasks: number;
//   done: number;
//   orders: number;
//   errors: number;
//   score: number;
// }

// interface DeptTask {
//   name: string;
//   assigned: number;
//   done: number;
//   color: string;
// }

// interface ExportHistoryItem {
//   time: string;
//   type: string;
//   range: string;
//   records: number;
//   fmt: string;
//   by: string;
//   status: string;
// }

// // ═══════════════════════════════════════════════════════════
// // STATIC DATA
// // ═══════════════════════════════════════════════════════════

// const DAILY_SALES: DailySale[] = [
//   { date: '11 May 2026', orders: 34, units: 61, revenue: 91800,  cod: 54200,  prepaid: 37600, returns: 2, net: 89400  },
//   { date: '10 May 2026', orders: 28, units: 49, revenue: 74600,  cod: 44100,  prepaid: 30500, returns: 1, net: 73800  },
//   { date: '09 May 2026', orders: 31, units: 55, revenue: 84200,  cod: 50400,  prepaid: 33800, returns: 3, net: 81600  },
//   { date: '08 May 2026', orders: 22, units: 38, revenue: 60100,  cod: 36400,  prepaid: 23700, returns: 0, net: 60100  },
//   { date: '07 May 2026', orders: 29, units: 52, revenue: 78400,  cod: 46200,  prepaid: 32200, returns: 2, net: 76800  },
//   { date: '06 May 2026', orders: 35, units: 64, revenue: 95200,  cod: 56800,  prepaid: 38400, returns: 1, net: 93900  },
//   { date: '05 May 2026', orders: 18, units: 30, revenue: 48600,  cod: 29100,  prepaid: 19500, returns: 0, net: 48600  },
//   { date: '04 May 2026', orders: 14, units: 24, revenue: 37200,  cod: 22400,  prepaid: 14800, returns: 1, net: 36400  },
//   { date: '03 May 2026', orders: 26, units: 45, revenue: 70800,  cod: 42400,  prepaid: 28400, returns: 2, net: 69100  },
//   { date: '02 May 2026', orders: 32, units: 57, revenue: 86400,  cod: 51800,  prepaid: 34600, returns: 1, net: 85200  },
//   { date: '01 May 2026', orders: 43, units: 78, revenue: 114200, cod: 68200,  prepaid: 46000, returns: 4, net: 110600 },
// ];

// const WEEKLY_DATA: ChartDataPoint[] = [
//   { label: 'W1 Apr', val: 320000 }, { label: 'W2 Apr', val: 410000 },
//   { label: 'W3 Apr', val: 380000 }, { label: 'W4 Apr', val: 520000 },
//   { label: 'W1 May', val: 460000 }, { label: 'W2 May', val: 590000 },
//   { label: 'W3 May', val: 540000 }, { label: 'W4 May', val: 640000 },
// ];

// const DAILY_DATA: ChartDataPoint[] = [
//   { label: '28 Apr', val: 72000  }, { label: '29 Apr', val: 68000  }, { label: '30 Apr', val: 88000  },
//   { label: '01 May', val: 114200 }, { label: '02 May', val: 86400  }, { label: '03 May', val: 70800  },
//   { label: '04 May', val: 37200  }, { label: '05 May', val: 48600  }, { label: '06 May', val: 95200  },
//   { label: '07 May', val: 78400  }, { label: '08 May', val: 60100  }, { label: '09 May', val: 84200  },
//   { label: '10 May', val: 74600  }, { label: '11 May', val: 91800  },
// ];

// const MONTHLY_DATA: ChartDataPoint[] = [
//   { label: 'Dec 25', val: 2800000 }, { label: 'Jan 26', val: 3200000 },
//   { label: 'Feb 26', val: 2900000 }, { label: 'Mar 26', val: 3600000 },
//   { label: 'Apr 26', val: 4100000 }, { label: 'May 26', val: 840000  },
// ];

// const CHANNELS: Channel[] = [
//   { name: 'WhatsApp', pct: 58, val: '₨4.87L', color: '#25D366' },
//   { name: 'Shopify',  pct: 27, val: '₨2.27L', color: '#96BF48' },
//   { name: 'Manual',   pct: 15, val: '₨1.26L', color: '#FF6A00' },
// ];

// const TOP_PRODUCTS: TopProduct[] = [
//   { name: 'Cotton Kurti',        sku: 'SKU-0135', sold: 207, revenue: '₨1,55,250', trend: 'up'   },
//   { name: 'Lawn Kurti Printed',  sku: 'SKU-0191', sold: 189, revenue: '₨1,22,850', trend: 'up'   },
//   { name: 'Block Print Dupatta', sku: 'SKU-0112', sold: 120, revenue: '₨60,000',   trend: 'up'   },
//   { name: 'Classic Lawn Suit',   sku: 'SKU-0041', sold: 142, revenue: '₨2,55,600', trend: 'up'   },
//   { name: 'Chiffon Dupatta',     sku: 'SKU-0028', sold: 98,  revenue: '₨58,800',   trend: 'down' },
//   { name: 'Linen Trouser',       sku: 'SKU-0078', sold: 88,  revenue: '₨79,200',   trend: 'up'   },
// ];

// const CATEGORY_SALES: CategorySale[] = [
//   { name: 'Suits',    val: 384000, color: 'var(--accent)'  },
//   { name: 'Kurtas',   val: 212000, color: '#8B5CF6'        },
//   { name: 'Sarees',   val: 224000, color: '#EC4899'        },
//   { name: 'Dupattas', val: 96000,  color: '#0891B2'        },
//   { name: 'Shawls',   val: 140000, color: 'var(--green)'   },
//   { name: 'Bottoms',  val: 162000, color: '#F59E0B'        },
//   { name: 'Shirts',   val: 108000, color: '#7C3AED'        },
// ];

// const STOCK_HEALTH_CATS: StockHealthCat[] = [
//   { name: 'Suits',    instock: 48, low: 8, oos: 2 },
//   { name: 'Kurtas',   instock: 38, low: 4, oos: 1 },
//   { name: 'Dupattas', instock: 30, low: 4, oos: 1 },
//   { name: 'Shawls',   instock: 24, low: 3, oos: 1 },
//   { name: 'Bottoms',  instock: 20, low: 2, oos: 0 },
//   { name: 'Shirts',   instock: 16, low: 2, oos: 0 },
// ];

// const LOW_STOCK_ITEMS: LowStockItem[] = [
//   { sku: 'SKU-0041', name: 'Classic Lawn Suit',     cat: 'Suits',    stock: 3, thr: 10, days: 2, last: '02 May', supplier: 'Al-Karam',  urgency: 'Critical' },
//   { sku: 'SKU-0028', name: 'Chiffon Dupatta White', cat: 'Dupattas', stock: 7, thr: 10, days: 4, last: '28 Apr', supplier: 'Gul Ahmed', urgency: 'High'     },
//   { sku: 'SKU-0092', name: 'Embroidered Shawl',     cat: 'Shawls',   stock: 8, thr: 10, days: 5, last: '01 May', supplier: 'Orient',    urgency: 'High'     },
//   { sku: 'SKU-0167', name: 'Shalwar Kameez Set',    cat: 'Suits',    stock: 9, thr: 10, days: 6, last: '03 May', supplier: 'Al-Karam',  urgency: 'Medium'   },
//   { sku: 'SKU-0205', name: 'Velvet Jacket Ladies',  cat: 'Jackets',  stock: 6, thr: 8,  days: 3, last: '30 Apr', supplier: 'Bonanza',   urgency: 'High'     },
//   { sku: 'SKU-0183', name: 'Chiffon Saree Pink',    cat: 'Sarees',   stock: 0, thr: 5,  days: 0, last: '15 Apr', supplier: 'Nishat',    urgency: 'Critical' },
// ];

// const DEAD_STOCK: DeadStockItem[] = [
//   { sku: 'SKU-0099', name: 'Velvet Shawl Maroon', stock: 18, last: '28 Jan 2026', days: 103, val: '₨25,200' },
//   { sku: 'SKU-0077', name: 'Georgette Dupatta',   stock: 12, last: '15 Feb 2026', days: 85,  val: '₨8,400'  },
//   { sku: 'SKU-0062', name: 'Winter Kurta XL',     stock: 9,  last: '01 Feb 2026', days: 99,  val: '₨22,500' },
//   { sku: 'SKU-0144', name: 'Lawn Set (2019)',      stock: 6,  last: '10 Jan 2026', days: 121, val: '₨10,800' },
//   { sku: 'SKU-0033', name: 'Old Print Shalwar',   stock: 4,  last: '05 Feb 2026', days: 95,  val: '₨5,600'  },
// ];

// const INV_VALUATION: ValuationRow[] = [
//   { name: 'Suits',    cost: '₨5,20,000', retail: '₨8,40,000'  },
//   { name: 'Kurtas',   cost: '₨2,80,000', retail: '₨4,60,000'  },
//   { name: 'Sarees',   cost: '₨1,80,000', retail: '₨4,20,000'  },
//   { name: 'Shawls',   cost: '₨1,20,000', retail: '₨2,40,000'  },
//   { name: 'Dupattas', cost: '₨64,000',   retail: '₨1,12,000'  },
//   { name: 'Bottoms',  cost: '₨84,000',   retail: '₨1,89,000'  },
// ];

// const PL_ROWS: PLRow[] = [
//   { label: 'Gross Revenue',        val: '₨8,41,500',    color: 'var(--text-primary)', bold: true  },
//   { label: 'Cost of Goods Sold',   val: '− ₨5,31,000', color: 'var(--red)'                       },
//   { label: 'Gross Profit',         val: '₨3,10,500',    color: 'var(--green)',        bold: true  },
//   { label: 'Shipping & Courier',   val: '− ₨42,000',   color: 'var(--red)'                       },
//   { label: 'Operational Expenses', val: '− ₨38,000',   color: 'var(--red)'                       },
//   { label: 'Staff Costs',          val: '− ₨40,000',   color: 'var(--red)'                       },
//   { label: 'Net Profit',           val: '₨1,90,500',    color: 'var(--accent)',       bold: true  },
// ];

// const EXPENSES: ExpenseRow[] = [
//   { cat: 'Shipping & Courier', val: 42000, color: 'var(--accent)' },
//   { cat: 'Staff Salaries',     val: 40000, color: '#8B5CF6'       },
//   { cat: 'Packaging',          val: 18000, color: '#0891B2'       },
//   { cat: 'Marketing',          val: 12000, color: '#EC4899'       },
//   { cat: 'Utilities',          val: 8000,  color: '#F59E0B'       },
// ];

// const COD_ITEMS: CODItem[] = [
//   { id: 'ORD-1048', cust: 'Amna Bibi',      amt: 3600, courier: 'TCS',      disp: '07 May', exp: '10 May', days: 4  },
//   { id: 'ORD-1045', cust: 'Sara Khan',       amt: 5800, courier: 'Leopards', disp: '06 May', exp: '09 May', days: 5  },
//   { id: 'ORD-1042', cust: 'Zainab Qureshi', amt: 2800, courier: 'TCS',      disp: '05 May', exp: '08 May', days: 6  },
//   { id: 'ORD-1039', cust: 'Bushra Nawaz',   amt: 4200, courier: 'M&P',      disp: '04 May', exp: '07 May', days: 7  },
//   { id: 'ORD-1036', cust: 'Lubna Tanvir',   amt: 1800, courier: 'TCS',      disp: '03 May', exp: '06 May', days: 8  },
//   { id: 'ORD-1033', cust: 'Nadia Iqbal',    amt: 7500, courier: 'Leopards', disp: '02 May', exp: '05 May', days: 9  },
//   { id: 'ORD-1030', cust: 'Rafia Usman',    amt: 2600, courier: 'TCS',      disp: '01 May', exp: '04 May', days: 10 },
//   { id: 'ORD-1027', cust: 'Hira Malik',     amt: 9000, courier: 'M&P',      disp: '30 Apr', exp: '03 May', days: 11 },
//   { id: 'ORD-1024', cust: 'Fareeha Sana',   amt: 3400, courier: 'TCS',      disp: '29 Apr', exp: '02 May', days: 12 },
//   { id: 'ORD-1021', cust: 'Kiran Baig',     amt: 4800, courier: 'Leopards', disp: '28 Apr', exp: '01 May', days: 13 },
// ];

// const SUPPLIER_PAYMENTS: SupplierPayment[] = [
//   { name: 'Al-Karam Textile', total: '₨8,40,000', paid: '₨7,95,000', out: '₨45,000', last: '02 May', due: '15 May', status: 'Active'  },
//   { name: 'Nishat Textiles',  total: '₨5,20,000', paid: '₨4,40,000', out: '₨80,000', last: '28 Apr', due: '12 May', status: 'Overdue' },
//   { name: 'Gul Ahmed',        total: '₨4,10,000', paid: '₨4,10,000', out: '₨0',      last: '06 May', due: '—',      status: 'Cleared' },
//   { name: 'Bonanza Satrangi', total: '₨2,80,000', paid: '₨2,58,000', out: '₨22,000', last: '01 May', due: '20 May', status: 'Active'  },
//   { name: 'Orient Textiles',  total: '₨1,90,000', paid: '₨1,90,000', out: '₨0',      last: '25 Apr', due: '—',      status: 'Cleared' },
// ];

// const STAFF_DATA: StaffMember[] = [
//   { name: 'Admin Khan',    role: 'Administrator',     avatar: 'AK', color: '#FF6A00', tasks: 52, done: 51, orders: 0,   errors: 0,  score: 98  },
//   { name: 'Sara Khan',     role: 'Ops Manager',       avatar: 'SK', color: '#8B5CF6', tasks: 44, done: 43, orders: 124, errors: 2,  score: 97  },
//   { name: 'Bilal Raza',    role: 'Inventory Manager', avatar: 'BR', color: '#2563EB', tasks: 38, done: 35, orders: 0,   errors: 3,  score: 92  },
//   { name: 'Fatima Noor',   role: 'Accounts',          avatar: 'FN', color: '#059669', tasks: 29, done: 27, orders: 0,   errors: 1,  score: 93  },
//   { name: 'Omar Farooq',   role: 'Rider',             avatar: 'OF', color: '#16A34A', tasks: 22, done: 22, orders: 112, errors: 2,  score: 100 },
//   { name: 'Amna Siddiqui', role: 'Sales Operator',    avatar: 'AS', color: '#EC4899', tasks: 61, done: 54, orders: 310, errors: 8,  score: 88  },
//   { name: 'Tariq Mehmood', role: 'Sales Operator',    avatar: 'TM', color: '#0891B2', tasks: 58, done: 49, orders: 278, errors: 11, score: 84  },
//   { name: 'Hassan Ali',    role: 'Courier Handler',   avatar: 'HA', color: '#7C3AED', tasks: 33, done: 28, orders: 89,  errors: 4,  score: 85  },
// ];

// const DEPT_TASKS: DeptTask[] = [
//   { name: 'Sales',      assigned: 159, done: 137, color: '#EC4899' },
//   { name: 'Operations', assigned: 44,  done: 43,  color: '#8B5CF6' },
//   { name: 'Inventory',  assigned: 69,  done: 61,  color: '#2563EB' },
//   { name: 'Logistics',  assigned: 55,  done: 50,  color: '#16A34A' },
//   { name: 'Finance',    assigned: 54,  done: 47,  color: '#059669' },
//   { name: 'Management', assigned: 52,  done: 51,  color: '#FF6A00' },
// ];

// const EXPORT_HISTORY: ExportHistoryItem[] = [
//   { time: '11 May 2026 14:30', type: 'Sales Data',      range: 'May 2026',      records: 312,  fmt: 'CSV',   by: 'Sara Khan',   status: 'Ready' },
//   { time: '11 May 2026 10:00', type: 'Inventory Data',  range: 'Snapshot',      records: 248,  fmt: 'Excel', by: 'Bilal Raza',  status: 'Ready' },
//   { time: '10 May 2026 17:15', type: 'Customer Data',   range: 'All Customers', records: 1842, fmt: 'CSV',   by: 'Admin Khan',  status: 'Ready' },
//   { time: '09 May 2026 09:30', type: 'Financial Data',  range: 'Apr 2026',      records: 892,  fmt: 'Excel', by: 'Fatima Noor', status: 'Ready' },
//   { time: '07 May 2026 16:45', type: 'Audit Logs',      range: 'Last 30 Days',  records: 4820, fmt: 'CSV',   by: 'Admin Khan',  status: 'Ready' },
//   { time: '05 May 2026 11:00', type: 'Staff Report',    range: 'Apr 2026',      records: 14,   fmt: 'Excel', by: 'Sara Khan',   status: 'Ready' },
//   { time: '01 May 2026 08:30', type: 'Sales Data',      range: 'Apr 2026',      records: 421,  fmt: 'CSV',   by: 'Admin Khan',  status: 'Ready' },
// ];

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// const fmt  = (n: number): string => '₨' + n.toLocaleString();
// const fmtL = (n: number): string => n >= 100000 ? '₨' + (n / 100000).toFixed(1) + 'L' : fmt(n);

// function statusBadgeClass(s: string): string {
//   const m: Record<string, string> = {
//     Active: 'green', Overdue: 'orange', Cleared: 'green',
//     Pending: 'yellow', Ready: 'green', Partial: 'yellow', Failed: 'red',
//   };
//   return m[s] || 'gray';
// }

// // ═══════════════════════════════════════════════════════════
// // SUB-COMPONENTS
// // ═══════════════════════════════════════════════════════════

// const Badge: React.FC<{ label: string }> = ({ label }) => (
//   <span className={`badge ${statusBadgeClass(label)}`}>{label}</span>
// );

// const CodeChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <code className="code-chip">{children}</code>
// );

// // ── Revenue Bar Chart ──
// interface RevenueChartProps { period: RevenuePeriod; }
// const RevenueChart: React.FC<RevenueChartProps> = ({ period }) => {
//   const [hovered, setHovered] = useState<number | null>(null);

//   const data: ChartDataPoint[] =
//     period === 'daily' ? DAILY_DATA :
//     period === 'monthly' ? MONTHLY_DATA :
//     WEEKLY_DATA;

//   const maxVal = Math.max(...data.map(d => d.val));
//   const H = 130;
//   const barH = (val: number) => Math.max(4, Math.round((val / maxVal) * (H - 24)));

//   return (
//     <div className="revenue-chart-container">
//       <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: H, paddingBottom: 20, position: 'relative' }}>
//         {data.map((d, i) => (
//           <div
//             key={i}
//             style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, height: '100%', cursor: 'pointer', position: 'relative' }}
//             onMouseEnter={() => setHovered(i)}
//             onMouseLeave={() => setHovered(null)}
//           >
//             {hovered === i && (
//               <div style={{
//                 display: 'block', position: 'absolute', background: '#1F2937', color: '#fff',
//                 fontSize: 9.5, padding: '3px 7px', borderRadius: 4, whiteSpace: 'nowrap',
//                 bottom: barH(d.val) + 24, zIndex: 10,
//               }}>
//                 {fmtL(d.val)}
//               </div>
//             )}
//             <div
//               className="rep-bar"
//               style={{
//                 width: '100%', height: barH(d.val),
//                 background: hovered === i ? '#E65C00' : '#FF6A00',
//                 borderRadius: '3px 3px 0 0',
//               }}
//             />
//             <div style={{ fontSize: 8.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>
//               {d.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ── Export Button ──
// interface ExportBtnProps {
//   type: string;
//   icon: string;
//   bgColor: string;
//   iconColor: string;
//   subtitle: string;
//   description: string;
//   filterLabel: string;
//   filterOptions: string[];
// }
// const ExportCard: React.FC<ExportBtnProps> = ({ type, icon, bgColor, iconColor, subtitle, description, filterLabel, filterOptions }) => {
//   const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

//   const handleExport = () => {
//     setState('loading');
//     setTimeout(() => {
//       setState('done');
//       setTimeout(() => setState('idle'), 3000);
//     }, 1800);
//   };

//   return (
//     <div className="card">
//       <div className="card-body" style={{ padding: 16 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
//           <div className="export-icon-box" style={{ background: bgColor }}>
//             <i className={`fa-solid ${icon}`} style={{ color: iconColor, fontSize: 16 }} />
//           </div>
//           <div>
//             <div style={{ fontSize: 13, fontWeight: 700 }}>{type}</div>
//             <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{subtitle}</div>
//           </div>
//         </div>
//         <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 12 }}>{description}</div>
//         <div className="form-group" style={{ marginBottom: 8 }}>
//           <div className="form-label">{filterLabel}</div>
//           <select className="form-select" style={{ width: '100%' }}>
//             {filterOptions.map(o => <option key={o}>{o}</option>)}
//           </select>
//         </div>
//         <div className="form-group" style={{ marginBottom: 10 }}>
//           <div className="form-label">Format</div>
//           <select className="form-select" style={{ width: '100%' }}>
//             <option>CSV</option>
//             <option>Excel (.xlsx)</option>
//           </select>
//         </div>
//         <button
//           className="header-btn primary"
//           style={{
//             width: '100%', justifyContent: 'center',
//             ...(state === 'done' ? { background: 'var(--green)', borderColor: 'var(--green)' } : {}),
//           }}
//           onClick={handleExport}
//           disabled={state === 'loading'}
//         >
//           {state === 'loading' && <><i className="fa-solid fa-spinner fa-spin" /> Preparing...</>}
//           {state === 'done'    && <><i className="fa-solid fa-circle-check" /> Ready — Download</>}
//           {state === 'idle'    && <><i className="fa-solid fa-download" /> Export {type}</>}
//         </button>
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: SALES REPORTS
// // ═══════════════════════════════════════════════════════════

// const SalesReportsTab: React.FC = () => {
//   const [period, setPeriod] = useState<RevenuePeriod>('weekly');
//   const [salesMonth, setSalesMonth] = useState('May 2026');

//   return (
//     <>
//       {/* KPI Row */}
//       <div className="stats-row" style={{ marginBottom: 14 }}>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Total Revenue (MTD)</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-sack-dollar ic-orange" /></div></div>
//           <div className="stat-value">₨8.4L</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +18.3% vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Total Orders (MTD)</div><div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-bag-shopping" style={{ color: 'var(--blue)' }} /></div></div>
//           <div className="stat-value">312</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +42 vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Avg. Order Value</div><div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-receipt" style={{ color: 'var(--green)' }} /></div></div>
//           <div className="stat-value">₨2,692</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +₨312 vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Conversion Rate</div><div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-bullseye" style={{ color: 'var(--yellow)' }} /></div></div>
//           <div className="stat-value">74.2%</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +2.1% vs last month</div>
//         </div>
//       </div>

//       {/* Revenue + Channel */}
//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-chart-line ic-orange" /> Revenue Trend</div>
//             <div className="card-actions">
//               <select className="form-select" style={{ height: 26, fontSize: 11 }} value={period} onChange={e => setPeriod(e.target.value as RevenuePeriod)}>
//                 <option value="daily">Last 14 Days</option>
//                 <option value="weekly">Last 8 Weeks</option>
//                 <option value="monthly">Last 6 Months</option>
//               </select>
//             </div>
//           </div>
//           <div className="card-body" style={{ padding: '12px 16px' }}>
//             <RevenueChart period={period} />
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-pie ic-orange" /> Sales by Channel</div></div>
//           <div className="card-body" style={{ padding: '12px 16px' }}>
//             {CHANNELS.map(c => (
//               <div key={c.name} style={{ marginBottom: 14 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                     <div className="channel-dot" style={{ background: c.color }} />
//                     <span style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
//                   </div>
//                   <div style={{ textAlign: 'right' }}>
//                     <span style={{ fontSize: 12, fontWeight: 700 }}>{c.val}</span>
//                     <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>{c.pct}%</span>
//                   </div>
//                 </div>
//                 <div className="prog-bar" style={{ height: 8 }}>
//                   <div className="prog-fill" style={{ width: `${c.pct}%`, background: c.color, borderRadius: 2 }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Top Products + Category Sales */}
//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-fire ic-orange" /> Top Selling Products</div>
//             <div className="card-actions">
//               <select className="form-select" style={{ height: 26, fontSize: 11 }}>
//                 <option>This Month</option><option>Last Month</option><option>Last 3 Months</option>
//               </select>
//             </div>
//           </div>
//           <div className="card-body" style={{ padding: '0 16px' }}>
//             {TOP_PRODUCTS.map((p, i) => (
//               <div key={p.sku} className="list-item" style={{ padding: '7px 0' }}>
//                 <div style={{ width: 20, textAlign: 'center', fontSize: 11, fontWeight: 700, color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
//                   {i + 1}
//                 </div>
//                 <div className="list-content">
//                   <div className="list-title">{p.name}</div>
//                   <div className="list-meta">{p.sku}</div>
//                 </div>
//                 <div className="list-right">
//                   <div style={{ fontSize: 12, fontWeight: 700 }}>{p.revenue}</div>
//                   <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
//                     {p.sold} units · <i className={`fa-solid fa-arrow-trend-${p.trend}`} style={{ color: p.trend === 'up' ? 'var(--green)' : 'var(--red)', fontSize: 9 }} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-tags ic-orange" /> Sales by Category</div></div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             {(() => {
//               const max = Math.max(...CATEGORY_SALES.map(c => c.val));
//               return CATEGORY_SALES.map(c => (
//                 <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
//                   <div style={{ width: 58, fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{c.name}</div>
//                   <div className="prog-bar" style={{ flex: 1, height: 9 }}>
//                     <div className="prog-fill" style={{ width: `${(c.val / max) * 100}%`, background: c.color, borderRadius: 2 }} />
//                   </div>
//                   <div style={{ width: 52, textAlign: 'right', fontSize: 11, fontWeight: 600 }}>{fmtL(c.val)}</div>
//                 </div>
//               ));
//             })()}
//           </div>
//         </div>
//       </div>

//       {/* Daily Sales Table */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-table" /> Daily Sales Summary</div>
//           <div className="card-actions">
//             <select className="form-select" style={{ height: 26, fontSize: 11 }} value={salesMonth} onChange={e => setSalesMonth(e.target.value)}>
//               <option>May 2026</option><option>April 2026</option><option>March 2026</option>
//             </select>
//             <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export CSV</button>
//           </div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th><th>Orders</th><th>Units Sold</th><th>Revenue</th>
//                 <th>COD</th><th>Prepaid</th><th>Returns</th><th>Net Revenue</th><th>vs Prev Day</th>
//               </tr>
//             </thead>
//             <tbody>
//               {DAILY_SALES.map((d, i) => {
//                 const prev = DAILY_SALES[i + 1];
//                 const diff = prev ? d.revenue - prev.revenue : 0;
//                 const diffColor = diff >= 0 ? 'var(--green)' : 'var(--red)';
//                 const diffIcon  = diff >= 0 ? 'arrow-trend-up' : 'arrow-trend-down';
//                 return (
//                   <tr key={d.date}>
//                     <td style={{ fontWeight: 600 }}>{d.date}</td>
//                     <td style={{ textAlign: 'center' }}>{d.orders}</td>
//                     <td style={{ textAlign: 'center' }}>{d.units}</td>
//                     <td><strong>{fmt(d.revenue)}</strong></td>
//                     <td style={{ color: 'var(--text-secondary)' }}>{fmt(d.cod)}</td>
//                     <td style={{ color: 'var(--text-secondary)' }}>{fmt(d.prepaid)}</td>
//                     <td style={{ textAlign: 'center', color: d.returns > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{d.returns}</td>
//                     <td><strong style={{ color: 'var(--green)' }}>{fmt(d.net)}</strong></td>
//                     <td>
//                       {prev ? (
//                         <span style={{ color: diffColor, fontSize: 11, fontWeight: 600 }}>
//                           <i className={`fa-solid fa-${diffIcon}`} style={{ fontSize: 9 }} /> {fmtL(Math.abs(diff))}
//                         </span>
//                       ) : (
//                         <span style={{ color: 'var(--text-muted)' }}>—</span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//         <div className="pagination">
//           <div className="pagination-info">Showing <strong>1–11</strong> of <strong>11</strong> days</div>
//           <div className="pagination-controls">
//             <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} /></button>
//             <button className="page-btn active">1</button>
//             <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} /></button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: INVENTORY REPORTS
// // ═══════════════════════════════════════════════════════════

// const InventoryReportsTab: React.FC = () => {
//   // Stock movement bar chart data
//   const weeks    = ['W1', 'W2', 'W3', 'W4'];
//   const stockIn  = [420, 310, 280, 380];
//   const stockOut = [380, 340, 310, 420];
//   const maxMov   = Math.max(...stockIn, ...stockOut);
//   const movH     = 100;

//   return (
//     <>
//       <div className="stats-row" style={{ marginBottom: 14 }}>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Total Stock Value</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-warehouse ic-orange" /></div></div>
//           <div className="stat-value">₨14.2L</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +₨1.8L vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Stock Turnover Rate</div><div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-rotate" style={{ color: 'var(--blue)' }} /></div></div>
//           <div className="stat-value">4.2x</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> Healthy range</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Low Stock Items</div><div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--yellow)' }} /></div></div>
//           <div className="stat-value">33</div>
//           <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs restocking</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Dead Stock Items</div><div className="stat-icon" style={{ background: '#FEF2F2' }}><i className="fa-solid fa-box-archive" style={{ color: 'var(--red)' }} /></div></div>
//           <div className="stat-value">8</div>
//           <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> No movement 30d+</div>
//         </div>
//       </div>

//       {/* Stock Health + Movement */}
//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Stock Health by Category</div></div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             {STOCK_HEALTH_CATS.map(c => {
//               const total = c.instock + c.low + c.oos;
//               const iP = Math.round((c.instock / total) * 100);
//               const lP = Math.round((c.low / total) * 100);
//               const oP = 100 - iP - lP;
//               return (
//                 <div key={c.name} style={{ marginBottom: 10 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
//                     <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.name}</span>
//                     <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{total} products</span>
//                   </div>
//                   <div className="stock-health-bar">
//                     <div style={{ width: `${iP}%`, background: 'var(--green)', height: 8 }} />
//                     <div style={{ width: `${lP}%`, background: 'var(--yellow)', height: 8 }} />
//                     <div style={{ width: `${oP}%`, background: 'var(--red)', height: 8 }} />
//                   </div>
//                   <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
//                     <span style={{ fontSize: 9.5, color: 'var(--green)' }}>● {c.instock} OK</span>
//                     <span style={{ fontSize: 9.5, color: 'var(--yellow)' }}>● {c.low} Low</span>
//                     <span style={{ fontSize: 9.5, color: 'var(--red)' }}>● {c.oos} OOS</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-arrow-trend-up ic-orange" /> Stock Movement (Last 30 Days)</div></div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
//               <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 <span style={{ width: 10, height: 4, background: 'var(--green)', display: 'inline-block', borderRadius: 2 }} /> Stock In
//               </span>
//               <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 <span style={{ width: 10, height: 4, background: 'var(--accent)', display: 'inline-block', borderRadius: 2 }} /> Stock Out
//               </span>
//             </div>
//             <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: movH }}>
//               {weeks.map((w, i) => (
//                 <div key={w} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                   <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%', height: movH - 20 }}>
//                     <div style={{ flex: 1, background: 'var(--green)', borderRadius: '3px 3px 0 0', height: Math.round((stockIn[i] / maxMov) * (movH - 20)), opacity: 0.85 }} />
//                     <div style={{ flex: 1, background: 'var(--accent)', borderRadius: '3px 3px 0 0', height: Math.round((stockOut[i] / maxMov) * (movH - 20)), opacity: 0.85 }} />
//                   </div>
//                   <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{w}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Low Stock Alert Table */}
//       <div className="card" style={{ marginBottom: 14 }}>
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--yellow)' }} /> Low Stock Alert Report</div>
//           <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>SKU</th><th>Product</th><th>Category</th><th>Current Stock</th>
//                 <th>Threshold</th><th>Days Until Stockout</th><th>Last Restocked</th><th>Supplier</th><th>Urgency</th>
//               </tr>
//             </thead>
//             <tbody>
//               {LOW_STOCK_ITEMS.map(p => {
//                 const uBadge: Record<string, string> = { Critical: 'orange', High: 'yellow', Medium: 'blue' };
//                 return (
//                   <tr key={p.sku}>
//                     <td><CodeChip>{p.sku}</CodeChip></td>
//                     <td><strong>{p.name}</strong></td>
//                     <td><span className="tag">{p.cat}</span></td>
//                     <td><strong style={{ color: p.stock === 0 ? 'var(--red)' : 'var(--yellow)' }}>{p.stock}</strong></td>
//                     <td style={{ color: 'var(--text-muted)' }}>{p.thr}</td>
//                     <td style={{ fontWeight: 600, color: p.days <= 2 ? 'var(--red)' : p.days <= 5 ? 'var(--yellow)' : 'var(--text-secondary)' }}>
//                       {p.days === 0 ? 'Stockout' : `~${p.days}d`}
//                     </td>
//                     <td style={{ color: 'var(--text-muted)' }}>{p.last}</td>
//                     <td style={{ color: 'var(--text-secondary)' }}>{p.supplier}</td>
//                     <td><span className={`badge ${uBadge[p.urgency] || 'gray'}`}>{p.urgency}</span></td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Dead Stock + Valuation */}
//       <div className="grid-2">
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-box-archive" style={{ color: 'var(--red)', fontSize: 12 }} /> Dead Stock Report</div>
//             <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//           </div>
//           <div className="table-wrap">
//             <table>
//               <thead><tr><th>SKU</th><th>Product</th><th>Stock</th><th>Last Sold</th><th>Days Idle</th><th>Value</th></tr></thead>
//               <tbody>
//                 {DEAD_STOCK.map(d => (
//                   <tr key={d.sku}>
//                     <td><CodeChip>{d.sku}</CodeChip></td>
//                     <td>{d.name}</td>
//                     <td style={{ fontWeight: 600 }}>{d.stock}</td>
//                     <td style={{ color: 'var(--text-muted)' }}>{d.last}</td>
//                     <td><span className="badge red">{d.days}d</span></td>
//                     <td><strong style={{ color: 'var(--red)' }}>{d.val}</strong></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-coins ic-orange" /> Inventory Valuation</div></div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--divider)' }}>
//               <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</span>
//               <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cost / Retail</span>
//             </div>
//             {INV_VALUATION.map(v => (
//               <div key={v.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
//                 <span style={{ fontSize: 12, fontWeight: 500 }}>{v.name}</span>
//                 <div style={{ textAlign: 'right' }}>
//                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.cost}</div>
//                   <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--green)' }}>{v.retail}</div>
//                 </div>
//               </div>
//             ))}
//             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', marginTop: 4 }}>
//               <span style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₨11,48,000 cost</div>
//                 <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>₨22,61,000 retail</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: FINANCIAL REPORTS
// // ═══════════════════════════════════════════════════════════

// const FinancialReportsTab: React.FC = () => {
//   const [codFilter, setCodFilter] = useState<CODFilter>('pending');
//   const expTotal = EXPENSES.reduce((a, e) => a + e.val, 0);
//   const supBadge: Record<string, string> = { Active: 'blue', Overdue: 'orange', Cleared: 'green' };

//   return (
//     <>
//       <div className="stats-row" style={{ marginBottom: 14 }}>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Gross Profit (MTD)</div><div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-hand-holding-dollar" style={{ color: 'var(--green)' }} /></div></div>
//           <div className="stat-value">₨3.1L</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 36.9% margin</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Total Expenses (MTD)</div><div className="stat-icon" style={{ background: '#FEF2F2' }}><i className="fa-solid fa-money-bill-wave" style={{ color: 'var(--red)' }} /></div></div>
//           <div className="stat-value">₨1.2L</div>
//           <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> -₨15K vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">COD Pending</div><div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-clock" style={{ color: 'var(--yellow)' }} /></div></div>
//           <div className="stat-value">₨94,200</div>
//           <div className="stat-trend neutral"><i className="fa-solid fa-minus" /> 34 orders pending</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Supplier Outstanding</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-file-invoice-dollar ic-orange" /></div></div>
//           <div className="stat-value">₨1.47L</div>
//           <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Due this week</div>
//         </div>
//       </div>

//       {/* P&L + Expense Breakdown */}
//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-scale-balanced ic-orange" /> P&L Summary</div>
//             <div className="card-actions">
//               <select className="form-select" style={{ height: 26, fontSize: 11 }}>
//                 <option>May 2026</option><option>April 2026</option><option>Q1 2026</option>
//               </select>
//             </div>
//           </div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             {PL_ROWS.map((r, i) => (
//               <div key={i} className={`pl-row${r.bold ? ' bold' : ''}`}>
//                 <span className="pl-label">{r.label}</span>
//                 <span className="pl-val" style={{ color: r.color }}>{r.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Expense Breakdown</div></div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             {EXPENSES.map(e => (
//               <div key={e.cat} style={{ marginBottom: 10 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
//                   <span style={{ fontSize: 11.5, fontWeight: 500 }}>{e.cat}</span>
//                   <span style={{ fontSize: 11.5, fontWeight: 600 }}>
//                     {fmt(e.val)} <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>({Math.round((e.val / expTotal) * 100)}%)</span>
//                   </span>
//                 </div>
//                 <div className="prog-bar" style={{ height: 7 }}>
//                   <div className="prog-fill" style={{ width: `${(e.val / expTotal) * 100}%`, background: e.color, borderRadius: 2 }} />
//                 </div>
//               </div>
//             ))}
//             <div style={{ paddingTop: 8, borderTop: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between' }}>
//               <strong style={{ fontSize: 12 }}>Total</strong>
//               <strong style={{ fontSize: 12, color: 'var(--red)' }}>{fmt(expTotal)}</strong>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* COD Report */}
//       <div className="card" style={{ marginBottom: 14 }}>
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-money-bills" /> COD Collection Report</div>
//           <div className="card-actions">
//             {(['pending', 'collected', 'all'] as CODFilter[]).map(f => (
//               <button key={f} className={`t-filter-btn${codFilter === f ? ' active' : ''}`} onClick={() => setCodFilter(f)}>
//                 {f.charAt(0).toUpperCase() + f.slice(1)}
//               </button>
//             ))}
//             <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
//           </div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Courier</th><th>Dispatched</th><th>Expected By</th><th>Days Pending</th><th>Status</th></tr>
//             </thead>
//             <tbody>
//               {COD_ITEMS.map(item => (
//                 <tr key={item.id}>
//                   <td><CodeChip>{item.id}</CodeChip></td>
//                   <td><strong>{item.cust}</strong></td>
//                   <td><strong>{fmt(item.amt)}</strong></td>
//                   <td><span className="tag">{item.courier}</span></td>
//                   <td style={{ color: 'var(--text-muted)' }}>{item.disp}</td>
//                   <td style={{ color: 'var(--text-muted)' }}>{item.exp}</td>
//                   <td><span className={`badge ${item.days > 7 ? 'orange' : item.days > 4 ? 'yellow' : 'blue'}`}>{item.days}d</span></td>
//                   <td><span className="badge yellow">Pending</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="pagination">
//           <div className="pagination-info">Showing <strong>1–10</strong> of <strong>34</strong> pending COD orders</div>
//           <div className="pagination-controls">
//             <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} /></button>
//             {[1, 2, 3, 4].map(p => <button key={p} className={`page-btn${p === 1 ? ' active' : ''}`}>{p}</button>)}
//             <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} /></button>
//           </div>
//         </div>
//       </div>

//       {/* Supplier Payments */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-handshake" /> Supplier Payment Summary</div>
//           <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr><th>Supplier</th><th>Total Purchased</th><th>Paid</th><th>Outstanding</th><th>Last Payment</th><th>Due Date</th><th>Status</th></tr>
//             </thead>
//             <tbody>
//               {SUPPLIER_PAYMENTS.map(s => (
//                 <tr key={s.name}>
//                   <td><strong>{s.name}</strong></td>
//                   <td>{s.total}</td>
//                   <td style={{ color: 'var(--green)' }}>{s.paid}</td>
//                   <td><strong style={{ color: s.out === '₨0' ? 'var(--green)' : 'var(--red)' }}>{s.out}</strong></td>
//                   <td style={{ color: 'var(--text-muted)' }}>{s.last}</td>
//                   <td style={{ color: 'var(--text-muted)' }}>{s.due}</td>
//                   <td><span className={`badge ${supBadge[s.status] || 'gray'}`}>{s.status}</span></td>
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
// // TAB: STAFF REPORTS
// // ═══════════════════════════════════════════════════════════

// const StaffReportsTab: React.FC = () => {
//   const sortedStaff = [...STAFF_DATA].sort((a, b) => b.score - a.score);
//   const top6        = sortedStaff.slice(0, 6);
//   const maxAssigned = Math.max(...DEPT_TASKS.map(d => d.assigned));

//   return (
//     <>
//       <div className="stats-row" style={{ marginBottom: 14 }}>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Total Tasks (MTD)</div><div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-list-check" style={{ color: 'var(--blue)' }} /></div></div>
//           <div className="stat-value">412</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +48 vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Avg Completion Rate</div><div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }} /></div></div>
//           <div className="stat-value">87%</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +3% this month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Orders Processed</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-bag-shopping ic-orange" /></div></div>
//           <div className="stat-value">1,164</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> by sales team</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top"><div className="stat-label">Error Rate</div><div className="stat-icon" style={{ background: '#FEF2F2' }}><i className="fa-solid fa-circle-exclamation" style={{ color: 'var(--red)' }} /></div></div>
//           <div className="stat-value">4.2%</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> Down from 5.8%</div>
//         </div>
//       </div>

//       {/* Ranking + Dept Tasks */}
//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-ranking-star ic-orange" /> Staff Performance Ranking</div>
//             <div className="card-actions">
//               <select className="form-select" style={{ height: 26, fontSize: 11 }}>
//                 <option>May 2026</option><option>April 2026</option>
//               </select>
//             </div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 16px' }}>
//             {top6.map((s, i) => {
//               const medals   = ['🥇', '🥈', '🥉'];
//               const medal    = medals[i] ?? null;
//               const sColor   = s.score >= 90 ? 'var(--green)' : s.score >= 75 ? 'var(--accent)' : 'var(--red)';
//               return (
//                 <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
//                   <div className="medal-cell">
//                     {medal ? <span>{medal}</span> : <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</span>}
//                   </div>
//                   <div className="staff-avatar-sm" style={{ background: `${s.color}20`, color: s.color }}>
//                     {s.avatar}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
//                     <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{s.role}</div>
//                   </div>
//                   <div style={{ textAlign: 'right' }}>
//                     <div style={{ fontSize: 13, fontWeight: 800, color: sColor }}>{s.score}%</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Tasks by Department</div></div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             {DEPT_TASKS.map(d => {
//               const donePct = Math.round((d.done / d.assigned) * 100);
//               return (
//                 <div key={d.name} style={{ marginBottom: 10 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
//                     <span style={{ fontSize: 11.5, fontWeight: 500 }}>{d.name}</span>
//                     <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
//                       {d.done}/{d.assigned} · <strong style={{ color: donePct >= 90 ? 'var(--green)' : 'var(--accent)' }}>{donePct}%</strong>
//                     </span>
//                   </div>
//                   <div className="prog-bar" style={{ height: 7 }}>
//                     <div className="prog-fill" style={{ width: `${(d.done / maxAssigned) * 100}%`, background: d.color, borderRadius: 2 }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Staff Detail Table */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-table" /> Staff Performance Detail</div>
//           <div className="card-actions"><button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Staff Member</th><th>Role</th><th>Tasks Assigned</th><th>Completed</th>
//                 <th>Completion %</th><th>Orders</th><th>Errors</th><th>Error Rate</th><th>Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedStaff.map(s => {
//                 const pct     = Math.round((s.done / s.tasks) * 100);
//                 const errRate = s.orders > 0 ? ((s.errors / s.orders) * 100).toFixed(1) + '%' : '—';
//                 const sB      = s.score >= 90 ? 'green' : s.score >= 75 ? 'yellow' : 'red';
//                 return (
//                   <tr key={s.name}>
//                     <td>
//                       <div className="td-flex">
//                         <div className="staff-avatar-sm" style={{ background: `${s.color}20`, color: s.color }}>{s.avatar}</div>
//                         <div style={{ fontWeight: 600 }}>{s.name}</div>
//                       </div>
//                     </td>
//                     <td><span className="tag">{s.role}</span></td>
//                     <td style={{ textAlign: 'center' }}>{s.tasks}</td>
//                     <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--green)' }}>{s.done}</td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                         <div className="prog-bar" style={{ width: 44 }}>
//                           <div className={`prog-fill ${pct >= 90 ? 'green' : pct >= 70 ? 'yellow' : 'red'}`} style={{ width: `${pct}%` }} />
//                         </div>
//                         <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
//                       </div>
//                     </td>
//                     <td style={{ textAlign: 'center' }}>{s.orders || '—'}</td>
//                     <td style={{ textAlign: 'center', color: s.errors > 5 ? 'var(--red)' : 'var(--text-muted)' }}>{s.errors}</td>
//                     <td style={{ textAlign: 'center' }}>{errRate}</td>
//                     <td><span className={`badge ${sB}`}>{s.score}%</span></td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: EXPORT DATA
// // ═══════════════════════════════════════════════════════════

// const exportCards = [
//   {
//     type: 'Sales Data',      icon: 'fa-chart-line',        bgColor: '#FFF5EE', iconColor: '#FF6A00',
//     subtitle: 'Orders, revenue, channels',
//     description: 'Export all sales transactions including order details, payment methods, customers, and revenue breakdown.',
//     filterLabel: 'Date Range',
//     filterOptions: ['This Month', 'Last Month', 'Last 3 Months', 'Custom Range'],
//   },
//   {
//     type: 'Inventory Data',  icon: 'fa-warehouse',          bgColor: '#EFF6FF', iconColor: 'var(--blue)',
//     subtitle: 'Stock levels, movements, alerts',
//     description: 'Export current stock levels, product variants, stock movement history, and low stock alerts.',
//     filterLabel: 'Data Type',
//     filterOptions: ['Current Stock Snapshot', 'Stock Movement Log', 'Low Stock Only', 'Full Product Catalog'],
//   },
//   {
//     type: 'Financial Data',  icon: 'fa-coins',              bgColor: '#F0FDF4', iconColor: 'var(--green)',
//     subtitle: 'COD, expenses, payments',
//     description: 'Export COD collection records, expenses by category, supplier payments, and profit & loss summary.',
//     filterLabel: 'Date Range',
//     filterOptions: ['This Month', 'Last Month', 'Last 3 Months', 'Custom Range'],
//   },
//   {
//     type: 'Customer Data',   icon: 'fa-users',              bgColor: '#FFFBEB', iconColor: 'var(--yellow)',
//     subtitle: 'Profiles, order history, segments',
//     description: 'Export customer profiles including contact info, order history, total spend, and segment classifications.',
//     filterLabel: 'Segment Filter',
//     filterOptions: ['All Customers', 'VIP Only', 'New (30 days)', 'Inactive (90d+)'],
//   },
//   {
//     type: 'Staff Report',    icon: 'fa-id-badge',           bgColor: '#F5F3FF', iconColor: '#7C3AED',
//     subtitle: 'Performance, tasks, activity',
//     description: 'Export staff performance metrics, task completion rates, activity logs, and role-wise breakdowns.',
//     filterLabel: 'Date Range',
//     filterOptions: ['This Month', 'Last Month', 'Custom Range'],
//   },
//   {
//     type: 'Audit Logs',      icon: 'fa-file-alt',           bgColor: '#F1F5F9', iconColor: '#475569',
//     subtitle: 'System activity, logins, changes',
//     description: 'Export a complete audit trail of all system actions, user logins, data modifications, and critical events.',
//     filterLabel: 'Date Range',
//     filterOptions: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'],
//   },
// ];

// const ExportDataTab: React.FC = () => (
//   <>
//     <div className="info-banner">
//       <i className="fa-solid fa-circle-info" />
//       <div className="info-banner-text">
//         Export any data set as <strong>CSV or Excel</strong>. Large exports are queued and a download link is sent to your dashboard. All exports are logged in the audit trail.
//       </div>
//     </div>

//     <div className="grid-3" style={{ marginBottom: 14 }}>
//       {exportCards.map(card => (
//         <ExportCard key={card.type} {...card} />
//       ))}
//     </div>

//     {/* Export History */}
//     <div className="card">
//       <div className="card-header">
//         <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Export History</div>
//         <div className="card-actions"><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last 10 exports</span></div>
//       </div>
//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr><th>Timestamp</th><th>Export Type</th><th>Date Range</th><th>Records</th><th>Format</th><th>Exported By</th><th>Status</th><th>Action</th></tr>
//           </thead>
//           <tbody>
//             {EXPORT_HISTORY.map((e, i) => (
//               <tr key={i}>
//                 <td style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{e.time}</td>
//                 <td><strong style={{ fontSize: 11.5 }}>{e.type}</strong></td>
//                 <td style={{ color: 'var(--text-muted)' }}>{e.range}</td>
//                 <td style={{ textAlign: 'center' }}>{e.records.toLocaleString()}</td>
//                 <td><span className="tag">{e.fmt}</span></td>
//                 <td>{e.by}</td>
//                 <td><Badge label={e.status} /></td>
//                 <td>
//                   <button className="t-filter-btn" style={{ height: 24, fontSize: 10 }}>
//                     <i className="fa-solid fa-download" /> Download
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // MAIN PAGE COMPONENT
// // ═══════════════════════════════════════════════════════════

// const ReportsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<ReportTab>('sales');
//   const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

//   const tabs: { id: ReportTab; icon: string; label: string }[] = [
//     { id: 'sales',     icon: 'fa-chart-line',   label: 'Sales Reports'     },
//     { id: 'inventory', icon: 'fa-boxes-stacked', label: 'Inventory Reports' },
//     { id: 'financial', icon: 'fa-coins',         label: 'Financial Reports' },
//     { id: 'staff',     icon: 'fa-users-gear',    label: 'Staff Reports'     },
//     { id: 'export',    icon: 'fa-file-export',   label: 'Export Data'       },
//   ];

//   return (
//     <div id="page-reports">
//       <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

//       <div className="section-heading">Reports &amp; Analytics</div>
//       <div className="section-subheading">
//         Track sales performance, monitor inventory health, review financials, and export data across all operations in real time.
//       </div>

//       {/* Horizontal Tabs */}
//       <div className="h-tabs">
//         {tabs.map(t => (
//           <div
//             key={t.id}
//             className={`h-tab ${activeTab === t.id ? 'active' : ''}`}
//             onClick={() => switchTab(t.id)}
//           >
//             <i className={`fa-solid ${t.icon}`} /> {t.label}
//           </div>
//         ))}
//       </div>

//       {/* Tab Panels */}
//       {activeTab === 'sales'     && <SalesReportsTab />}
//       {activeTab === 'inventory' && <InventoryReportsTab />}
//       {activeTab === 'financial' && <FinancialReportsTab />}
//       {activeTab === 'staff'     && <StaffReportsTab />}
//       {activeTab === 'export'    && <ExportDataTab />}
//     </div>
//   );
// };

// export default ReportsPage;
