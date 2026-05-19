import React, { useState, useCallback } from 'react';
import './CouriersPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';
import {
  NavPanel, CourierCompany,
  COURIERS,
  fmt,
  Badge, StarRating, PerfBar,
} from './shared';
import OverviewPanel    from './OverviewPanel';
import CompaniesPanel   from './CompaniesPanel';
import ContactsPanel    from './ContactsPanel';
import ContractsPanel   from './ContractsPanel';
import ShipmentsPanel   from './ShipmentsPanel';
import PendingPanel     from './PendingPanel';
import InTransitPanel   from './InTransitPanel';
import DeliveredPanel   from './DeliveredPanel';
import ReturnsPanel     from './ReturnsPanel';
import FailedPanel      from './FailedPanel';
import TrackingPanel    from './TrackingPanel';
import APILogPanel      from './APILogPanel';
import PerformancePanel from './PerformancePanel';
import CODPanel         from './CODPanel';
import ReportsPanel     from './ReportsPanel';
import SettingsPanel    from './SettingsPanel';
import RulesPanel       from './RulesPanel';
import ZonesPanel       from './ZonesPanel';

// ═══════════════════════════════════════════════════════════
// OVERLAY STATE TYPE
// ═══════════════════════════════════════════════════════════

interface OverlayState {
  open: boolean;
  title: string;
  content: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const CouriersPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<NavPanel>('overview');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActivePanel, activePanel);
  const [overlay, setOverlay] = useState<OverlayState>({ open: false, title: '', content: null });

  const openCourierOverlay = useCallback((c: CourierCompany) => {
    setOverlay({
      open: true,
      title: c.name,
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div className="row-avatar" style={{ width: 40, height: 40, fontSize: 12, background: 'var(--bg)' }}>
              {c.code}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.coverage} Coverage · {c.city}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}><Badge label={c.status} /></div>
          </div>

          {([
            ['Contact Person', c.contact],
            ['Phone', c.phone],
            ['Base Rate', `₨${c.baseRate}/kg`],
            ['COD Charge', `${c.codPct}%`],
            ['COD Settlement', `${c.codDays} days`],
            ['COD Outstanding', <span style={{ color: c.outstanding > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{fmt(c.outstanding)}</span>],
            ['Avg. Delivery', `${c.avgDays} days`],
            ['Success Rate', <strong>{c.successRate}%</strong>],
            ['API Connected', <Badge label={c.api ? 'Connected' : 'Not Connected'} />],
            ['Rating', <StarRating rating={c.rating} />],
          ] as [string, React.ReactNode][]).map(([k, v], i) => (
            <div className="detail-row" key={i}>
              <div className="detail-key">{k}</div>
              <div className="detail-val">{v}</div>
            </div>
          ))}

          <hr />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className="c-btn primary" style={{ fontSize: 10 }}><i className="fa-solid fa-pen" /> Edit</button>
            <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-truck" /> View Shipments</button>
            <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-coins" /> Record Payment</button>
            <button className="c-btn" style={{ fontSize: 10, color: 'var(--red)' }}><i className="fa-solid fa-pause" /> Pause</button>
          </div>
        </div>
      ),
    });
  }, []);

  const closeOverlay = () => setOverlay(v => ({ ...v, open: false }));

  type NavEntry = { panel: NavPanel; icon: string; label: string; badge?: number | string; badgeGray?: boolean };
  type NavSection = { heading: string; items: NavEntry[] };

  const navSections: NavSection[] = [
    {
      heading: 'Overview',
      items: [{ panel: 'overview', icon: 'fa-gauge', label: 'Overview' }],
    },
    {
      heading: 'Couriers',
      items: [
        { panel: 'companies', icon: 'fa-building',      label: 'Courier Companies' },
        { panel: 'contacts',  icon: 'fa-address-book',  label: 'Contacts & Rates'  },
        { panel: 'contracts', icon: 'fa-file-contract', label: 'Contracts & Terms' },
      ],
    },
    {
      heading: 'Shipments',
      items: [
        { panel: 'shipments', icon: 'fa-boxes-stacked', label: 'All Shipments',    badge: 142              },
        { panel: 'pending',   icon: 'fa-clock',         label: 'Pending Dispatch', badge: 18               },
        { panel: 'intransit', icon: 'fa-truck-moving',  label: 'In Transit',       badge: 54               },
        { panel: 'delivered', icon: 'fa-circle-check',  label: 'Delivered',        badge: 68, badgeGray: true },
        { panel: 'returns',   icon: 'fa-rotate-left',   label: 'Returns / RTO',    badge: 6                },
        { panel: 'failed',    icon: 'fa-circle-xmark',  label: 'Failed Delivery',  badge: 4                },
      ],
    },
    {
      heading: 'Tracking',
      items: [
        { panel: 'tracking', icon: 'fa-location-dot', label: 'Live Tracking' },
        { panel: 'apilog',   icon: 'fa-plug',         label: 'API Sync Log'  },
      ],
    },
    {
      heading: 'Analytics',
      items: [
        { panel: 'performance', icon: 'fa-chart-bar',         label: 'Performance'       },
        { panel: 'cod',         icon: 'fa-coins',             label: 'COD Reconciliation' },
        { panel: 'reports',     icon: 'fa-file-chart-column', label: 'Reports'           },
      ],
    },
    {
      heading: 'Configuration',
      items: [
        { panel: 'settings', icon: 'fa-gear',    label: 'Settings'         },
        { panel: 'rules',    icon: 'fa-sitemap', label: 'Assignment Rules' },
        { panel: 'zones',    icon: 'fa-map',     label: 'Zones & Coverage' },
      ],
    },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':     return <OverviewPanel onNav={setActivePanel} onOpenOverlay={openCourierOverlay} />;
      case 'companies':    return <CompaniesPanel onOpenOverlay={openCourierOverlay} />;
      case 'contacts':     return <ContactsPanel />;
      case 'contracts':    return <ContractsPanel />;
      case 'shipments':    return <ShipmentsPanel />;
      case 'pending':      return <PendingPanel />;
      case 'intransit':    return <InTransitPanel />;
      case 'delivered':    return <DeliveredPanel />;
      case 'returns':      return <ReturnsPanel />;
      case 'failed':       return <FailedPanel />;
      case 'tracking':     return <TrackingPanel />;
      case 'apilog':       return <APILogPanel />;
      case 'performance':  return <PerformancePanel />;
      case 'cod':          return <CODPanel />;
      case 'reports':      return <ReportsPanel />;
      case 'settings':     return <SettingsPanel />;
      case 'rules':        return <RulesPanel />;
      case 'zones':        return <ZonesPanel />;
      default:             return null;
    }
  };

  return (
    <div id="page-couriers">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      <div className="page-hero">
        <div className="page-hero-title">Courier Management</div>
        <div className="page-hero-sub">
          Manage courier partners, shipments, tracking, performance, and all delivery operations.
        </div>
      </div>

      <div className="courier-layout">
        {/* Vertical Nav */}
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
                    <span className={`vnav-badge ${item.badgeGray ? 'gray' : ''}`}>{item.badge}</span>
                  )}
                </div>
              ))}
              <div className="vnav-divider" />
            </React.Fragment>
          ))}
        </div>

        {/* Content Panels */}
        <div className="courier-content">
          {renderPanel()}
        </div>
      </div>

      {/* Overlay Backdrop */}
      <div
        className={`courier-backdrop ${overlay.open ? 'open' : ''}`}
        onClick={closeOverlay}
      />

      {/* Overlay Panel */}
      <div className={`courier-overlay ${overlay.open ? 'open' : ''}`}>
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

export default CouriersPage;

// import React, { useState, useEffect, useCallback } from 'react';
// import './CouriersPage.css';
// import TopLoadingBar from '../../components/ui/TopLoadingBar';
// import { useTabLoading } from '../../hooks/useTabLoading';

// // ═══════════════════════════════════════════════════════════
// // TYPES
// // ═══════════════════════════════════════════════════════════

// type NavPanel =
//   | 'overview' | 'companies' | 'contacts' | 'contracts'
//   | 'shipments' | 'pending' | 'intransit' | 'delivered' | 'returns' | 'failed'
//   | 'tracking' | 'apilog'
//   | 'performance' | 'cod' | 'reports'
//   | 'settings' | 'rules' | 'zones';

// interface CourierCompany {
//   id: number; name: string; code: string; contact: string; phone: string;
//   city: string; coverage: string; baseRate: number; codPct: number; codDays: number;
//   outstanding: number; avgDays: number; successRate: number; api: boolean;
//   rating: number; status: 'Active' | 'Paused' | 'Inactive';
// }
// interface Shipment {
//   track: string; order: string; customer: string; courier: string; city: string;
//   weight: string; cod: number; status: string; dispatched: string; est: string; codStatus: string;
// }
// interface PendingOrder {
//   order: string; customer: string; city: string; items: number;
//   weight: string; cod: string; date: string; waiting: string;
// }
// interface TransitItem {
//   track: string; order: string; customer: string; courier: string; location: string;
//   status: string; dispatched: string; est: string; daysLeft: number; cod: string;
// }
// interface DeliveredItem {
//   track: string; order: string; customer: string; courier: string;
//   deliveredOn: string; days: number; cod: number; codStatus: string; proof: string;
// }
// interface RTOItem {
//   track: string; order: string; customer: string; courier: string;
//   reason: string; dispatched: string; rtoDate: string; cod: string; restock: string;
// }
// interface FailedItem {
//   track: string; order: string; customer: string; phone: string; courier: string;
//   attempts: number; last: string; reason: string; action: string;
// }
// interface PerfItem {
//   name: string; assigned: number; delivered: number; rto: number; failed: number;
//   rate: number; rtoRate: number; avgDays: number; codCollPct: number; slaPct: number; rating: number;
// }
// interface CODPending {
//   order: string; courier: string; customer: string; delivered: string;
//   amount: number; days: number; due: string;
// }
// interface CODSummary {
//   courier: string; delivered: number; codAmt: string; collected: string;
//   pending: string; overdue: string; freq: string; last: string; next: string;
// }
// interface Contract {
//   courier: string; ref: string; start: string; end: string; sla: number;
//   penalty: number; codDays: number; autoRenew: string; status: string;
// }
// interface Contact {
//   courier: string; name: string; role: string; phone: string;
//   email: string; city: string; last: string;
// }
// interface Rule {
//   priority: number; name: string; condition: string; assign: string;
//   fallback: string; status: string; applied: number;
// }
// interface Zone {
//   name: string; cities: string; primary: string; backup: string; days: string; mult: string;
// }
// interface CityMap {
//   city: string; province: string; zone: string; primary: string; backup: string; days: number;
// }
// interface RateCard {
//   courier: string; zone: string; weight: string; base: string;
//   extra: string; codPct: string; fuel: string; days: string;
// }
// interface APILog {
//   ts: string; courier: string; type: string; track: string;
//   code: number; ms: number; result: string;
// }
// interface APICredential {
//   courier: string; endpoint: string; key: string; connected: boolean; lastPing: string;
// }
// interface BulkSync {
//   courier: string; lastSync: string; shipments: number; updated: number; errors: number; status: string;
// }
// interface RecentReport {
//   name: string; type: string; generated: string; format: string; size: string;
// }

// // ═══════════════════════════════════════════════════════════
// // STATIC DATA
// // ═══════════════════════════════════════════════════════════

// const COURIERS: CourierCompany[] = [
//   { id:1, name:'TCS Express',      code:'TCS',    contact:'Naseer Rana',   phone:'0321-1112233', city:'Lahore',    coverage:'Nationwide', baseRate:200, codPct:1.5, codDays:7,  outstanding:38000, avgDays:2.1, successRate:91, api:true,  rating:4.5, status:'Active' },
//   { id:2, name:'Leopards Courier', code:'LCS',    contact:'Bilal Shah',    phone:'0300-4445566', city:'Karachi',   coverage:'Nationwide', baseRate:180, codPct:1.2, codDays:5,  outstanding:29000, avgDays:1.9, successRate:94, api:true,  rating:4.7, status:'Active' },
//   { id:3, name:'M&P Express',      code:'MNP',    contact:'Tariq Mehmood', phone:'0333-7778899', city:'Lahore',    coverage:'Nationwide', baseRate:170, codPct:1.0, codDays:7,  outstanding:10000, avgDays:1.8, successRate:88, api:true,  rating:4.2, status:'Active' },
//   { id:4, name:'Trax',             code:'TRAX',   contact:'Sadia Naz',     phone:'0311-0001112', city:'Karachi',   coverage:'Nationwide', baseRate:160, codPct:1.5, codDays:10, outstanding:7000,  avgDays:2.4, successRate:82, api:false, rating:3.8, status:'Active' },
//   { id:5, name:'PostEx',           code:'POSTEX', contact:'Imran Saeed',   phone:'0345-3334445', city:'Multan',    coverage:'Regional',   baseRate:190, codPct:1.3, codDays:7,  outstanding:0,     avgDays:2.8, successRate:79, api:false, rating:3.6, status:'Paused' },
//   { id:6, name:'BlueEX',           code:'BLUEEX', contact:'Ali Rana',      phone:'0300-8889990', city:'Islamabad', coverage:'Nationwide', baseRate:210, codPct:1.1, codDays:5,  outstanding:0,     avgDays:2.0, successRate:90, api:false, rating:4.0, status:'Active' },
// ];

