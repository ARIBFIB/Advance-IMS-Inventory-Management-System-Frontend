// ─── hooks/useDashboard.ts ────────────────────────────────────
// Fetches all data the Dashboard page needs from real backend APIs.
// Replaces static imports from dashboardData.ts with live data.

import { useState, useEffect, useCallback } from 'react';
import {
  analyticsAPI,
  ridersAPI,
  ordersAPI,
  integrationsAPI,
  notificationsAPI,
} from '../services/api';

// ── Shape of everything the Dashboard needs ───────────────────

export interface DashboardKpis {
  // From /api/analytics/dashboard
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
    returned: number;
    fulfillmentRate: string;
    codOrders: number;
    prepaidOrders: number;
  };
  revenue: {
    total: string;
    avgOrderValue: string;
    totalDiscount: string;
    paid: string;
    pending: string;
    netRevenue: string;
  };
  inventory: {
    totalVariants: number;
    totalStockUnits: number;
    totalInventoryValue: string;
    lowStockAlerts: number;
    outOfStock: number;
  };
  customers: {
    total: number;
    vip: number;
    new: number;
    inactive: number;
  };
  expenses: {
    total: string;
    count: number;
    avg: string;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  topSellingProducts: Array<{
    _id: string;
    name: string;
    sku: string;
    totalQty: number;
    totalRevenue: number;
  }>;
  generatedAt: string;
  period: { from: string | null; to: string | null };
}

export interface DashboardTrends {
  // From /api/analytics/trends
  growth: {
    orders: { current: number; previous: number; growthRate: string; trend: string };
    revenue: { current: string; previous: string; growthRate: string; trend: string };
    avgOrderValue: { current: string; previous: string; growthRate: string; trend: string };
  };
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  forecast: {
    next7DaysEstimate: string;
    dailyAverage: string;
  };
}

export interface LiveRider {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  isAvailable: boolean;
  assignedLocation?: string;
  currentOrder?: { orderId: string };
}

