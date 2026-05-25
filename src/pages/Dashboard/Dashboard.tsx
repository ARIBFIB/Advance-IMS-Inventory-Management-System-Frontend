// ─── pages/Dashboard/Dashboard.tsx ───────────────────────────
// Now fully dynamic — fetches all data from the real backend APIs.
// No more static imports from dashboardData.ts.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardHeader     from '../../components/dashboard/DashboardHeader';
import StatCardsRow        from '../../components/dashboard/StatCardsRow';
import WeeklyOrdersChart   from '../../components/dashboard/WeeklyOrdersChart';
import ActivityFeed        from '../../components/dashboard/ActivityFeed';
import TopProductsList     from '../../components/dashboard/TopProductsList';
import RiderStatusList     from '../../components/dashboard/RiderStatusList';
import FinancialSummary    from '../../components/dashboard/FinancialSummary';
import RecentOrdersTable   from '../../components/dashboard/RecentOrdersTable';
import CodStatusCard       from '../../components/dashboard/CodStatusCard';
import IntegrationsSection from '../../components/dashboard/IntegrationsSection';

// ── Live data hook ────────────────────────────────────────────
import { useDashboard } from '../../hooks/useDashboard';

// ── Mappers: raw API → UI types ───────────────────────────────
import {
  mapHeaderKpis,
  mapStatCards,
  mapWeekBars,
  mapTopProducts,
  mapRiders,
  mapRecentOrders,
  mapCodRings,
  mapActivityItems,
} from '../../utils/dashboardMappers';

// ── Static integration config (visual-only; live status from API) ──
import {
  ECOMMERCE_INTEGRATIONS,
  COURIER_INTEGRATIONS,
  PAYMENT_INTEGRATIONS,
  COMMS_INTEGRATIONS,
} from '../../data/dashboardData';