// const SHIPMENTS: Shipment[] = [
//   { track:'TCS-2026-04821',  order:'ORD-1046', customer:'Sara Khan',       courier:'TCS',    city:'Islamabad', weight:'0.8', cod:3600,  status:'In Transit', dispatched:'07 May', est:'12 May', codStatus:'Pending'   },
//   { track:'LCS-2026-01234',  order:'ORD-1044', customer:'Rabia Ahmed',     courier:'LCS',    city:'Karachi',   weight:'0.5', cod:2200,  status:'Delivered',  dispatched:'06 May', est:'09 May', codStatus:'Collected'  },
//   { track:'MNP-2026-08812',  order:'ORD-1045', customer:'Nadia Malik',     courier:'MNP',    city:'Rawalpindi',weight:'1.2', cod:7100,  status:'In Transit', dispatched:'06 May', est:'10 May', codStatus:'Pending'   },
//   { track:'TCS-2026-04800',  order:'ORD-1043', customer:'Hira Baig',       courier:'TCS',    city:'Multan',    weight:'0.6', cod:3900,  status:'Delivered',  dispatched:'05 May', est:'08 May', codStatus:'Collected'  },
//   { track:'TRAX-2026-0312',  order:'ORD-1040', customer:'Sadia Hussain',   courier:'TRAX',   city:'Peshawar',  weight:'2.1', cod:9200,  status:'In Transit', dispatched:'04 May', est:'11 May', codStatus:'Pending'   },
//   { track:'LCS-2026-01200',  order:'ORD-1039', customer:'Bushra Nawaz',    courier:'LCS',    city:'Quetta',    weight:'0.4', cod:3100,  status:'Delivered',  dispatched:'04 May', est:'07 May', codStatus:'Collected'  },
//   { track:'TCS-2026-04780',  order:'ORD-1037', customer:'Maira Usman',     courier:'TCS',    city:'Lahore',    weight:'0.9', cod:5700,  status:'RTO',        dispatched:'03 May', est:'06 May', codStatus:'N/A'       },
//   { track:'MNP-2026-08780',  order:'ORD-1036', customer:'Iram Sheikh',     courier:'MNP',    city:'Karachi',   weight:'0.7', cod:4100,  status:'Pending',    dispatched:'—',      est:'—',      codStatus:'Pending'   },
//   { track:'TRAX-2026-0298',  order:'ORD-1042', customer:'Zainab Qureshi',  courier:'TRAX',   city:'Faisalabad',weight:'1.4', cod:5400,  status:'Failed',     dispatched:'05 May', est:'09 May', codStatus:'N/A'       },
//   { track:'LCS-2026-01190',  order:'ORD-1035', customer:'Lubna Tanvir',    courier:'LCS',    city:'Lahore',    weight:'0.5', cod:1600,  status:'Delivered',  dispatched:'02 May', est:'05 May', codStatus:'Collected'  },
//   { track:'TCS-2026-04770',  order:'ORD-1034', customer:'Amna Bibi',       courier:'TCS',    city:'Faisalabad',weight:'1.0', cod:4500,  status:'Delivered',  dispatched:'01 May', est:'04 May', codStatus:'Collected'  },
//   { track:'POSTEX-2026-0021',order:'ORD-1033', customer:'Fatima Zara',     courier:'POSTEX', city:'Multan',    weight:'0.8', cod:2800,  status:'In Transit', dispatched:'08 May', est:'13 May', codStatus:'Pending'   },
// ];

// const PENDING_ORDERS: PendingOrder[] = [
//   { order:'ORD-1048', customer:'Amna Bibi',      city:'Lahore',      items:3, weight:'0.9 kg', cod:'₨4,200', date:'10 May 2026', waiting:'1h'  },
//   { order:'ORD-1042', customer:'Zainab Qureshi', city:'Faisalabad',  items:3, weight:'1.4 kg', cod:'₨5,400', date:'09 May 2026', waiting:'26h' },
//   { order:'ORD-1036', customer:'Iram Sheikh',    city:'Karachi',     items:2, weight:'0.7 kg', cod:'₨4,100', date:'08 May 2026', waiting:'50h' },
//   { order:'ORD-1034', customer:'Tania Siddiqui', city:'Rawalpindi',  items:4, weight:'2.1 kg', cod:'₨6,800', date:'07 May 2026', waiting:'74h' },
// ];

// const TRANSIT_ITEMS: TransitItem[] = [
//   { track:'TCS-2026-04821',   order:'ORD-1046', customer:'Sara Khan',    courier:'TCS',    location:'Islamabad Hub', status:'In Transit',       dispatched:'07 May', est:'12 May', daysLeft:1, cod:'₨3,600' },
//   { track:'MNP-2026-08812',   order:'ORD-1045', customer:'Nadia Malik',  courier:'MNP',    location:'Lahore Depot',  status:'In Transit',       dispatched:'06 May', est:'10 May', daysLeft:0, cod:'₨7,100' },
//   { track:'TRAX-2026-0312',   order:'ORD-1040', customer:'Sadia Hussain',courier:'TRAX',   location:'Peshawar Hub',  status:'In Transit',       dispatched:'04 May', est:'11 May', daysLeft:0, cod:'₨9,200' },
//   { track:'LCS-2026-01188',   order:'ORD-1038', customer:'Asma Iqbal',   courier:'LCS',    location:'Karachi Hub',   status:'Out for Delivery', dispatched:'09 May', est:'11 May', daysLeft:0, cod:'₨2,800' },
//   { track:'POSTEX-2026-0021', order:'ORD-1033', customer:'Fatima Zara',  courier:'POSTEX', location:'Multan Depot',  status:'In Transit',       dispatched:'08 May', est:'13 May', daysLeft:2, cod:'₨2,800' },
// ];

// const DELIVERED_ITEMS: DeliveredItem[] = [
//   { track:'LCS-2026-01234',  order:'ORD-1044', customer:'Rabia Ahmed',  courier:'LCS', deliveredOn:'09 May 2026', days:3, cod:2200, codStatus:'Collected', proof:'Yes' },
//   { track:'TCS-2026-04800',  order:'ORD-1043', customer:'Hira Baig',    courier:'TCS', deliveredOn:'08 May 2026', days:3, cod:3900, codStatus:'Collected', proof:'Yes' },
//   { track:'LCS-2026-01200',  order:'ORD-1039', customer:'Bushra Nawaz', courier:'LCS', deliveredOn:'07 May 2026', days:3, cod:3100, codStatus:'Collected', proof:'No'  },
//   { track:'LCS-2026-01190',  order:'ORD-1035', customer:'Lubna Tanvir', courier:'LCS', deliveredOn:'05 May 2026', days:3, cod:1600, codStatus:'Collected', proof:'Yes' },
//   { track:'TCS-2026-04770',  order:'ORD-1034', customer:'Amna Bibi',    courier:'TCS', deliveredOn:'04 May 2026', days:3, cod:4500, codStatus:'Pending',   proof:'Yes' },
// ];

// const RTO_ITEMS: RTOItem[] = [
//   { track:'TCS-2026-04780', order:'ORD-1037', customer:'Maira Usman', courier:'TCS',  reason:'Wrong Address',   dispatched:'03 May', rtoDate:'09 May', cod:'—', restock:'Pending' },
//   { track:'LCS-2026-01150', order:'ORD-1022', customer:'Hina Akhtar', courier:'LCS',  reason:'Customer Refused',dispatched:'28 Apr', rtoDate:'05 May', cod:'—', restock:'Done'    },
//   { track:'TRAX-2026-0250', order:'ORD-1018', customer:'Sana Farooq', courier:'TRAX', reason:'Not Reachable',   dispatched:'25 Apr', rtoDate:'02 May', cod:'—', restock:'Done'    },
// ];

// const FAILED_ITEMS: FailedItem[] = [
//   { track:'TRAX-2026-0298',  order:'ORD-1042', customer:'Zainab Qureshi', phone:'0300-9988776', courier:'TRAX', attempts:3, last:'09 May 2026', reason:'Not Home',            action:'Pending'      },
//   { track:'TCS-2026-04760',  order:'ORD-1019', customer:'Ayesha Tariq',   phone:'0321-1234567', courier:'TCS',  attempts:3, last:'07 May 2026', reason:'Wrong Pin',           action:'Pending'      },
//   { track:'MNP-2026-08700',  order:'ORD-1015', customer:'Sobia Ali',      phone:'0333-7766554', courier:'MNP',  attempts:3, last:'06 May 2026', reason:'Address Unclear',     action:'Pending'      },
//   { track:'LCS-2026-01100',  order:'ORD-1011', customer:'Mariam Khan',    phone:'0311-8899001', courier:'LCS',  attempts:3, last:'05 May 2026', reason:'Customer Not Available',action:'Re-dispatched'},
// ];

// const PERF_DATA: PerfItem[] = [
//   { name:'TCS Express',      assigned:56, delivered:51, rto:3, failed:2, rate:91, rtoRate:5.4,  avgDays:2.1, codCollPct:96, slaPct:88, rating:4.5 },
//   { name:'Leopards Courier', assigned:42, delivered:39, rto:2, failed:1, rate:93, rtoRate:4.8,  avgDays:1.9, codCollPct:98, slaPct:94, rating:4.7 },
//   { name:'M&P Express',      assigned:28, delivered:25, rto:2, failed:1, rate:89, rtoRate:7.1,  avgDays:1.8, codCollPct:97, slaPct:90, rating:4.2 },
//   { name:'Trax',             assigned:16, delivered:13, rto:2, failed:1, rate:81, rtoRate:12.5, avgDays:2.4, codCollPct:91, slaPct:75, rating:3.8 },
// ];

// const COD_PENDING: CODPending[] = [
//   { order:'ORD-1046', courier:'TCS',    customer:'Sara Khan',    delivered:'09 May 2026', amount:3600, days:2, due:'16 May' },
//   { order:'ORD-1045', courier:'MNP',    customer:'Nadia Malik',  delivered:'10 May 2026', amount:7100, days:1, due:'17 May' },
//   { order:'ORD-1040', courier:'TRAX',   customer:'Sadia Hussain',delivered:'08 May 2026', amount:9200, days:3, due:'18 May' },
//   { order:'ORD-1032', courier:'TCS',    customer:'Amna Bibi',    delivered:'04 May 2026', amount:4200, days:7, due:'11 May' },
//   { order:'ORD-1029', courier:'LCS',    customer:'Fatima Zara',  delivered:'03 May 2026', amount:1800, days:8, due:'10 May' },
// ];

// const COD_SUMMARY: CODSummary[] = [
//   { courier:'TCS Express',      delivered:51, codAmt:'₨1,12,000', collected:'₨74,000', pending:'₨38,000', overdue:'₨12,000', freq:'Weekly',    last:'05 May', next:'12 May' },
//   { courier:'Leopards Courier', delivered:39, codAmt:'₨84,000',   collected:'₨55,000', pending:'₨29,000', overdue:'₨0',      freq:'Weekly',    last:'06 May', next:'13 May' },
//   { courier:'M&P Express',      delivered:25, codAmt:'₨52,000',   collected:'₨42,000', pending:'₨10,000', overdue:'₨0',      freq:'Bi-weekly', last:'02 May', next:'16 May' },
//   { courier:'Trax',             delivered:13, codAmt:'₨28,000',   collected:'₨21,000', pending:'₨7,000',  overdue:'₨7,000',  freq:'Weekly',    last:'29 Apr', next:'06 May' },
// ];

// const CONTRACTS: Contract[] = [
//   { courier:'TCS Express',      ref:'CTR-2026-001', start:'01 Jan 2026', end:'31 Dec 2026', sla:3, penalty:100, codDays:7,  autoRenew:'Yes', status:'Active' },
//   { courier:'Leopards Courier', ref:'CTR-2026-002', start:'01 Feb 2026', end:'31 Jan 2027', sla:2, penalty:50,  codDays:5,  autoRenew:'Yes', status:'Active' },
//   { courier:'M&P Express',      ref:'CTR-2026-003', start:'15 Feb 2026', end:'14 Feb 2027', sla:2, penalty:75,  codDays:7,  autoRenew:'No',  status:'Active' },
//   { courier:'Trax',             ref:'CTR-2026-004', start:'01 Mar 2026', end:'28 Feb 2027', sla:3, penalty:50,  codDays:10, autoRenew:'No',  status:'Active' },
// ];

// const CONTACTS: Contact[] = [
//   { courier:'TCS Express',      name:'Naseer Rana',   role:'Account Manager', phone:'0321-1112233', email:'naseer@tcs.com',     city:'Lahore',    last:'08 May 2026' },
//   { courier:'Leopards Courier', name:'Bilal Shah',    role:'Sales Rep',       phone:'0300-4445566', email:'bilal@leopards.com', city:'Karachi',   last:'07 May 2026' },
//   { courier:'M&P Express',      name:'Tariq Mehmood', role:'Ops Manager',     phone:'0333-7778899', email:'tariq@mnp.com',      city:'Lahore',    last:'05 May 2026' },
//   { courier:'Trax',             name:'Sadia Naz',     role:'Account Manager', phone:'0311-0001112', email:'sadia@trax.com',     city:'Karachi',   last:'04 May 2026' },
//   { courier:'BlueEX',           name:'Ali Rana',      role:'Key Account',     phone:'0300-8889990', email:'ali@blueex.com',     city:'Islamabad', last:'01 May 2026' },
// ];

// const RULES: Rule[] = [
//   { priority:1, name:'Karachi — Leopards', condition:'City = Karachi',    assign:'Leopards', fallback:'TCS', status:'Active', applied:34 },
//   { priority:2, name:'Heavy Orders — TCS', condition:'Weight > 3 kg',     assign:'TCS',      fallback:'MNP', status:'Active', applied:12 },
//   { priority:3, name:'High COD — TCS',     condition:'COD > ₨8,000',      assign:'TCS',      fallback:'LCS', status:'Active', applied:8  },
//   { priority:4, name:'Punjab — Leopards',  condition:'Province = Punjab',  assign:'Leopards', fallback:'TCS', status:'Active', applied:41 },
//   { priority:5, name:'Default — TCS',      condition:'All others',         assign:'TCS',      fallback:'LCS', status:'Active', applied:47 },
// ];

