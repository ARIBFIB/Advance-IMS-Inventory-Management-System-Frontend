import React, { useState, useCallback } from 'react';
import './RidersPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type NavPanel =
  | 'overview' | 'all' | 'add' | 'availability'
  | 'active' | 'assign' | 'completed' | 'failed-del'
  | 'livemap' | 'routes'
  | 'performance' | 'earnings' | 'reports'
  | 'integrations'
  | 'settings' | 'zones';

interface Rider {
  id: number; name: string; phone: string; cnic: string;
  vehicle: string; plate: string; zone: string; shift: string;
  deliveries: number; completion: number; avgTime: number; onTime: number;
  rating: number; status: 'Active' | 'Inactive'; availability: 'Online' | 'Offline';
  pay: string; rate: number; earned: number; bonus: number; paid: number; join: string;
}
interface ActiveDelivery {
  order: string; rider: string; customer: string; address: string;
  assigned: string; eta: string; cod: string; status: string;
}
interface UnassignedOrder {
  order: string; customer: string; area: string; cod: string; priority: string;
}
interface CompletedDelivery {
  order: string; rider: string; customer: string; time: string;
  taken: string; cod: number; codStatus: string; rating: string;
}
interface FailedDelivery {
  order: string; rider: string; customer: string; phone: string;
  attempts: number; last: string; reason: string; action: string;
}
interface DocItem {
  rider: string; type: string; file: string; expiry: string; status: string; uploaded: string;
}
interface AvailabilityItem {
  rider: string; shift: string; checkin: string; zone: string; task: string; avail: string;
}
interface ScheduleItem {
  rider: string; days: string[];
}
interface ZoneItem {
  name: string; areas: string; primary: string; backup: string; time: string; active: number;
}
interface RouteItem {
  order: string; rider: string; start: string; end: string; km: string; duration: string; date: string;
}
interface ReportItem {
  name: string; type: string; date: string; format: string; size: string;
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const AVATAR_COLORS = ['#FF6A00','#16A34A','#2563EB','#7C3AED','#D97706','#DC2626','#0284C7','#059669'];

const RIDERS: Rider[] = [
  { id:1, name:'Usman Ahmed',    phone:'0321-1234567', cnic:'35202-1234567-1', vehicle:'Motorcycle', plate:'LHR-2201', zone:'Lahore Central',       shift:'Morning (9AM–5PM)', deliveries:68, completion:96, avgTime:38, onTime:94, rating:4.8, status:'Active',   availability:'Online',  pay:'Per Delivery',  rate:80,    earned:5440, bonus:400, paid:5000, join:'Jan 2025' },
  { id:2, name:'Bilal Raza',     phone:'0300-9876543', cnic:'35202-9876543-2', vehicle:'Motorcycle', plate:'LHR-3312', zone:'DHA / Cantt',           shift:'Morning (9AM–5PM)', deliveries:61, completion:93, avgTime:42, onTime:91, rating:4.9, status:'Active',   availability:'Online',  pay:'Per Delivery',  rate:80,    earned:4880, bonus:200, paid:4000, join:'Feb 2025' },
  { id:3, name:'Asad Khan',      phone:'0333-5556677', cnic:'35202-5556677-3', vehicle:'Bicycle',    plate:'—',        zone:'Gulberg / Garden Town', shift:'Full Day',           deliveries:55, completion:89, avgTime:34, onTime:88, rating:4.5, status:'Active',   availability:'Online',  pay:'Per Delivery',  rate:70,    earned:3850, bonus:0,   paid:3500, join:'Mar 2025' },
  { id:4, name:'Hamza Iqbal',    phone:'0311-3334455', cnic:'35202-3334455-4', vehicle:'Motorcycle', plate:'LHR-4421', zone:'Model Town',            shift:'Evening (5PM–11PM)', deliveries:48, completion:88, avgTime:45, onTime:85, rating:4.3, status:'Active',   availability:'Online',  pay:'Per Delivery',  rate:80,    earned:3840, bonus:0,   paid:3500, join:'Apr 2025' },
  { id:5, name:'Faisal Mehmood', phone:'0345-2223344', cnic:'35202-2223344-5', vehicle:'Motorcycle', plate:'LHR-5533', zone:'Johar Town',            shift:'Morning (9AM–5PM)', deliveries:44, completion:85, avgTime:50, onTime:82, rating:4.1, status:'Active',   availability:'Offline', pay:'Per Delivery',  rate:80,    earned:3520, bonus:0,   paid:3000, join:'May 2025' },
  { id:6, name:'Tariq Saleem',   phone:'0300-1112233', cnic:'35202-1112233-6', vehicle:'Van',        plate:'LHR-6644', zone:'All Zones',             shift:'Full Day',           deliveries:39, completion:82, avgTime:58, onTime:78, rating:3.9, status:'Active',   availability:'Online',  pay:'Monthly Fixed', rate:25000, earned:25000,bonus:0,   paid:20000,join:'Jun 2025' },
  { id:7, name:'Zubair Ali',     phone:'0321-8889900', cnic:'35202-8889900-7', vehicle:'Motorcycle', plate:'LHR-7755', zone:'Lahore Central',        shift:'Morning (9AM–5PM)', deliveries:12, completion:75, avgTime:65, onTime:70, rating:3.5, status:'Active',   availability:'Offline', pay:'Per Delivery',  rate:80,    earned:960,  bonus:0,   paid:800,  join:'Aug 2025' },
  { id:8, name:'Imran Siddiqui', phone:'0333-4445566', cnic:'35202-4445566-8', vehicle:'Motorcycle', plate:'LHR-8866', zone:'DHA / Cantt',           shift:'Morning (9AM–5PM)', deliveries:0,  completion:0,  avgTime:0,  onTime:0,  rating:0,   status:'Inactive', availability:'Offline', pay:'Per Delivery',  rate:80,    earned:0,    bonus:0,   paid:0,    join:'Oct 2025' },
];

const ACTIVE_DELIVERIES: ActiveDelivery[] = [
  { order:'ORD-1052', rider:'Usman Ahmed',    customer:'Amna Bibi',     address:'Gulberg III, Lahore',    assigned:'09:45', eta:'10:30', cod:'₨4,200', status:'In Transit'     },
  { order:'ORD-1053', rider:'Bilal Raza',     customer:'Rabia Ahmed',   address:'DHA Phase 5',            assigned:'09:55', eta:'10:45', cod:'₨2,800', status:'In Transit'     },
  { order:'ORD-1054', rider:'Asad Khan',      customer:'Nadia Malik',   address:'Garden Town, Lahore',    assigned:'10:10', eta:'10:40', cod:'₨6,100', status:'Out for Delivery'},
  { order:'ORD-1055', rider:'Hamza Iqbal',    customer:'Hira Baig',     address:'Model Town Block D',     assigned:'10:20', eta:'11:10', cod:'₨3,500', status:'In Transit'     },
  { order:'ORD-1056', rider:'Faisal Mehmood', customer:'Sadia Hussain', address:'Johar Town Phase 1',     assigned:'10:25', eta:'11:00', cod:'₨5,700', status:'Delayed'        },
  { order:'ORD-1057', rider:'Tariq Saleem',   customer:'Bushra Nawaz',  address:'Cantt, Lahore',          assigned:'10:30', eta:'11:30', cod:'₨1,800', status:'In Transit'     },
  { order:'ORD-1058', rider:'Usman Ahmed',    customer:'Maira Usman',   address:'Gulberg II, Lahore',     assigned:'11:00', eta:'11:45', cod:'₨3,900', status:'Pending Pickup' },
  { order:'ORD-1059', rider:'Bilal Raza',     customer:'Fatima Zara',   address:'DHA Phase 1',            assigned:'11:05', eta:'12:00', cod:'₨2,200', status:'Delayed'        },
];

const UNASSIGNED_ORDERS: UnassignedOrder[] = [
  { order:'ORD-1060', customer:'Sara Khan',     area:'Gulberg',      cod:'₨3,600', priority:'Normal' },
  { order:'ORD-1061', customer:'Iram Sheikh',   area:'DHA Phase 6',  cod:'₨8,100', priority:'High'   },
  { order:'ORD-1062', customer:'Zainab Qureshi',area:'Model Town',   cod:'₨2,400', priority:'Normal' },
  { order:'ORD-1063', customer:'Asma Iqbal',    area:'Johar Town',   cod:'₨5,500', priority:'Urgent' },
  { order:'ORD-1064', customer:'Lubna Tanvir',  area:'Garden Town',  cod:'₨1,900', priority:'Normal' },
];

const COMPLETED_DELIVERIES: CompletedDelivery[] = [
  { order:'ORD-1045', rider:'Usman Ahmed', customer:'Nadia Malik',  time:'09:22', taken:'38 min', cod:6100, codStatus:'Collected', rating:'★★★★★' },
  { order:'ORD-1043', rider:'Bilal Raza',  customer:'Hira Baig',    time:'09:48', taken:'42 min', cod:3900, codStatus:'Collected', rating:'★★★★★' },
  { order:'ORD-1040', rider:'Asad Khan',   customer:'Sadia Hussain',time:'10:05', taken:'34 min', cod:9200, codStatus:'Pending',   rating:'★★★★☆' },
  { order:'ORD-1039', rider:'Hamza Iqbal', customer:'Bushra Nawaz', time:'10:30', taken:'48 min', cod:3100, codStatus:'Collected', rating:'★★★★☆' },
  { order:'ORD-1035', rider:'Usman Ahmed', customer:'Lubna Tanvir', time:'11:00', taken:'35 min', cod:1600, codStatus:'Collected', rating:'★★★★★' },
];

const FAILED_DELIVERIES: FailedDelivery[] = [
  { order:'ORD-1028', rider:'Zubair Ali',     customer:'Ayesha Tariq',   phone:'0321-1234567', attempts:3, last:'10 May, 16:30', reason:'Not Home',                action:'Pending'    },
  { order:'ORD-1025', rider:'Faisal Mehmood', customer:'Tania Siddiqui', phone:'0333-7766554', attempts:3, last:'09 May, 14:00', reason:'Wrong Address',           action:'Pending'    },
  { order:'ORD-1021', rider:'Zubair Ali',     customer:'Mariam Khan',    phone:'0311-8899001', attempts:3, last:'08 May, 17:00', reason:'Customer Not Available',  action:'Re-assigned'},
];

const DOCS_DATA: DocItem[] = [
  { rider:'Usman Ahmed', type:'CNIC',              file:'usman_cnic.pdf',    expiry:'N/A',      status:'Active',        uploaded:'Jan 2025' },
  { rider:'Usman Ahmed', type:"Driver's License",  file:'usman_license.pdf', expiry:'Mar 2027', status:'Active',        uploaded:'Jan 2025' },
  { rider:'Bilal Raza',  type:'CNIC',              file:'bilal_cnic.pdf',    expiry:'N/A',      status:'Active',        uploaded:'Feb 2025' },
  { rider:'Asad Khan',   type:'CNIC',              file:'asad_cnic.pdf',     expiry:'N/A',      status:'Active',        uploaded:'Mar 2025' },
  { rider:'Hamza Iqbal', type:"Driver's License",  file:'hamza_license.pdf', expiry:'Jun 2026', status:'Expiring Soon', uploaded:'Apr 2025' },
];

const AVAILABILITY_DATA: AvailabilityItem[] = [
  { rider:'Usman Ahmed',    shift:'Morning (9AM–5PM)',  checkin:'09:02', zone:'Lahore Central',       task:'ORD-1052', avail:'Busy'        },
  { rider:'Bilal Raza',     shift:'Morning (9AM–5PM)',  checkin:'09:10', zone:'DHA / Cantt',          task:'ORD-1053', avail:'Busy'        },
  { rider:'Asad Khan',      shift:'Full Day',           checkin:'09:15', zone:'Gulberg / Garden Town', task:'ORD-1054', avail:'Busy'        },
  { rider:'Hamza Iqbal',    shift:'Evening (5PM–11PM)', checkin:'—',     zone:'Model Town',           task:'—',        avail:'Not Started' },
  { rider:'Faisal Mehmood', shift:'Morning (9AM–5PM)',  checkin:'09:30', zone:'Johar Town',           task:'ORD-1056', avail:'Busy'        },
  { rider:'Tariq Saleem',   shift:'Full Day',           checkin:'09:00', zone:'All Zones',            task:'ORD-1057', avail:'Busy'        },
  { rider:'Zubair Ali',     shift:'Morning (9AM–5PM)',  checkin:'—',     zone:'Lahore Central',       task:'—',        avail:'Absent'      },
  { rider:'Imran Siddiqui', shift:'—',                  checkin:'—',     zone:'—',                    task:'—',        avail:'Inactive'    },
];

const SCHEDULE_DATA: ScheduleItem[] = [
  { rider:'Usman Ahmed', days:['M','T','W','T','F','-','M'] },
  { rider:'Bilal Raza',  days:['M','T','W','T','F','M','-'] },
  { rider:'Asad Khan',   days:['M','T','W','T','F','M','M'] },
  { rider:'Hamza Iqbal', days:['-','E','E','E','E','E','E']  },
];

const ZONES_DATA: ZoneItem[] = [
  { name:'Lahore Central',    areas:'Anarkali, Gulberg I & II, Liberty Market',    primary:'Usman Ahmed',    backup:'Zubair Ali',  time:'30–50 min', active:3 },
  { name:'DHA / Cantt',       areas:'DHA Phase 1–6, Cantonment',                   primary:'Bilal Raza',     backup:'Tariq Saleem',time:'35–60 min', active:2 },
  { name:'Gulberg / Garden Town', areas:'Gulberg III–V, Garden Town, Jail Road',   primary:'Asad Khan',      backup:'Usman Ahmed', time:'25–45 min', active:2 },
  { name:'Model Town',        areas:'Model Town A-L Blocks, Faisal Town',           primary:'Hamza Iqbal',    backup:'—',           time:'30–50 min', active:1 },
  { name:'Johar Town',        areas:'Johar Town Phase 1 & 2, Muslim Town',          primary:'Faisal Mehmood', backup:'—',           time:'35–55 min', active:1 },
];

const ROUTES_DATA: RouteItem[] = [
  { order:'ORD-1045', rider:'Usman Ahmed', start:'Gulberg Warehouse', end:'Faisal Town',   km:'8.4',  duration:'38 min', date:'11 May 2026' },
  { order:'ORD-1039', rider:'Bilal Raza',  start:'Gulberg Warehouse', end:'DHA Phase 5',  km:'12.1', duration:'42 min', date:'11 May 2026' },
  { order:'ORD-1035', rider:'Asad Khan',   start:'Gulberg Warehouse', end:'Garden Town',  km:'4.2',  duration:'34 min', date:'11 May 2026' },
];

const RECENT_REPORTS: ReportItem[] = [
  { name:'Performance Report — Apr 2026', type:'Performance', date:'01 May 2026', format:'Excel', size:'38 KB' },
  { name:'Earnings & Payroll — Apr 2026', type:'Payroll',     date:'01 May 2026', format:'PDF',   size:'22 KB' },
  { name:'Daily Log — Week 18',           type:'Log',          date:'05 May 2026', format:'CSV',   size:'18 KB' },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const fmt = (n: number) => '₨' + Number(n).toLocaleString();
const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
const avatarColor = (id: number) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
const rColor = (r: number) => r >= 90 ? 'var(--green)' : r >= 80 ? 'var(--yellow)' : 'var(--red)';

function badgeClass(s: string): string {
  const m: Record<string, string> = {
    'Active': 'green', 'Inactive': 'gray', 'Online': 'green', 'Offline': 'gray',
    'Busy': 'orange', 'Not Started': 'yellow', 'Absent': 'red',
    'In Transit': 'orange', 'Out for Delivery': 'blue', 'Delayed': 'red',
    'Pending Pickup': 'yellow', 'Collected': 'green', 'Pending': 'yellow',
    'N/A': 'gray', 'Re-assigned': 'blue',
    'High': 'orange', 'Urgent': 'red', 'Normal': 'gray',
    'Expiring Soon': 'yellow', 'Monthly Fixed': 'blue',
    'Per Delivery': 'purple', 'Hybrid': 'blue',
    'Connected': 'green', 'Not Connected': 'red',
    'Option 2': 'orange', 'Manual': 'gray',
  };
  return m[s] || 'gray';
}

// ═══════════════════════════════════════════════════════════
// REUSABLE MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${badgeClass(label)}`}>{label}</span>
);

const PerfBar: React.FC<{ pct: number; color?: string }> = ({ pct, color }) => (
  <div className="perf-cell">
    <div className="perf-bar">
      <div className="perf-fill" style={{ width: `${pct}%`, background: color || 'var(--accent)' }} />
    </div>
    <div className="perf-pct">{pct}%</div>
  </div>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <>
    <span className="rating-stars">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
    <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 3 }}>{rating}</span>
  </>
);

const ToggleSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => {
  const [on, setOn] = React.useState(defaultChecked);
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
      <span className="toggle-track" />
    </label>
  );
};

const EmptyState: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="empty-state">
    <i className={`fa-solid ${icon}`} />
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

interface InnerTabsProps { tabs: { id: string; label: React.ReactNode }[]; active: string; onChange: (id: string) => void; }
const InnerTabs: React.FC<InnerTabsProps> = ({ tabs, active, onChange }) => (
  <div className="inner-tabs">
    {tabs.map(t => (
      <div key={t.id} className={`itab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
        {t.label}
      </div>
    ))}
  </div>
);

interface CPagProps { current: number; total: number; totalItems: number; start: number; end: number; onChange: (p: number) => void; }
const CPagination: React.FC<CPagProps> = ({ current, total, totalItems, start, end, onChange }) => {
  const pages: (number | '…')[] = [];
  if (total <= 7) { for (let p = 1; p <= total; p++) pages.push(p); }
  else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }
  return (
    <div className="c-pagination">
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
        Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems}</strong>
      </div>
      <div className="c-pag-controls">
        <button className="c-pag-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>‹</button>
        {pages.map((p, i) => p === '…'
          ? <button key={`d${i}`} className="c-pag-btn" style={{ pointerEvents: 'none' }}>…</button>
          : <button key={p} className={`c-pag-btn ${p === current ? 'active' : ''}`} onClick={() => onChange(p as number)}>{p}</button>
        )}
        <button className="c-pag-btn" disabled={current === total || total === 0} onClick={() => onChange(current + 1)}>›</button>
      </div>
    </div>
  );
};

const RiderAvatar: React.FC<{ rider: Rider; size?: number; fontSize?: number }> = ({ rider, size = 30, fontSize = 11 }) => (
  <div className="row-avatar" style={{ background: avatarColor(rider.id), width: size, height: size, fontSize }}>
    {initials(rider.name)}
  </div>
);

// ═══════════════════════════════════════════════════════════
// PANEL: OVERVIEW
// ═══════════════════════════════════════════════════════════

const OverviewPanel: React.FC<{ onNav: (p: NavPanel) => void; onOpenRider: (r: Rider) => void }> = ({ onNav, onOpenRider }) => {
  const activeRiders = RIDERS.filter(r => r.status === 'Active');
  return (
    <div className="rpanel active">
      <div className="panel-heading">Overview</div>
      <div className="panel-desc">Real-time snapshot of rider activity — active deliveries, task queue, daily completions, and alerts requiring immediate attention.</div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div><strong>5 orders</strong> in queue awaiting rider assignment · <strong>3 deliveries</strong> delayed beyond scheduled time.</div>
        <button className="c-btn" style={{ marginLeft: 'auto' }} onClick={() => onNav('assign')}>
          <i className="fa-solid fa-eye" /> Assign Now
        </button>
      </div>

      <div className="mini-stats">
        {[
          { label: 'Active Riders (Today)', value: '6',   trend: '6 online · 2 offline',  up: true  },
          { label: 'Active Deliveries',     value: '8',   trend: 'In transit now',         up: false },
          { label: 'Completed Today',       value: '34',  trend: '+6 vs yesterday',        up: true  },
          { label: 'Avg. Delivery Time',    value: '42m', trend: '-8m vs last week',       up: true  },
        ].map(s => (
          <div className="mini-stat" key={s.label}>
            <div className="ms-label">{s.label}</div>
            <div className="ms-value">{s.value}</div>
            <div className={`ms-trend ${s.up ? 'up' : ''}`}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="detail-grid-3">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-person-biking" /> Rider Status</div>
            <button className="c-btn" onClick={() => onNav('all')}>View All</button>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {RIDERS.slice(0, 5).map(r => (
              <div className="list-item" key={r.id} style={{ cursor: 'pointer' }} onClick={() => onOpenRider(r)}>
                <RiderAvatar rider={r} size={26} fontSize={9} />
                <div className="list-content">
                  <div className="list-title">{r.name}</div>
                  <div className="list-meta">{r.zone}</div>
                </div>
                <div className="list-right"><Badge label={r.availability} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-map-location-dot" /> Active Now</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {ACTIVE_DELIVERIES.slice(0, 4).map(d => (
              <div className="list-item" key={d.order}>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{d.order} · {d.rider.split(' ')[0]}</div>
                  <div className="list-meta">{d.customer} · ETA {d.eta}</div>
                </div>
                <div className="list-right"><Badge label={d.status} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-clipboard-list" /> Pending Assignment</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {UNASSIGNED_ORDERS.slice(0, 4).map(o => (
              <div className="list-item" key={o.order}>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{o.order} · {o.customer}</div>
                  <div className="list-meta">{o.area} · {o.cod}</div>
                </div>
                <div className="list-right"><Badge label={o.priority} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-trophy" /> Today's Rider Performance</div>
          <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Rider</th><th>Assigned</th><th>Completed</th><th>Failed</th>
                <th>Completion %</th><th>Avg. Time</th><th>On-Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeRiders.map(r => {
                const daily = Math.round(r.deliveries / 30);
                const done = Math.round(daily * r.completion / 100);
                const fail = daily - done;
                return (
                  <tr key={r.id} onClick={() => onOpenRider(r)}>
                    <td>
                      <div className="td-flex">
                        <RiderAvatar rider={r} size={26} fontSize={9} />
                        {r.name.split(' ')[0]}
                      </div>
                    </td>
                    <td>{daily}</td>
                    <td style={{ color: 'var(--green)', fontWeight: 600 }}>{done}</td>
                    <td style={{ color: 'var(--red)' }}>{fail}</td>
                    <td><PerfBar pct={r.completion} color={rColor(r.completion)} /></td>
                    <td>{r.avgTime > 0 ? `${r.avgTime} min` : '—'}</td>
                    <td><PerfBar pct={r.onTime} color={rColor(r.onTime)} /></td>
                    <td><Badge label={r.availability} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: ALL RIDERS
// ═══════════════════════════════════════════════════════════

const AllRidersPanel: React.FC<{ onNav: (p: NavPanel) => void; onOpenRider: (r: Rider) => void }> = ({ onNav, onOpenRider }) => {
  const [innerTab, setInnerTab] = useState('grid');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = RIDERS.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.zone.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const DayBadge: React.FC<{ d: string }> = ({ d }) => {
    if (d === 'M') return <span className="day-badge-morning">M</span>;
    if (d === 'E') return <span className="day-badge-evening">E</span>;
    return <span className="day-badge-off">—</span>;
  };

  return (
    <>
      <div className="panel-heading">All Riders</div>
      <div className="panel-desc">Full directory of internal delivery riders. View profiles, contact details, vehicle info, and current status.</div>

      <div className="mini-stats">
        <div className="mini-stat"><div className="ms-label">Total Riders</div><div className="ms-value">8</div><div className="ms-trend">6 active · 2 inactive</div></div>
        <div className="mini-stat"><div className="ms-label">Online Now</div><div className="ms-value">6</div><div className="ms-trend up"><i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 7 }} /> Tracking active</div></div>
        <div className="mini-stat"><div className="ms-label">Avg. Rating</div><div className="ms-value">4.3</div><div className="ms-trend up"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }} /> Customer rated</div></div>
        <div className="mini-stat"><div className="ms-label">Deliveries (MTD)</div><div className="ms-value">312</div><div className="ms-trend up">+42 vs last month</div></div>
      </div>

      <InnerTabs
        tabs={[{ id: 'grid', label: 'Grid View' }, { id: 'table', label: 'Table View' }, { id: 'docs', label: 'Documents' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {/* Grid View */}
      {innerTab === 'grid' && (
        <>
          <div className="c-toolbar" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card) var(--radius-card) 0 0', borderBottom: '1px solid var(--divider)' }}>
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search rider..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="c-btn active">All</button>
              <button className="c-btn" style={{ color: 'var(--green)' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: 7 }} /> Online
              </button>
              <button className="c-btn" style={{ color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: 7 }} /> Offline
              </button>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn primary" onClick={() => onNav('add')}><i className="fa-solid fa-plus" /> Add Rider</button>
            </div>
          </div>
          <div className="rider-grid">
            {filtered.map(r => (
              <div className="rider-card" key={r.id} onClick={() => onOpenRider(r)}>
                <div className="rider-card-status"><Badge label={r.availability} /></div>
                <div className="rider-card-top">
                  <RiderAvatar rider={r} size={36} fontSize={12} />
                  <div>
                    <div className="rider-card-name">{r.name}</div>
                    <div className="rider-card-id"><i className="fa-solid fa-person-biking" style={{ fontSize: 9, color: 'var(--text-muted)' }} /> {r.zone}</div>
                  </div>
                </div>
                <div className="rider-card-stats">
                  <div className="rider-stat"><div className="rider-stat-val">{r.deliveries}</div><div className="rider-stat-lbl">Deliveries</div></div>
                  <div className="rider-stat"><div className="rider-stat-val">{r.completion}%</div><div className="rider-stat-lbl">Completion</div></div>
                  <div className="rider-stat"><div className="rider-stat-val">{r.avgTime > 0 ? `${r.avgTime}m` : '—'}</div><div className="rider-stat-lbl">Avg Time</div></div>
                  <div className="rider-stat"><div className="rider-stat-val">{r.rating > 0 ? r.rating : '—'}</div><div className="rider-stat-lbl">Rating ★</div></div>
                </div>
                <div className="rider-card-footer">
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-motorcycle" style={{ fontSize: 9 }} /> {r.vehicle} · {r.plate}
                  </div>
                  <span className="tag" style={{ fontSize: 9 }}>{r.shift.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Table View */}
      {innerTab === 'table' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
              <button className="c-btn primary" onClick={() => onNav('add')}><i className="fa-solid fa-plus" /> Add Rider</button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Rider</th><th>Phone</th><th>Vehicle</th><th>Zone</th>
                  <th>Deliveries (MTD)</th><th>Completion %</th><th>Rating</th>
                  <th>Status</th><th>Availability</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(r => (
                  <tr key={r.id} onClick={() => onOpenRider(r)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td>
                      <div className="td-flex">
                        <RiderAvatar rider={r} fontSize={9} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{r.name}</div>
                          <div className="td-sub">{r.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{r.phone}</td>
                    <td><span className="tag"><i className="fa-solid fa-motorcycle" style={{ fontSize: 9, marginRight: 3 }} />{r.vehicle}</span></td>
                    <td><span className="tag">{r.zone}</span></td>
                    <td>{r.deliveries}</td>
                    <td><PerfBar pct={r.completion} color={rColor(r.completion)} /></td>
                    <td>{r.rating > 0 ? <StarRating rating={r.rating} /> : '—'}</td>
                    <td><Badge label={r.status} /></td>
                    <td><Badge label={r.availability} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5 }} onClick={() => onOpenRider(r)}><i className="fa-solid fa-eye" /></button>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3 }}><i className="fa-solid fa-pen" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
        </div>
      )}

      {/* Documents */}
      {innerTab === 'docs' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-alt" /> Rider Documents</div>
            <button className="c-btn primary"><i className="fa-solid fa-upload" /> Upload Document</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Rider</th><th>Document Type</th><th>File Name</th><th>Expiry Date</th><th>Status</th><th>Uploaded</th><th>Actions</th></tr></thead>
              <tbody>
                {DOCS_DATA.map((d, i) => (
                  <tr key={i}>
                    <td><strong>{d.rider}</strong></td>
                    <td>{d.type}</td>
                    <td><code className="sku">{d.file}</code></td>
                    <td>{d.expiry}</td>
                    <td><Badge label={d.status} /></td>
                    <td>{d.uploaded}</td>
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5, marginLeft: 3, color: 'var(--red)' }}><i className="fa-solid fa-trash" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule tab under docs — not shown here separately */}
      {innerTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-calendar-alt" /> Shift Schedule Configuration</div>
            <button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Shift</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Rider</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th><th>Actions</th></tr></thead>
              <tbody>
                {SCHEDULE_DATA.map(s => (
                  <tr key={s.rider}>
                    <td><strong>{s.rider.split(' ')[0]}</strong></td>
                    {s.days.map((d, i) => (
                      <td key={i} style={{ textAlign: 'center' }}>
                        <DayBadge d={d} />
                      </td>
                    ))}
                    <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: ADD RIDER
// ═══════════════════════════════════════════════════════════

const AddRiderPanel: React.FC<{ onNav: (p: NavPanel) => void }> = ({ onNav }) => (
  <>
    <div className="panel-heading">Add New Rider</div>
    <div className="panel-desc">Register a new internal delivery rider. Fill in personal details, vehicle information, assigned zone, and pay structure.</div>
    <div className="card">
      <div className="card-header"><div className="card-title"><i className="fa-solid fa-user-plus" /> Rider Registration</div></div>
      <div className="card-body">
        <div className="section-label">Personal Information</div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">Full Name *</div><input className="c-form-input" placeholder="e.g. Usman Ahmed" /></div>
          <div className="c-form-group"><div className="c-form-label">Phone Number *</div><input className="c-form-input" placeholder="03XX-XXXXXXX" /></div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">CNIC Number</div><input className="c-form-input" placeholder="XXXXX-XXXXXXX-X" /></div>
          <div className="c-form-group"><div className="c-form-label">Date of Birth</div><input className="c-form-input" type="date" /></div>
        </div>
        <div className="c-form-row single">
          <div className="c-form-group"><div className="c-form-label">Home Address</div><input className="c-form-input" placeholder="Full residential address" /></div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">Emergency Contact Name</div><input className="c-form-input" placeholder="Name" /></div>
          <div className="c-form-group"><div className="c-form-label">Emergency Contact Phone</div><input className="c-form-input" placeholder="03XX-XXXXXXX" /></div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
        <div className="section-label">Vehicle &amp; Assignment</div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">Vehicle Type</div>
            <select className="c-form-select"><option>Motorcycle</option><option>Bicycle</option><option>Van</option><option>Car</option></select>
          </div>
          <div className="c-form-group"><div className="c-form-label">Vehicle Registration No.</div><input className="c-form-input" placeholder="LHR-1234" /></div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">Primary Delivery Zone</div>
            <select className="c-form-select">
              {ZONES_DATA.map(z => <option key={z.name}>{z.name}</option>)}
              <option>All Zones</option>
            </select>
          </div>
          <div className="c-form-group"><div className="c-form-label">Shift</div>
            <select className="c-form-select">
              <option>Morning (9AM–5PM)</option><option>Evening (5PM–11PM)</option><option>Full Day</option><option>Flexible</option>
            </select>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
        <div className="section-label">Pay Structure</div>
        <div className="c-form-row triple">
          <div className="c-form-group"><div className="c-form-label">Pay Type</div>
            <select className="c-form-select"><option>Per Delivery</option><option>Monthly Fixed</option><option>Hybrid</option></select>
          </div>
          <div className="c-form-group"><div className="c-form-label">Per Delivery Rate (₨)</div><input className="c-form-input" type="number" placeholder="80" /></div>
          <div className="c-form-group"><div className="c-form-label">Monthly Base (₨)</div><input className="c-form-input" type="number" placeholder="0" /></div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
        <div className="section-label">System Access</div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">System Login Email</div><input className="c-form-input" type="email" placeholder="rider@yourstore.com" /></div>
          <div className="c-form-group"><div className="c-form-label">Temporary Password</div><input className="c-form-input" type="password" placeholder="Auto-generate or set" /></div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group"><div className="c-form-label">Status</div>
            <select className="c-form-select"><option>Active</option><option>Inactive</option></select>
          </div>
          <div className="c-form-group"><div className="c-form-label">Join Date</div><input className="c-form-input" type="date" /></div>
        </div>
        <div className="c-form-row single">
          <div className="c-form-group"><div className="c-form-label">Notes</div><textarea className="c-form-textarea" placeholder="Any additional notes about this rider..." /></div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Register Rider</button>
          <button className="c-btn" onClick={() => onNav('all')}>Cancel</button>
        </div>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// PANEL: AVAILABILITY
// ═══════════════════════════════════════════════════════════

const AvailabilityPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('today');

  const DayBadge: React.FC<{ d: string }> = ({ d }) => {
    if (d === 'M') return <span className="day-badge-morning">M</span>;
    if (d === 'E') return <span className="day-badge-evening">E</span>;
    return <span className="day-badge-off">—</span>;
  };

  return (
    <>
      <div className="panel-heading">Rider Availability</div>
      <div className="panel-desc">View and manage rider shifts, day-off schedules, and real-time availability. Ensure adequate coverage for each zone.</div>
      <InnerTabs
        tabs={[{ id: 'today', label: 'Today' }, { id: 'week', label: 'This Week' }, { id: 'schedule', label: 'Shift Schedule' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'today' && (
        <>
          <div className="mini-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="mini-stat"><div className="ms-label">On Duty</div><div className="ms-value" style={{ color: 'var(--green)' }}>6</div><div className="ms-trend">Currently active</div></div>
            <div className="mini-stat"><div className="ms-label">Day Off</div><div className="ms-value" style={{ color: 'var(--text-muted)' }}>1</div><div className="ms-trend">Scheduled off</div></div>
            <div className="mini-stat"><div className="ms-label">Absent / Sick</div><div className="ms-value" style={{ color: 'var(--red)' }}>1</div><div className="ms-trend down">Unplanned absence</div></div>
          </div>
          <div className="card">
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Rider</th><th>Shift</th><th>Check-In</th><th>Zone</th><th>Current Task</th><th>Availability</th><th>Actions</th></tr></thead>
                <tbody>
                  {AVAILABILITY_DATA.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <div className="td-flex">
                          <div className="row-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], fontSize: 9 }}>{initials(a.rider)}</div>
                          <strong>{a.rider}</strong>
                        </div>
                      </td>
                      <td><span className="tag">{a.shift}</span></td>
                      <td>{a.checkin}</td>
                      <td>{a.zone}</td>
                      <td>{a.task !== '—' ? <code className="sku">{a.task}</code> : '—'}</td>
                      <td><Badge label={a.avail} /></td>
                      <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {innerTab === 'week' && (
        <div className="card"><div className="card-body"><EmptyState icon="fa-calendar-week" title="Weekly Schedule" desc="Weekly view of rider shift assignments and off days." /></div></div>
      )}

      {innerTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-calendar-alt" /> Shift Schedule Configuration</div>
            <button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Shift</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Rider</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th><th>Actions</th></tr></thead>
              <tbody>
                {SCHEDULE_DATA.map(s => (
                  <tr key={s.rider}>
                    <td><strong>{s.rider.split(' ')[0]}</strong></td>
                    {s.days.map((d, i) => (
                      <td key={i} style={{ textAlign: 'center' }}><DayBadge d={d} /></td>
                    ))}
                    <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: ACTIVE DELIVERIES
// ═══════════════════════════════════════════════════════════

const ActiveDeliveriesPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = ACTIVE_DELIVERIES.filter(d =>
    !search || d.order.toLowerCase().includes(search.toLowerCase()) || d.rider.toLowerCase().includes(search.toLowerCase()) || d.customer.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">Active Deliveries</div>
      <div className="panel-desc">All deliveries currently in progress by internal riders. Monitor real-time location updates, estimated arrival, and flag delays.</div>
      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <strong>3 deliveries</strong> are running behind schedule by more than 20 minutes.
        <button className="c-btn" style={{ marginLeft: 'auto' }}>View Delayed</button>
      </div>

      <InnerTabs
        tabs={[
          { id: 'all', label: 'All Active' },
          { id: 'delayed', label: <span>Delayed <span style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>3</span></span> },
          { id: 'map', label: 'Live Map View' },
        ]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'all' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order or rider..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
              <button className="c-btn">All Riders</button>
            </div>
            <div className="c-toolbar-right"><button className="c-btn"><i className="fa-solid fa-rotate" /> Refresh</button></div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Rider</th><th>Customer</th><th>Address</th><th>Assigned</th><th>ETA</th><th>COD</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pageItems.map(d => {
                  const r = RIDERS.find(x => x.name === d.rider);
                  return (
                    <tr key={d.order}>
                      <td><strong>{d.order}</strong></td>
                      <td>
                        <div className="td-flex">
                          <div className="row-avatar" style={{ background: avatarColor(r?.id || 1), width: 22, height: 22, fontSize: 8 }}>{initials(d.rider)}</div>
                          {d.rider.split(' ')[0]}
                        </div>
                      </td>
                      <td>{d.customer}</td>
                      <td style={{ fontSize: 10.5, maxWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.address}</td>
                      <td>{d.assigned}</td>
                      <td><strong>{d.eta}</strong></td>
                      <td><strong>{d.cod}</strong></td>
                      <td><Badge label={d.status} /></td>
                      <td>
                        <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-location-dot" /></button>
                        <button className="c-btn" style={{ height: 22, fontSize: 9.5, marginLeft: 3 }}><i className="fa-solid fa-phone" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <CPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
        </div>
      )}

      {innerTab === 'delayed' && (
        <>
          <div className="alert-strip danger"><i className="fa-solid fa-clock" />The following deliveries are past their expected time. Contact riders immediately.</div>
          <div className="card"><div className="card-body"><EmptyState icon="fa-person-biking" title="3 Delayed Deliveries" desc="Contact riders or reassign orders." /></div></div>
        </>
      )}

      {innerTab === 'map' && (
        <div className="map-placeholder">
          {[
            { color: '#FF6A00', top: '35%', left: '42%' },
            { color: '#16A34A', top: '55%', left: '60%' },
            { color: '#2563EB', top: '25%', left: '70%' },
            { color: '#FF6A00', top: '65%', left: '30%' },
            { color: '#16A34A', top: '45%', left: '50%' },
            { color: '#7C3AED', top: '70%', left: '55%' },
          ].map((dot, i) => (
            <div key={i} className="map-rider-dot" style={{ background: dot.color, top: dot.top, left: dot.left }} />
          ))}
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--accent)', fontSize: 8 }} /> 6 riders live</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Live GPS tracking requires app integration. See <strong>App Integrations</strong> tab.</div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: ASSIGN TASKS
// ═══════════════════════════════════════════════════════════

const AssignTasksPanel: React.FC = () => {
  const activeRiders = RIDERS.filter(r => r.status === 'Active');
  return (
    <>
      <div className="panel-heading">Assign Delivery Tasks</div>
      <div className="panel-desc">Orders ready for internal rider assignment. Review customer location and available riders, then assign. Supports bulk assignment.</div>

      <div className="detail-grid-2" style={{ marginBottom: 14 }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-clipboard-list" /> Unassigned Orders (5)</div></div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th><input type="checkbox" /></th><th>Order ID</th><th>Customer</th><th>Area</th><th>COD</th><th>Priority</th></tr></thead>
              <tbody>
                {UNASSIGNED_ORDERS.map(o => (
                  <tr key={o.order}>
                    <td><input type="checkbox" /></td>
                    <td><strong>{o.order}</strong></td>
                    <td>{o.customer}</td>
                    <td><span className="tag">{o.area}</span></td>
                    <td><strong>{o.cod}</strong></td>
                    <td><Badge label={o.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-person-biking" /> Available Riders</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {activeRiders.map(r => (
              <div className="list-item" key={r.id}>
                <RiderAvatar rider={r} fontSize={9} />
                <div className="list-content">
                  <div className="list-title">{r.name}</div>
                  <div className="list-meta">{r.zone} · {r.vehicle}</div>
                </div>
                <div className="list-right">
                  <Badge label={r.availability} />
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3 }}>{r.deliveries % 5} today</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-paper-plane" /> Quick Assign</div></div>
        <div className="card-body">
          <div className="c-form-row">
            <div className="c-form-group"><div className="c-form-label">Select Order</div>
              <select className="c-form-select">
                {UNASSIGNED_ORDERS.map(o => <option key={o.order}>{o.order} — {o.customer} ({o.area})</option>)}
              </select>
            </div>
            <div className="c-form-group"><div className="c-form-label">Assign To Rider</div>
              <select className="c-form-select">{activeRiders.map(r => <option key={r.id}>{r.name} ({r.zone})</option>)}</select>
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group"><div className="c-form-label">Priority</div>
              <select className="c-form-select"><option>Normal</option><option>High</option><option>Urgent</option></select>
            </div>
            <div className="c-form-group"><div className="c-form-label">Expected Delivery By</div><input className="c-form-input" type="time" defaultValue="17:00" /></div>
          </div>
          <div className="c-form-row single">
            <div className="c-form-group"><div className="c-form-label">Notes for Rider</div><textarea className="c-form-textarea" placeholder="e.g. Call on arrival, leave at gate..." /></div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="c-btn primary"><i className="fa-solid fa-paper-plane" /> Assign &amp; Notify Rider</button>
            <button className="c-btn"><i className="fa-solid fa-layer-group" /> Bulk Assign</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: COMPLETED DELIVERIES
// ═══════════════════════════════════════════════════════════

const CompletedPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = COMPLETED_DELIVERIES.filter(d =>
    !search || d.order.toLowerCase().includes(search.toLowerCase()) || d.rider.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">Completed Deliveries</div>
      <div className="panel-desc">All deliveries successfully completed by internal riders. Verify COD collection, customer confirmation, and close out delivery records.</div>
      <InnerTabs
        tabs={[{ id: 'all', label: 'All Completed' }, { id: 'cod-pend', label: 'COD Not Collected' }, { id: 'today', label: 'Today' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'all' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order or rider..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
              <button className="c-btn"><i className="fa-solid fa-calendar" /> Date</button>
            </div>
            <div className="c-toolbar-right"><button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Rider</th><th>Customer</th><th>Delivered At</th><th>Time Taken</th><th>COD Amount</th><th>COD Status</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {pageItems.map(d => (
                  <tr key={d.order}>
                    <td><strong>{d.order}</strong></td>
                    <td>{d.rider.split(' ')[0]}</td>
                    <td>{d.customer}</td>
                    <td>{d.time}</td>
                    <td>{d.taken}</td>
                    <td><strong>{fmt(d.cod)}</strong></td>
                    <td><Badge label={d.codStatus} /></td>
                    <td><span className="rating-stars" style={{ fontSize: 11 }}>{d.rating}</span></td>
                    <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Submit COD</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
        </div>
      )}
      {innerTab === 'cod-pend' && (
        <><div className="alert-strip warn"><i className="fa-solid fa-coins" />₨14,800 COD collected but not yet submitted by riders.</div>
          <div className="card"><div className="card-body"><EmptyState icon="fa-money-bill-wave" title="COD Not Submitted" desc="8 deliveries with collected COD pending submission to accounts." /></div></div></>
      )}
      {innerTab === 'today' && (
        <div className="card"><div className="card-body"><EmptyState icon="fa-circle-check" title="Today: 34 Deliveries Completed" desc="All riders have performed well today." /></div></div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: FAILED DELIVERIES
// ═══════════════════════════════════════════════════════════

const FailedDeliveriesPanel: React.FC = () => (
  <>
    <div className="panel-heading">Failed Deliveries &amp; Returns</div>
    <div className="panel-desc">Deliveries that could not be completed by internal riders. Review failure reason, re-attempt or mark as returned.</div>
    <div className="alert-strip danger"><i className="fa-solid fa-circle-xmark" /><strong>3 deliveries</strong> marked as failed after maximum attempts.</div>
    <div className="card">
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Rider</th><th>Customer</th><th>Phone</th><th>Attempts</th><th>Last Attempt</th><th>Failure Reason</th><th>Action</th><th>Actions</th></tr></thead>
          <tbody>
            {FAILED_DELIVERIES.map(f => (
              <tr key={f.order}>
                <td><strong>{f.order}</strong></td>
                <td>{f.rider.split(' ')[0]}</td>
                <td>{f.customer}</td>
                <td>{f.phone}</td>
                <td style={{ fontWeight: 700, color: 'var(--red)' }}>{f.attempts}</td>
                <td>{f.last}</td>
                <td>{f.reason}</td>
                <td><Badge label={f.action} /></td>
                <td style={{ display: 'flex', gap: 4 }}>
                  <button className="c-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-rotate" /> Re-attempt</button>
                  <button className="c-btn" style={{ height: 22, fontSize: 9.5, color: 'var(--red)' }}><i className="fa-solid fa-xmark" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// PANEL: LIVE MAP
// ═══════════════════════════════════════════════════════════

const LiveMapPanel: React.FC = () => {
  const onlineRiders = RIDERS.filter(r => r.availability === 'Online');
  return (
    <>
      <div className="panel-heading">Live Map</div>
      <div className="panel-desc">Real-time GPS tracking of all active riders. Requires mobile app integration for riders to share live location.</div>
      <div className="alert-strip info"><i className="fa-solid fa-circle-info" />Live GPS tracking requires the <strong>Rider Mobile App</strong> integration. Connect via the <strong>App Integrations</strong> panel.</div>

      <div className="map-placeholder tall">
        <div className="map-rider-dot large" style={{ background: '#FF6A00', top: '30%', left: '40%' }} />
        <div className="map-label-popup" style={{ top: 'calc(30% - 28px)', left: 'calc(40% + 8px)' }}>Usman · ORD-1052</div>
        <div className="map-rider-dot large" style={{ background: '#16A34A', top: '55%', left: '65%' }} />
        <div className="map-label-popup" style={{ top: 'calc(55% - 28px)', left: 'calc(65% + 8px)' }}>Bilal · ORD-1053</div>
        <div className="map-rider-dot large" style={{ background: '#2563EB', top: '25%', left: '70%' }} />
        <div className="map-rider-dot large" style={{ background: '#7C3AED', top: '68%', left: '35%' }} />
        <div className="map-rider-dot large" style={{ background: '#D97706', top: '45%', left: '50%' }} />
        <div className="map-rider-dot large" style={{ background: '#DC2626', top: '72%', left: '58%' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 8 }}>
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--accent)', fontSize: 8 }} /> Delivering</div>
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 8 }} /> Idle / Available</div>
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--red)', fontSize: 8 }} /> Delayed</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '10px 16px', textAlign: 'center' }}>
          <i className="fa-solid fa-map-location-dot" style={{ fontSize: 22, color: 'var(--accent)', display: 'block', marginBottom: 4 }} />
          <div style={{ fontSize: 11, fontWeight: 700 }}>Live GPS Map</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>6 riders being tracked · Last update: just now</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-list" /> Rider Locations (Live)</div>
          <button className="c-btn"><i className="fa-solid fa-rotate" /> Refresh</button>
        </div>
        <div className="card-body" style={{ padding: '8px 14px' }}>
          {onlineRiders.map(r => {
            const active = ACTIVE_DELIVERIES.find(d => d.rider === r.name);
            return (
              <div className="list-item" key={r.id}>
                <RiderAvatar rider={r} fontSize={9} />
                <div className="list-content">
                  <div className="list-title">
                    {r.name}
                    {active && <span className="badge orange" style={{ fontSize: 8.5, marginLeft: 4 }}>{active.order}</span>}
                  </div>
                  <div className="list-meta">{r.zone} · <i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 7 }} /> Last seen just now</div>
                </div>
                <div className="list-right">
                  <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-location-dot" /> Track</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: ROUTE HISTORY
// ═══════════════════════════════════════════════════════════

const RouteHistoryPanel: React.FC = () => (
  <>
    <div className="panel-heading">Route History</div>
    <div className="panel-desc">View historical delivery routes taken by riders. Useful for verifying delivery paths, analyzing efficiency, and resolving customer disputes.</div>
    <div className="card">
      <div className="c-toolbar">
        <div className="c-toolbar-left">
          <div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search order or rider..." /></div>
          <select className="c-form-select" style={{ height: 27, fontSize: 10.5 }}>
            <option>All Riders</option>
            {RIDERS.filter(r => r.status === 'Active').map(r => <option key={r.id}>{r.name}</option>)}
          </select>
          <button className="c-btn"><i className="fa-solid fa-calendar" /> Date Range</button>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Rider</th><th>Route Start</th><th>Route End</th><th>Distance (km)</th><th>Duration</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {ROUTES_DATA.map(r => (
              <tr key={r.order}>
                <td><strong>{r.order}</strong></td>
                <td>{r.rider}</td>
                <td>{r.start}</td>
                <td>{r.end}</td>
                <td>{r.km} km</td>
                <td>{r.duration}</td>
                <td>{r.date}</td>
                <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-map" /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// PANEL: PERFORMANCE
// ═══════════════════════════════════════════════════════════

const PerformancePanel: React.FC<{ onOpenRider: (r: Rider) => void }> = ({ onOpenRider }) => {
  const [innerTab, setInnerTab] = useState('summary');
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Rider Performance</div>
      <div className="panel-desc">Comparative performance analytics across all riders — delivery completion rates, average times, on-time percentages, and customer ratings.</div>
      <InnerTabs
        tabs={[{ id: 'summary', label: 'Summary' }, { id: 'detail', label: 'Detailed Metrics' }, { id: 'trends', label: 'Trends' }, { id: 'kpi', label: 'KPI Dashboard' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'summary' && (
        <>
          <div className="mini-stats">
            <div className="mini-stat"><div className="ms-label">Top Performer</div><div className="ms-value" style={{ fontSize: 14 }}>Usman</div><div className="ms-trend up">96% completion</div></div>
            <div className="mini-stat"><div className="ms-label">Fastest Rider</div><div className="ms-value" style={{ fontSize: 14 }}>Asad</div><div className="ms-trend up">34 min avg.</div></div>
            <div className="mini-stat"><div className="ms-label">Highest Rated</div><div className="ms-value" style={{ fontSize: 14 }}>Bilal</div><div className="ms-trend up">4.9 ★</div></div>
            <div className="mini-stat"><div className="ms-label">Overall Completion</div><div className="ms-value">91%</div><div className="ms-trend up">+4% this month</div></div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title"><i className="fa-solid fa-trophy" /> Performance Scorecard</div></div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rider</th><th>Assigned</th><th>Delivered</th><th>Failed</th>
                    <th>Completion %</th><th>Avg. Time</th><th>On-Time %</th>
                    <th>COD Collected</th><th>Rating</th><th>Earnings (MTD)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRiders.map(r => {
                    const delivered = Math.round(r.deliveries * r.completion / 100);
                    const failed = r.deliveries - delivered;
                    return (
                      <tr key={r.id} onClick={() => onOpenRider(r)}>
                        <td>
                          <div className="td-flex">
                            <RiderAvatar rider={r} fontSize={9} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{r.name}</div>
                              <div className="td-sub">{r.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td>{r.deliveries}</td>
                        <td style={{ color: 'var(--green)', fontWeight: 600 }}>{delivered}</td>
                        <td style={{ color: 'var(--red)' }}>{failed}</td>
                        <td><PerfBar pct={r.completion} color={rColor(r.completion)} /></td>
                        <td>{r.avgTime > 0 ? `${r.avgTime} min` : '—'}</td>
                        <td>{r.onTime > 0 ? <PerfBar pct={r.onTime} color={rColor(r.onTime)} /> : '—'}</td>
                        <td>{fmt(Math.round(delivered * 80))}</td>
                        <td>{r.rating > 0 ? <StarRating rating={r.rating} /> : '—'}</td>
                        <td><strong style={{ color: 'var(--green)' }}>{fmt(r.earned + r.bonus)}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {innerTab === 'detail' && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-simple" title="Detailed Metrics" desc="Select a rider and date range to view breakdown." /></div></div>}
      {innerTab === 'trends' && <div className="card"><div className="card-body"><EmptyState icon="fa-chart-line" title="Performance Trends" desc="Month-over-month completion and timing trends." /></div></div>}
      {innerTab === 'kpi' && (
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-gauge" /> KPI Overview — May 2026</div></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 14 }}>
              {activeRiders.slice(0, 4).map(r => (
                <div key={r.id} style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}>
                  <RiderAvatar rider={r} size={36} fontSize={11} />
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 8 }}>{r.name.split(' ')[0]}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10, gap: 4 }}>
                    <div className="kpi-ring-wrap">
                      <div className={`kpi-ring ${r.completion >= 90 ? 'good' : r.completion >= 80 ? 'warn' : 'bad'}`}>{r.completion}%</div>
                      <div className="kpi-ring-label">Completion</div>
                    </div>
                    <div className="kpi-ring-wrap">
                      <div className={`kpi-ring ${r.onTime >= 90 ? 'good' : r.onTime >= 80 ? 'warn' : 'bad'}`}>{r.onTime}%</div>
                      <div className="kpi-ring-label">On-Time</div>
                    </div>
                    <div className="kpi-ring-wrap">
                      <div className={`kpi-ring ${r.rating >= 4.5 ? 'good' : r.rating >= 3.5 ? 'warn' : 'bad'}`} style={{ fontSize: 11 }}>{r.rating}★</div>
                      <div className="kpi-ring-label">Rating</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: EARNINGS & PAY
// ═══════════════════════════════════════════════════════════

const EarningsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('summary');
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Earnings &amp; Pay</div>
      <div className="panel-desc">Track per-delivery earnings, monthly pay calculations, bonuses, and pending payouts for each rider.</div>
      <InnerTabs
        tabs={[{ id: 'summary', label: 'Pay Summary' }, { id: 'detail', label: 'Delivery Breakdown' }, { id: 'payout', label: 'Payouts' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'summary' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-coins" /> Monthly Pay Summary — May 2026</div>
            <button className="c-btn primary"><i className="fa-solid fa-file-export" /> Export Payroll</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rider</th><th>Pay Type</th><th>Deliveries</th><th>Base/Per Delivery</th>
                  <th>Earned</th><th>Bonus</th><th>Total Due</th><th>Paid</th><th>Balance</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeRiders.map(r => {
                  const balance = r.earned + r.bonus - r.paid;
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="td-flex">
                          <RiderAvatar rider={r} fontSize={9} />
                          <strong>{r.name}</strong>
                        </div>
                      </td>
                      <td><Badge label={r.pay} /></td>
                      <td>{r.deliveries}</td>
                      <td>{r.pay === 'Monthly Fixed' ? `${fmt(r.rate)}/mo` : `${fmt(r.rate)}/del`}</td>
                      <td><strong>{fmt(r.earned)}</strong></td>
                      <td style={{ color: 'var(--green)' }}>{r.bonus > 0 ? fmt(r.bonus) : '—'}</td>
                      <td><strong style={{ color: 'var(--accent)' }}>{fmt(r.earned + r.bonus)}</strong></td>
                      <td style={{ color: 'var(--green)' }}>{fmt(r.paid)}</td>
                      <td style={{ color: balance > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{fmt(balance)}</td>
                      <td><button className="c-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-money-bill-transfer" /> Pay</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {innerTab === 'detail' && <div className="card"><div className="card-body"><EmptyState icon="fa-list-ul" title="Delivery Breakdown" desc="Select a rider to view per-delivery earnings detail." /></div></div>}
      {innerTab === 'payout' && (
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-money-bill-transfer" /> Record Payout</div></div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group"><div className="c-form-label">Rider</div>
                <select className="c-form-select">{activeRiders.map(r => <option key={r.id}>{r.name}</option>)}</select>
              </div>
              <div className="c-form-group"><div className="c-form-label">Amount (₨)</div><input className="c-form-input" type="number" placeholder="0" /></div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group"><div className="c-form-label">Payment Method</div>
                <select className="c-form-select"><option>Cash</option><option>Bank Transfer</option><option>JazzCash</option><option>EasyPaisa</option></select>
              </div>
              <div className="c-form-group"><div className="c-form-label">Date</div><input className="c-form-input" type="date" /></div>
            </div>
            <div className="c-form-row single"><div className="c-form-group"><div className="c-form-label">Notes</div><textarea className="c-form-textarea" placeholder="Optional payment notes..." /></div></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
            <button className="c-btn primary"><i className="fa-solid fa-check" /> Record Payment</button>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: REPORTS
// ═══════════════════════════════════════════════════════════

const ReportsPanel: React.FC = () => (
  <>
    <div className="panel-heading">Rider Reports</div>
    <div className="panel-desc">Generate downloadable reports on rider performance, delivery statistics, earnings, and operational summaries.</div>
    <div className="detail-grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-file-chart-column" /> Generate Report</div></div>
        <div className="card-body">
          <div className="c-form-row single"><div className="c-form-group"><div className="c-form-label">Report Type</div>
            <select className="c-form-select">
              <option>Rider Performance Summary</option><option>Daily Delivery Log</option>
              <option>Earnings &amp; Payroll Report</option><option>COD Collection Report</option>
              <option>Failed Deliveries Report</option><option>Route Efficiency Report</option>
            </select>
          </div></div>
          <div className="c-form-row">
            <div className="c-form-group"><div className="c-form-label">Date From</div><input className="c-form-input" type="date" /></div>
            <div className="c-form-group"><div className="c-form-label">Date To</div><input className="c-form-input" type="date" /></div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group"><div className="c-form-label">Rider</div>
              <select className="c-form-select">
                <option>All Riders</option>
                {RIDERS.filter(r => r.status === 'Active').map(r => <option key={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="c-form-group"><div className="c-form-label">Format</div>
              <select className="c-form-select"><option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>PDF</option></select>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
          <button className="c-btn primary" style={{ width: '100%', justifyContent: 'center' }}><i className="fa-solid fa-file-export" /> Generate &amp; Download</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Reports</div></div>
        <div className="card-body" style={{ padding: '0 14px' }}>
          {RECENT_REPORTS.map(r => (
            <div className="list-item" key={r.name}>
              <div className="list-icon" style={{ background: 'var(--green-bg)' }}><i className="fa-solid fa-file-chart-column" style={{ color: 'var(--green)', fontSize: 11 }} /></div>
              <div className="list-content"><div className="list-title">{r.name}</div><div className="list-meta">{r.date} · {r.format} · {r.size}</div></div>
              <div className="list-right"><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// PANEL: INTEGRATIONS
// ═══════════════════════════════════════════════════════════

const IntegrationsPanel: React.FC = () => {
  const IntCard: React.FC<{ logo: React.ReactNode; name: string; desc: string; badge: string; btnLabel: string; btnPrimary?: boolean }> = ({ logo, name, desc, badge, btnLabel, btnPrimary }) => (
    <div className="integration-card">
      <div className="integration-logo">{logo}</div>
      <div><div className="integration-name">{name}</div><div className="integration-desc">{desc}</div></div>
      <div className="integration-right">
        <Badge label={badge} />
        <button className={`c-btn ${btnPrimary ? 'primary' : ''}`} style={{ fontSize: 10 }}>{btnLabel}</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="panel-heading">App Integrations</div>
      <div className="panel-desc">Connect third-party apps and tools to enhance rider tracking, delivery notifications, and operational automation.</div>
      <div className="alert-strip info"><i className="fa-solid fa-circle-info" />Integrations marked <strong>Option 2</strong> are available under Option 2 of the system plan. Connect to unlock real-time tracking, automated dispatch, and more.</div>

      <div className="section-label" style={{ marginTop: 4 }}>Rider Mobile App</div>
      <IntCard
        logo={<i className="fa-solid fa-location-dot" style={{ color: '#FF6A00', fontSize: 20 }} />}
        name="Zone In Rider App"
        desc="Custom mobile app for riders — view tasks, update delivery status, collect COD confirmation, and share live GPS location."
        badge="Option 2" btnLabel="Setup Guide" btnPrimary
      />

      <div className="section-label" style={{ marginTop: 14 }}>Live Tracking &amp; Maps</div>
      <IntCard
        logo={<i className="fa-solid fa-map" style={{ color: '#4285F4', fontSize: 18 }} />}
        name="Google Maps"
        desc="Route planning and live location display for rider tracking on the Live Map view. Embed in operations dashboard."
        badge="Not Connected" btnLabel="Connect" btnPrimary
      />

      <div className="section-label" style={{ marginTop: 14 }}>Communication &amp; Notifications</div>
      <IntCard
        logo={<i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: 22 }} />}
        name="WhatsApp Business API"
        desc="Send automated delivery status updates, assignment notifications, and COD confirmations to riders and customers via WhatsApp."
        badge="Not Connected" btnLabel="Connect" btnPrimary
      />
      <IntCard
        logo={<i className="fa-solid fa-bell" style={{ color: '#FF6900', fontSize: 18 }} />}
        name="Firebase Push Notifications"
        desc="Send real-time push notifications to rider mobile app for new task assignments, cancellations, and urgent alerts."
        badge="Option 2" btnLabel="Learn More"
      />

      <div className="section-label" style={{ marginTop: 14 }}>E-commerce &amp; Order Sources</div>
      <IntCard
        logo={<span style={{ fontSize: 9, fontWeight: 800, color: '#96BF48' }}>SHOPIFY</span>}
        name="Shopify"
        desc="Auto-pull confirmed Shopify orders into the rider dispatch queue. Orders ready for internal delivery appear automatically."
        badge="Not Connected" btnLabel="Connect" btnPrimary
      />

      <div className="section-label" style={{ marginTop: 14 }}>Rider Payments</div>
      <IntCard
        logo={<span style={{ fontSize: 8, fontWeight: 800, color: '#AA1F27', textAlign: 'center' }}>Jazz Cash</span>}
        name="JazzCash"
        desc="Pay riders directly via JazzCash mobile wallet. Record and confirm digital payouts within the earnings module."
        badge="Manual" btnLabel="Configure"
      />
      <IntCard
        logo={<span style={{ fontSize: 8, fontWeight: 800, color: '#02a550', textAlign: 'center', lineHeight: '1.2' }}>Easy Paisa</span>}
        name="EasyPaisa"
        desc="Pay riders via EasyPaisa mobile wallet. Log payments and track payout history in the earnings module."
        badge="Manual" btnLabel="Configure"
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: SETTINGS
// ═══════════════════════════════════════════════════════════

const SettingsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('general');
  return (
    <>
      <div className="panel-heading">Rider Settings</div>
      <div className="panel-desc">Configure system-wide rider defaults — dispatch rules, COD collection limits, notification preferences, and performance thresholds.</div>
      <InnerTabs
        tabs={[{ id: 'general', label: 'General' }, { id: 'dispatch', label: 'Dispatch' }, { id: 'notif', label: 'Notifications' }, { id: 'pay', label: 'Pay Rules' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'general' && (
        <>
          <div className="settings-grid">
            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-sliders" /> General Defaults</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Default Shift Duration</div><div className="stg-desc">Standard working hours per day</div></div><input type="number" defaultValue={8} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Max Deliveries Per Rider/Day</div><div className="stg-desc">Cap per rider before overflow</div></div><input type="number" defaultValue={20} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">COD Collection Limit (₨)</div><div className="stg-desc">Max cash a rider can hold</div></div><input type="number" defaultValue={15000} className="stg-input" /></div>
                <div className="stg-row"><div><div className="stg-key">Allow Rider Self Check-In</div><div className="stg-desc">Rider marks own attendance</div></div><ToggleSwitch defaultChecked /></div>
                <div className="stg-row"><div><div className="stg-key">Require Customer Signature</div><div className="stg-desc">Confirm delivery via app</div></div><ToggleSwitch /></div>
              </div>
            </div>
            <div className="settings-section">
              <div className="settings-section-head"><i className="fa-solid fa-shield-halved" /> Performance Thresholds</div>
              <div className="settings-section-body">
                <div className="stg-row"><div><div className="stg-key">Min. Completion Rate (%)</div><div className="stg-desc">Below this flags for review</div></div><input type="number" defaultValue={85} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">On-Time Target (%)</div></div><input type="number" defaultValue={90} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Max Failed Deliveries/Week</div><div className="stg-desc">Before escalation alert</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
                <div className="stg-row"><div><div className="stg-key">Auto-Flag Low Performers</div></div><ToggleSwitch defaultChecked /></div>
                <div className="stg-row"><div><div className="stg-key">Rating Below Alert</div><div className="stg-desc">Alert if rider rating drops below</div></div><input type="number" defaultValue={3.5} className="stg-input" style={{ width: 60 }} step={0.1} /></div>
              </div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save General Settings</button>
        </>
      )}

      {innerTab === 'dispatch' && (
        <>
          <div className="settings-section" style={{ marginBottom: 12 }}>
            <div className="settings-section-head"><i className="fa-solid fa-paper-plane" /> Dispatch Configuration</div>
            <div className="settings-section-body">
              <div className="stg-row"><div><div className="stg-key">Auto-Assign Rider</div><div className="stg-desc">Assign based on zone and availability</div></div><ToggleSwitch defaultChecked /></div>
              <div className="stg-row"><div><div className="stg-key">Dispatch Cut-off Time</div><div className="stg-desc">Orders after this go next day</div></div><input type="time" defaultValue="15:00" className="stg-input" /></div>
              <div className="stg-row"><div><div className="stg-key">Max Delivery Attempts</div></div><input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} /></div>
              <div className="stg-row"><div><div className="stg-key">Re-attempt After (hours)</div></div><input type="number" defaultValue={2} className="stg-input" style={{ width: 60 }} /></div>
              <div className="stg-row"><div><div className="stg-key">High Value COD Threshold (₨)</div><div className="stg-desc">Flag for manager approval before dispatch</div></div><input type="number" defaultValue={8000} className="stg-input" /></div>
              <div className="stg-row"><div><div className="stg-key">Notify Manager on Assignment</div></div><ToggleSwitch defaultChecked /></div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Dispatch Settings</button>
        </>
      )}

      {innerTab === 'notif' && (
        <>
          <div className="settings-section" style={{ marginBottom: 12 }}>
            <div className="settings-section-head"><i className="fa-solid fa-bell" /> Notification Preferences</div>
            <div className="settings-section-body">
              {[
                'Notify Rider on Assignment', 'Notify Manager on Delay',
                'Notify Accounts on COD Collection', 'Daily Summary to Manager',
              ].map(k => <div key={k} className="stg-row"><div><div className="stg-key">{k}</div></div><ToggleSwitch defaultChecked /></div>)}
              <div className="stg-row"><div><div className="stg-key">Delay Alert After (min)</div><div className="stg-desc">Alert when delivery exceeds ETA by N mins</div></div><input type="number" defaultValue={20} className="stg-input" style={{ width: 60 }} /></div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Notification Settings</button>
        </>
      )}

      {innerTab === 'pay' && (
        <>
          <div className="settings-section" style={{ marginBottom: 12 }}>
            <div className="settings-section-head"><i className="fa-solid fa-coins" /> Pay Rules</div>
            <div className="settings-section-body">
              <div className="stg-row"><div><div className="stg-key">Default Pay Type</div></div><select className="stg-select"><option>Per Delivery</option><option>Monthly Fixed</option><option>Hybrid</option></select></div>
              <div className="stg-row"><div><div className="stg-key">Default Per-Delivery Rate (₨)</div></div><input type="number" defaultValue={80} className="stg-input" style={{ width: 80 }} /></div>
              <div className="stg-row"><div><div className="stg-key">Performance Bonus Threshold</div><div className="stg-desc">Deliveries above this earn bonus</div></div><input type="number" defaultValue={15} className="stg-input" style={{ width: 60 }} /></div>
              <div className="stg-row"><div><div className="stg-key">Bonus Per Extra Delivery (₨)</div></div><input type="number" defaultValue={20} className="stg-input" style={{ width: 60 }} /></div>
              <div className="stg-row"><div><div className="stg-key">Fuel Allowance (₨/day)</div></div><input type="number" defaultValue={200} className="stg-input" style={{ width: 80 }} /></div>
              <div className="stg-row"><div><div className="stg-key">Deduct for Failed Deliveries</div><div className="stg-desc">Reduce pay for rider-caused failures</div></div><ToggleSwitch /></div>
              <div className="stg-row"><div><div className="stg-key">Pay Cycle</div></div><select className="stg-select"><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option></select></div>
            </div>
          </div>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Pay Rules</button>
        </>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// PANEL: DELIVERY ZONES
// ═══════════════════════════════════════════════════════════

const ZonesPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('list');
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Delivery Zones</div>
      <div className="panel-desc">Define geographic delivery zones, map areas to primary riders, and set delivery time targets per zone.</div>
      <InnerTabs
        tabs={[{ id: 'list', label: 'Zone List' }, { id: 'add', label: 'Add Zone' }, { id: 'areas', label: 'Area Mapping' }]}
        active={innerTab} onChange={setInnerTab}
      />

      {innerTab === 'list' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left"><div className="c-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search zone..." /></div></div>
            <div className="c-toolbar-right"><button className="c-btn primary" onClick={() => setInnerTab('add')}><i className="fa-solid fa-plus" /> Add Zone</button></div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Zone Name</th><th>Areas / Neighbourhoods</th><th>Primary Rider</th><th>Backup Rider</th><th>Avg. Delivery Time</th><th>Active Orders</th><th>Active</th><th>Actions</th></tr></thead>
              <tbody>
                {ZONES_DATA.map(z => (
                  <tr key={z.name}>
                    <td><strong>{z.name}</strong></td>
                    <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>{z.areas}</td>
                    <td>{z.primary}</td>
                    <td>{z.backup}</td>
                    <td>{z.time}</td>
                    <td><span className="badge orange">{z.active}</span></td>
                    <td><ToggleSwitch defaultChecked /></td>
                    <td><button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-pen" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {innerTab === 'add' && (
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-map-pin" /> Add Delivery Zone</div></div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group"><div className="c-form-label">Zone Name *</div><input className="c-form-input" placeholder="e.g. DHA / Cantt" /></div>
              <div className="c-form-group"><div className="c-form-label">Zone Code</div><input className="c-form-input" placeholder="DHA" /></div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group"><div className="c-form-label">Primary Rider</div>
                <select className="c-form-select">{activeRiders.map(r => <option key={r.id}>{r.name}</option>)}</select>
              </div>
              <div className="c-form-group"><div className="c-form-label">Backup Rider</div>
                <select className="c-form-select"><option>None</option>{activeRiders.map(r => <option key={r.id}>{r.name}</option>)}</select>
              </div>
            </div>
            <div className="c-form-row triple">
              <div className="c-form-group"><div className="c-form-label">Min Delivery Time (min)</div><input className="c-form-input" type="number" defaultValue={20} /></div>
              <div className="c-form-group"><div className="c-form-label">Max Delivery Time (min)</div><input className="c-form-input" type="number" defaultValue={60} /></div>
              <div className="c-form-group"><div className="c-form-label">Delivery Charge (₨)</div><input className="c-form-input" type="number" defaultValue={0} /></div>
            </div>
            <div className="c-form-row single">
              <div className="c-form-group"><div className="c-form-label">Areas / Neighbourhoods</div><textarea className="c-form-textarea" placeholder="e.g. DHA Phase 1, DHA Phase 2, Cantonment, Walton..." /></div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Zone</button>
              <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {innerTab === 'areas' && (
        <div className="card"><div className="card-body"><EmptyState icon="fa-map" title="Area Mapping" desc="Map specific areas and postal codes to their delivery zones." /></div></div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

interface OverlayState { open: boolean; title: string; content: React.ReactNode; }

const RidersPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<NavPanel>('overview');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActivePanel, activePanel);
  const [overlay, setOverlay] = useState<OverlayState>({ open: false, title: '', content: null });

  const openRiderOverlay = useCallback((r: Rider) => {
    const balance = r.earned + r.bonus - r.paid;
    setOverlay({
      open: true,
      title: r.name,
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <RiderAvatar rider={r} size={44} fontSize={14} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{r.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.zone} · {r.vehicle} · {r.plate}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <Badge label={r.status} />
              <Badge label={r.availability} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { val: r.deliveries, lbl: 'MTD Deliveries', color: 'var(--text-primary)' },
              { val: `${r.completion}%`, lbl: 'Completion', color: rColor(r.completion) },
              { val: r.rating > 0 ? r.rating : '—', lbl: 'Rating ★', color: 'var(--yellow)' },
            ].map(s => (
              <div key={s.lbl} style={{ background: 'var(--bg)', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {[
            ['Phone', r.phone],
            ['CNIC', r.cnic],
            ['Vehicle', `${r.vehicle} · ${r.plate}`],
            ['Zone', r.zone],
            ['Shift', r.shift],
            ['Avg. Delivery Time', r.avgTime > 0 ? `${r.avgTime} min` : '—'],
            ['On-Time Rate', r.onTime > 0 ? `${r.onTime}%` : '—'],
            ['Pay Type', r.pay],
            ['MTD Earnings', <span style={{ color: 'var(--green)', fontWeight: 700 }}>{fmt(r.earned + r.bonus)}</span>],
            ['Balance Due', <span style={{ color: balance > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{fmt(balance)}</span>],
            ['Join Date', r.join],
          ].map(([k, v], i) => (
            <div className="detail-row" key={i}>
              <div className="detail-key">{k}</div>
              <div className="detail-val">{v}</div>
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className="c-btn primary" style={{ fontSize: 10 }}><i className="fa-solid fa-pen" /> Edit</button>
            <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-clipboard-list" /> View Tasks</button>
            <button className="c-btn" style={{ fontSize: 10 }}><i className="fa-solid fa-coins" /> Pay Now</button>
            <button className="c-btn" style={{ fontSize: 10, color: r.status === 'Active' ? 'var(--red)' : 'var(--green)' }}>
              <i className={`fa-solid fa-${r.status === 'Active' ? 'pause' : 'play'}`} /> {r.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      ),
    });
  }, []);

  const closeOverlay = () => setOverlay(v => ({ ...v, open: false }));

  type NavEntry = { panel: NavPanel; icon: string; label: string; badge?: number | string; badgeGray?: boolean };
  type NavSection = { heading: string; items: NavEntry[] };

  const navSections: NavSection[] = [
    { heading: 'Overview',      items: [{ panel: 'overview', icon: 'fa-gauge', label: 'Overview' }] },
    { heading: 'Riders',        items: [
      { panel: 'all',          icon: 'fa-person-biking', label: 'All Riders'    },
      { panel: 'add',          icon: 'fa-user-plus',     label: 'Add Rider'     },
      { panel: 'availability', icon: 'fa-calendar-check',label: 'Availability'  },
    ]},
    { heading: 'Deliveries',    items: [
      { panel: 'active',      icon: 'fa-map-location-dot', label: 'Active Deliveries', badge: 8           },
      { panel: 'assign',      icon: 'fa-clipboard-list',   label: 'Assign Tasks',      badge: 5           },
      { panel: 'completed',   icon: 'fa-circle-check',     label: 'Completed',         badge: 34, badgeGray: true },
      { panel: 'failed-del',  icon: 'fa-circle-xmark',     label: 'Failed / RTO',      badge: 3           },
    ]},
    { heading: 'Tracking',      items: [
      { panel: 'livemap', icon: 'fa-location-dot', label: 'Live Map'      },
      { panel: 'routes',  icon: 'fa-route',        label: 'Route History' },
    ]},
    { heading: 'Analytics',     items: [
      { panel: 'performance', icon: 'fa-chart-bar',         label: 'Performance'    },
      { panel: 'earnings',    icon: 'fa-coins',             label: 'Earnings & Pay' },
      { panel: 'reports',     icon: 'fa-file-chart-column', label: 'Reports'        },
    ]},
    { heading: 'Integrations',  items: [{ panel: 'integrations', icon: 'fa-plug', label: 'App Integrations' }] },
    { heading: 'Configuration', items: [
      { panel: 'settings', icon: 'fa-gear', label: 'Settings'        },
      { panel: 'zones',    icon: 'fa-map',  label: 'Delivery Zones' },
    ]},
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':      return <OverviewPanel onNav={setActivePanel} onOpenRider={openRiderOverlay} />;
      case 'all':           return <AllRidersPanel onNav={setActivePanel} onOpenRider={openRiderOverlay} />;
      case 'add':           return <AddRiderPanel onNav={setActivePanel} />;
      case 'availability':  return <AvailabilityPanel />;
      case 'active':        return <ActiveDeliveriesPanel />;
      case 'assign':        return <AssignTasksPanel />;
      case 'completed':     return <CompletedPanel />;
      case 'failed-del':    return <FailedDeliveriesPanel />;
      case 'livemap':       return <LiveMapPanel />;
      case 'routes':        return <RouteHistoryPanel />;
      case 'performance':   return <PerformancePanel onOpenRider={openRiderOverlay} />;
      case 'earnings':      return <EarningsPanel />;
      case 'reports':       return <ReportsPanel />;
      case 'integrations':  return <IntegrationsPanel />;
      case 'settings':      return <SettingsPanel />;
      case 'zones':         return <ZonesPanel />;
      default:              return null;
    }
  };

  return (
    <div id="page-riders">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      <div className="page-hero">
        <div className="page-hero-title">Rider Management</div>
        <div className="page-hero-sub">Manage internal delivery riders, assign deliveries, track live status, and monitor performance metrics.</div>
      </div>

      <div className="rider-layout">
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
        <div className="rider-content">
          {renderPanel()}
        </div>
      </div>

      {/* Overlay */}
      <div className={`rider-backdrop ${overlay.open ? 'open' : ''}`} onClick={closeOverlay} />
      <div className={`rider-overlay ${overlay.open ? 'open' : ''}`}>
        <div className="overlay-header">
          <div className="overlay-title">{overlay.title}</div>
          <button className="close-btn" onClick={closeOverlay}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="overlay-body">{overlay.content}</div>
      </div>
    </div>
  );
};

export default RidersPage;