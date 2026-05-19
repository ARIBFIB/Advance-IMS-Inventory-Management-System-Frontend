// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type NavPanel =
  | 'overview' | 'cod' | 'cod-log' | 'prepaid'
  | 'expenses' | 'exp-add' | 'exp-categories'
  | 'suppliers' | 'sup-payments' | 'sup-add'
  | 'reports' | 'pl'
  | 'integrations' | 'settings';

export interface CODOrder {
  order: string; customer: string; rider: string; amount: number;
  delivered: string; codStatus: string; submission: string;
}
export interface CODLog {
  date: string; rider: string; orders: number; amount: number;
  time: string; received: string; status: string;
}
export interface PrepaidOrder {
  order: string; customer: string; amount: number; channel: string;
  method: string; ref: string; date: string; status: string;
}
export interface Expense {
  date: string; desc: string; category: string; amount: number;
  method: string; by: string; ref: string;
}
export interface ExpenseCategory {
  name: string; count: number; amount: number; active: boolean; color: string;
}
export interface Supplier {
  name: string; purchased: number; paid: number; balance: number;
  lastPurchase: string; lastPayment: string; status: string;
}
export interface SupplierPayment {
  date: string; supplier: string; amount: number; method: string;
  ref: string; by: string;
}
export interface MonthlyData {
  month: string; revenue: number; cod: number; prepaid: number;
  expenses: number; supPaid: number; profit: number;
}
export interface RecentReport {
  name: string; type: string; date: string; format: string; size: string;
}
export interface Integration {
  name: string; desc: string; logoText: string; logoBg?: string; status: string; statusColor: string;
}
export interface OverlayState {
  open: boolean; title: string; content: React.ReactNode;
}