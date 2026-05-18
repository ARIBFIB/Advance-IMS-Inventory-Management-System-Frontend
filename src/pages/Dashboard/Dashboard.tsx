// ─── pages/Dashboard/Dashboard.tsx ───────────────────────────

import React from 'react';
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

import {
  HEADER_KPIS,
  STAT_CARDS,
  WEEK_BARS,
  ACTIVITY_ITEMS,
  TOP_PRODUCTS,
  RIDERS,
  RECENT_ORDERS,
  COD_RINGS,
  SPARKLINE_HEIGHTS,
  ECOMMERCE_INTEGRATIONS,
  COURIER_INTEGRATIONS,
  PAYMENT_INTEGRATIONS,
  COMMS_INTEGRATIONS,
} from '../../data/dashboardData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-dashboard">

      {/* ── Hero header with live date + KPI strip ── */}
      <DashboardHeader
        kpis={HEADER_KPIS}
        onNewOrder={() => navigate('/orders?new=true')}
        onExport={() => navigate('/reports')}
      />

      {/* ── Alert notice ── */}
      <div className="d-mini-notice">
        <i className="fa-solid fa-triangle-exclamation" />
        <div className="d-mini-notice-text">
          <strong>12 orders</strong> pending confirmation ·{' '}
          <strong>3 products</strong> below low-stock threshold ·{' '}
          <strong>₨84K COD</strong> outstanding from couriers
        </div>
        <button className="d-btn sm" onClick={() => navigate('/orders')}>
          <i className="fa-solid fa-eye" /> View Orders
        </button>
      </div>

      {/* ── KPI stat cards ── */}
      <StatCardsRow cards={STAT_CARDS} />

      {/* ── Row 1: chart + activity ── */}
      <div className="d-grid-2" style={{ marginBottom: '14px' }}>
        <WeeklyOrdersChart bars={WEEK_BARS} />
        <ActivityFeed items={ACTIVITY_ITEMS} onViewAll={() => navigate('/audit')} />
      </div>

      {/* ── Row 2: products + riders + financials ── */}
      <div className="d-grid-3" style={{ marginBottom: '14px' }}>
        <TopProductsList
          products={TOP_PRODUCTS}
          onViewAll={() => navigate('/products')}
        />
        <RiderStatusList
          riders={RIDERS}
          onManage={() => navigate('/riders')}
        />
        <FinancialSummary
          codRings={COD_RINGS}
          sparkHeights={SPARKLINE_HEIGHTS}
          onViewDetails={() => navigate('/finance')}
        />
      </div>

      {/* ── Row 3: orders table + COD status ── */}
      <div className="d-grid-31" style={{ marginBottom: '14px' }}>
        <RecentOrdersTable
          orders={RECENT_ORDERS}
          pendingCount={12}
          onViewAll={() => navigate('/orders')}
          onRowClick={(id) => navigate(`/orders/${id}`)}
        />
        <CodStatusCard
          rings={COD_RINGS}
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