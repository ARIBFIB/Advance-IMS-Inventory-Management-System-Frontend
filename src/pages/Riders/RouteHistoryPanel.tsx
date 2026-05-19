// RidersPage.tsx
import React, { useState, useCallback } from 'react';
import './RidersPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';

import {
  NavPanel, Rider,
  RIDERS,
  fmt, rColor, avatarColor, initials,
  Badge, RiderAvatar,
} from './shared';

import OverviewPanel       from './OverviewPanel';
import AllRidersPanel      from './AllRidersPanel';
import AddRiderPanel       from './AddRiderPanel';
import AvailabilityPanel   from './AvailabilityPanel';
import ActiveDeliveriesPanel from './ActiveDeliveriesPanel';
import AssignTasksPanel    from './AssignTasksPanel';
import CompletedPanel      from './CompletedPanel';
import FailedDeliveriesPanel from './FailedDeliveriesPanel';
import LiveMapPanel        from './LiveMapPanel';
import RouteHistoryPanel   from './RouteHistoryPanel';
import PerformancePanel    from './PerformancePanel';
import EarningsPanel       from './EarningsPanel';
import ReportsPanel        from './ReportsPanel';
import IntegrationsPanel   from './IntegrationsPanel';
import SettingsPanel       from './SettingsPanel';
import ZonesPanel          from './ZonesPanel';

// ═══════════════════════════════════════════════════════════
// OVERLAY STATE
// ═══════════════════════════════════════════════════════════

