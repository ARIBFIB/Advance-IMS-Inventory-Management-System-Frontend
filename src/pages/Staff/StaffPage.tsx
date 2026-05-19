// ═══════════════════════════════════════════════════════════
// StaffPage.tsx — Main page shell (tabs only, no logic here)
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import './StaffPage.css';

import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';
import { StaffTab } from './staff.types';

import StaffMembersTab  from './StaffMembersTab';
import RolesTab         from './RolesTab';
import PerformanceTab   from './PerformanceTab';
import ActivityTab      from './ActivityTab';
import IntegrationsTab  from './IntegrationsTab';

const TABS: { id: StaffTab; icon: string; label: string }[] = [
  { id: 'members',      icon: 'fa-users-gear',        label: 'Staff Members'  },
  { id: 'roles',        icon: 'fa-shield-halved',     label: 'Roles & Access' },
  { id: 'performance',  icon: 'fa-chart-simple',      label: 'Performance'    },
  { id: 'activity',     icon: 'fa-clock-rotate-left', label: 'Activity Log'   },
  { id: 'integrations', icon: 'fa-plug',              label: 'Integrations'   },
];

const StaffPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StaffTab>('members');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

  return (
    <div id="page-staff">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      <div className="section-heading">Staff &amp; Roles</div>
      <div className="section-subheading">
        Manage your team members, define role-based permissions, track performance metrics,
        and monitor staff activity across all operations.
      </div>

      {/* ── Tab Bar ─────────────────────────────────────── */}
      <div className="h-tabs">
        {TABS.map(t => (
          <div
            key={t.id}
            className={`h-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => switchTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </div>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────── */}
      {activeTab === 'members'      && <StaffMembersTab />}
      {activeTab === 'roles'        && <RolesTab />}
      {activeTab === 'performance'  && <PerformanceTab />}
      {activeTab === 'activity'     && <ActivityTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
    </div>
  );
};

export default StaffPage;


// import React, { useState, useEffect, useCallback } from 'react';
// import './StaffPage.css';
// import TopLoadingBar from '../../components/ui/TopLoadingBar';
// import { useTabLoading } from '../../hooks/useTabLoading';

// // ═══════════════════════════════════════════════════════════
// // TYPES
// // ═══════════════════════════════════════════════════════════

// type StaffTab = 'members' | 'roles' | 'performance' | 'activity' | 'integrations';
// type StaffStatus = 'Active' | 'Offline' | 'Suspended';
// type StaffFilter = 'all' | 'active' | 'offline' | 'suspended';
// type AccessLevel = 'Full' | 'High' | 'Medium' | 'Limited' | 'Minimal';
// type Severity = 'Info' | 'Warning' | 'Critical';
// type PerfPeriod = 'month' | 'week' | 'all';
// type StaffPanelTab = 'profile' | 'permissions' | 'tasks' | 'activity';

// interface StaffMember {
//   id: number;
//   name: string;
//   role: string;
//   dept: string;
//   email: string;
//   phone: string;
//   tasks: number;
//   completed: number;
//   orders: number;
//   errors: number;
//   score: number;
//   status: StaffStatus;
//   joined: string;
//   lastActive: string;
//   avatar: string;
//   color: string;
// }

// interface Role {
//   name: string;
//   members: number;
//   level: AccessLevel;
//   color: string;
//   desc: string;
// }

// interface ActivityEntry {
//   time: string;
//   staff: string;
//   action: string;
//   module: string;
//   detail: string;
//   severity: Severity;
// }

// interface MatrixModule {
//   mod: string;
//   perms: boolean[];
// }

// // ═══════════════════════════════════════════════════════════
// // STATIC DATA
// // ═══════════════════════════════════════════════════════════

// const STAFF_DATA: StaffMember[] = [
//   { id:1,  name:'Admin Khan',     role:'Administrator',      dept:'Management', email:'admin@inventoryos.pk',  phone:'0321-1112233', tasks:52, completed:51, orders:0,   errors:0,  score:98, status:'Active',    joined:'01 Jan 2026', lastActive:'Just now',   avatar:'AK', color:'#FF6A00' },
//   { id:2,  name:'Sara Khan',      role:'Ops Manager',        dept:'Operations', email:'sara@inventoryos.pk',   phone:'0300-2223344', tasks:44, completed:43, orders:124, errors:2,  score:97, status:'Active',    joined:'05 Jan 2026', lastActive:'2 min ago',  avatar:'SK', color:'#8B5CF6' },
//   { id:3,  name:'Bilal Raza',     role:'Inventory Manager',  dept:'Inventory',  email:'bilal@inventoryos.pk',  phone:'0311-3334455', tasks:38, completed:35, orders:0,   errors:3,  score:92, status:'Active',    joined:'10 Jan 2026', lastActive:'15 min ago', avatar:'BR', color:'#2563EB' },
//   { id:4,  name:'Amna Siddiqui', role:'Sales Operator',     dept:'Sales',      email:'amna@inventoryos.pk',   phone:'0333-4445566', tasks:61, completed:54, orders:310, errors:8,  score:88, status:'Active',    joined:'12 Jan 2026', lastActive:'1 hr ago',   avatar:'AS', color:'#EC4899' },
//   { id:5,  name:'Tariq Mehmood', role:'Sales Operator',     dept:'Sales',      email:'tariq@inventoryos.pk',  phone:'0345-5556677', tasks:58, completed:49, orders:278, errors:11, score:84, status:'Active',    joined:'15 Jan 2026', lastActive:'3 hrs ago',  avatar:'TM', color:'#0891B2' },
//   { id:6,  name:'Fatima Noor',   role:'Accounts',           dept:'Finance',    email:'fatima@inventoryos.pk', phone:'0312-6667788', tasks:29, completed:27, orders:0,   errors:1,  score:93, status:'Active',    joined:'20 Jan 2026', lastActive:'30 min ago', avatar:'FN', color:'#059669' },
//   { id:7,  name:'Hassan Ali',    role:'Courier Handler',    dept:'Logistics',  email:'hassan@inventoryos.pk', phone:'0321-7778899', tasks:33, completed:28, orders:89,  errors:4,  score:85, status:'Active',    joined:'25 Jan 2026', lastActive:'Yesterday',  avatar:'HA', color:'#7C3AED' },
//   { id:8,  name:'Zara Hussain',  role:'Sales Operator',     dept:'Sales',      email:'zara@inventoryos.pk',   phone:'0300-8889900', tasks:47, completed:40, orders:198, errors:7,  score:85, status:'Active',    joined:'01 Feb 2026', lastActive:'4 hrs ago',  avatar:'ZH', color:'#DB2777' },
//   { id:9,  name:'Omar Farooq',   role:'Rider',              dept:'Logistics',  email:'omar@inventoryos.pk',   phone:'0311-9990011', tasks:22, completed:22, orders:112, errors:2,  score:100,status:'Active',    joined:'05 Feb 2026', lastActive:'10 min ago', avatar:'OF', color:'#16A34A' },
//   { id:10, name:'Sana Bukhari',  role:'Inventory Manager',  dept:'Inventory',  email:'sana@inventoryos.pk',   phone:'0333-0001122', tasks:31, completed:26, orders:0,   errors:5,  score:84, status:'Offline',   joined:'10 Feb 2026', lastActive:'2 days ago', avatar:'SB', color:'#0284C7' },
//   { id:11, name:'Imran Qureshi', role:'Rider',              dept:'Logistics',  email:'imran@inventoryos.pk',  phone:'0345-1112233', tasks:19, completed:17, orders:94,  errors:3,  score:89, status:'Active',    joined:'15 Feb 2026', lastActive:'5 min ago',  avatar:'IQ', color:'#DC2626' },
//   { id:12, name:'Nadia Malik',   role:'Sales Operator',     dept:'Sales',      email:'nadia@inventoryos.pk',  phone:'0312-2223344', tasks:40, completed:30, orders:156, errors:12, score:75, status:'Offline',   joined:'20 Feb 2026', lastActive:'3 days ago', avatar:'NM', color:'#9333EA' },
//   { id:13, name:'Usman Ghani',   role:'Accounts',           dept:'Finance',    email:'usman@inventoryos.pk',  phone:'0321-3334455', tasks:25, completed:20, orders:0,   errors:4,  score:80, status:'Offline',   joined:'01 Mar 2026', lastActive:'1 day ago',  avatar:'UG', color:'#0369A1' },
//   { id:14, name:'Rabia Tanvir',  role:'Sales Operator',     dept:'Sales',      email:'rabia@inventoryos.pk',  phone:'0300-4445566', tasks:35, completed:24, orders:143, errors:9,  score:68, status:'Suspended', joined:'15 Mar 2026', lastActive:'1 week ago', avatar:'RT', color:'#6B7280' },
// ];

// const ROLES_DATA: Role[] = [
//   { name:'Administrator',    members:1, level:'Full',    color:'#FF6A00', desc:'Complete system access and configuration.' },
//   { name:'Ops Manager',      members:1, level:'High',    color:'#8B5CF6', desc:'Oversight of operations, reports, and staff.' },
//   { name:'Inventory Manager',members:2, level:'Medium',  color:'#2563EB', desc:'Product and stock management.' },
//   { name:'Sales Operator',   members:5, level:'Limited', color:'#EC4899', desc:'Order entry and customer management.' },
//   { name:'Accounts',         members:2, level:'Limited', color:'#059669', desc:'Financial tracking and supplier payments.' },
//   { name:'Courier Handler',  members:1, level:'Limited', color:'#7C3AED', desc:'Courier assignment and shipment tracking.' },
//   { name:'Rider',            members:2, level:'Minimal', color:'#16A34A', desc:'View and update own delivery assignments.' },
// ];

// const MATRIX_MODULES: MatrixModule[] = [
//   { mod:'Dashboard',  perms:[true, true, true, true, true, true, false] },
//   { mod:'Products',   perms:[true, true, true, false,false,false,false] },
//   { mod:'Orders',     perms:[true, true, false,true, true, true, true]  },
//   { mod:'Inventory',  perms:[true, true, true, false,false,false,false] },
//   { mod:'Customers',  perms:[true, true, false,true, false,false,false] },
//   { mod:'Couriers',   perms:[true, true, false,false,false,true, false] },
//   { mod:'Riders',     perms:[true, true, false,false,false,false,true]  },
//   { mod:'Finance',    perms:[true, false,false,false,true, false,false] },
//   { mod:'Tasks',      perms:[true, true, true, true, true, true, true]  },
//   { mod:'Staff',      perms:[true, true, false,false,false,false,false] },
//   { mod:'Reports',    perms:[true, true, false,false,true, false,false] },
//   { mod:'Settings',   perms:[true, false,false,false,false,false,false] },
// ];

// const MODULE_PERMS: Record<string, Record<string, boolean>> = {
//   'Administrator':    { Dashboard:true, Products:true, Orders:true, Inventory:true, Customers:true, Couriers:true, Riders:true, Finance:true, Tasks:true, Staff:true, Reports:true, Settings:true },
//   'Ops Manager':      { Dashboard:true, Products:true, Orders:true, Inventory:true, Customers:true, Couriers:true, Riders:true, Finance:false,Tasks:true, Staff:true, Reports:true, Settings:false },
//   'Inventory Manager':{ Dashboard:true, Products:true, Orders:false,Inventory:true, Customers:false,Couriers:false,Riders:false,Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
//   'Sales Operator':   { Dashboard:true, Products:false,Orders:true, Inventory:false,Customers:true, Couriers:false,Riders:false,Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
//   'Accounts':         { Dashboard:true, Products:false,Orders:true, Inventory:false,Customers:false,Couriers:false,Riders:false,Finance:true, Tasks:true, Staff:false,Reports:true, Settings:false },
//   'Courier Handler':  { Dashboard:true, Products:false,Orders:true, Inventory:false,Customers:false,Couriers:true, Riders:false,Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
//   'Rider':            { Dashboard:false,Products:false,Orders:true, Inventory:false,Customers:false,Couriers:false,Riders:true, Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
// };

// const ACTIVITY_LOG: ActivityEntry[] = [
//   { time:'11 May 09:12', staff:'Admin Khan',    action:'Logged in to system',                    module:'System',    detail:'IP: 192.168.1.1',              severity:'Info'     },
//   { time:'11 May 09:45', staff:'Sara Khan',     action:'Updated order ORD-1052 to Packed',       module:'Orders',    detail:'Order ID: ORD-1052',            severity:'Info'     },
//   { time:'11 May 10:03', staff:'Bilal Raza',    action:'Added 30 units for SKU-0041',            module:'Inventory', detail:'Stock: 3 → 33',                 severity:'Info'     },
//   { time:'11 May 10:20', staff:'Amna Siddiqui', action:'Created new customer profile',           module:'Customers', detail:'Customer: Aisha Bhatti',        severity:'Info'     },
//   { time:'11 May 10:44', staff:'Fatima Noor',   action:'Recorded COD collection',                module:'Finance',   detail:'Amount: ₨5,400',               severity:'Info'     },
//   { time:'11 May 11:00', staff:'Sara Khan',     action:'Exported sales report',                  module:'Reports',   detail:'Format: CSV',                   severity:'Info'     },
//   { time:'11 May 11:15', staff:'Hassan Ali',    action:'Assigned courier to ORD-1048',           module:'Couriers',  detail:'Courier: TCS Express',          severity:'Info'     },
//   { time:'11 May 11:30', staff:'Admin Khan',    action:'Changed role for Rabia Tanvir',          module:'Staff',     detail:'Old: Sales Op → New: Suspended',severity:'Warning'  },
//   { time:'11 May 12:00', staff:'Omar Farooq',   action:'Marked delivery as Delivered',           module:'Riders',    detail:'Order: ORD-1044',               severity:'Info'     },
//   { time:'11 May 12:15', staff:'Tariq Mehmood', action:'Failed login attempt',                   module:'System',    detail:'IP: 203.55.11.4',               severity:'Critical' },
//   { time:'11 May 12:30', staff:'Nadia Malik',   action:'Cancelled order ORD-1046',              module:'Orders',    detail:'Reason: Customer request',       severity:'Warning'  },
//   { time:'11 May 13:00', staff:'Admin Khan',    action:'Modified product pricing for SKU-0183', module:'Products',  detail:'Price: ₨7,200 → ₨7,500',       severity:'Info'     },
//   { time:'11 May 13:20', staff:'Usman Ghani',   action:'Logged expense entry',                   module:'Finance',   detail:'Category: Operations, ₨2,200', severity:'Info'     },
//   { time:'11 May 14:00', staff:'Sara Khan',     action:'Created 5 new orders (batch)',           module:'Orders',    detail:'ORD-1053 to ORD-1057',          severity:'Info'     },
//   { time:'11 May 14:30', staff:'Bilal Raza',    action:'Triggered low-stock alert override',     module:'Inventory', detail:'SKU-0028 threshold changed',     severity:'Warning'  },
//   { time:'11 May 15:00', staff:'Admin Khan',    action:'Settings updated: Email notifications ON',module:'Settings', detail:'Changed by Admin Khan',          severity:'Info'     },
//   { time:'11 May 15:20', staff:'Imran Qureshi', action:'Updated delivery status to In Transit',  module:'Riders',    detail:'Order: ORD-1050',               severity:'Info'     },
//   { time:'11 May 15:45', staff:'Fatima Noor',   action:'Supplier payment recorded',              module:'Finance',   detail:'Supplier: Gul Ahmed, ₨45,000', severity:'Info'     },
//   { time:'11 May 16:00', staff:'Zara Hussain',  action:'Edited customer address',                module:'Customers', detail:'Customer: Sara Bano',           severity:'Info'     },
//   { time:'11 May 16:30', staff:'Admin Khan',    action:'Database backup triggered manually',     module:'Security',  detail:'Backup size: 4.2MB',            severity:'Info'     },
// ];

// const DEPT_PERFORMANCE = [
//   { dept:'Operations', score:94 },
//   { dept:'Sales',      score:80 },
//   { dept:'Inventory',  score:88 },
//   { dept:'Finance',    score:86 },
//   { dept:'Logistics',  score:91 },
//   { dept:'Management', score:98 },
// ];

// const STAFF_PER_PAGE = 14;

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// const scoreColor = (s: number) =>
//   s >= 90 ? '#16A34A' : s >= 75 ? '#D97706' : '#DC2626';

// const scoreFill = (s: number) =>
//   s >= 90 ? 'green' : s >= 75 ? 'yellow' : 'red';

// const completionPct = (s: StaffMember) =>
//   Math.round((s.completed / s.tasks) * 100);

// const statusDotClass: Record<StaffStatus, string> = {
//   Active:    'online',
//   Offline:   'offline',
//   Suspended: 'suspended',
// };

// const statusBadgeClass: Record<StaffStatus, string> = {
//   Active:    'green',
//   Offline:   'gray',
//   Suspended: 'orange',
// };

// const severityBadgeClass: Record<Severity, string> = {
//   Info:     'blue',
//   Warning:  'orange',
//   Critical: 'red',
// };

// const levelBadgeClass: Record<AccessLevel, string> = {
//   Full:    'orange',
//   High:    'blue',
//   Medium:  'blue',
//   Limited: 'gray',
//   Minimal: 'gray',
// };

// // ═══════════════════════════════════════════════════════════
// // SUB-COMPONENTS
// // ═══════════════════════════════════════════════════════════

// /* ── Three-Dot Menu ── */
// interface ThreeDotItem {
//   label: string;
//   icon: string;
//   danger?: boolean;
//   onClick: () => void;
// }
// const ThreeDot: React.FC<{ id: string; items: ThreeDotItem[] }> = ({ id, items }) => {
//   const [open, setOpen] = useState(false);
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       const el = document.getElementById(id);
//       if (el && !el.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener('click', handler);
//     return () => document.removeEventListener('click', handler);
//   }, [id]);
//   return (
//     <div id={id} className="three-dot" style={{ position: 'relative', display: 'inline-block' }}>
//       <button className="three-dot-btn" onClick={e => { e.stopPropagation(); setOpen(v => !v); }}>
//         <i className="fa-solid fa-ellipsis" />
//       </button>
//       {open && (
//         <div className="three-dot-menu" style={{ display: 'block' }}>
//           {items.map((item, idx) =>
//             item.label === '---'
//               ? <div key={idx} className="three-dot-menu-divider" />
//               : (
//                 <div
//                   key={item.label}
//                   className={`three-dot-menu-item ${item.danger ? 'danger' : ''}`}
//                   onClick={() => { item.onClick(); setOpen(false); }}
//                 >
//                   <i className={`fa-solid ${item.icon}`} /> {item.label}
//                 </div>
//               )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ── Progress Bar ── */
// const ProgBar: React.FC<{ pct: number; fill: string; width?: number }> = ({ pct, fill, width = 64 }) => (
//   <div className="prog-bar" style={{ width }}>
//     <div className={`prog-fill ${fill}`} style={{ width: `${pct}%` }} />
//   </div>
// );

// /* ── Status Badge ── */
// const StatusBadge: React.FC<{ status: StaffStatus }> = ({ status }) => (
//   <span className={`badge ${statusBadgeClass[status]}`}>
//     <span className={`online-dot ${statusDotClass[status]}`} />
//     {status}
//   </span>
// );

// /* ── Toggle Switch ── */
// const Toggle: React.FC<{ checked: boolean; onChange?: (v: boolean) => void }> = ({ checked, onChange }) => {
//   const [val, setVal] = useState(checked);
//   return (
//     <label className="toggle-switch" onClick={e => e.stopPropagation()}>
//       <input
//         type="checkbox"
//         checked={val}
//         onChange={e => { setVal(e.target.checked); onChange?.(e.target.checked); }}
//       />
//       <span className="toggle-slider" />
//     </label>
//   );
// };

// /* ── Permissions Panel ── */
// const PermissionsPanel: React.FC<{ role: string }> = ({ role }) => {
//   const perms = MODULE_PERMS[role] ?? MODULE_PERMS['Rider'];
//   return (
//     <>
//       {Object.entries(perms).map(([mod, has]) => (
//         <div className="perm-row" key={mod}>
//           <div className="perm-label">
//             {mod}
//             <small>{has ? 'Full access' : 'No access'}</small>
//           </div>
//           <Toggle checked={has} />
//         </div>
//       ))}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // STAFF DETAIL SIDE PANEL
// // ═══════════════════════════════════════════════════════════

// interface StaffPanelProps {
//   staff: StaffMember | null;
//   mode: 'view' | 'edit' | 'add';
//   onClose: () => void;
//   onEdit: (s: StaffMember) => void;
// }

// const PANEL_TASKS = [
//   { title: 'Review low-stock items',     due: 'Today',   status: 'In Progress', priority: 'High'   },
//   { title: 'Process pending returns',    due: 'Today',   status: 'Done',        priority: 'Normal' },
//   { title: 'Update supplier payments',   due: '11 May',  status: 'Pending',     priority: 'High'   },
//   { title: 'Prepare daily sales report', due: '11 May',  status: 'Done',        priority: 'Normal' },
//   { title: 'Follow up on overdue COD',   due: '12 May',  status: 'Pending',     priority: 'High'   },
// ];

// const PANEL_ACTIVITY = [
//   { action: 'Logged in',                     module: 'System',    time: 'Today 09:12'    },
//   { action: 'Updated order status to Packed', module: 'Orders',    time: 'Today 09:45'    },
//   { action: 'Added stock for SKU-0041',       module: 'Inventory', time: 'Today 10:20'    },
//   { action: 'Marked task as complete',        module: 'Tasks',     time: 'Today 11:00'    },
//   { action: 'Exported sales report',          module: 'Reports',   time: 'Yesterday 16:30' },
// ];

// const taskStatusIcon: Record<string, string> = {
//   Done:        'fa-check',
//   'In Progress':'fa-spinner',
//   Pending:     'fa-clock',
// };
// const taskStatusColor: Record<string, string> = {
//   Done:        'var(--green)',
//   'In Progress':'var(--blue)',
//   Pending:     'var(--yellow)',
// };
// const taskStatusBg: Record<string, string> = {
//   Done:        'var(--green-bg)',
//   'In Progress':'var(--blue-bg)',
//   Pending:     'var(--yellow-bg)',
// };

// const StaffPanel: React.FC<StaffPanelProps> = ({ staff, mode, onClose, onEdit }) => {
//   const [activeTab, setActiveTab] = useState<StaffPanelTab>('profile');

//   useEffect(() => { setActiveTab('profile'); }, [staff, mode]);

//   const isAdd = mode === 'add';
//   const isEdit = mode === 'edit';

//   const title = isAdd
//     ? 'Add New Staff Member'
//     : isEdit
//     ? 'Edit Staff Member'
//     : staff?.name ?? '';

//   const renderForm = (s: StaffMember | null) => (
//     <div className="staff-panel-form">
//       <div className="form-row">
//         <div className="form-group">
//           <div className="form-label">First Name *</div>
//           <input className="form-input" defaultValue={s ? s.name.split(' ')[0] : ''} placeholder="First name" />
//         </div>
//         <div className="form-group">
//           <div className="form-label">Last Name *</div>
//           <input className="form-input" defaultValue={s ? s.name.split(' ').slice(1).join(' ') : ''} placeholder="Last name" />
//         </div>
//       </div>
//       <div className="form-group" style={{ marginBottom: 10 }}>
//         <div className="form-label">Email Address *</div>
//         <input className="form-input" type="email" defaultValue={s?.email ?? ''} placeholder="email@company.pk" style={{ width: '100%' }} />
//       </div>
//       <div className="form-group" style={{ marginBottom: 10 }}>
//         <div className="form-label">Phone Number</div>
//         <input className="form-input" defaultValue={s?.phone ?? ''} placeholder="03XX-XXXXXXX" style={{ width: '100%' }} />
//       </div>
//       <div className="form-row">
//         <div className="form-group">
//           <div className="form-label">Role *</div>
//           <select className="form-select" defaultValue={s?.role}>
//             {['Administrator','Ops Manager','Inventory Manager','Sales Operator','Accounts','Courier Handler','Rider'].map(r => (
//               <option key={r}>{r}</option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <div className="form-label">Department</div>
//           <select className="form-select" defaultValue={s?.dept}>
//             {['Management','Operations','Inventory','Sales','Finance','Logistics'].map(d => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//       {isAdd && (
//         <div className="form-row">
//           <div className="form-group">
//             <div className="form-label">Password *</div>
//             <input className="form-input" type="password" placeholder="Min. 8 characters" />
//           </div>
//           <div className="form-group">
//             <div className="form-label">Confirm Password *</div>
//             <input className="form-input" type="password" placeholder="Repeat password" />
//           </div>
//         </div>
//       )}
//       <div className="form-row">
//         <div className="form-group">
//           <div className="form-label">Status</div>
//           <select className="form-select" defaultValue={s?.status ?? 'Active'}>
//             <option>Active</option>
//             <option>Offline</option>
//             <option>Suspended</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <div className="form-label">Joined Date</div>
//           <input className="form-input" type="date" defaultValue={s ? '2026-01-01' : ''} style={{ width: '100%' }} />
//         </div>
//       </div>
//       <hr />
//       <div style={{ display: 'flex', gap: 8 }}>
//         <button className="header-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
//           <i className="fa-solid fa-check" /> {isAdd ? 'Add Staff Member' : 'Save Changes'}
//         </button>
//         <button className="header-btn" onClick={onClose}>Cancel</button>
//       </div>
//     </div>
//   );

//   const renderProfile = (s: StaffMember) => {
//     const pct = completionPct(s);
//     const sc = scoreColor(s.score);
//     const fill = scoreFill(s.score);
//     return (
//       <div id="spt-profile" className="staff-panel-content active">
//         {/* Profile Header */}
//         <div className="panel-profile-header">
//           <div className="panel-avatar" style={{ background: `${s.color}20`, color: s.color }}>{s.avatar}</div>
//           <div className="panel-profile-info">
//             <div className="panel-profile-name">{s.name}</div>
//             <div className="panel-profile-sub">{s.role} · {s.dept}</div>
//             <div className="panel-profile-status">
//               <span className={`online-dot ${statusDotClass[s.status]}`} style={{ width: 7, height: 7 }} />
//               <span>{s.status} · Last seen {s.lastActive}</span>
//             </div>
//           </div>
//           <div className="panel-score-box">
//             <div className="panel-score-val" style={{ color: sc }}>{s.score}%</div>
//             <div className="panel-score-lbl">Score</div>
//           </div>
//         </div>

//         {/* Stats Row */}
//         <div className="panel-stats-row">
//           {[
//             { val: s.tasks,          lbl: 'Tasks MTD' },
//             { val: s.orders || '—',  lbl: 'Orders'    },
//             { val: s.errors,         lbl: 'Errors'     },
//           ].map(item => (
//             <div className="panel-stat" key={item.lbl}>
//               <div className="panel-stat-val">{item.val}</div>
//               <div className="panel-stat-lbl">{item.lbl}</div>
//             </div>
//           ))}
//         </div>

//         {/* Completion */}
//         <div className="panel-completion">
//           <div className="panel-completion-top">
//             <span>Task Completion Rate</span>
//             <span style={{ color: sc, fontWeight: 700 }}>{pct}%</span>
//           </div>
//           <ProgBar pct={pct} fill={fill} width={999} />
//         </div>

//         <div className="detail-row"><div className="detail-key">Email</div><div className="detail-val">{s.email}</div></div>
//         <div className="detail-row"><div className="detail-key">Phone</div><div className="detail-val">{s.phone}</div></div>
//         <div className="detail-row"><div className="detail-key">Role</div><div className="detail-val"><span className="tag">{s.role}</span></div></div>
//         <div className="detail-row"><div className="detail-key">Department</div><div className="detail-val">{s.dept}</div></div>
//         <div className="detail-row"><div className="detail-key">Joined</div><div className="detail-val">{s.joined}</div></div>
//         <div className="detail-row">
//           <div className="detail-key">Staff ID</div>
//           <div className="detail-val">
//             <code className="staff-id-code">STF-{String(s.id).padStart(4, '0')}</code>
//           </div>
//         </div>

//         <hr />
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//           <button className="header-btn primary" onClick={() => onEdit(s)}><i className="fa-solid fa-pen" /> Edit</button>
//           <button className="header-btn"><i className="fa-solid fa-key" /> Reset Password</button>
//           <button className="header-btn"><i className="fa-solid fa-shield-halved" /> Change Role</button>
//           {s.status !== 'Suspended'
//             ? <button className="header-btn" style={{ color:'var(--red)', borderColor:'var(--red)' }}><i className="fa-solid fa-ban" /> Suspend</button>
//             : <button className="header-btn" style={{ color:'var(--green)', borderColor:'var(--green)' }}><i className="fa-solid fa-circle-check" /> Reactivate</button>
//           }
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div id="staff-backdrop" className="open" onClick={onClose} />
//       <div id="staff-detail-panel" className="open">
//         <div className="staff-panel-header">
//           <div className="staff-panel-title">{title}</div>
//           <button className="staff-panel-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
//         </div>
//         <div id="staff-panel-body">
//           {(isAdd || isEdit) && renderForm(staff)}
//           {mode === 'view' && staff && (
//             <>
//               <div className="staff-panel-tabs">
//                 {(['profile','permissions','tasks','activity'] as StaffPanelTab[]).map(t => (
//                   <div
//                     key={t}
//                     className={`staff-panel-tab ${activeTab === t ? 'active' : ''}`}
//                     onClick={() => setActiveTab(t)}
//                   >
//                     {t.charAt(0).toUpperCase() + t.slice(1)}
//                   </div>
//                 ))}
//               </div>

//               {activeTab === 'profile' && renderProfile(staff)}

//               {activeTab === 'permissions' && (
//                 <div className="staff-panel-content active">
//                   <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
//                     Permissions are inherited from the <strong>{staff.role}</strong> role. Individual overrides can be applied below.
//                   </div>
//                   <PermissionsPanel role={staff.role} />
//                 </div>
//               )}

//               {activeTab === 'tasks' && (
//                 <div className="staff-panel-content active">
//                   <div className="panel-section-label">Recent Tasks</div>
//                   {PANEL_TASKS.map((t, i) => (
//                     <div className="list-item" key={i} style={{ padding: '6px 0' }}>
//                       <div className="list-icon" style={{ background: taskStatusBg[t.status] }}>
//                         <i className={`fa-solid ${taskStatusIcon[t.status]}`} style={{ fontSize: 10, color: taskStatusColor[t.status] }} />
//                       </div>
//                       <div className="list-content">
//                         <div className="list-title">{t.title}</div>
//                         <div className="list-meta">
//                           Due: {t.due} · <span style={{ color: t.priority === 'High' ? 'var(--accent)' : 'var(--text-muted)' }}>{t.priority}</span>
//                         </div>
//                       </div>
//                       <div className="list-right">
//                         <span className={`badge ${t.status === 'Done' ? 'green' : t.status === 'In Progress' ? 'blue' : 'yellow'}`}>{t.status}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {activeTab === 'activity' && (
//                 <div className="staff-panel-content active">
//                   <div className="panel-section-label">Recent Activity</div>
//                   {PANEL_ACTIVITY.map((a, i) => (
//                     <div className="list-item" key={i} style={{ padding: '5px 0' }}>
//                       <div className="list-icon"><i className="fa-solid fa-circle-dot ic-orange" style={{ fontSize: 9 }} /></div>
//                       <div className="list-content">
//                         <div className="list-title" style={{ fontSize: 11.5 }}>{a.action}</div>
//                         <div className="list-meta">{a.module} · {a.time}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: STAFF MEMBERS
// // ═══════════════════════════════════════════════════════════

// const StaffMembersTab: React.FC = () => {
//   const [search,   setSearch]   = useState('');
//   const [filter,   setFilter]   = useState<StaffFilter>('all');
//   const [page,     setPage]     = useState(1);
//   const [panelStaff, setPanelStaff] = useState<StaffMember | null>(null);
//   const [panelMode,  setPanelMode]  = useState<'view' | 'edit' | 'add'>('view');

//   const filtered = STAFF_DATA.filter(s => {
//     if (filter === 'active'    && s.status !== 'Active')    return false;
//     if (filter === 'offline'   && s.status !== 'Offline')   return false;
//     if (filter === 'suspended' && s.status !== 'Suspended') return false;
//     if (search) {
//       const q = search.toLowerCase();
//       return s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
//     }
//     return true;
//   });

//   const total      = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(total / STAFF_PER_PAGE));
//   const pageItems  = filtered.slice((page - 1) * STAFF_PER_PAGE, page * STAFF_PER_PAGE);

//   const filterBtns: { key: StaffFilter; label: string; icon?: React.ReactNode }[] = [
//     { key: 'all',       label: 'All' },
//     { key: 'active',    label: 'Active',    icon: <i className="fa-solid fa-circle" style={{ color: '#22C55E', fontSize: 7 }} /> },
//     { key: 'offline',   label: 'Offline',   icon: <i className="fa-solid fa-circle" style={{ color: '#9CA3AF', fontSize: 7 }} /> },
//     { key: 'suspended', label: 'Suspended', icon: <i className="fa-solid fa-ban" /> },
//   ];

//   const openPanel = (s: StaffMember, mode: 'view' | 'edit' = 'view') => {
//     setPanelStaff(s);
//     setPanelMode(mode);
//   };
//   const openAdd = () => { setPanelStaff(null); setPanelMode('add'); };
//   const closePanel = () => setPanelStaff(null);

//   const showPanel = panelStaff !== null || panelMode === 'add';

//   return (
//     <>
//       {/* Stat Cards */}
//       <div className="stats-row" style={{ marginBottom: 14 }}>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Total Staff</div>
//             <div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-id-badge ic-orange" /></div>
//           </div>
//           <div className="stat-value">14</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +2 this month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Active Now</div>
//             <div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-circle-check" style={{ color: '#22C55E' }} /></div>
//           </div>
//           <div className="stat-value">9</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 64.3% online</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Tasks Completed Today</div>
//             <div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-list-check" style={{ color: '#3B82F6' }} /></div>
//           </div>
//           <div className="stat-value">37</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +12 vs yesterday</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Avg. Performance Score</div>
//             <div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-star" style={{ color: '#F59E0B' }} /></div>
//           </div>
//           <div className="stat-value">87%</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +3% this week</div>
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className="card">
//         <div className="table-toolbar">
//           <div className="table-toolbar-left">
//             <div className="table-search">
//               <i className="fa-solid fa-magnifying-glass" />
//               <input
//                 type="text"
//                 placeholder="Search name, role, email..."
//                 value={search}
//                 onChange={e => { setSearch(e.target.value); setPage(1); }}
//               />
//             </div>
//             {filterBtns.map(f => (
//               <button
//                 key={f.key}
//                 className={`t-filter-btn ${filter === f.key ? 'active' : ''}`}
//                 onClick={() => { setFilter(f.key); setPage(1); }}
//               >
//                 {f.icon} {f.label}
//               </button>
//             ))}
//           </div>
//           <div className="table-toolbar-right">
//             <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
//             <button className="header-btn primary" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Staff</button>
//           </div>
//         </div>

//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th style={{ width: 32 }}><input type="checkbox" onChange={e => document.querySelectorAll<HTMLInputElement>('.staff-cb').forEach(c => { c.checked = e.target.checked; })} /></th>
//                 <th>Staff Member</th>
//                 <th>Role</th>
//                 <th>Department</th>
//                 <th>
//                   Performance
//                   <span className="tooltip-wrap">
//                     <span className="tooltip-icon"><i className="fa-solid fa-question" /></span>
//                     <span className="tooltip-box">Average task completion rate this month</span>
//                   </span>
//                 </th>
//                 <th>Tasks (MTD)</th>
//                 <th>Last Active</th>
//                 <th>Joined</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pageItems.map(s => {
//                 const pct = completionPct(s);
//                 const fill = scoreFill(s.score);
//                 return (
//                   <tr key={s.id} onClick={() => openPanel(s, 'view')} style={{ cursor: 'pointer' }}>
//                     <td onClick={e => e.stopPropagation()}><input type="checkbox" className="staff-cb" /></td>
//                     <td>
//                       <div className="td-flex">
//                         <div className="row-avatar" style={{ background: `${s.color}20`, color: s.color, fontSize: 9.5, fontWeight: 700 }}>{s.avatar}</div>
//                         <div>
//                           <div style={{ fontWeight: 600 }}>{s.name}</div>
//                           <div className="td-sub">{s.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className="tag">{s.role}</span></td>
//                     <td><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.dept}</span></td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <ProgBar pct={pct} fill={fill} />
//                         <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
//                       </div>
//                     </td>
//                     <td><strong>{s.completed}</strong><span style={{ color: 'var(--text-muted)', fontSize: 10 }}>/{s.tasks}</span></td>
//                     <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.lastActive}</span></td>
//                     <td><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.joined}</span></td>
//                     <td><StatusBadge status={s.status} /></td>
//                     <td onClick={e => e.stopPropagation()}>
//                       <ThreeDot
//                         id={`staff-dot-${s.id}`}
//                         items={[
//                           { label: 'View Profile',  icon: 'fa-eye',          onClick: () => openPanel(s, 'view') },
//                           { label: 'Edit',          icon: 'fa-pen',          onClick: () => openPanel(s, 'edit') },
//                           { label: 'Reset Password',icon: 'fa-key',          onClick: () => {} },
//                           { label: 'Change Role',   icon: 'fa-shield-halved',onClick: () => {} },
//                           { label: '---',           icon: '',                onClick: () => {} },
//                           ...(s.status === 'Suspended'
//                             ? [{ label: 'Reactivate', icon: 'fa-circle-check', onClick: () => {} }]
//                             : [{ label: 'Suspend', icon: 'fa-ban', danger: true, onClick: () => {} }]
//                           ),
//                           { label: 'Remove', icon: 'fa-trash', danger: true, onClick: () => {} },
//                         ]}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="pagination">
//           <div className="pagination-info">
//             Showing <strong>{filtered.length}</strong> of <strong>{STAFF_DATA.length}</strong> staff
//           </div>
//           <div className="pagination-controls">
//             <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
//               <i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} />
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//               <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
//             ))}
//             <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
//               <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {showPanel && (
//         <StaffPanel
//           staff={panelStaff}
//           mode={panelMode}
//           onClose={closePanel}
//           onEdit={(s) => { setPanelStaff(s); setPanelMode('edit'); }}
//         />
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: ROLES & ACCESS
// // ═══════════════════════════════════════════════════════════

// const RolesTab: React.FC = () => {
//   const [selectedRole, setSelectedRole] = useState<{ name: string; idx: number } | null>(null);
//   const [showRolePanel, setShowRolePanel] = useState(false);
//   const [editRoleName, setEditRoleName] = useState<string | null>(null);

//   const MATRIX_COLS = ['Admin','Ops Manager','Inventory Mgr','Sales Operator','Accounts','Courier Handler','Rider'];

//   return (
//     <>
//       <div className="info-banner">
//         <i className="fa-solid fa-circle-info" />
//         <div className="info-banner-text">
//           Role-based access control (RBAC) restricts system access based on each user's assigned role. Changes to permissions apply immediately to all staff with that role. <strong>Admin role cannot be modified.</strong>
//         </div>
//       </div>

//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         {/* Roles Table */}
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-shield-halved" /> System Roles</div>
//             <div className="card-actions">
//               <button className="header-btn primary" onClick={() => { setEditRoleName(null); setShowRolePanel(true); }}>
//                 <i className="fa-solid fa-plus" /> Add Role
//               </button>
//             </div>
//           </div>
//           <div className="table-wrap">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Role</th>
//                   <th>Members</th>
//                   <th>Access Level</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ROLES_DATA.map((r, i) => (
//                   <tr key={r.name} onClick={() => setSelectedRole({ name: r.name, idx: i })} style={{ cursor: 'pointer' }}>
//                     <td>
//                       <div className="td-flex">
//                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
//                         <div>
//                           <div style={{ fontWeight: 600, fontSize: 12 }}>{r.name}</div>
//                           <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.desc}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td><strong>{r.members}</strong></td>
//                     <td><span className={`badge ${levelBadgeClass[r.level]}`}>{r.level}</span></td>
//                     <td><span className="badge green">Active</span></td>
//                     <td onClick={e => e.stopPropagation()}>
//                       <ThreeDot
//                         id={`role-dot-${i}`}
//                         items={[
//                           { label: 'View Permissions', icon: 'fa-eye',   onClick: () => setSelectedRole({ name: r.name, idx: i }) },
//                           ...(r.name !== 'Administrator'
//                             ? [
//                                 { label: 'Edit Role',   icon: 'fa-pen',   onClick: () => { setEditRoleName(r.name); setShowRolePanel(true); } },
//                                 { label: '---',         icon: '',          onClick: () => {} },
//                                 { label: 'Delete Role', icon: 'fa-trash', danger: true, onClick: () => {} },
//                               ]
//                             : []
//                           ),
//                         ]}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Role Detail */}
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title">
//               <i className="fa-solid fa-sliders" /> {selectedRole ? selectedRole.name : 'Select a role to view permissions'}
//             </div>
//           </div>
//           <div className="card-body">
//             {!selectedRole ? (
//               <div className="empty-state">
//                 <i className="fa-solid fa-hand-pointer" />
//                 <h4>Click a role to view its permissions</h4>
//                 <p>Select any role from the left panel to inspect or modify its access rights.</p>
//               </div>
//             ) : (
//               <>
//                 <div style={{ marginBottom: 12 }}>
//                   <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{ROLES_DATA[selectedRole.idx].desc}</div>
//                   <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
//                     <span className="tag">{ROLES_DATA[selectedRole.idx].members} member{ROLES_DATA[selectedRole.idx].members !== 1 ? 's' : ''}</span>
//                     <span className="tag">Access: {ROLES_DATA[selectedRole.idx].level}</span>
//                   </div>
//                 </div>
//                 <PermissionsPanel role={selectedRole.name} />
//                 <hr />
//                 {selectedRole.name !== 'Administrator'
//                   ? <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Permissions</button>
//                   : <div style={{ fontSize: 11, color: 'var(--text-muted)' }}><i className="fa-solid fa-lock" style={{ marginRight: 4 }} />Admin permissions cannot be modified.</div>
//                 }
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Permissions Matrix */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-table-columns" /> Permissions Matrix</div>
//           <div className="card-actions"><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Overview of all roles vs modules</span></div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Module</th>
//                 {MATRIX_COLS.map(c => <th key={c} style={{ textAlign: 'center' }}>{c}</th>)}
//               </tr>
//             </thead>
//             <tbody>
//               {MATRIX_MODULES.map(m => (
//                 <tr key={m.mod}>
//                   <td><strong style={{ fontSize: 12 }}>{m.mod}</strong></td>
//                   {m.perms.map((p, i) => (
//                     <td key={i} style={{ textAlign: 'center' }}>
//                       {p
//                         ? <i className="fa-solid fa-circle-check" style={{ color: '#22C55E', fontSize: 13 }} />
//                         : <i className="fa-solid fa-circle-xmark" style={{ color: '#E5E7EB', fontSize: 13 }} />
//                       }
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Role Side Panel */}
//       {showRolePanel && (
//         <>
//           <div id="staff-backdrop" className="open" onClick={() => setShowRolePanel(false)} />
//           <div id="staff-detail-panel" className="open">
//             <div className="staff-panel-header">
//               <div className="staff-panel-title">{editRoleName ? `Edit Role: ${editRoleName}` : 'Add New Role'}</div>
//               <button className="staff-panel-close" onClick={() => setShowRolePanel(false)}><i className="fa-solid fa-xmark" /></button>
//             </div>
//             <div id="staff-panel-body">
//               <div className="staff-panel-form">
//                 <div className="form-group" style={{ marginBottom: 10 }}>
//                   <div className="form-label">Role Name *</div>
//                   <input className="form-input" defaultValue={editRoleName ?? ''} placeholder="e.g. Warehouse Staff" style={{ width: '100%' }} />
//                 </div>
//                 <div className="form-group" style={{ marginBottom: 10 }}>
//                   <div className="form-label">Description</div>
//                   <input className="form-input" placeholder="Brief description of this role..." style={{ width: '100%' }} />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <div className="form-label">Access Level</div>
//                     <select className="form-select">
//                       {(['Full','High','Medium','Limited','Minimal'] as AccessLevel[]).map(l => <option key={l}>{l}</option>)}
//                     </select>
//                   </div>
//                   <div className="form-group">
//                     <div className="form-label">Status</div>
//                     <select className="form-select"><option>Active</option><option>Inactive</option></select>
//                   </div>
//                 </div>
//                 <div className="panel-section-label" style={{ margin: '12px 0 8px' }}>Module Permissions</div>
//                 <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Toggle which modules this role can access.</div>
//                 {['Dashboard','Products','Orders','Inventory','Customers','Couriers','Riders','Finance','Tasks','Staff','Reports','Settings'].map(mod => (
//                   <div className="perm-row" key={mod}>
//                     <div className="perm-label">{mod}<small>Grant access to {mod} module</small></div>
//                     <Toggle checked={['Dashboard','Orders','Tasks'].includes(mod)} />
//                   </div>
//                 ))}
//                 <hr />
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <button className="header-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
//                     <i className="fa-solid fa-check" /> {editRoleName ? 'Save Changes' : 'Create Role'}
//                   </button>
//                   <button className="header-btn" onClick={() => setShowRolePanel(false)}>Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // TAB: PERFORMANCE
// // ═══════════════════════════════════════════════════════════

// const PerformanceTab: React.FC = () => {
//   const [period, setPeriod] = useState<PerfPeriod>('month');
//   const sorted = [...STAFF_DATA].sort((a, b) => b.score - a.score);

//   const MEDALS = ['🥇', '🥈', '🥉'];

//   return (
//     <>
//       <div className="stats-row" style={{ marginBottom: 14 }}>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Top Performer</div>
//             <div className="stat-icon" style={{ background: '#FFFBEB' }}><i className="fa-solid fa-trophy" style={{ color: '#F59E0B' }} /></div>
//           </div>
//           <div className="stat-value" style={{ fontSize: 14 }}>Sara Khan</div>
//           <div className="stat-trend up"><i className="fa-solid fa-star" /> 97% completion rate</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Total Tasks MTD</div>
//             <div className="stat-icon" style={{ background: '#EFF6FF' }}><i className="fa-solid fa-clipboard-list" style={{ color: '#3B82F6' }} /></div>
//           </div>
//           <div className="stat-value">412</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +48 vs last month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Avg Completion Rate</div>
//             <div className="stat-icon" style={{ background: '#F0FDF4' }}><i className="fa-solid fa-circle-check" style={{ color: '#22C55E' }} /></div>
//           </div>
//           <div className="stat-value">87%</div>
//           <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +3% this month</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-top">
//             <div className="stat-label">Overdue Tasks</div>
//             <div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-triangle-exclamation ic-orange" /></div>
//           </div>
//           <div className="stat-value">7</div>
//           <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs attention</div>
//         </div>
//       </div>

//       <div className="grid-2" style={{ marginBottom: 14 }}>
//         {/* Leaderboard */}
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-ranking-star ic-orange" /> Performance Leaderboard</div>
//             <div className="card-actions">
//               <select className="form-select" style={{ height: 26, fontSize: 11 }} value={period} onChange={e => setPeriod(e.target.value as PerfPeriod)}>
//                 <option value="month">This Month</option>
//                 <option value="week">This Week</option>
//                 <option value="all">All Time</option>
//               </select>
//             </div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 16px' }}>
//             {sorted.slice(0, 8).map((s, i) => {
//               const sc = scoreColor(s.score);
//               return (
//                 <div className="leaderboard-row" key={s.id}>
//                   <div className="leaderboard-rank">
//                     {i < 3 ? MEDALS[i] : <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</span>}
//                   </div>
//                   <div className="leaderboard-avatar" style={{ background: `${s.color}20`, color: s.color }}>{s.avatar}</div>
//                   <div className="leaderboard-info">
//                     <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
//                     <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.role}</div>
//                   </div>
//                   <div className="leaderboard-score">
//                     <div style={{ fontSize: 13, fontWeight: 800, color: sc }}>{s.score}%</div>
//                     <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{s.completed}/{s.tasks} tasks</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Dept Performance */}
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Department Performance</div>
//           </div>
//           <div className="card-body" style={{ padding: '10px 16px' }}>
//             {DEPT_PERFORMANCE.map(d => (
//               <div className="dept-perf-row" key={d.dept}>
//                 <div className="dept-perf-label">{d.dept}</div>
//                 <div className="prog-bar" style={{ flex: 1, height: 10 }}>
//                   <div
//                     className="prog-fill"
//                     style={{
//                       width: `${d.score}%`,
//                       background: d.score >= 90 ? 'var(--green)' : d.score >= 75 ? 'var(--accent)' : '#DC2626',
//                       borderRadius: 2,
//                     }}
//                   />
//                 </div>
//                 <div className="dept-perf-val">{d.score}%</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Individual Performance Table */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-user-chart" /> Individual Performance Breakdown</div>
//           <div className="card-actions">
//             <select className="form-select" style={{ height: 26, fontSize: 11 }}>
//               <option>May 2026</option>
//               <option>April 2026</option>
//               <option>March 2026</option>
//             </select>
//             <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
//           </div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Staff Member</th>
//                 <th>Role</th>
//                 <th>Tasks Assigned</th>
//                 <th>Completed</th>
//                 <th>Overdue</th>
//                 <th>Completion Rate</th>
//                 <th>Orders Processed</th>
//                 <th>Errors</th>
//                 <th>Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sorted.map(s => {
//                 const pct = completionPct(s);
//                 const overdue = s.tasks - s.completed;
//                 const fill = scoreFill(s.score);
//                 const scoreBadge = s.score >= 90 ? 'green' : s.score >= 75 ? 'yellow' : 'red';
//                 return (
//                   <tr key={s.id}>
//                     <td>
//                       <div className="td-flex">
//                         <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: s.color }}>{s.avatar}</div>
//                         <div style={{ fontWeight: 600 }}>{s.name}</div>
//                       </div>
//                     </td>
//                     <td><span className="tag">{s.role}</span></td>
//                     <td style={{ textAlign: 'center' }}>{s.tasks}</td>
//                     <td style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 600 }}>{s.completed}</td>
//                     <td style={{ textAlign: 'center', color: overdue > 5 ? 'var(--red)' : 'var(--text-muted)' }}>{overdue}</td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <ProgBar pct={pct} fill={fill} width={50} />
//                         <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
//                       </div>
//                     </td>
//                     <td style={{ textAlign: 'center' }}>{s.orders || '—'}</td>
//                     <td style={{ textAlign: 'center', color: s.errors > 5 ? 'var(--red)' : 'var(--text-muted)' }}>{s.errors}</td>
//                     <td><span className={`badge ${scoreBadge}`}>{s.score}%</span></td>
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
// // TAB: ACTIVITY LOG
// // ═══════════════════════════════════════════════════════════

// const ActivityTab: React.FC = () => (
//   <>
//     <div className="info-banner">
//       <i className="fa-solid fa-circle-info" />
//       <div className="info-banner-text">
//         All critical actions performed by staff are automatically logged here. This includes logins, order updates, stock changes, and settings modifications.
//         Logs are retained for <strong>90 days</strong> and can be exported at any time.
//       </div>
//     </div>

//     <div className="card">
//       <div className="table-toolbar">
//         <div className="table-toolbar-left">
//           <div className="table-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search by staff, action, module..." /></div>
//           <select className="form-select" style={{ height: 28, fontSize: 11 }}>
//             <option>All Staff</option>
//             {['Sara Khan','Admin Khan','Bilal Raza'].map(n => <option key={n}>{n}</option>)}
//           </select>
//           <select className="form-select" style={{ height: 28, fontSize: 11 }}>
//             <option>All Modules</option>
//             {['Orders','Inventory','Products','Customers','Finance','Settings'].map(m => <option key={m}>{m}</option>)}
//           </select>
//           <select className="form-select" style={{ height: 28, fontSize: 11 }}>
//             <option>Today</option>
//             <option>Last 7 days</option>
//             <option>Last 30 days</option>
//             <option>Custom range</option>
//           </select>
//         </div>
//         <div className="table-toolbar-right">
//           <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export Log</button>
//         </div>
//       </div>

//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Timestamp</th>
//               <th>Staff Member</th>
//               <th>Action</th>
//               <th>Module</th>
//               <th>Details</th>
//               <th>IP Address</th>
//               <th>Severity</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ACTIVITY_LOG.map((a, i) => (
//               <tr key={i}>
//                 <td style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.time}</td>
//                 <td><strong style={{ fontSize: 11.5 }}>{a.staff}</strong></td>
//                 <td style={{ fontSize: 11.5 }}>{a.action}</td>
//                 <td><span className="tag"><i className="fa-solid fa-cube" style={{ fontSize: 8 }} /> {a.module}</span></td>
//                 <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{a.detail}</td>
//                 <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>192.168.1.{(i * 7 + 11) % 254 + 1}</td>
//                 <td><span className={`badge ${severityBadgeClass[a.severity]}`}>{a.severity}</span></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <div className="pagination-info">Showing <strong>1–20</strong> of <strong>348</strong> logs</div>
//         <div className="pagination-controls">
//           {[1, 2, 3, '…', 18].map((p, i) => (
//             <button key={i} className={`page-btn ${p === 1 ? 'active' : ''}`}>{p}</button>
//           ))}
//         </div>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // TAB: INTEGRATIONS
// // ═══════════════════════════════════════════════════════════

// interface IntegrationConfig {
//   id: string;
//   name: string;
//   sub: string;
//   desc: string;
//   imgUrl: string;
//   fallbackBg: string;
//   fallbackChar: string;
//   iconClass: string;
//   connected: boolean;
// }

// const INTEGRATIONS: IntegrationConfig[] = [
//   { id:'slack',     name:'Slack',             sub:'Team messaging & notifications',  desc:'Send automatic staff notifications for new task assignments, overdue tasks, and performance alerts directly to Slack channels.',                      imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/120px-Slack_icon_2019.svg.png',       fallbackBg:'#4A154B', fallbackChar:'S', iconClass:'fa-brands fa-slack',   connected:false },
//   { id:'whatsapp',  name:'WhatsApp Business',  sub:'Staff alerts via WhatsApp',       desc:'Notify staff of task assignments and urgent alerts through WhatsApp Business API. Currently active and sending notifications.',                       imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png',                         fallbackBg:'#25D366', fallbackChar:'W', iconClass:'fa-brands fa-whatsapp', connected:true  },
//   { id:'google',    name:'Google Workspace',   sub:'Calendar, Gmail, Drive sync',     desc:'Sync staff schedules with Google Calendar, send task email reminders via Gmail, and share reports on Drive automatically.',                           imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png',  fallbackBg:'#4285F4', fallbackChar:'G', iconClass:'fa-brands fa-google',  connected:false },
//   { id:'shopify',   name:'Shopify',            sub:'E-commerce staff sync',           desc:'Assign staff roles to handle Shopify-synced orders. Staff will be automatically assigned tasks when new Shopify orders arrive.',                      imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/120px-Shopify_logo_2018.svg.png',      fallbackBg:'#96BF48', fallbackChar:'SH',iconClass:'fa-solid fa-store',    connected:false },
//   { id:'zoom',      name:'Zoom',               sub:'Team meetings & standups',        desc:'Schedule and launch team meetings directly from the staff dashboard. Automatic standup reminders for daily team syncs.',                               imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Zoom_Logo_2022.svg/120px-Zoom_Logo_2022.svg.png',             fallbackBg:'#2D8CFF', fallbackChar:'Z', iconClass:'fa-solid fa-video',    connected:false },
//   { id:'trello',    name:'Trello',             sub:'Visual task board sync',          desc:'Sync tasks assigned in this system to Trello boards. Cards are automatically created and moved as task status changes.',                               imgUrl:'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/120px-Trello_logo.svg.png',                         fallbackBg:'#0052CC', fallbackChar:'T', iconClass:'fa-solid fa-table-columns', connected:false },
// ];

// const NOTIF_TRIGGERS = [
//   { label: 'New task assigned to staff member', checked: true  },
//   { label: 'Task overdue (past due date)',       checked: true  },
//   { label: 'Task marked as completed',           checked: false },
//   { label: 'New staff member added',             checked: true  },
//   { label: 'Staff login from new device',        checked: false },
//   { label: 'Role or permission changed',         checked: true  },
// ];

// const NOTIF_CHANNELS = [
//   { label: 'In-app dashboard notification', checked: true  },
//   { label: 'WhatsApp (if connected)',        checked: true  },
//   { label: 'Slack (if connected)',           checked: false },
//   { label: 'Email (Google Workspace)',       checked: false },
//   { label: 'Weekly performance digest',     checked: false },
// ];

// const IntegrationCard: React.FC<{ config: IntegrationConfig }> = ({ config }) => {
//   const [connected, setConnected] = useState(config.connected);
//   const [loading, setLoading] = useState(false);
//   const [imgError, setImgError] = useState(false);

//   const connect = () => {
//     setLoading(true);
//     setTimeout(() => { setLoading(false); setConnected(true); }, 1500);
//   };

//   return (
//     <div className="card integration-card">
//       <div className="card-body" style={{ padding: 16 }}>
//         <div className="int-card-top">
//           {!imgError
//             ? <img src={config.imgUrl} className="int-logo" onError={() => setImgError(true)} alt={config.name} />
//             : <div className="int-fallback-icon" style={{ background: config.fallbackBg }}>{config.fallbackChar}</div>
//           }
//           <div className="int-info">
//             <div className="int-name">{config.name}</div>
//             <div className="int-sub">{config.sub}</div>
//           </div>
//           <span className={`badge ${connected ? 'green' : 'gray'}`} style={{ marginLeft: 'auto' }}>
//             {connected ? 'Connected' : 'Not Connected'}
//           </span>
//         </div>
//         <div className="int-desc">{config.desc}</div>
//         {connected ? (
//           <div style={{ display: 'flex', gap: 8 }}>
//             <button className="header-btn" style={{ flex: 1, justifyContent: 'center' }}><i className="fa-solid fa-gear" /> Configure</button>
//             <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => setConnected(false)}>
//               <i className="fa-solid fa-unlink" /> Disconnect
//             </button>
//           </div>
//         ) : (
//           <button className="header-btn primary" style={{ width: '100%', justifyContent: 'center' }} onClick={connect} disabled={loading}>
//             {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Connecting…</> : <><i className={config.iconClass} /> Connect {config.name}</>}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// const IntegrationsTab: React.FC = () => (
//   <>
//     <div className="section-divider"><span>HR &amp; Team Collaboration Tools</span></div>
//     <div className="grid-3" style={{ marginBottom: 14 }}>
//       {INTEGRATIONS.map(c => <IntegrationCard key={c.id} config={c} />)}
//     </div>

//     <div className="section-divider"><span>Notification Preferences</span></div>
//     <div className="card">
//       <div className="card-header"><div className="card-title"><i className="fa-solid fa-bell" /> Integration Notification Settings</div></div>
//       <div className="card-body">
//         <div className="grid-2">
//           <div>
//             <div className="notif-section-label">Trigger Events</div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {NOTIF_TRIGGERS.map(t => (
//                 <label key={t.label} className="notif-check">
//                   <input type="checkbox" defaultChecked={t.checked} /> {t.label}
//                 </label>
//               ))}
//             </div>
//           </div>
//           <div>
//             <div className="notif-section-label">Delivery Channels</div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {NOTIF_CHANNELS.map(c => (
//                 <label key={c.label} className="notif-check">
//                   <input type="checkbox" defaultChecked={c.checked} /> {c.label}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//         <hr />
//         <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Notification Settings</button>
//       </div>
//     </div>
//   </>
// );

// // ═══════════════════════════════════════════════════════════
// // MAIN PAGE COMPONENT
// // ═══════════════════════════════════════════════════════════

// const StaffPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<StaffTab>('members');
//   const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

//   const tabs: { id: StaffTab; icon: string; label: string }[] = [
//     { id: 'members',      icon: 'fa-users-gear',        label: 'Staff Members'   },
//     { id: 'roles',        icon: 'fa-shield-halved',     label: 'Roles & Access'  },
//     { id: 'performance',  icon: 'fa-chart-simple',      label: 'Performance'     },
//     { id: 'activity',     icon: 'fa-clock-rotate-left', label: 'Activity Log'    },
//     { id: 'integrations', icon: 'fa-plug',              label: 'Integrations'    },
//   ];

//   return (
//     <div id="page-staff">
//       <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
//       <div className="section-heading">Staff &amp; Roles</div>
//       <div className="section-subheading">
//         Manage your team members, define role-based permissions, track performance metrics, and monitor staff activity across all operations.
//       </div>

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

//       {activeTab === 'members'      && <StaffMembersTab />}
//       {activeTab === 'roles'        && <RolesTab />}
//       {activeTab === 'performance'  && <PerformanceTab />}
//       {activeTab === 'activity'     && <ActivityTab />}
//       {activeTab === 'integrations' && <IntegrationsTab />}
//     </div>
//   );
// };

// export default StaffPage;