// const ZONES: Zone[] = [
//   { name:'Lahore Metro',    cities:'Lahore, Sheikhupura, Kasur',        primary:'Leopards', backup:'TCS',  days:'1-2', mult:'1.0' },
//   { name:'Karachi Metro',   cities:'Karachi, Hyderabad',                primary:'M&P',      backup:'LCS',  days:'1-2', mult:'1.0' },
//   { name:'Islamabad/RWP',   cities:'Islamabad, Rawalpindi',             primary:'TCS',      backup:'LCS',  days:'1-2', mult:'1.0' },
//   { name:'Punjab Outskirts',cities:'Faisalabad, Multan, Gujranwala',    primary:'TCS',      backup:'TRAX', days:'2-3', mult:'1.1' },
//   { name:'KPK & FATA',      cities:'Peshawar, Abbottabad, Mardan',      primary:'TCS',      backup:'—',    days:'3-5', mult:'1.3' },
//   { name:'Balochistan',     cities:'Quetta, Gwadar',                    primary:'TCS',      backup:'—',    days:'4-6', mult:'1.5' },
// ];

// const CITY_MAP: CityMap[] = [
//   { city:'Lahore',      province:'Punjab',     zone:'Lahore Metro',     primary:'Leopards', backup:'TCS',  days:1 },
//   { city:'Karachi',     province:'Sindh',      zone:'Karachi Metro',    primary:'M&P',      backup:'LCS',  days:1 },
//   { city:'Islamabad',   province:'Federal',    zone:'Islamabad/RWP',    primary:'TCS',      backup:'LCS',  days:1 },
//   { city:'Rawalpindi',  province:'Punjab',     zone:'Islamabad/RWP',    primary:'TCS',      backup:'LCS',  days:1 },
//   { city:'Faisalabad',  province:'Punjab',     zone:'Punjab Outskirts', primary:'TCS',      backup:'TRAX', days:2 },
//   { city:'Multan',      province:'Punjab',     zone:'Punjab Outskirts', primary:'TCS',      backup:'TRAX', days:2 },
//   { city:'Peshawar',    province:'KPK',        zone:'KPK & FATA',       primary:'TCS',      backup:'—',    days:3 },
//   { city:'Quetta',      province:'Balochistan',zone:'Balochistan',      primary:'TCS',      backup:'—',    days:4 },
// ];

// const RATES: RateCard[] = [
//   { courier:'TCS Express', zone:'Nationwide', weight:'0-1 kg', base:'₨200', extra:'₨80/kg',  codPct:'1.5%', fuel:'5%', days:'1-3' },
//   { courier:'TCS Express', zone:'Remote',     weight:'0-1 kg', base:'₨280', extra:'₨100/kg', codPct:'1.5%', fuel:'5%', days:'3-5' },
//   { courier:'Leopards',    zone:'Nationwide', weight:'0-1 kg', base:'₨180', extra:'₨70/kg',  codPct:'1.2%', fuel:'4%', days:'1-2' },
//   { courier:'M&P Express', zone:'Nationwide', weight:'0-1 kg', base:'₨170', extra:'₨65/kg',  codPct:'1.0%', fuel:'3%', days:'1-2' },
//   { courier:'Trax',        zone:'Nationwide', weight:'0-1 kg', base:'₨160', extra:'₨60/kg',  codPct:'1.5%', fuel:'5%', days:'2-3' },
// ];

// const API_LOGS: APILog[] = [
//   { ts:'2026-05-11 08:00:02', courier:'TCS',      type:'Status Poll',   track:'TCS-2026-04821',   code:200, ms:312,  result:'Updated'   },
//   { ts:'2026-05-11 08:00:04', courier:'Leopards', type:'Status Poll',   track:'LCS-2026-01234',   code:200, ms:287,  result:'No Change'  },
//   { ts:'2026-05-11 08:00:07', courier:'Trax',     type:'Status Poll',   track:'TRAX-2026-0312',   code:502, ms:5001, result:'Error'      },
//   { ts:'2026-05-11 08:00:09', courier:'M&P',      type:'Status Poll',   track:'MNP-2026-08812',   code:200, ms:198,  result:'Updated'    },
//   { ts:'2026-05-11 07:00:01', courier:'TCS',      type:'Create Booking',track:'TCS-2026-04900',   code:201, ms:450,  result:'Created'    },
//   { ts:'2026-05-11 07:00:08', courier:'Trax',     type:'Status Poll',   track:'TRAX-2026-0298',   code:404, ms:120,  result:'Not Found'  },
//   { ts:'2026-05-11 06:00:03', courier:'Leopards', type:'Status Poll',   track:'LCS-2026-01190',   code:200, ms:305,  result:'Updated'    },
//   { ts:'2026-05-11 06:00:05', courier:'M&P',      type:'Status Poll',   track:'MNP-2026-08780',   code:200, ms:221,  result:'No Change'  },
// ];

// const API_CREDS: APICredential[] = [
//   { courier:'TCS Express',      endpoint:'https://api.tcs.com.pk/track',   key:'TCS-••••••••••••7f2a',  connected:true,  lastPing:'11 May 08:00' },
//   { courier:'Leopards Courier', endpoint:'https://api.leopards.com.pk/',    key:'LCS-••••••••••••3b19',  connected:true,  lastPing:'11 May 08:00' },
//   { courier:'M&P Express',      endpoint:'https://mpm.com.pk/api/v2/',      key:'MNP-••••••••••••9c44',  connected:true,  lastPing:'11 May 08:00' },
//   { courier:'Trax',             endpoint:'https://api.traxlogistics.com/',  key:'Not configured',         connected:false, lastPing:'N/A'           },
// ];

// const BULK_SYNC: BulkSync[] = [
//   { courier:'TCS Express',      lastSync:'11 May 08:00', shipments:21, updated:4, errors:0, status:'OK'    },
//   { courier:'Leopards Courier', lastSync:'11 May 08:00', shipments:15, updated:2, errors:0, status:'OK'    },
//   { courier:'M&P Express',      lastSync:'11 May 08:00', shipments:9,  updated:1, errors:0, status:'OK'    },
//   { courier:'Trax',             lastSync:'11 May 08:00', shipments:6,  updated:0, errors:3, status:'Error' },
// ];

// const RECENT_REPORTS: RecentReport[] = [
//   { name:'Delivery Performance — Apr 2026', type:'Performance', generated:'01 May 2026', format:'Excel', size:'48 KB' },
//   { name:'COD Reconciliation — Apr 2026',   type:'COD',         generated:'01 May 2026', format:'CSV',   size:'22 KB' },
//   { name:'Shipment Status — Week 18',        type:'Status',      generated:'05 May 2026', format:'Excel', size:'31 KB' },
// ];

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// const fmt = (n: number) => '₨' + Number(n).toLocaleString();

// const initials = (name: string) =>
//   name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// function badgeClass(s: string): string {
//   const m: Record<string, string> = {
//     'Active': 'green', 'Paused': 'yellow', 'Inactive': 'gray',
//     'In Transit': 'orange', 'Delivered': 'green', 'RTO': 'yellow',
//     'Pending': 'yellow', 'Failed': 'red', 'Out for Delivery': 'blue',
//     'Collected': 'green', 'N/A': 'gray', 'Done': 'green',
//     'OK': 'green', 'Error': 'red', 'Connected': 'green', 'Not Connected': 'red',
//     'Updated': 'green', 'No Change': 'gray', 'Created': 'green', 'Not Found': 'red',
//     'Re-dispatched': 'blue', 'Critical': 'red', 'Low': 'yellow', 'Good': 'green',
//   };
//   return m[s] || 'gray';
// }

// const rColor = (r: number) => r >= 90 ? 'var(--green)' : r >= 80 ? 'var(--yellow)' : 'var(--red)';

// // ═══════════════════════════════════════════════════════════
// // REUSABLE MICRO-COMPONENTS
// // ═══════════════════════════════════════════════════════════

// const Badge: React.FC<{ label: string }> = ({ label }) => (
//   <span className={`badge ${badgeClass(label)}`}>{label}</span>
// );

// const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
//   <>
//     <span className="rating-stars">{'★'.repeat(Math.floor(rating))}{rating % 1 ? '½' : ''}</span>
//     <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 3 }}>{rating}</span>
//   </>
// );

// const PerfBar: React.FC<{ pct: number; color?: string }> = ({ pct, color }) => (
//   <div className="perf-cell">
//     <div className="perf-bar">
//       <div className="perf-fill" style={{ width: `${pct}%`, background: color || 'var(--accent)' }} />
//     </div>
//     <div className="perf-pct">{pct}%</div>
//   </div>
// );

// /* ── CPagination ── */
// interface CPagProps { current: number; total: number; totalItems: number; start: number; end: number; onChange: (p: number) => void; }
// const CPagination: React.FC<CPagProps> = ({ current, total, totalItems, start, end, onChange }) => {
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
//     <div className="c-pagination">
//       <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
//         Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems}</strong>
//       </div>
//       <div className="c-pag-controls">
//         <button className="c-pag-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>‹</button>
//         {pages.map((p, i) => p === '…'
//           ? <button key={`d${i}`} className="c-pag-btn" style={{ pointerEvents: 'none' }}>…</button>
//           : <button key={p} className={`c-pag-btn ${p === current ? 'active' : ''}`} onClick={() => onChange(p as number)}>{p}</button>
//         )}
//         <button className="c-pag-btn" disabled={current === total || total === 0} onClick={() => onChange(current + 1)}>›</button>
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

// /* ── ToggleSwitch ── */
// const ToggleSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => {
//   const [on, setOn] = useState(defaultChecked);
//   return (
//     <label className="toggle-switch">
//       <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
//       <span className="toggle-track" />
//     </label>
//   );
// };

// /* ── EmptyState ── */
// const EmptyState: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
//   <div className="empty-state">
//     <i className={`fa-solid ${icon}`} />
//     <h4>{title}</h4>
//     <p>{desc}</p>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // COURIER DETAIL OVERLAY
// // ═══════════════════════════════════════════════════════════

// interface OverlayState { open: boolean; title: string; content: React.ReactNode; }

// // ═══════════════════════════════════════════════════════════
// // PANEL: OVERVIEW
// // ═══════════════════════════════════════════════════════════

// const OverviewPanel: React.FC<{ onNav: (p: NavPanel) => void; onOpenOverlay: (c: CourierCompany) => void; }> = ({ onNav, onOpenOverlay }) => (
//   <div className="cpanel active">
//     <div className="panel-heading">Overview</div>
//     <div className="panel-desc">A real-time snapshot of today's courier activity — shipment volumes, active couriers, COD status, and alerts that need immediate attention.</div>

//     <div className="alert-strip warn">
//       <i className="fa-solid fa-triangle-exclamation" />
//       <div><strong>4 shipments</strong> pending courier assignment · <strong>6 RTO returns</strong> awaiting processing from TCS.</div>
//       <button className="c-btn" style={{ marginLeft: 'auto' }} onClick={() => onNav('pending')}>
//         <i className="fa-solid fa-eye" /> View
//       </button>
//     </div>

//     <div className="mini-stats">
//       {[
//         { label: 'Total Shipments (MTD)', value: '142', trend: '+18% vs last month', up: true },
//         { label: 'Delivered',             value: '68',  trend: '47.9% success',      up: true },
//         { label: 'In Transit',            value: '54',  trend: '4 couriers',         up: false },
//         { label: 'Avg. Delivery Time',    value: '2.4d',trend: '-0.3d vs last month',up: true  },
//       ].map(s => (
//         <div className="mini-stat" key={s.label}>
//           <div className="ms-label">{s.label}</div>
//           <div className="ms-value">{s.value}</div>
//           <div className={`ms-trend ${s.up ? 'up' : ''}`}>{s.trend}</div>
//         </div>
//       ))}
//     </div>

//     <div className="detail-grid-3">
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-building" /> Active Couriers</div>
//           <button className="c-btn" onClick={() => onNav('companies')}>Manage</button>
//         </div>
//         <div className="card-body" style={{ padding: '8px 14px' }}>
//           {COURIERS.slice(0, 4).map(c => (
//             <div className="list-item" key={c.id} onClick={() => onOpenOverlay(c)} style={{ cursor: 'pointer' }}>
//               <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8 }}>{c.code}</div>
//               <div className="list-content">
//                 <div className="list-title">{c.name}</div>
//                 <div className="list-meta">{c.successRate}% success · {c.avgDays}d avg.</div>
//               </div>
//               <div className="list-right"><Badge label={c.status} /></div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header"><div className="card-title"><i className="fa-solid fa-truck" /> Today's Dispatches</div></div>
//         <div className="card-body" style={{ padding: '8px 14px' }}>
//           {SHIPMENTS.slice(0, 4).map(s => (
//             <div className="list-item" key={s.track}>
//               <div className="list-content">
//                 <div className="list-title" style={{ fontSize: 10.5 }}>{s.track}</div>
//                 <div className="list-meta">{s.customer} · {s.courier} · {s.city}</div>
//               </div>
//               <div className="list-right"><Badge label={s.status} /></div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header"><div className="card-title"><i className="fa-solid fa-coins" /> COD Pending</div></div>
//         <div className="card-body" style={{ padding: '8px 14px' }}>
//           {COD_PENDING.slice(0, 4).map(c => (
//             <div className="list-item" key={c.order}>
//               <div className="list-content">
//                 <div className="list-title" style={{ fontSize: 10.5 }}>{c.order} — {c.courier}</div>
//                 <div className="list-meta">{c.customer} · Due {c.due}</div>
//               </div>
//               <div className="list-right"><div style={{ fontSize: 11, fontWeight: 700 }}>{fmt(c.amount)}</div></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//     {/* Breakdown Table */}
//     <div className="card">
//       <div className="card-header">
//         <div className="card-title"><i className="fa-solid fa-chart-bar" /> Courier-wise Breakdown — This Month</div>
//         <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
//       </div>
//       <div className="tbl-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Courier</th><th>Assigned</th><th>Delivered</th><th>In Transit</th>
//               <th>RTO</th><th>Failed</th><th>Delivery Rate</th><th>Avg. Time</th><th>COD Pending</th><th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {COURIERS.map(c => {
//               const p = PERF_DATA.find(x => x.name === c.name) || { assigned: 0, delivered: 0, rto: 0, failed: 0, rate: 0, avgDays: 0 };
//               return (
//                 <tr key={c.id} onClick={() => onOpenOverlay(c)}>
//                   <td>
//                     <div className="td-flex">
//                       <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8 }}>{c.code}</div>
//                       {c.name}
//                     </div>
//                   </td>
//                   <td>{p.assigned}</td>
//                   <td style={{ color: 'var(--green)', fontWeight: 600 }}>{p.delivered}</td>
//                   <td style={{ color: 'var(--accent)' }}>{TRANSIT_ITEMS.filter(t => t.courier === c.code).length}</td>
//                   <td style={{ color: 'var(--yellow)' }}>{p.rto || 0}</td>
//                   <td style={{ color: 'var(--red)' }}>{p.failed || 0}</td>
//                   <td><PerfBar pct={p.rate} color={rColor(p.rate)} /></td>
//                   <td>{p.avgDays}d</td>
//                   <td style={{ color: c.outstanding > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{fmt(c.outstanding)}</td>
//                   <td><Badge label={c.status} /></td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: COMPANIES
// // ═══════════════════════════════════════════════════════════