export interface LiveOrder {
  _id: string;
  orderNumber: string;
  customer: { firstName: string; lastName: string };
  items: Array<{ quantity: number }>;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface IntegrationStatus {
  shopify: { connected: boolean; shopName?: string; pendingOrders?: number };
  aftership: { connected: boolean; activeShipments?: number; courierCount?: number };
  checkedAt: string;
}

export interface DashboardState {
  kpis: DashboardKpis | null;
  trends: DashboardTrends | null;
  riders: LiveRider[];
  recentOrders: LiveOrder[];
  integrations: IntegrationStatus | null;
  unreadCount: number;
  loading: {
    kpis: boolean;
    trends: boolean;
    riders: boolean;
    orders: boolean;
    integrations: boolean;
  };
  errors: {
    kpis: string | null;
    trends: string | null;
    riders: string | null;
    orders: string | null;
    integrations: string | null;
  };
  lastRefreshed: Date | null;
}

// ── Initial state ─────────────────────────────────────────────

const initialState: DashboardState = {
  kpis: null,
  trends: null,
  riders: [],
  recentOrders: [],
  integrations: null,
  unreadCount: 0,
  loading: {
    kpis: true,
    trends: true,
    riders: true,
    orders: true,
    integrations: true,
  },
  errors: {
    kpis: null,
    trends: null,
    riders: null,
    orders: null,
    integrations: null,
  },
  lastRefreshed: null,
};

// ── Hook ──────────────────────────────────────────────────────

export function useDashboard(dateRange?: { from?: string; to?: string }) {
  const [state, setState] = useState<DashboardState>(initialState);

  // ── Helper: partial state update ──────────────────────────
  const patch = useCallback((partial: Partial<DashboardState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Fetch KPIs (dashboard summary) ────────────────────────
  const fetchKpis = useCallback(async () => {
    patch({ loading: { ...state.loading, kpis: true }, errors: { ...state.errors, kpis: null } });
    try {
      const params = dateRange?.from
        ? { from: dateRange.from, to: dateRange.to }
        : undefined;
      const res = await analyticsAPI.getDashboard(params);
      patch({
        kpis: res.data.data as DashboardKpis,
        loading: { ...state.loading, kpis: false },
      });
    } catch (err: any) {
      patch({
        errors: { ...state.errors, kpis: err?.response?.data?.message ?? 'Failed to load KPIs' },
        loading: { ...state.loading, kpis: false },
      });
    }
  }, [dateRange?.from, dateRange?.to]);

  // ── Fetch Trends (weekly chart + growth) ──────────────────
  const fetchTrends = useCallback(async () => {
    patch({ loading: { ...state.loading, trends: true }, errors: { ...state.errors, trends: null } });
    try {
      const res = await analyticsAPI.getSales({ groupBy: 'day' });
      // Map sales timeline to trends shape expected by WeeklyOrdersChart
      const trendsData: DashboardTrends = {
        growth: (res.data as any).data?.growth ?? {
          orders: { current: 0, previous: 0, growthRate: '0', trend: 'neutral' },
          revenue: { current: '0', previous: '0', growthRate: '0', trend: 'neutral' },
          avgOrderValue: { current: '0', previous: '0', growthRate: '0', trend: 'neutral' },
        },
        dailyRevenue: (res.data as any).data?.timeline ?? [],
        forecast: { next7DaysEstimate: '0', dailyAverage: '0' },
      };
      patch({ trends: trendsData, loading: { ...state.loading, trends: false } });
    } catch (err: any) {
      // Fallback: try the /analytics/trends endpoint
      try {
        const res2 = await (analyticsAPI as any).getTrends?.();
        patch({ trends: res2?.data?.data ?? null, loading: { ...state.loading, trends: false } });
      } catch {
        patch({
          errors: { ...state.errors, trends: err?.response?.data?.message ?? 'Failed to load trends' },
          loading: { ...state.loading, trends: false },
        });
      }
    }
  }, [dateRange?.from, dateRange?.to]);

  // ── Fetch Riders ──────────────────────────────────────────
  const fetchRiders = useCallback(async () => {
    patch({ loading: { ...state.loading, riders: true }, errors: { ...state.errors, riders: null } });
    try {
      const res = await ridersAPI.getAll({ limit: 10 });
      patch({
        riders: (res.data as any).data?.riders ?? [],
        loading: { ...state.loading, riders: false },
      });
    } catch (err: any) {
      patch({
        errors: { ...state.errors, riders: err?.response?.data?.message ?? 'Failed to load riders' },
        loading: { ...state.loading, riders: false },
      });
    }
  }, []);

  // ── Fetch Recent Orders ───────────────────────────────────
  const fetchOrders = useCallback(async () => {
    patch({ loading: { ...state.loading, orders: true }, errors: { ...state.errors, orders: null } });
    try {
      const res = await ordersAPI.getAll({ limit: 8, page: 1 });
      patch({
        recentOrders: (res.data as any).data?.orders ?? [],
        loading: { ...state.loading, orders: false },
      });
    } catch (err: any) {
      patch({
        errors: { ...state.errors, orders: err?.response?.data?.message ?? 'Failed to load orders' },
        loading: { ...state.loading, orders: false },
      });
    }
  }, []);

  // ── Fetch Integration Status ──────────────────────────────
  const fetchIntegrations = useCallback(async () => {
    patch({ loading: { ...state.loading, integrations: true }, errors: { ...state.errors, integrations: null } });
    try {
      const res = await integrationsAPI.getStatus();
      patch({
        integrations: (res.data as any).data ?? null,
        loading: { ...state.loading, integrations: false },
      });
    } catch (err: any) {
      // Non-critical — just mark as disconnected, don't break the page
      patch({
        integrations: {
          shopify: { connected: false },
          aftership: { connected: false },
          checkedAt: new Date().toISOString(),
        },
        loading: { ...state.loading, integrations: false },
      });
    }
  }, []);

  // ── Fetch Unread Notification Count ──────────────────────
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationsAPI.getAll({ read: false, limit: 1 });
      patch({ unreadCount: (res.data as any).data?.unreadCount ?? 0 });
    } catch {
      // Silent fail — badge just shows 0
    }
  }, []);

  // ── Refresh all ───────────────────────────────────────────
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchKpis(),
      fetchTrends(),
      fetchRiders(),
      fetchOrders(),
      fetchIntegrations(),
      fetchUnreadCount(),
    ]);
    setState((prev) => ({ ...prev, lastRefreshed: new Date() }));
  }, [fetchKpis, fetchTrends, fetchRiders, fetchOrders, fetchIntegrations, fetchUnreadCount]);

  // ── Mount ─────────────────────────────────────────────────
  useEffect(() => {
    refresh();
  }, [dateRange?.from, dateRange?.to]);

  return { ...state, refresh };
}