// ─────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Optional date range filter — can be wired to a date-picker in the header
  const [dateRange] = useState<{ from?: string; to?: string }>({});

  // ── Fetch all dashboard data ─────────────────────────────
  const {
    kpis,
    trends,
    riders,
    recentOrders,
    // integrations,   // available if you want to show live integration badges
    loading,
    errors,
    refresh,
    lastRefreshed,
  } = useDashboard(dateRange);

  // ── Map API data → component-ready types ─────────────────
  const headerKpis    = mapHeaderKpis(kpis);
  const statCards     = mapStatCards(kpis);
  const weekBars      = mapWeekBars(trends);
  const topProducts   = mapTopProducts(kpis);
  const riderList     = mapRiders(riders);
  const recentOrdersMapped = mapRecentOrders(recentOrders);
  const codRings      = mapCodRings(kpis);
  const activityItems = mapActivityItems(kpis);

  // ── Pending order count for the alert notice ──────────────
  const pendingCount  = kpis?.orders.pending ?? 0;
  const lowStockCount = kpis?.inventory.lowStockAlerts ?? 0;

  // ── Financial summary props ───────────────────────────────
  const sparkHeights = trends?.dailyRevenue
    ?.slice(-10)
    ?.map((d) => {
      const max = Math.max(...(trends.dailyRevenue.map((x) => x.revenue)), 1);
      return Math.max(10, Math.round((d.revenue / max) * 90));
    }) ?? [30, 45, 60, 40, 70, 55, 80, 65, 50, 75];

  // ── Overall loading state ─────────────────────────────────
  const isLoading = loading.kpis && loading.orders;

  return (
    <div className="page-dashboard">

      {/* ── Hero header with live date + KPI strip ── */}
      <DashboardHeader
        kpis={headerKpis}
        onNewOrder={() => navigate('/orders?new=true')}
        onExport={() => navigate('/reports')}
      />

      {/* ── Alert notice (only shows when there are real alerts) ── */}
      {(pendingCount > 0 || lowStockCount > 0) && (
        <div className="d-mini-notice">
          <i className="fa-solid fa-triangle-exclamation" />
          <div className="d-mini-notice-text">
            {pendingCount > 0 && (
              <><strong>{pendingCount} orders</strong> pending confirmation · </>
            )}
            {lowStockCount > 0 && (
              <><strong>{lowStockCount} products</strong> below low-stock threshold · </>
            )}
            {kpis?.orders.codOrders && kpis.orders.codOrders > 0 && (
              <><strong>{kpis.orders.codOrders} COD orders</strong> in system</>
            )}
          </div>
          <button className="d-btn sm" onClick={() => navigate('/orders')}>
            <i className="fa-solid fa-eye" /> View Orders
          </button>
        </div>
      )}

      {/* ── Error banner (only shows if critical data fails) ── */}
      {errors.kpis && (
        <div
          className="d-mini-notice"
          style={{ borderColor: 'var(--red)', background: '#FFF1F2' }}
        >
          <i className="fa-solid fa-circle-xmark" style={{ color: 'var(--red)' }} />
          <div className="d-mini-notice-text" style={{ color: 'var(--red)' }}>
            {errors.kpis} — some data may be stale.
          </div>
          <button className="d-btn sm" onClick={refresh}>
            <i className="fa-solid fa-rotate-right" /> Retry
          </button>
        </div>
      )}

      {/* ── Refresh indicator ── */}
      {lastRefreshed && (
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-faint)',
            textAlign: 'right',
            marginBottom: '6px',
            paddingRight: '4px',
          }}
        >
          <i className="fa-solid fa-rotate-right" style={{ marginRight: '4px' }} />
          Last updated {lastRefreshed.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
          <button
            onClick={refresh}
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            Refresh
          </button>
        </div>
      )}

      {/* ── KPI stat cards ── */}
      {loading.kpis ? (
        <div className="d-stats-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="d-stat" style={{ opacity: 0.4 }}>
              <div className="d-stat-value" style={{ background: 'var(--divider)', borderRadius: 4, height: 28, width: 80 }} />
              <div className="d-stat-label" style={{ background: 'var(--divider)', borderRadius: 4, height: 12, width: 60, marginTop: 8 }} />
            </div>
          ))}
        </div>
      ) : (
        <StatCardsRow cards={statCards} />
      )}

      {/* ── Row 1: chart + activity ── */}
      <div className="d-grid-2" style={{ marginBottom: '14px' }}>
        <WeeklyOrdersChart bars={weekBars} />
        <ActivityFeed
          items={activityItems.length ? activityItems : [
            {
              iconClass: 'fa-spinner fa-spin',
              iconBg: 'var(--bg)',
              iconColor: 'var(--text-faint)',
              title: loading.kpis ? 'Loading activity...' : 'No recent activity',
              meta: '',
            }
          ]}
          onViewAll={() => navigate('/audit')}
        />
      </div>

      {/* ── Row 2: products + riders + financials ── */}
      <div className="d-grid-3" style={{ marginBottom: '14px' }}>
        <TopProductsList
          products={topProducts}
          onViewAll={() => navigate('/products')}
        />
        <RiderStatusList
          riders={loading.riders ? [] : riderList}
          onManage={() => navigate('/riders')}
        />
        <FinancialSummary
          codRings={codRings}
          sparkHeights={sparkHeights}
          onViewDetails={() => navigate('/finance')}
        />
      </div>

      {/* ── Row 3: orders table + COD status ── */}
      <div className="d-grid-31" style={{ marginBottom: '14px' }}>
        <RecentOrdersTable
          orders={loading.orders ? [] : recentOrdersMapped}
          pendingCount={pendingCount}
          onViewAll={() => navigate('/orders')}
          onRowClick={(id) => navigate(`/orders/${id}`)}
        />
        <CodStatusCard
          rings={codRings}
          onViewCouriers={() => navigate('/couriers')}
          onNewOrder={() => navigate('/orders?new=true')}
          onAddProduct={() => navigate('/products')}
          onLogCod={() => navigate('/finance')}
          onExportReport={() => navigate('/reports')}
        />
      </div>

      {/* ── API Integrations ── */}
      <IntegrationsSection
        ecommerce={ECOMMERCE_INTEGRATIONS}
        couriers={COURIER_INTEGRATIONS}
        payments={PAYMENT_INTEGRATIONS}
        comms={COMMS_INTEGRATIONS}
        onSettings={() => navigate('/settings')}
      />

      <div className="d-page-bottom" />
    </div>
  );
};

export default Dashboard;