interface OverlayState {
  open: boolean;
  title: string;
  content: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const RidersPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<NavPanel>('overview');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActivePanel, activePanel);
  const [overlay, setOverlay] = useState<OverlayState>({ open: false, title: '', content: null });

  // ── Rider detail overlay ──────────────────────────────
  const openRiderOverlay = useCallback((r: Rider) => {
    const balance = r.earned + r.bonus - r.paid;
    setOverlay({
      open: true,
      title: r.name,
      content: (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <RiderAvatar rider={r} size={44} fontSize={14} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{r.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {r.zone} · {r.vehicle} · {r.plate}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <Badge label={r.status} />
              <Badge label={r.availability} />
            </div>
          </div>

          {/* Key stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { val: r.deliveries,                   lbl: 'MTD Deliveries', color: 'var(--text-primary)' },
              { val: `${r.completion}%`,              lbl: 'Completion',     color: rColor(r.completion)  },
              { val: r.rating > 0 ? r.rating : '—',  lbl: 'Rating ★',      color: 'var(--yellow)'       },
            ].map(s => (
              <div key={s.lbl} style={{ background: 'var(--bg)', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Detail rows */}
          {(
            [
              ['Phone',             r.phone],
              ['CNIC',              r.cnic],
              ['Vehicle',           `${r.vehicle} · ${r.plate}`],
              ['Zone',              r.zone],
              ['Shift',             r.shift],
              ['Avg. Delivery Time',r.avgTime > 0 ? `${r.avgTime} min` : '—'],
              ['On-Time Rate',      r.onTime > 0  ? `${r.onTime}%`    : '—'],
              ['Pay Type',          r.pay],
              ['MTD Earnings',      <span style={{ color: 'var(--green)', fontWeight: 700 }}>{fmt(r.earned + r.bonus)}</span>],
              ['Balance Due',       <span style={{ color: balance > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{fmt(balance)}</span>],
              ['Join Date',         r.join],
            ] as [string, React.ReactNode][]
          ).map(([k, v], i) => (
            <div className="detail-row" key={i}>
              <div className="detail-key">{k}</div>
              <div className="detail-val">{v}</div>
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className="c-btn primary" style={{ fontSize: 10 }}>
              <i className="fa-solid fa-pen" /> Edit
            </button>
            <button className="c-btn" style={{ fontSize: 10 }}>
              <i className="fa-solid fa-clipboard-list" /> View Tasks
            </button>
            <button className="c-btn" style={{ fontSize: 10 }}>
              <i className="fa-solid fa-coins" /> Pay Now
            </button>
            <button className="c-btn" style={{ fontSize: 10, color: r.status === 'Active' ? 'var(--red)' : 'var(--green)' }}>
              <i className={`fa-solid fa-${r.status === 'Active' ? 'pause' : 'play'}`} />
              {r.status === 'Active' ? ' Deactivate' : ' Activate'}
            </button>
          </div>
        </div>
      ),
    });
  }, []);

  const closeOverlay = () => setOverlay(v => ({ ...v, open: false }));

  // ── Navigation structure ──────────────────────────────
  type NavEntry = {
    panel: NavPanel;
    icon: string;
    label: string;
    badge?: number | string;
    badgeGray?: boolean;
  };
  type NavSection = { heading: string; items: NavEntry[] };

  const navSections: NavSection[] = [
    {
      heading: 'Overview',
      items: [{ panel: 'overview', icon: 'fa-gauge', label: 'Overview' }],
    },
    {
      heading: 'Riders',
      items: [
        { panel: 'all',          icon: 'fa-person-biking',  label: 'All Riders'   },
        { panel: 'add',          icon: 'fa-user-plus',      label: 'Add Rider'    },
        { panel: 'availability', icon: 'fa-calendar-check', label: 'Availability' },
      ],
    },
    {
      heading: 'Deliveries',
      items: [
        { panel: 'active',     icon: 'fa-map-location-dot', label: 'Active Deliveries', badge: 8            },
        { panel: 'assign',     icon: 'fa-clipboard-list',   label: 'Assign Tasks',      badge: 5            },
        { panel: 'completed',  icon: 'fa-circle-check',     label: 'Completed',         badge: 34, badgeGray: true },
        { panel: 'failed-del', icon: 'fa-circle-xmark',     label: 'Failed / RTO',      badge: 3            },
      ],
    },
    {
      heading: 'Tracking',
      items: [
        { panel: 'livemap', icon: 'fa-location-dot', label: 'Live Map'      },
        { panel: 'routes',  icon: 'fa-route',        label: 'Route History' },
      ],
    },
    {
      heading: 'Analytics',
      items: [
        { panel: 'performance', icon: 'fa-chart-bar',         label: 'Performance'    },
        { panel: 'earnings',    icon: 'fa-coins',             label: 'Earnings & Pay' },
        { panel: 'reports',     icon: 'fa-file-chart-column', label: 'Reports'        },
      ],
    },
    {
      heading: 'Integrations',
      items: [{ panel: 'integrations', icon: 'fa-plug', label: 'App Integrations' }],
    },
    {
      heading: 'Configuration',
      items: [
        { panel: 'settings', icon: 'fa-gear', label: 'Settings'        },
        { panel: 'zones',    icon: 'fa-map',  label: 'Delivery Zones'  },
      ],
    },
  ];

  // ── Panel renderer ────────────────────────────────────
  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':     return <OverviewPanel onNav={setActivePanel} onOpenRider={openRiderOverlay} />;
      case 'all':          return <AllRidersPanel onNav={setActivePanel} onOpenRider={openRiderOverlay} />;
      case 'add':          return <AddRiderPanel onNav={setActivePanel} />;
      case 'availability': return <AvailabilityPanel />;
      case 'active':       return <ActiveDeliveriesPanel />;
      case 'assign':       return <AssignTasksPanel />;
      case 'completed':    return <CompletedPanel />;
      case 'failed-del':   return <FailedDeliveriesPanel />;
      case 'livemap':      return <LiveMapPanel />;
      case 'routes':       return <RouteHistoryPanel />;
      case 'performance':  return <PerformancePanel onOpenRider={openRiderOverlay} />;
      case 'earnings':     return <EarningsPanel />;
      case 'reports':      return <ReportsPanel />;
      case 'integrations': return <IntegrationsPanel />;
      case 'settings':     return <SettingsPanel />;
      case 'zones':        return <ZonesPanel />;
      default:             return null;
    }
  };

  // ── Render ────────────────────────────────────────────
  return (
    <div id="page-riders">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      <div className="page-hero">
        <div className="page-hero-title">Rider Management</div>
        <div className="page-hero-sub">
          Manage internal delivery riders, assign deliveries, track live status, and monitor
          performance metrics.
        </div>
      </div>

      <div className="rider-layout">
        {/* ── Vertical Nav ── */}
        <div className="vnav">
          {navSections.map(section => (
            <React.Fragment key={section.heading}>
              <div className="vnav-section-label">{section.heading}</div>
              {section.items.map(item => (
                <div
                  key={item.panel}
                  className={`vnav-item ${activePanel === item.panel ? 'active' : ''}`}
                  onClick={() => switchTab(item.panel)}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  {item.label}
                  {item.badge !== undefined && (
                    <span className={`vnav-badge ${item.badgeGray ? 'gray' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
              <div className="vnav-divider" />
            </React.Fragment>
          ))}
        </div>

        {/* ── Content Area ── */}
        <div className="rider-content">
          {renderPanel()}
        </div>
      </div>

      {/* ── Rider Detail Overlay ── */}
      <div
        className={`rider-backdrop ${overlay.open ? 'open' : ''}`}
        onClick={closeOverlay}
      />
      <div className={`rider-overlay ${overlay.open ? 'open' : ''}`}>
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

export default RidersPage;