// const CompaniesPanel: React.FC<{ onOpenOverlay: (c: CourierCompany) => void }> = ({ onOpenOverlay }) => {
//   const [innerTab, setInnerTab] = useState('list');
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 10;

//   const filtered = COURIERS.filter(c => {
//     if (statusFilter && c.status !== statusFilter) return false;
//     if (search) { const q = search.toLowerCase(); return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q); }
//     return true;
//   });

//   const total = filtered.length;
//   const start = (page - 1) * PER_PAGE + 1;
//   const end = Math.min(page * PER_PAGE, total);
//   const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   return (
//     <>
//       <div className="panel-heading">Courier Companies</div>
//       <div className="panel-desc">View and manage all courier partners — their rates, API credentials, COD outstanding, and performance metrics.</div>

//       <InnerTabs
//         tabs={[{ id: 'list', label: 'All Companies' }, { id: 'add', label: 'Add Company' }, { id: 'rates', label: 'Rate Cards' }, { id: 'api', label: 'API Credentials' }]}
//         active={innerTab}
//         onChange={setInnerTab}
//       />

//       {innerTab === 'list' && (
//         <>
//           <div className="mini-stats">
//             <div className="mini-stat"><div className="ms-label">Total Partners</div><div className="ms-value">6</div><div className="ms-trend">5 active · 1 paused</div></div>
//             <div className="mini-stat"><div className="ms-label">Avg. Success Rate</div><div className="ms-value">89%</div><div className="ms-trend up">+3% this month</div></div>
//             <div className="mini-stat"><div className="ms-label">COD Outstanding</div><div className="ms-value">₨84K</div><div className="ms-trend down">Needs settlement</div></div>
//             <div className="mini-stat"><div className="ms-label">API Connected</div><div className="ms-value">3</div><div className="ms-trend">3 manual · 0 error</div></div>
//           </div>
//           <div className="card">
//             <div className="c-toolbar">
//               <div className="c-toolbar-left">
//                 <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search courier..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
//                 {(['', 'Active', 'Paused'] as const).map(f => (
//                   <button key={f} className={`c-btn ${statusFilter === f ? 'active' : ''}`} onClick={() => { setStatusFilter(f); setPage(1); }}>{f || 'All'}</button>
//                 ))}
//               </div>
//               <div className="c-toolbar-right">
//                 <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
//                 <button className="c-btn primary" onClick={() => setInnerTab('add')}><i className="fa-solid fa-plus" /> Add Courier</button>
//               </div>
//             </div>
//             <div className="tbl-wrap">
//               <table>
//                 <thead>
//                   <tr>
//                     <th><input type="checkbox" /></th>
//                     <th>Company</th><th>Coverage</th><th>Base Rate</th><th>COD Charge</th>
//                     <th>COD Outstanding</th><th>Avg. Days</th><th>Success Rate</th>
//                     <th>API</th><th>Rating</th><th>Status</th><th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pageItems.map(c => (
//                     <tr key={c.id} onClick={() => onOpenOverlay(c)}>
//                       <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
//                       <td>
//                         <div className="td-flex">
//                           <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8 }}>{c.code}</div>
//                           <div>
//                             <div style={{ fontWeight: 600 }}>{c.name}</div>
//                             <div className="td-sub">{c.phone}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td><span className="tag">{c.coverage}</span></td>
//                       <td>₨{c.baseRate}/kg</td>
//                       <td>{c.codPct}%</td>
//                       <td><strong style={{ color: c.outstanding > 0 ? 'var(--red)' : 'var(--green)' }}>{fmt(c.outstanding)}</strong></td>
//                       <td>{c.avgDays}d</td>
//                       <td><PerfBar pct={c.successRate} color={rColor(c.successRate)} /></td>
//                       <td>{c.api ? <Badge label="API" /> : <Badge label="Manual" />}</td>
//                       <td><StarRating rating={c.rating} /></td>
//                       <td><Badge label={c.status} /></td>
//                       <td onClick={e => e.stopPropagation()}>
//                         <button className="c-btn" style={{ height: 24, fontSize: 9.5 }} onClick={() => onOpenOverlay(c)}><i className="fa-solid fa-eye" /></button>
//                         <button className="c-btn" style={{ height: 24, fontSize: 9.5, marginLeft: 3 }}><i className="fa-solid fa-pen" /></button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <CPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
//           </div>
//         </>
//       )}

//       {innerTab === 'add' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-plus-circle" /> Add New Courier Company</div></div>
//           <div className="card-body">
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Company Name *</div><input className="c-form-input" placeholder="e.g. TCS Express" /></div>
//               <div className="c-form-group"><div className="c-form-label">Short Code</div><input className="c-form-input" placeholder="e.g. TCS" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Contact Person</div><input className="c-form-input" placeholder="Account manager name" /></div>
//               <div className="c-form-group"><div className="c-form-label">Contact Phone</div><input className="c-form-input" placeholder="03XX-XXXXXXX" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Email</div><input className="c-form-input" type="email" placeholder="ops@courier.com" /></div>
//               <div className="c-form-group"><div className="c-form-label">City / HQ</div><input className="c-form-input" placeholder="Lahore" /></div>
//             </div>
//             <div className="c-form-row triple">
//               <div className="c-form-group"><div className="c-form-label">Base Rate (₨/kg)</div><input className="c-form-input" type="number" placeholder="200" /></div>
//               <div className="c-form-group"><div className="c-form-label">COD Charge (%)</div><input className="c-form-input" type="number" placeholder="1.5" /></div>
//               <div className="c-form-group"><div className="c-form-label">COD Settlement Days</div><input className="c-form-input" type="number" placeholder="7" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Coverage Type</div><select className="c-form-select"><option>Nationwide</option><option>Regional</option><option>City Only</option></select></div>
//               <div className="c-form-group"><div className="c-form-label">Default Status</div><select className="c-form-select"><option>Active</option><option>Inactive</option></select></div>
//             </div>
//             <hr />
//             <div style={{ display: 'flex', gap: 8 }}>
//               <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Courier</button>
//               <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {innerTab === 'rates' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-tags" /> Rate Cards by Courier</div><button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Rate</button></div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Courier</th><th>Zone</th><th>Weight</th><th>Base Rate</th><th>Per Extra Kg</th><th>COD Fee %</th><th>Fuel Surcharge</th><th>Est. Delivery</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {RATES.map((r, i) => (
//                   <tr key={i}>
//                     <td><strong>{r.courier}</strong></td>
//                     <td>{r.zone}</td><td>{r.weight}</td><td>{r.base}</td><td>{r.extra}</td><td>{r.codPct}</td><td>{r.fuel}</td><td>{r.days} days</td>
//                     <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {innerTab === 'api' && (
//         <>
//           <div className="alert-strip info"><i className="fa-solid fa-circle-info" />API credentials are encrypted at rest. Keys are never displayed in full after saving.</div>
//           {API_CREDS.map(a => (
//             <div className="card" style={{ marginBottom: 10 }} key={a.courier}>
//               <div className="card-header">
//                 <div className="card-title"><i className="fa-solid fa-building" /> {a.courier}</div>
//                 <Badge label={a.connected ? 'Connected' : 'Not Connected'} />
//               </div>
//               <div className="card-body">
//                 <div className="detail-row"><div className="detail-key">Endpoint</div><div className="detail-val"><code className="sku">{a.endpoint}</code></div></div>
//                 <div className="detail-row"><div className="detail-key">API Key</div><div className="detail-val"><code className="sku">{a.key}</code></div></div>
//                 <div className="detail-row"><div className="detail-key">Last Ping</div><div className="detail-val">{a.lastPing}</div></div>
//                 <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
//                   <button className="c-btn primary" style={{ fontSize: 10 }}><i className="fa-solid fa-rotate" /> Test</button>
//                   <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-key" /> Update Key</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: ALL SHIPMENTS
// // ═══════════════════════════════════════════════════════════

// const ShipmentsPanel: React.FC = () => {
//   const [search, setSearch] = useState('');
//   const [chipFilter, setChipFilter] = useState('all');
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 8;

//   const chips = ['all', 'Pending', 'In Transit', 'Delivered', 'RTO', 'Failed'];
//   const chipIcons: Record<string, string> = { 'Pending': 'fa-clock', 'In Transit': 'fa-truck-moving', 'Delivered': 'fa-circle-check', 'RTO': 'fa-rotate-left', 'Failed': 'fa-circle-xmark' };

//   const filtered = SHIPMENTS.filter(s => {
//     if (chipFilter !== 'all' && s.status !== chipFilter) return false;
//     if (search) { const q = search.toLowerCase(); return s.track.toLowerCase().includes(q) || s.order.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q); }
//     return true;
//   });

//   const total = filtered.length;
//   const start = (page - 1) * PER_PAGE + 1;
//   const end = Math.min(page * PER_PAGE, total);
//   const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   return (
//     <>
//       <div className="panel-heading">All Shipments</div>
//       <div className="panel-desc">Complete list of every shipment dispatched through external couriers. Filter by status or courier, search by tracking number.</div>
//       <div className="mini-stats">
//         <div className="mini-stat"><div className="ms-label">Total Shipments</div><div className="ms-value">142</div><div className="ms-trend up">+18 this month</div></div>
//         <div className="mini-stat"><div className="ms-label">Delivered</div><div className="ms-value">68</div><div className="ms-trend up">47.9% success</div></div>
//         <div className="mini-stat"><div className="ms-label">In Transit</div><div className="ms-value">54</div><div className="ms-trend">38% of total</div></div>
//         <div className="mini-stat"><div className="ms-label">RTO / Returns</div><div className="ms-value">6</div><div className="ms-trend down">4.2% return rate</div></div>
//       </div>
//       <div className="chip-group">
//         {chips.map(c => (
//           <div key={c} className={`chip ${chipFilter === c ? 'active' : ''}`} onClick={() => { setChipFilter(c); setPage(1); }}>
//             {chipIcons[c] && <i className={`fa-solid ${chipIcons[c]}`} />}
//             {c === 'all' ? 'All Status' : c}
//           </div>
//         ))}
//       </div>
//       <div className="card">
//         <div className="c-toolbar">
//           <div className="c-toolbar-left">
//             <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search tracking, order, customer..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
//           </div>
//           <div className="c-toolbar-right">
//             <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>142 records</span>
//             <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
//             <button className="c-btn primary"><i className="fa-solid fa-plus" /> Create Shipment</button>
//           </div>
//         </div>
//         <div className="tbl-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th><input type="checkbox" /></th>
//                 <th>Tracking No.</th><th>Order ID</th><th>Customer</th><th>Courier</th>
//                 <th>City</th><th>Weight</th><th>COD Amount</th><th>Status</th>
//                 <th>Dispatched</th><th>Est. Delivery</th><th>COD Status</th><th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pageItems.map(s => (
//                 <tr key={s.track}>
//                   <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
//                   <td><code className="sku">{s.track}</code></td>
//                   <td><strong>{s.order}</strong></td>
//                   <td>{s.customer}</td>
//                   <td><span className="tag">{s.courier}</span></td>
//                   <td>{s.city}</td>
//                   <td>{s.weight} kg</td>
//                   <td><strong>{fmt(s.cod)}</strong></td>
//                   <td><Badge label={s.status} /></td>
//                   <td>{s.dispatched}</td>
//                   <td>{s.est}</td>
//                   <td><Badge label={s.codStatus} /></td>
//                   <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-location-dot" /></button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <CPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: PENDING DISPATCH
// // ═══════════════════════════════════════════════════════════

// const PendingPanel: React.FC = () => (
//   <>
//     <div className="panel-heading">Pending Dispatch</div>
//     <div className="panel-desc">Orders confirmed but not yet dispatched. Assign a courier and dispatch — overdue orders (&gt;24h) are highlighted in red.</div>
//     <div className="alert-strip warn"><i className="fa-solid fa-triangle-exclamation" /><strong>4 orders</strong> pending dispatch for more than 24 hours. Assign a courier immediately.</div>
//     <div className="card">
//       <div className="c-toolbar">
//         <div className="c-toolbar-left">
//           <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order or customer..." /></div>
//           <button className="c-btn active">All Pending</button>
//           <button className="c-btn" style={{ color: 'var(--red)' }}>Overdue (&gt;24h)</button>
//         </div>
//         <div className="c-toolbar-right"><button className="c-btn primary"><i className="fa-solid fa-truck" /> Bulk Assign</button></div>
//       </div>
//       <div className="tbl-wrap">
//         <table>
//           <thead><tr><th><input type="checkbox" /></th><th>Order ID</th><th>Customer</th><th>City</th><th>Items</th><th>Weight</th><th>COD Amount</th><th>Order Date</th><th>Waiting</th><th>Assign Courier</th><th>Actions</th></tr></thead>
//           <tbody>
//             {PENDING_ORDERS.map(p => (
//               <tr key={p.order}>
//                 <td><input type="checkbox" /></td>
//                 <td><strong>{p.order}</strong></td>
//                 <td>{p.customer}</td>
//                 <td>{p.city}</td>
//                 <td>{p.items}</td>
//                 <td>{p.weight}</td>
//                 <td><strong>{p.cod}</strong></td>
//                 <td>{p.date}</td>
//                 <td><span style={{ fontWeight: 700, color: parseInt(p.waiting) > 24 ? 'var(--red)' : 'var(--text-secondary)' }}>{p.waiting}</span></td>
//                 <td>
//                   <select className="c-form-select" style={{ height: 24, fontSize: 10, minWidth: 110 }}>
//                     <option>— Assign —</option>
//                     {COURIERS.filter(c => c.status === 'Active').map(c => <option key={c.id}>{c.name}</option>)}
//                   </select>
//                 </td>
//                 <td><button className="c-btn primary" style={{ height: 24, fontSize: 9.5 }}><i className="fa-solid fa-truck" /> Dispatch</button></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: IN TRANSIT
// // ═══════════════════════════════════════════════════════════

// const InTransitPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('all');
//   return (
//     <>
//       <div className="panel-heading">In Transit</div>
//       <div className="panel-desc">Shipments currently on the way to customers. Monitor location, expected delivery, and flag delayed shipments.</div>
//       <InnerTabs
//         tabs={[
//           { id: 'all', label: 'All In Transit' },
//           { id: 'delayed', label: <span>Delayed <span style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>7</span></span> },
//           { id: 'ofd', label: 'Out for Delivery' },
//         ]}
//         active={innerTab} onChange={setInnerTab}
//       />
//       {innerTab === 'all' && (
//         <div className="card">
//           <div className="c-toolbar">
//             <div className="c-toolbar-left"><div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search tracking no..." /></div></div>
//             <div className="c-toolbar-right"><button className="c-btn"><i className="fa-solid fa-rotate" /> Sync Tracking</button></div>
//           </div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Tracking No.</th><th>Order</th><th>Customer</th><th>Courier</th><th>Current Location</th><th>Status</th><th>Dispatched</th><th>Est. Delivery</th><th>Days Left</th><th>COD</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {TRANSIT_ITEMS.map(t => (
//                   <tr key={t.track}>
//                     <td><code className="sku">{t.track}</code></td>
//                     <td>{t.order}</td><td>{t.customer}</td>
//                     <td><span className="tag">{t.courier}</span></td>
//                     <td>{t.location}</td>
//                     <td><Badge label={t.status} /></td>
//                     <td>{t.dispatched}</td><td>{t.est}</td>
//                     <td><span style={{ fontWeight: 700, color: t.daysLeft === 0 ? 'var(--red)' : 'var(--text-primary)' }}>{t.daysLeft === 0 ? 'Today' : `${t.daysLeft} day(s)`}</span></td>
//                     <td>{t.cod}</td>
//                     <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-location-dot" /></button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       {innerTab === 'delayed' && <><div className="alert-strip danger"><i className="fa-solid fa-circle-xmark" /><strong>7 shipments</strong> are past their estimated delivery date. Contact couriers immediately.</div><div className="card"><div className="card-body"><EmptyState icon="fa-truck" title="7 Shipments Delayed" desc="Contact respective couriers for status update." /></div></div></>}
//       {innerTab === 'ofd' && <div className="card"><div className="card-body"><EmptyState icon="fa-person-walking-arrow-right" title="Out for Delivery Today" desc="12 shipments out for delivery — awaiting confirmation." /></div></div>}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: DELIVERED
// // ═══════════════════════════════════════════════════════════

// const DeliveredPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('all');
//   return (
//     <>
//       <div className="panel-heading">Delivered</div>
//       <div className="panel-desc">Confirmed successful deliveries. Verify COD collection status and view proof of delivery.</div>
//       <InnerTabs
//         tabs={[{ id: 'all', label: 'All Delivered' }, { id: 'cod-pend', label: 'COD Not Collected' }, { id: 'cod-done', label: 'COD Collected' }]}
//         active={innerTab} onChange={setInnerTab}
//       />
//       {innerTab === 'all' && (
//         <div className="card">
//           <div className="c-toolbar">
//             <div className="c-toolbar-left"><div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search..." /></div></div>
//             <div className="c-toolbar-right"><button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
//           </div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Tracking No.</th><th>Order</th><th>Customer</th><th>Courier</th><th>Delivered On</th><th>Days Taken</th><th>COD Amount</th><th>COD Status</th><th>Proof</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {DELIVERED_ITEMS.map(d => (
//                   <tr key={d.track}>
//                     <td><code className="sku">{d.track}</code></td>
//                     <td>{d.order}</td><td>{d.customer}</td>
//                     <td><span className="tag">{d.courier}</span></td>
//                     <td>{d.deliveredOn}</td><td>{d.days}d</td>
//                     <td><strong>{fmt(d.cod)}</strong></td>
//                     <td><Badge label={d.codStatus} /></td>
//                     <td><span className={`badge ${d.proof === 'Yes' ? 'green' : 'gray'}`}>{d.proof === 'Yes' ? 'Available' : 'None'}</span></td>
//                     <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-coins" /></button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       {innerTab === 'cod-pend' && <><div className="alert-strip warn"><i className="fa-solid fa-coins" />₨38,400 in COD has been delivered but not yet collected from couriers.</div><div className="card"><div className="card-body"><EmptyState icon="fa-money-bill-wave" title="COD Not Yet Collected" desc="14 deliveries pending COD remittance from courier." /></div></div></>}
//       {innerTab === 'cod-done' && <div className="card"><div className="card-body"><EmptyState icon="fa-circle-check" title="COD Fully Collected" desc="54 deliveries with COD fully remitted and confirmed." /></div></div>}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: RETURNS / RTO
// // ═══════════════════════════════════════════════════════════

// const ReturnsPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('all');
//   const rtoReasons = [{ r: 'Customer Refused', n: 2 }, { r: 'Wrong Address', n: 2 }, { r: 'Not Reachable', n: 1 }, { r: 'Not Home', n: 1 }];
//   return (
//     <>
//       <div className="panel-heading">Returns / RTO</div>
//       <div className="panel-desc">Shipments returned to origin. Log receipt, process restocking, analyze return reasons, and track courier charges.</div>
//       <InnerTabs
//         tabs={[{ id: 'all', label: 'All Returns' }, { id: 'pending', label: 'Awaiting Receipt' }, { id: 'received', label: 'Received & Processed' }, { id: 'reasons', label: 'Return Reasons' }]}
//         active={innerTab} onChange={setInnerTab}
//       />
//       {innerTab === 'all' && (
//         <>
//           <div className="mini-stats">
//             <div className="mini-stat"><div className="ms-label">Total RTO</div><div className="ms-value">6</div><div className="ms-trend">4.2% of dispatched</div></div>
//             <div className="mini-stat"><div className="ms-label">Awaiting Receipt</div><div className="ms-value">4</div><div className="ms-trend down">₨8,400 in transit back</div></div>
//             <div className="mini-stat"><div className="ms-label">Restocked</div><div className="ms-value">2</div><div className="ms-trend up">Back in inventory</div></div>
//             <div className="mini-stat"><div className="ms-label">RTO Courier Charge</div><div className="ms-value">₨1,200</div><div className="ms-trend down">Charged by courier</div></div>
//           </div>
//           <div className="card">
//             <div className="tbl-wrap">
//               <table>
//                 <thead><tr><th>Tracking No.</th><th>Order</th><th>Customer</th><th>Courier</th><th>Return Reason</th><th>Dispatched</th><th>RTO Date</th><th>COD Recovered</th><th>Restock Status</th><th>Actions</th></tr></thead>
//                 <tbody>
//                   {RTO_ITEMS.map(r => (
//                     <tr key={r.track}>
//                       <td><code className="sku">{r.track}</code></td>
//                       <td>{r.order}</td><td>{r.customer}</td>
//                       <td><span className="tag">{r.courier}</span></td>
//                       <td>{r.reason}</td><td>{r.dispatched}</td><td>{r.rtoDate}</td><td>{r.cod}</td>
//                       <td><Badge label={r.restock} /></td>
//                       <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-plus" /> Restock</button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//       {innerTab === 'pending' && <div className="card"><div className="card-body"><EmptyState icon="fa-truck" title="4 Returns In Transit" desc="Awaiting receipt from courier — mark as received once inventory is back." /></div></div>}
//       {innerTab === 'received' && <div className="card"><div className="card-body"><EmptyState icon="fa-boxes-stacked" title="2 Returns Processed" desc="Received and restocked into inventory." /></div></div>}
//       {innerTab === 'reasons' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-pie" /> Return Reason Analysis</div></div>
//           <div className="card-body">
//             {rtoReasons.map(x => (
//               <div key={x.r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
//                 <div style={{ width: 130, fontSize: 10.5, color: 'var(--text-secondary)' }}>{x.r}</div>
//                 <div className="perf-bar"><div className="perf-fill" style={{ width: `${x.n / 2 * 100}%`, background: 'var(--red)' }} /></div>
//                 <div style={{ width: 20, fontSize: 10.5, fontWeight: 700, textAlign: 'right' }}>{x.n}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: FAILED DELIVERIES
// // ═══════════════════════════════════════════════════════════

// const FailedPanel: React.FC = () => (
//   <>
//     <div className="panel-heading">Failed Deliveries</div>
//     <div className="panel-desc">Delivery attempts that could not be completed after maximum attempts. Re-dispatch or cancel.</div>
//     <div className="alert-strip danger"><i className="fa-solid fa-circle-xmark" /><strong>4 deliveries</strong> failed after maximum attempts. Review and take action immediately.</div>
//     <div className="card">
//       <div className="tbl-wrap">
//         <table>
//           <thead><tr><th>Tracking No.</th><th>Order</th><th>Customer</th><th>Phone</th><th>Courier</th><th>Attempts</th><th>Last Attempt</th><th>Failure Reason</th><th>Action Taken</th><th>Actions</th></tr></thead>
//           <tbody>
//             {FAILED_ITEMS.map(f => (
//               <tr key={f.track}>
//                 <td><code className="sku">{f.track}</code></td>
//                 <td>{f.order}</td><td>{f.customer}</td><td>{f.phone}</td>
//                 <td><span className="tag">{f.courier}</span></td>
//                 <td style={{ fontWeight: 700, color: 'var(--red)' }}>{f.attempts}</td>
//                 <td>{f.last}</td><td>{f.reason}</td>
//                 <td><Badge label={f.action} /></td>
//                 <td style={{ display: 'flex', gap: 4 }}>
//                   <button className="c-btn primary" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-truck" /> Re-dispatch</button>
//                   <button className="c-btn" style={{ height: 23, fontSize: 9.5, color: 'var(--red)' }}><i className="fa-solid fa-xmark" /> Cancel</button>
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
// // PANEL: LIVE TRACKING
// // ═══════════════════════════════════════════════════════════

// const TrackingPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('lookup');
//   const timeline = [
//     { title: 'Order Dispatched',            meta: '07 May 2026, 09:30 · Lahore Hub', done: true  },
//     { title: 'Picked up from Shipper',      meta: '07 May 2026, 11:00 · Gulberg, Lahore', done: true  },
//     { title: 'In Transit — Lahore → Islamabad', meta: '08 May 2026, 02:15', done: true  },
//     { title: 'Arrived at Destination Hub',  meta: '09 May 2026, 08:45 · Islamabad Hub', active: true },
//     { title: 'Out for Delivery',            meta: 'Pending', done: false },
//   ];
//   return (
//     <>
//       <div className="panel-heading">Live Tracking</div>
//       <div className="panel-desc">Pull real-time shipment status from connected courier APIs. Enter a tracking number for a full timeline or bulk refresh all active shipments.</div>
//       <InnerTabs tabs={[{ id: 'lookup', label: 'Tracking Lookup' }, { id: 'bulk', label: 'Bulk Refresh' }, { id: 'history', label: 'Status History' }]} active={innerTab} onChange={setInnerTab} />

//       {innerTab === 'lookup' && (
//         <div className="card" style={{ marginBottom: 14 }}>
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-location-dot" /> Track a Shipment</div></div>
//           <div className="card-body">
//             <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
//               <input className="c-form-input" style={{ flex: 1, maxWidth: 300 }} placeholder="Enter tracking number or order ID..." />
//               <select className="c-form-select" style={{ minWidth: 120 }}><option>All Couriers</option>{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select>
//               <button className="c-btn primary"><i className="fa-solid fa-magnifying-glass" /> Track</button>
//             </div>
//             <div className="detail-grid-2">
//               <div>
//                 <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Shipment Details</div>
//                 {[
//                   ['Tracking No.', <code className="sku">TCS-2026-04821</code>],
//                   ['Order', 'ORD-1046'], ['Customer', 'Sara Khan · 0333-5552211'],
//                   ['Courier', 'TCS Express'], ['Destination', 'Islamabad'],
//                   ['Est. Delivery', '12 May 2026'], ['COD Amount', '₨3,600'],
//                   ['Current Status', <Badge label="In Transit" />],
//                 ].map(([k, v], i) => (
//                   <div className="detail-row" key={i}>
//                     <div className="detail-key">{k}</div>
//                     <div className="detail-val">{v}</div>
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Tracking Timeline</div>
//                 <div className="timeline">
//                   {timeline.map((tl, i) => (
//                     <div className="tl-item" key={i}>
//                       <div className="tl-dot-col">
//                         <div className={`tl-dot ${tl.done ? 'done' : ''} ${tl.active ? 'active' : ''}`} />
//                         {i < timeline.length - 1 && <div className="tl-line" />}
//                       </div>
//                       <div className="tl-content">
//                         <div className="tl-title" style={{ color: !tl.done && !tl.active ? 'var(--text-muted)' : undefined }}>{tl.title}</div>
//                         <div className="tl-meta">{tl.meta}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {innerTab === 'bulk' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-rotate" /> Bulk Tracking Refresh</div><button className="c-btn primary"><i className="fa-solid fa-rotate" /> Sync All Now</button></div>
//           <div className="card-body">
//             <div className="alert-strip info"><i className="fa-solid fa-circle-info" />Last full sync: 11 May 2026, 08:00. Next scheduled: 11 May 2026, 14:00 (auto).</div>
//             {BULK_SYNC.map(s => (
//               <div className="list-item" key={s.courier}>
//                 <div className="list-icon" style={{ background: s.status === 'OK' ? 'var(--green-bg)' : 'var(--red-bg)' }}>
//                   <i className={`fa-solid fa-${s.status === 'OK' ? 'circle-check ic-green' : 'circle-xmark ic-red'}`} style={{ fontSize: 12 }} />
//                 </div>
//                 <div className="list-content">
//                   <div className="list-title">{s.courier}</div>
//                   <div className="list-meta">Last: {s.lastSync} · {s.shipments} shipments · {s.updated} updated · {s.errors} errors</div>
//                 </div>
//                 <div className="list-right">
//                   <Badge label={s.status === 'OK' ? 'Active' : 'Error'} />
//                   <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginTop: 4 }}><i className="fa-solid fa-rotate" /> Sync Now</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {innerTab === 'history' && <div className="card"><div className="card-body"><EmptyState icon="fa-clock-rotate-left" title="Tracking History" desc="Select a shipment from the lookup to see full history." /></div></div>}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: PERFORMANCE
// // ═══════════════════════════════════════════════════════════

// const PerformancePanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('summary');
//   return (
//     <>
//       <div className="panel-heading">Courier Performance</div>
//       <div className="panel-desc">Comparative analytics — delivery success rates, average delivery times, COD collection percentages, and SLA compliance scores.</div>
//       <InnerTabs tabs={[{ id: 'summary', label: 'Summary' }, { id: 'detail', label: 'Detailed Metrics' }, { id: 'compare', label: 'Compare Couriers' }, { id: 'trends', label: 'Trends' }]} active={innerTab} onChange={setInnerTab} />

//       {innerTab === 'summary' && (
//         <>
//           <div className="mini-stats">
//             <div className="mini-stat"><div className="ms-label">Best Performer</div><div className="ms-value" style={{ fontSize: 14 }}>Leopards</div><div className="ms-trend up">94% delivery rate</div></div>
//             <div className="mini-stat"><div className="ms-label">Fastest Delivery</div><div className="ms-value" style={{ fontSize: 14 }}>M&amp;P</div><div className="ms-trend up">1.8 days avg.</div></div>
//             <div className="mini-stat"><div className="ms-label">Lowest RTO Rate</div><div className="ms-value" style={{ fontSize: 14 }}>TCS</div><div className="ms-trend up">2.1% RTO</div></div>
//             <div className="mini-stat"><div className="ms-label">Overall Success</div><div className="ms-value">89%</div><div className="ms-trend up">+3% this month</div></div>
//           </div>
//           <div className="card">
//             <div className="card-header"><div className="card-title"><i className="fa-solid fa-trophy" /> Courier Performance Scorecard</div></div>
//             <div className="tbl-wrap">
//               <table>
//                 <thead><tr><th>Courier</th><th>Assigned</th><th>Delivered</th><th>RTO</th><th>Failed</th><th>Delivery Rate</th><th>RTO Rate</th><th>Avg. Days</th><th>COD Collection</th><th>SLA Compliance</th><th>Rating</th></tr></thead>
//                 <tbody>
//                   {PERF_DATA.map(p => (
//                     <tr key={p.name}>
//                       <td><strong>{p.name}</strong></td>
//                       <td>{p.assigned}</td>
//                       <td style={{ color: 'var(--green)', fontWeight: 600 }}>{p.delivered}</td>
//                       <td style={{ color: 'var(--yellow)' }}>{p.rto}</td>
//                       <td style={{ color: 'var(--red)' }}>{p.failed}</td>
//                       <td><PerfBar pct={p.rate} color={rColor(p.rate)} /></td>
//                       <td style={{ color: p.rtoRate > 10 ? 'var(--red)' : 'var(--text-secondary)' }}>{p.rtoRate}%</td>
//                       <td>{p.avgDays}d</td>
//                       <td><PerfBar pct={p.codCollPct} color="var(--green)" /></td>
//                       <td><PerfBar pct={p.slaPct} color={rColor(p.slaPct)} /></td>
//                       <td><StarRating rating={p.rating} /></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//       {innerTab === 'detail'  && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-simple" title="Detailed Metrics" desc="Select a courier and date range to view granular breakdown." /></div></div>}
//       {innerTab === 'compare' && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-bar" title="Courier Comparison" desc="Side-by-side comparison of all metrics per courier." /></div></div>}
//       {innerTab === 'trends'  && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-line" title="Performance Trends" desc="Month-over-month delivery rate and timing trends." /></div></div>}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: COD RECONCILIATION
// // ═══════════════════════════════════════════════════════════

// const CODPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('pending');
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 5;
//   const total = COD_PENDING.length;
//   const start = (page - 1) * PER_PAGE + 1;
//   const end = Math.min(page * PER_PAGE, total);
//   const pageItems = COD_PENDING.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   return (
//     <>
//       <div className="panel-heading">COD Reconciliation</div>
//       <div className="panel-desc">Track, verify, and reconcile COD payments owed by each courier. Mark collections, flag overdue remittances, and view disputes.</div>
//       <InnerTabs tabs={[{ id: 'pending', label: 'Pending Collection' }, { id: 'collected', label: 'Collected' }, { id: 'disputes', label: 'Disputes' }, { id: 'summary', label: 'Summary by Courier' }]} active={innerTab} onChange={setInnerTab} />

//       {innerTab === 'pending' && (
//         <>
//           <div className="mini-stats">
//             <div className="mini-stat"><div className="ms-label">Total Pending COD</div><div className="ms-value">₨84K</div><div className="ms-trend down">Due from couriers</div></div>
//             <div className="mini-stat"><div className="ms-label">TCS Pending</div><div className="ms-value">₨38K</div><div className="ms-trend down">14 deliveries</div></div>
//             <div className="mini-stat"><div className="ms-label">Leopards Pending</div><div className="ms-value">₨29K</div><div className="ms-trend">11 deliveries</div></div>
//             <div className="mini-stat"><div className="ms-label">Overdue (&gt;7 days)</div><div className="ms-value">₨12K</div><div className="ms-trend down">Escalate</div></div>
//           </div>
//           <div className="card">
//             <div className="c-toolbar">
//               <div className="c-toolbar-left">
//                 <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order or courier..." /></div>
//                 <button className="c-btn active">All</button>
//                 <button className="c-btn" style={{ color: 'var(--red)' }}>Overdue</button>
//               </div>
//               <div className="c-toolbar-right"><button className="c-btn primary"><i className="fa-solid fa-check-double" /> Mark Selected Collected</button></div>
//             </div>
//             <div className="tbl-wrap">
//               <table>
//                 <thead><tr><th><input type="checkbox" /></th><th>Order</th><th>Courier</th><th>Customer</th><th>Delivered On</th><th>COD Amount</th><th>Days Outstanding</th><th>Settlement Due</th><th>Actions</th></tr></thead>
//                 <tbody>
//                   {pageItems.map(c => (
//                     <tr key={c.order}>
//                       <td><input type="checkbox" /></td>
//                       <td><strong>{c.order}</strong></td>
//                       <td><span className="tag">{c.courier}</span></td>
//                       <td>{c.customer}</td>
//                       <td>{c.delivered}</td>
//                       <td><strong>{fmt(c.amount)}</strong></td>
//                       <td><span style={{ fontWeight: 700, color: c.days >= 7 ? 'var(--red)' : c.days >= 5 ? 'var(--yellow)' : 'var(--text-primary)' }}>{c.days} days</span></td>
//                       <td>{c.due}</td>
//                       <td><button className="c-btn primary" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Mark Collected</button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <CPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
//           </div>
//         </>
//       )}
//       {innerTab === 'collected' && <div className="card"><div className="card-body"><EmptyState icon="fa-coins" title="Collected COD" desc="₨2,14,000 collected in total this month." /></div></div>}
//       {innerTab === 'disputes'  && <div className="card"><div className="card-body"><EmptyState icon="fa-scale-balanced" title="COD Disputes" desc="2 disputes under review — amounts don't match courier records." /></div></div>}
//       {innerTab === 'summary' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-table" /> COD Summary by Courier</div></div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Courier</th><th>Total Delivered</th><th>COD Amount</th><th>Collected</th><th>Pending</th><th>Overdue</th><th>Settlement Freq.</th><th>Last Settlement</th><th>Next Due</th></tr></thead>
//               <tbody>
//                 {COD_SUMMARY.map(c => (
//                   <tr key={c.courier}>
//                     <td><strong>{c.courier}</strong></td>
//                     <td>{c.delivered}</td>
//                     <td>{c.codAmt}</td>
//                     <td style={{ color: 'var(--green)' }}>{c.collected}</td>
//                     <td style={{ color: c.pending !== '₨0' ? 'var(--yellow)' : 'var(--text-primary)' }}>{c.pending}</td>
//                     <td style={{ color: c.overdue !== '₨0' ? 'var(--red)' : 'var(--green)' }}>{c.overdue}</td>
//                     <td>{c.freq}</td><td>{c.last}</td><td>{c.next}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: CONTACTS
// // ═══════════════════════════════════════════════════════════

// const ContactsPanel: React.FC = () => (
//   <>
//     <div className="panel-heading">Contacts &amp; Rates</div>
//     <div className="panel-desc">Directory of all courier contact persons, account managers, and their agreed rate structures.</div>
//     <div className="card">
//       <div className="c-toolbar">
//         <div className="c-toolbar-left"><div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search contact..." /></div></div>
//         <div className="c-toolbar-right"><button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Contact</button></div>
//       </div>
//       <div className="tbl-wrap">
//         <table>
//           <thead><tr><th>Courier</th><th>Contact Name</th><th>Role</th><th>Phone</th><th>Email</th><th>City</th><th>Last Contact</th><th>Actions</th></tr></thead>
//           <tbody>
//             {CONTACTS.map(c => (
//               <tr key={c.name}>
//                 <td>{c.courier}</td>
//                 <td><strong>{c.name}</strong></td>
//                 <td><span className="tag">{c.role}</span></td>
//                 <td>{c.phone}</td>
//                 <td><span style={{ color: 'var(--blue)', fontSize: 10.5 }}>{c.email}</span></td>
//                 <td>{c.city}</td>
//                 <td>{c.last}</td>
//                 <td><button className="c-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // PANEL: CONTRACTS
// // ═══════════════════════════════════════════════════════════

// const ContractsPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('active');
//   return (
//     <>
//       <div className="panel-heading">Contracts &amp; Terms</div>
//       <div className="panel-desc">Formal agreements, SLAs, and payment terms with each courier. Track expiry dates and auto-renewal settings.</div>
//       <InnerTabs tabs={[{ id: 'active', label: 'Active Contracts' }, { id: 'expired', label: 'Expired' }, { id: 'add', label: 'New Contract' }]} active={innerTab} onChange={setInnerTab} />
//       {innerTab === 'active' && (
//         <div className="card">
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Courier</th><th>Contract #</th><th>Start Date</th><th>End Date</th><th>SLA (Days)</th><th>Penalty/Day</th><th>COD Settlement</th><th>Auto-renew</th><th>Status</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {CONTRACTS.map(c => (
//                   <tr key={c.ref}>
//                     <td><strong>{c.courier}</strong></td>
//                     <td><code className="sku">{c.ref}</code></td>
//                     <td>{c.start}</td><td>{c.end}</td>
//                     <td>{c.sla} days</td>
//                     <td>₨{c.penalty}/day</td>
//                     <td>{c.codDays} days</td>
//                     <td>{c.autoRenew}</td>
//                     <td><Badge label={c.status} /></td>
//                     <td>
//                       <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
//                       <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3 }}><i className="fa-solid fa-pen" /></button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       {innerTab === 'expired' && <div className="card"><div className="card-body"><EmptyState icon="fa-file-circle-xmark" title="No Expired Contracts" desc="All contracts are currently active." /></div></div>}
//       {innerTab === 'add' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-file-pen" /> New Contract</div></div>
//           <div className="card-body">
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Courier Company</div><select className="c-form-select">{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//               <div className="c-form-group"><div className="c-form-label">Contract Reference #</div><input className="c-form-input" placeholder="CTR-2026-XXX" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Start Date</div><input className="c-form-input" type="date" /></div>
//               <div className="c-form-group"><div className="c-form-label">End Date</div><input className="c-form-input" type="date" /></div>
//             </div>
//             <div className="c-form-row triple">
//               <div className="c-form-group"><div className="c-form-label">SLA (Days)</div><input className="c-form-input" type="number" placeholder="3" /></div>
//               <div className="c-form-group"><div className="c-form-label">Penalty/Day (₨)</div><input className="c-form-input" type="number" placeholder="50" /></div>
//               <div className="c-form-group"><div className="c-form-label">COD Settlement (Days)</div><input className="c-form-input" type="number" placeholder="7" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Auto-renew</div><select className="c-form-select"><option>Yes</option><option>No</option></select></div>
//               <div className="c-form-group"><div className="c-form-label">Renewal Notice (Days)</div><input className="c-form-input" type="number" placeholder="30" /></div>
//             </div>
//             <hr />
//             <div style={{ display: 'flex', gap: 8 }}>
//               <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Contract</button>
//               <button className="c-btn" onClick={() => {}}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: API SYNC LOG
// // ═══════════════════════════════════════════════════════════

// const APILogPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('all');
//   return (
//     <>
//       <div className="panel-heading">API Sync Log</div>
//       <div className="panel-desc">Audit trail of all courier API calls — tracking polls, status updates, and errors. Diagnose integration failures.</div>
//       <InnerTabs
//         tabs={[
//           { id: 'all', label: 'All Logs' },
//           { id: 'errors', label: <span>Errors Only <span style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>12</span></span> },
//           { id: 'settings', label: 'Sync Settings' },
//         ]}
//         active={innerTab} onChange={setInnerTab}
//       />
//       {innerTab === 'all' && (
//         <div className="card">
//           <div className="c-toolbar">
//             <div className="c-toolbar-left">
//               <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search courier, tracking no..." /></div>
//               <button className="c-btn active">All Types</button>
//               <button className="c-btn" style={{ color: 'var(--green)' }}>Success</button>
//               <button className="c-btn" style={{ color: 'var(--red)' }}>Errors</button>
//             </div>
//             <div className="c-toolbar-right"><button className="c-btn"><i className="fa-solid fa-file-export" /> Export Log</button></div>
//           </div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Timestamp</th><th>Courier</th><th>Call Type</th><th>Tracking No.</th><th>HTTP Code</th><th>Response Time</th><th>Result</th><th>Error Detail</th></tr></thead>
//               <tbody>
//                 {API_LOGS.map((l, i) => (
//                   <tr key={i}>
//                     <td><code className="sku">{l.ts}</code></td>
//                     <td>{l.courier}</td><td>{l.type}</td>
//                     <td><code className="sku">{l.track}</code></td>
//                     <td><span style={{ fontWeight: 700, color: l.code >= 200 && l.code < 300 ? 'var(--green)' : l.code >= 400 ? 'var(--red)' : 'var(--yellow)' }}>{l.code}</span></td>
//                     <td><span style={{ fontSize: 10, color: l.ms > 1000 ? 'var(--red)' : 'var(--text-secondary)' }}>{l.ms}ms</span></td>
//                     <td><Badge label={l.result === 'Updated' || l.result === 'Created' ? 'Updated' : l.result === 'No Change' ? 'No Change' : 'Error'} /></td>
//                     <td style={{ fontSize: 10, color: 'var(--red)' }}>{l.code >= 400 ? `HTTP ${l.code} — check API key` : ''}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       {innerTab === 'errors' && <><div className="alert-strip danger"><i className="fa-solid fa-circle-xmark" /><strong>12 API errors</strong> in the last 24 hours. Most from Trax — check API key validity.</div><div className="card"><div className="card-body"><EmptyState icon="fa-plug-circle-xmark" title="Error Logs" desc="12 errors logged in past 24 hours. Mostly Trax HTTP 502 gateway errors." /></div></div></>}
//       {innerTab === 'settings' && (
//         <>
//           <div className="settings-grid">
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-rotate" /> Auto-sync Settings</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Auto-sync Enabled</div><div className="stg-desc">Automatically poll courier APIs</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Sync Frequency</div><div className="stg-desc">How often to poll tracking APIs</div></div><select className="stg-select"><option>Every 6 hours</option><option>Every 3 hours</option><option>Every 12 hours</option><option>Once daily</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Retry on Failure</div><div className="stg-desc">Auto-retry failed API calls</div></div><select className="stg-select"><option>3 times</option><option>5 times</option><option>No retry</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Log Retention</div><div className="stg-desc">How long to keep API logs</div></div><select className="stg-select"><option>30 days</option><option>60 days</option><option>90 days</option></select></div>
//               </div>
//             </div>
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-bell" /> Alert Settings</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Alert on API Error</div><div className="stg-desc">Notify admin on consecutive failures</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Error Threshold</div><div className="stg-desc">Alert after N consecutive failures</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Alert on Delay</div><div className="stg-desc">Notify when shipment exceeds SLA</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Notify Who</div></div><select className="stg-select"><option>Admin</option><option>Operations Manager</option><option>Both</option></select></div>
//               </div>
//             </div>
//           </div>
//           <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Settings</button>
//         </>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: REPORTS
// // ═══════════════════════════════════════════════════════════

// const ReportsPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('gen');
//   return (
//     <>
//       <div className="panel-heading">Courier Reports</div>
//       <div className="panel-desc">Generate and download detailed courier reports — performance, COD reconciliation, RTO analysis, and financial charges.</div>
//       <InnerTabs tabs={[{ id: 'gen', label: 'Generate Report' }, { id: 'sched', label: 'Scheduled Reports' }, { id: 'hist', label: 'Report History' }]} active={innerTab} onChange={setInnerTab} />
//       {innerTab === 'gen' && (
//         <div className="detail-grid-2">
//           <div className="card">
//             <div className="card-header"><div className="card-title"><i className="fa-solid fa-file-chart-column" /> New Report</div></div>
//             <div className="card-body">
//               <div className="c-form-row single"><div className="c-form-group"><div className="c-form-label">Report Type</div><select className="c-form-select"><option>Delivery Performance Summary</option><option>Shipment Status Report</option><option>COD Reconciliation Report</option><option>RTO Analysis Report</option><option>Courier Comparison Report</option><option>Financial — Courier Charges</option></select></div></div>
//               <div className="c-form-row">
//                 <div className="c-form-group"><div className="c-form-label">Date From</div><input className="c-form-input" type="date" /></div>
//                 <div className="c-form-group"><div className="c-form-label">Date To</div><input className="c-form-input" type="date" /></div>
//               </div>
//               <div className="c-form-row">
//                 <div className="c-form-group"><div className="c-form-label">Courier</div><select className="c-form-select"><option>All Couriers</option>{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//                 <div className="c-form-group"><div className="c-form-label">Format</div><select className="c-form-select"><option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>PDF</option></select></div>
//               </div>
//               <hr />
//               <button className="c-btn primary" style={{ width: '100%', justifyContent: 'center' }}><i className="fa-solid fa-file-export" /> Generate &amp; Download</button>
//             </div>
//           </div>
//           <div className="card">
//             <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Reports</div></div>
//             <div className="card-body" style={{ padding: '0 14px' }}>
//               {RECENT_REPORTS.map(r => (
//                 <div className="list-item" key={r.name}>
//                   <div className="list-icon" style={{ background: 'var(--green-bg)' }}><i className="fa-solid fa-file-chart-column ic-green" style={{ fontSize: 11 }} /></div>
//                   <div className="list-content">
//                     <div className="list-title">{r.name}</div>
//                     <div className="list-meta">{r.generated} · {r.format} · {r.size}</div>
//                   </div>
//                   <div className="list-right"><button className="c-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//       {innerTab === 'sched' && <div className="card"><div className="card-body"><EmptyState icon="fa-calendar" title="No Scheduled Reports" desc="Set up automatic weekly or monthly courier reports." /></div></div>}
//       {innerTab === 'hist'  && <div className="card"><div className="card-body"><EmptyState icon="fa-folder-open" title="Report History" desc="Previously generated reports appear here." /></div></div>}
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
//       <div className="panel-heading">Courier Settings</div>
//       <div className="panel-desc">System-wide courier defaults — dispatch rules, cut-off times, COD settings, tracking options, and notification preferences.</div>
//       <InnerTabs tabs={[{ id: 'general', label: 'General' }, { id: 'dispatch', label: 'Dispatch' }, { id: 'notif', label: 'Notifications' }, { id: 'cod', label: 'COD Settings' }, { id: 'tracking', label: 'Tracking' }]} active={innerTab} onChange={setInnerTab} />

//       {innerTab === 'general' && (
//         <>
//           <div className="settings-grid">
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-sliders" /> General Defaults</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Default Courier</div><div className="stg-desc">Auto-assigned when no rule matches</div></div><select className="stg-select">{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//                 <div className="stg-row"><div><div className="stg-key">Default Payment Type</div><div className="stg-desc">COD or Prepaid default</div></div><select className="stg-select"><option>COD</option><option>Prepaid</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Currency</div></div><input type="text" defaultValue="PKR (₨)" className="stg-input" /></div>
//                 <div className="stg-row"><div><div className="stg-key">Auto-create Shipment</div><div className="stg-desc">Create on order confirm</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Allow Manual Override</div></div><ToggleSwitch defaultChecked /></div>
//               </div>
//             </div>
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-weight-hanging" /> Weight &amp; Packaging</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Default Weight (kg)</div></div><input type="number" defaultValue={0.5} className="stg-input" style={{ width: 70 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Dimensional Weight Factor</div></div><input type="number" defaultValue={5000} className="stg-input" style={{ width: 70 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Bill on</div></div><select className="stg-select"><option>Higher of Both</option><option>Actual Only</option><option>Volumetric Only</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">Packaging Cost (₨)</div></div><input type="number" defaultValue={25} className="stg-input" style={{ width: 70 }} /></div>
//               </div>
//             </div>
//           </div>
//           <button className="c-btn primary"><i className="fa-solid fa-check" /> Save General Settings</button>
//         </>
//       )}
//       {innerTab === 'dispatch' && (
//         <>
//           <div className="settings-grid">
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-truck" /> Dispatch Rules</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Auto-assign Courier</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Dispatch Cut-off Time</div></div><input type="time" defaultValue="14:00" className="stg-input" /></div>
//                 <div className="stg-row"><div><div className="stg-key">Preferred Weekend Courier</div></div><select className="stg-select"><option>Leopards</option><option>TCS</option><option>Same as Weekday</option></select></div>
//                 <div className="stg-row"><div><div className="stg-key">High Value COD Threshold (₨)</div></div><input type="number" defaultValue={10000} className="stg-input" /></div>
//               </div>
//             </div>
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-redo" /> Re-attempt Settings</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Max Delivery Attempts</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Re-attempt After (hours)</div></div><input type="number" defaultValue={24} className="stg-input" style={{ width: 60 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Auto-RTO After Attempts</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Contact Customer on Fail</div></div><ToggleSwitch defaultChecked /></div>
//               </div>
//             </div>
//           </div>
//           <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Dispatch Settings</button>
//         </>
//       )}
//       {innerTab === 'notif' && (
//         <>
//           <div className="settings-section" style={{ marginBottom: 14 }}>
//             <div className="settings-section-head"><i className="fa-solid fa-bell" /> Notification Settings</div>
//             <div className="settings-section-body">
//               {[
//                 'Dispatched — Notify Ops Manager', 'Delivered — Notify Accounts',
//                 'RTO Received — Notify Inventory', 'Failed Delivery — Notify Admin',
//                 'COD Collected — Notify Accounts', 'Daily Dispatch Summary',
//               ].map(k => <div key={k} className="stg-row"><div><div className="stg-key">{k}</div></div><ToggleSwitch defaultChecked /></div>)}
//               <div className="stg-row"><div><div className="stg-key">Delay Alert Threshold (Days)</div></div><input type="number" defaultValue={1} className="stg-input" style={{ width: 60 }} /></div>
//             </div>
//           </div>
//           <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Notification Settings</button>
//         </>
//       )}
//       {innerTab === 'cod' && (
//         <>
//           <div className="settings-grid">
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-coins" /> COD Collection</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Auto-mark COD on Delivery</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Expected Settlement (Days)</div></div><input type="number" defaultValue={7} className="stg-input" style={{ width: 60 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Overdue Alert (Days)</div></div><input type="number" defaultValue={10} className="stg-input" style={{ width: 60 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">COD Shortfall Alert</div></div><ToggleSwitch defaultChecked /></div>
//               </div>
//             </div>
//             <div className="settings-section">
//               <div className="settings-section-head"><i className="fa-solid fa-percent" /> Charges &amp; Deductions</div>
//               <div className="settings-section-body">
//                 <div className="stg-row"><div><div className="stg-key">Default COD Fee (%)</div></div><input type="number" defaultValue={1.5} className="stg-input" style={{ width: 70 }} /></div>
//                 <div className="stg-row"><div><div className="stg-key">Auto-deduct COD Fee</div></div><ToggleSwitch defaultChecked /></div>
//                 <div className="stg-row"><div><div className="stg-key">Include Tax on COD Fee</div></div><ToggleSwitch /></div>
//                 <div className="stg-row"><div><div className="stg-key">Record COD in Financials</div></div><ToggleSwitch defaultChecked /></div>
//               </div>
//             </div>
//           </div>
//           <button className="c-btn primary"><i className="fa-solid fa-check" /> Save COD Settings</button>
//         </>
//       )}
//       {innerTab === 'tracking' && (
//         <>
//           <div className="settings-section" style={{ marginBottom: 14 }}>
//             <div className="settings-section-head"><i className="fa-solid fa-location-dot" /> Tracking Configuration</div>
//             <div className="settings-section-body">
//               <div className="stg-row"><div><div className="stg-key">Enable API Tracking</div></div><ToggleSwitch defaultChecked /></div>
//               <div className="stg-row"><div><div className="stg-key">Manual Tracking Fallback</div></div><ToggleSwitch defaultChecked /></div>
//               <div className="stg-row"><div><div className="stg-key">Show Tracking to Customers</div></div><ToggleSwitch /></div>
//               <div className="stg-row"><div><div className="stg-key">Tracking History Depth</div></div><input type="number" defaultValue={50} className="stg-input" style={{ width: 60 }} /></div>
//               <div className="stg-row"><div><div className="stg-key">Flag Stale Shipments After (Days)</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
//             </div>
//           </div>
//           <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Tracking Settings</button>
//         </>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: ASSIGNMENT RULES
// // ═══════════════════════════════════════════════════════════

// const RulesPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('list');
//   return (
//     <>
//       <div className="panel-heading">Assignment Rules</div>
//       <div className="panel-desc">Automated courier assignment logic. Rules are evaluated top-to-bottom — first match wins.</div>
//       <InnerTabs tabs={[{ id: 'list', label: 'Active Rules' }, { id: 'add', label: 'Add Rule' }, { id: 'priority', label: 'Priority Order' }]} active={innerTab} onChange={setInnerTab} />
//       {innerTab === 'list' && (
//         <>
//           <div className="alert-strip info"><i className="fa-solid fa-circle-info" />Rules are evaluated top-to-bottom. First matching rule wins. Use Priority Order to reorder.</div>
//           <div className="card">
//             <div className="c-toolbar">
//               <div className="c-toolbar-left"><div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search rules..." /></div></div>
//               <div className="c-toolbar-right"><button className="c-btn primary" onClick={() => {}}><i className="fa-solid fa-plus" /> Add Rule</button></div>
//             </div>
//             <div className="tbl-wrap">
//               <table>
//                 <thead><tr><th>Priority</th><th>Rule Name</th><th>Condition</th><th>Assign To</th><th>Fallback</th><th>Status</th><th>Applied (MTD)</th><th>Actions</th></tr></thead>
//                 <tbody>
//                   {RULES.map(r => (
//                     <tr key={r.priority}>
//                       <td><span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>#{r.priority}</span></td>
//                       <td><strong>{r.name}</strong></td>
//                       <td><code className="sku">{r.condition}</code></td>
//                       <td>{r.assign}</td><td>{r.fallback}</td>
//                       <td><Badge label={r.status} /></td>
//                       <td>{r.applied}</td>
//                       <td>
//                         <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button>
//                         <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3, color: 'var(--red)' }}><i className="fa-solid fa-trash" /></button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//       {innerTab === 'add' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-plus-circle" /> New Assignment Rule</div></div>
//           <div className="card-body">
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Rule Name *</div><input className="c-form-input" placeholder="e.g. Karachi — Trax" /></div>
//               <div className="c-form-group"><div className="c-form-label">Priority</div><input className="c-form-input" type="number" placeholder="1 = highest" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Condition Type</div><select className="c-form-select"><option>City / Destination</option><option>Order Weight</option><option>COD Amount</option><option>Payment Type</option><option>Product Category</option></select></div>
//               <div className="c-form-group"><div className="c-form-label">Condition Value</div><input className="c-form-input" placeholder="e.g. Karachi, >5kg" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Assign To Courier</div><select className="c-form-select">{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//               <div className="c-form-group"><div className="c-form-label">Fallback Courier</div><select className="c-form-select"><option>None</option>{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//             </div>
//             <hr />
//             <div style={{ display: 'flex', gap: 8 }}>
//               <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Rule</button>
//               <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {innerTab === 'priority' && <div className="card"><div className="card-body"><EmptyState icon="fa-list-ol" title="Drag to Reorder Rules" desc="Rule priority determines which courier is assigned first when multiple rules match." /></div></div>}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // PANEL: ZONES & COVERAGE
// // ═══════════════════════════════════════════════════════════

// const ZonesPanel: React.FC = () => {
//   const [innerTab, setInnerTab] = useState('list');
//   return (
//     <>
//       <div className="panel-heading">Zones &amp; Coverage</div>
//       <div className="panel-desc">Define delivery zones, map cities to their primary and backup couriers, and set rate multipliers for remote areas.</div>
//       <InnerTabs tabs={[{ id: 'list', label: 'Zone List' }, { id: 'cities', label: 'City Mapping' }, { id: 'add', label: 'Add Zone' }]} active={innerTab} onChange={setInnerTab} />
//       {innerTab === 'list' && (
//         <div className="card">
//           <div className="c-toolbar">
//             <div className="c-toolbar-left"><div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search zone..." /></div></div>
//             <div className="c-toolbar-right"><button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Zone</button></div>
//           </div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>Zone Name</th><th>Cities Covered</th><th>Primary Courier</th><th>Backup Courier</th><th>Avg. Delivery Days</th><th>Rate Multiplier</th><th>Active</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {ZONES.map(z => (
//                   <tr key={z.name}>
//                     <td><strong>{z.name}</strong></td>
//                     <td><span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{z.cities}</span></td>
//                     <td>{z.primary}</td><td>{z.backup}</td>
//                     <td>{z.days}d</td><td>{z.mult}x</td>
//                     <td><ToggleSwitch defaultChecked /></td>
//                     <td><button className="c-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       {innerTab === 'cities' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-city" /> City to Courier Mapping</div><button className="c-btn primary"><i className="fa-solid fa-plus" /> Add City</button></div>
//           <div className="tbl-wrap">
//             <table>
//               <thead><tr><th>City</th><th>Province</th><th>Zone</th><th>Primary Courier</th><th>Backup</th><th>Delivery Days</th><th>Serviceable</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {CITY_MAP.map(c => (
//                   <tr key={c.city}>
//                     <td><strong>{c.city}</strong></td>
//                     <td>{c.province}</td><td>{c.zone}</td>
//                     <td>{c.primary}</td><td>{c.backup}</td>
//                     <td>{c.days}d</td>
//                     <td><span className="badge green">Yes</span></td>
//                     <td><button className="c-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       {innerTab === 'add' && (
//         <div className="card">
//           <div className="card-header"><div className="card-title"><i className="fa-solid fa-map-pin" /> Add New Zone</div></div>
//           <div className="card-body">
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Zone Name *</div><input className="c-form-input" placeholder="e.g. Karachi Metro" /></div>
//               <div className="c-form-group"><div className="c-form-label">Zone Code</div><input className="c-form-input" placeholder="KHI" /></div>
//             </div>
//             <div className="c-form-row">
//               <div className="c-form-group"><div className="c-form-label">Primary Courier</div><select className="c-form-select">{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//               <div className="c-form-group"><div className="c-form-label">Backup Courier</div><select className="c-form-select"><option>None</option>{COURIERS.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
//             </div>
//             <div className="c-form-row triple">
//               <div className="c-form-group"><div className="c-form-label">Min Delivery Days</div><input className="c-form-input" type="number" defaultValue={1} /></div>
//               <div className="c-form-group"><div className="c-form-label">Max Delivery Days</div><input className="c-form-input" type="number" defaultValue={3} /></div>
//               <div className="c-form-group"><div className="c-form-label">Rate Multiplier</div><input className="c-form-input" type="number" defaultValue={1.0} step={0.1} /></div>
//             </div>
//             <hr />
//             <div style={{ display: 'flex', gap: 8 }}>
//               <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Zone</button>
//               <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // MAIN PAGE COMPONENT
// // ═══════════════════════════════════════════════════════════

// const CouriersPage: React.FC = () => {
//   const [activePanel, setActivePanel] = useState<NavPanel>('overview');
//   const { isLoading, loadingProgress, switchTab } = useTabLoading(setActivePanel, activePanel);
//   const [overlay, setOverlay] = useState<OverlayState>({ open: false, title: '', content: null });

//   const openCourierOverlay = useCallback((c: CourierCompany) => {
//     setOverlay({
//       open: true,
//       title: c.name,
//       content: (
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
//             <div className="row-avatar" style={{ width: 40, height: 40, fontSize: 12, background: 'var(--bg)' }}>{c.code}</div>
//             <div>
//               <div style={{ fontSize: 14, fontWeight: 800 }}>{c.name}</div>
//               <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.coverage} Coverage · {c.city}</div>
//             </div>
//             <div style={{ marginLeft: 'auto' }}><Badge label={c.status} /></div>
//           </div>
//           {[
//             ['Contact Person', c.contact], ['Phone', c.phone],
//             ['Base Rate', `₨${c.baseRate}/kg`], ['COD Charge', `${c.codPct}%`],
//             ['COD Settlement', `${c.codDays} days`],
//             ['COD Outstanding', <span style={{ color: c.outstanding > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{fmt(c.outstanding)}</span>],
//             ['Avg. Delivery', `${c.avgDays} days`], ['Success Rate', <strong>{c.successRate}%</strong>],
//             ['API Connected', <Badge label={c.api ? 'Connected' : 'Not Connected'} />],
//             ['Rating', <StarRating rating={c.rating} />],
//           ].map(([k, v], i) => (
//             <div className="detail-row" key={i}>
//               <div className="detail-key">{k}</div>
//               <div className="detail-val">{v}</div>
//             </div>
//           ))}
//           <hr />
//           <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
//             <button className="c-btn primary" style={{ fontSize: 10 }}><i className="fa-solid fa-pen" /> Edit</button>
//             <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-truck" /> View Shipments</button>
//             <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-coins" /> Record Payment</button>
//             <button className="c-btn" style={{ fontSize: 10, color: 'var(--red)' }}><i className="fa-solid fa-pause" /> Pause</button>
//           </div>
//         </div>
//       ),
//     });
//   }, []);

//   const closeOverlay = () => setOverlay(v => ({ ...v, open: false }));

//   type NavEntry = { panel: NavPanel; icon: string; label: string; badge?: number | string; badgeGray?: boolean };
//   type NavSection = { heading: string; items: NavEntry[] };

//   const navSections: NavSection[] = [
//     { heading: 'Overview', items: [{ panel: 'overview', icon: 'fa-gauge', label: 'Overview' }] },
//     { heading: 'Couriers', items: [
//       { panel: 'companies', icon: 'fa-building',      label: 'Courier Companies' },
//       { panel: 'contacts',  icon: 'fa-address-book',  label: 'Contacts & Rates'  },
//       { panel: 'contracts', icon: 'fa-file-contract', label: 'Contracts & Terms'  },
//     ]},
//     { heading: 'Shipments', items: [
//       { panel: 'shipments', icon: 'fa-boxes-stacked',  label: 'All Shipments',    badge: 142             },
//       { panel: 'pending',   icon: 'fa-clock',          label: 'Pending Dispatch', badge: 18              },
//       { panel: 'intransit', icon: 'fa-truck-moving',   label: 'In Transit',       badge: 54              },
//       { panel: 'delivered', icon: 'fa-circle-check',   label: 'Delivered',        badge: 68, badgeGray: true },
//       { panel: 'returns',   icon: 'fa-rotate-left',    label: 'Returns / RTO',    badge: 6               },
//       { panel: 'failed',    icon: 'fa-circle-xmark',   label: 'Failed Delivery',  badge: 4               },
//     ]},
//     { heading: 'Tracking', items: [
//       { panel: 'tracking', icon: 'fa-location-dot', label: 'Live Tracking' },
//       { panel: 'apilog',   icon: 'fa-plug',         label: 'API Sync Log'  },
//     ]},
//     { heading: 'Analytics', items: [
//       { panel: 'performance', icon: 'fa-chart-bar',          label: 'Performance'      },
//       { panel: 'cod',         icon: 'fa-coins',              label: 'COD Reconciliation'},
//       { panel: 'reports',     icon: 'fa-file-chart-column',  label: 'Reports'          },
//     ]},
//     { heading: 'Configuration', items: [
//       { panel: 'settings', icon: 'fa-gear',    label: 'Settings'         },
//       { panel: 'rules',    icon: 'fa-sitemap', label: 'Assignment Rules' },
//       { panel: 'zones',    icon: 'fa-map',     label: 'Zones & Coverage' },
//     ]},
//   ];

//   const renderPanel = () => {
//     switch (activePanel) {
//       case 'overview':     return <OverviewPanel onNav={setActivePanel} onOpenOverlay={openCourierOverlay} />;
//       case 'companies':    return <CompaniesPanel onOpenOverlay={openCourierOverlay} />;
//       case 'contacts':     return <ContactsPanel />;
//       case 'contracts':    return <ContractsPanel />;
//       case 'shipments':    return <ShipmentsPanel />;
//       case 'pending':      return <PendingPanel />;
//       case 'intransit':    return <InTransitPanel />;
//       case 'delivered':    return <DeliveredPanel />;
//       case 'returns':      return <ReturnsPanel />;
//       case 'failed':       return <FailedPanel />;
//       case 'tracking':     return <TrackingPanel />;
//       case 'apilog':       return <APILogPanel />;
//       case 'performance':  return <PerformancePanel />;
//       case 'cod':          return <CODPanel />;
//       case 'reports':      return <ReportsPanel />;
//       case 'settings':     return <SettingsPanel />;
//       case 'rules':        return <RulesPanel />;
//       case 'zones':        return <ZonesPanel />;
//       default:             return null;
//     }
//   };

//   return (
//     <div id="page-couriers">
//       <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
//       <div className="page-hero">
//         <div className="page-hero-title">Courier Management</div>
//         <div className="page-hero-sub">Manage courier partners, shipments, tracking, performance, and all delivery operations.</div>
//       </div>

//       <div className="courier-layout">
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
//                     <span className={`vnav-badge ${item.badgeGray ? 'gray' : ''}`}>{item.badge}</span>
//                   )}
//                 </div>
//               ))}
//               <div className="vnav-divider" />
//             </React.Fragment>
//           ))}
//         </div>

//         {/* Content Panels */}
//         <div className="courier-content">
//           {renderPanel()}
//         </div>
//       </div>

//       {/* Overlay */}
//       <div className={`courier-backdrop ${overlay.open ? 'open' : ''}`} onClick={closeOverlay} />
//       <div className={`courier-overlay ${overlay.open ? 'open' : ''}`}>
//         <div className="overlay-header">
//           <div className="overlay-title">{overlay.title}</div>
//           <button className="close-btn" onClick={closeOverlay}><i className="fa-solid fa-xmark" /></button>
//         </div>
//         <div className="overlay-body">{overlay.content}</div>
//       </div>
//     </div>
//   );
// };

// export default CouriersPage;