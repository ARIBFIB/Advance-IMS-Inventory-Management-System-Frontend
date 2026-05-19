// ═══════════════════════════════════════════════════════════
// TasksPage.tsx  —  Orchestrator (imports all sub-panels)
// ═══════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import './TasksPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading }  from '../../hooks/useTabLoading';

// Shared
import { Task, ActiveTab } from './types';
import { INITIAL_TASKS }   from './constants';
import { InnerTabs }       from './MicroComponents';

// Panels
import AllTasksPanel from './AllTasksPanel';
import KanbanPanel   from './KanbanPanel';
import ByStaffPanel  from './ByStaffPanel';
import CalendarPanel from './CalendarPanel';
import NewTaskPanel  from './NewTaskPanel';
import TaskOverlay   from './TaskOverlay';

// ── Tab definitions ──────────────────────────────────────────
const MAIN_TABS: { id: ActiveTab; label: string }[] = [
  { id: 'all',      label: 'All Tasks'  },
  { id: 'kanban',   label: 'Board View' },
  { id: 'bystaff',  label: 'By Staff'   },
  { id: 'calendar', label: 'Calendar'   },
  { id: 'add',      label: '+ New Task' },
];

// ═══════════════════════════════════════════════════════════
const TasksPage: React.FC = () => {
  const [tasks,        setTasks]        = useState<Task[]>(INITIAL_TASKS);
  const [activeTab,    setActiveTab]    = useState<ActiveTab>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

  // ── Handlers ────────────────────────────────────────────
  const openTask = useCallback((id: string) => {
    const t = tasks.find(x => x.id === id);
    if (t) setSelectedTask(t);
  }, [tasks]);

  const closeTask = useCallback(() => setSelectedTask(null), []);

  const markDone = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: 'Done' as const, progress: 100 } : t
      )
    );
    setSelectedTask(null);
  }, []);

  // ── Derived stats ────────────────────────────────────────
  const overdueCnt = tasks.filter(t => t.status === 'Overdue').length;
  const doneCnt    = tasks.filter(t => t.status === 'Done').length;
  const inProgCnt  = tasks.filter(t => t.status === 'In Progress').length;

  // ── Panel router ─────────────────────────────────────────
  const renderPanel = () => {
    switch (activeTab) {
      case 'all':
        return (
          <AllTasksPanel
            tasks={tasks}
            onOpenTask={openTask}
            onMarkDone={markDone}
            onNewTask={() => setActiveTab('add')}
          />
        );
      case 'kanban':
        return <KanbanPanel tasks={tasks} onOpenTask={openTask} />;
      case 'bystaff':
        return <ByStaffPanel tasks={tasks} onOpenTask={openTask} />;
      case 'calendar':
        return <CalendarPanel tasks={tasks} onOpenTask={openTask} />;
      case 'add':
        return <NewTaskPanel tasks={tasks} onCancel={() => setActiveTab('all')} />;
      default:
        return null;
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div id="page-tasks">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-title">Task Management</div>
        <div className="page-hero-sub">
          Create, assign, and track daily tasks across staff members.
          Monitor completion rates and operational efficiency.
        </div>
      </div>

      {/* Overdue alert */}
      {overdueCnt > 0 && (
        <div className="alert-strip warn">
          <i className="fa-solid fa-triangle-exclamation" />
          <div>
            <strong>{overdueCnt} tasks overdue</strong> — assigned to staff with no update in the last 24 hours.
          </div>
          <button
            className="t-btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => setActiveTab('all')}
          >
            <i className="fa-solid fa-eye" /> View Overdue
          </button>
        </div>
      )}

      {/* Mini stats */}
      <div className="mini-stats">
        <div className="mini-stat">
          <div className="ms-label">Total Tasks (Today)</div>
          <div className="ms-value">{tasks.length}</div>
          <div className="ms-trend up">
            <i className="fa-solid fa-arrow-trend-up" /> +4 vs yesterday
          </div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Completed</div>
          <div className="ms-value" style={{ color: 'var(--green)' }}>{doneCnt}</div>
          <div className="ms-trend up">
            <i className="fa-solid fa-circle-check" />
            {' '}{Math.round((doneCnt / tasks.length) * 100)}% completion rate
          </div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">In Progress</div>
          <div className="ms-value" style={{ color: 'var(--blue)' }}>{inProgCnt}</div>
          <div className="ms-trend">
            <i className="fa-solid fa-spinner" />
            {' '}Across{' '}
            {new Set(tasks.filter(t => t.status === 'In Progress').map(t => t.assignee)).size}
            {' '}staff
          </div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Overdue</div>
          <div className="ms-value" style={{ color: 'var(--red)' }}>{overdueCnt}</div>
          <div className="ms-trend down">
            <i className="fa-solid fa-circle-exclamation" /> Needs attention
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <InnerTabs
        tabs={MAIN_TABS}
        active={activeTab}
        onChange={id => switchTab(id as ActiveTab)}
      />

      {/* Active panel */}
      {renderPanel()}

      {/* Task detail overlay */}
      <TaskOverlay task={selectedTask} onClose={closeTask} onMarkDone={markDone} />
    </div>
  );
};

export default TasksPage;

// import React, { useState, useCallback } from 'react';
// import './TasksPage.css';
// import TopLoadingBar from '../../components/ui/TopLoadingBar';
// import { useTabLoading } from '../../hooks/useTabLoading';

// // ═══════════════════════════════════════════════════════════
// // TYPES
// // ═══════════════════════════════════════════════════════════

// type TaskStatus = 'Pending' | 'In Progress' | 'Done' | 'Overdue';
// type TaskPriority = 'High' | 'Medium' | 'Low';
// type ActiveTab = 'all' | 'kanban' | 'bystaff' | 'calendar' | 'add';

// interface Task {
//   id: string;
//   title: string;
//   category: string;
//   assignee: string;
//   assignedBy: string;
//   due: string;
//   priority: TaskPriority;
//   status: TaskStatus;
//   progress: number;
//   linked: string;
// }

// interface StaffMember {
//   name: string;
//   role: string;
//   color: string;
// }

// // ═══════════════════════════════════════════════════════════
// // STATIC DATA
// // ═══════════════════════════════════════════════════════════

// const STAFF_LIST: StaffMember[] = [
//   { name: 'Usman Ahmed',  role: 'Rider',              color: '#FF6A00' },
//   { name: 'Sara Khan',    role: 'Inventory Manager',  color: '#16A34A' },
//   { name: 'Bilal Raza',   role: 'Sales Operator',     color: '#2563EB' },
//   { name: 'Nadia Malik',  role: 'Accounts',           color: '#7C3AED' },
//   { name: 'Hamza Iqbal',  role: 'Operations',         color: '#D97706' },
//   { name: 'Tariq Saleem', role: 'Rider',              color: '#DC2626' },
//   { name: 'Asad Khan',    role: 'Courier Handler',    color: '#0284C7' },
// ];

// const INITIAL_TASKS: Task[] = [
//   { id: 'TSK-001', title: 'Restock warehouse shelves — Section B',           category: 'Inventory',       assignee: 'Sara Khan',    assignedBy: 'Admin Khan',         due: '11 May, 17:00', priority: 'High',   status: 'In Progress', progress: 60,  linked: '—'                },
//   { id: 'TSK-002', title: 'Prepare COD submission report for accounts',       category: 'Finance',         assignee: 'Nadia Malik',  assignedBy: 'Admin Khan',         due: '11 May, 14:00', priority: 'High',   status: 'Done',        progress: 100, linked: '—'                },
//   { id: 'TSK-003', title: 'Pack and dispatch ORD-1045, ORD-1043',            category: 'Packing',         assignee: 'Bilal Raza',   assignedBy: 'Operations Manager', due: '11 May, 12:00', priority: 'High',   status: 'Done',        progress: 100, linked: 'ORD-1045'         },
//   { id: 'TSK-004', title: 'Call supplier Al-Karam re: overdue invoice',       category: 'Finance',         assignee: 'Nadia Malik',  assignedBy: 'Admin Khan',         due: '10 May, 18:00', priority: 'High',   status: 'Overdue',     progress: 0,   linked: 'Al-Karam Textile' },
//   { id: 'TSK-005', title: 'Update stock count after new Gul Ahmed delivery',  category: 'Inventory',       assignee: 'Sara Khan',    assignedBy: 'Admin Khan',         due: '11 May, 11:00', priority: 'Medium', status: 'Done',        progress: 100, linked: 'Gul Ahmed'        },
//   { id: 'TSK-006', title: 'Assign 6 pending orders to riders for afternoon',  category: 'Logistics',       assignee: 'Hamza Iqbal',  assignedBy: 'Operations Manager', due: '11 May, 13:00', priority: 'High',   status: 'Done',        progress: 100, linked: '—'                },
//   { id: 'TSK-007', title: 'Review and approve 3 return requests',             category: 'Operations',      assignee: 'Hamza Iqbal',  assignedBy: 'Admin Khan',         due: '11 May, 16:00', priority: 'Medium', status: 'In Progress', progress: 33,  linked: '—'                },
//   { id: 'TSK-008', title: 'Post evening WhatsApp product story',              category: 'Operations',      assignee: 'Bilal Raza',   assignedBy: 'Admin Khan',         due: '11 May, 20:00', priority: 'Low',    status: 'Pending',     progress: 0,   linked: '—'                },
//   { id: 'TSK-009', title: 'Reconcile prepaid Shopify orders for May Week 2',  category: 'Finance',         assignee: 'Nadia Malik',  assignedBy: 'Admin Khan',         due: '09 May, 18:00', priority: 'High',   status: 'Overdue',     progress: 20,  linked: '—'                },
//   { id: 'TSK-010', title: 'Daily rider debrief and COD collection',           category: 'Rider / Delivery',assignee: 'Tariq Saleem', assignedBy: 'Operations Manager', due: '11 May, 19:00', priority: 'Medium', status: 'In Progress', progress: 50,  linked: '—'                },
//   { id: 'TSK-011', title: 'Scan and log 4 courier delivery confirmations',    category: 'Logistics',       assignee: 'Asad Khan',    assignedBy: 'Admin Khan',         due: '09 May, 17:00', priority: 'Medium', status: 'Overdue',     progress: 0,   linked: '—'                },
//   { id: 'TSK-012', title: 'Prepare weekly inventory variance report',         category: 'Inventory',       assignee: 'Sara Khan',    assignedBy: 'Operations Manager', due: '12 May, 10:00', priority: 'Medium', status: 'Pending',     progress: 0,   linked: '—'                },
//   { id: 'TSK-013', title: 'Fix wrong product image on Shopify listing',       category: 'Operations',      assignee: 'Bilal Raza',   assignedBy: 'Admin Khan',         due: '12 May, 14:00', priority: 'Low',    status: 'Pending',     progress: 0,   linked: '—'                },
//   { id: 'TSK-014', title: 'Update rider delivery zones for next week',        category: 'Rider / Delivery',assignee: 'Usman Ahmed',  assignedBy: 'Operations Manager', due: '12 May, 09:00', priority: 'Low',    status: 'Pending',     progress: 0,   linked: '—'                },
//   { id: 'TSK-015', title: 'Confirm new Nishat Textiles order with supplier',  category: 'Inventory',       assignee: 'Sara Khan',    assignedBy: 'Admin Khan',         due: '11 May, 10:00', priority: 'High',   status: 'Done',        progress: 100, linked: 'Nishat Textiles'  },
// ];

// const CATEGORIES = ['Inventory', 'Operations', 'Logistics', 'Finance', 'Customer Support', 'Packing', 'Rider / Delivery', 'Other'];

// const WEEKLY_DAYS = [
//   { label: 'Mon 6',  day: 6  },
//   { label: 'Tue 7',  day: 7  },
//   { label: 'Wed 8',  day: 8  },
//   { label: 'Thu 9',  day: 9  },
//   { label: 'Fri 10', day: 10 },
//   { label: 'Sat 11', day: 11 },
//   { label: 'Sun 12', day: 12 },
// ];

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// const initials = (name: string) =>
//   name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

// const getStaffColor = (name: string): string => {
//   const s = STAFF_LIST.find(x => x.name === name);
//   return s ? s.color : '#FF6A00';
// };

// const getStaffRole = (name: string): string => {
//   const s = STAFF_LIST.find(x => x.name === name);
//   return s ? s.role : 'Staff';
// };

// function badgeClass(s: string): string {
//   const m: Record<string, string> = {
//     'Done': 'green', 'In Progress': 'blue', 'Pending': 'gray', 'Overdue': 'red',
//     'High': 'red', 'Medium': 'yellow', 'Low': 'green',
//   };
//   return m[s] || 'gray';
// }

// const progressColor = (status: TaskStatus): string => {
//   if (status === 'Done') return 'var(--green)';
//   if (status === 'Overdue') return 'var(--red)';
//   return 'var(--accent)';
// };

// // ═══════════════════════════════════════════════════════════
// // MICRO-COMPONENTS
// // ═══════════════════════════════════════════════════════════

// const Badge: React.FC<{ label: string }> = ({ label }) => (
//   <span className={`badge ${badgeClass(label)}`}>{label}</span>
// );

// const PriorityDot: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
//   const c = { High: 'var(--red)', Medium: 'var(--yellow)', Low: 'var(--green)' };
//   return <div className="priority-dot" style={{ background: c[priority] }} />;
// };

// const ProgressBar: React.FC<{ pct: number; color: string }> = ({ pct, color }) => (
//   <div className="prog-bar">
//     <div className="prog-fill" style={{ width: `${pct}%`, background: color }} />
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

// const EmptyState: React.FC<{ icon: string; title: string; desc?: string }> = ({ icon, title, desc }) => (
//   <div className="empty-state">
//     <i className={`fa-solid ${icon}`} />
//     <h4>{title}</h4>
//     {desc && <p>{desc}</p>}
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // INNER TABS COMPONENT
// // ═══════════════════════════════════════════════════════════

// interface InnerTabsProps {
//   tabs: { id: string; label: React.ReactNode }[];
//   active: string;
//   onChange: (id: string) => void;
// }
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
// // TASK OVERLAY
// // ═══════════════════════════════════════════════════════════

// interface TaskOverlayProps {
//   task: Task | null;
//   onClose: () => void;
//   onMarkDone: (id: string) => void;
// }

// const TaskOverlay: React.FC<TaskOverlayProps> = ({ task, onClose, onMarkDone }) => {
//   if (!task) return null;
//   const color = getStaffColor(task.assignee);
//   const barColor = progressColor(task.status);

//   return (
//     <>
//       <div className={`task-backdrop ${task ? 'open' : ''}`} onClick={onClose} />
//       <div className={`task-overlay ${task ? 'open' : ''}`}>
//         <div className="overlay-header">
//           <div className="overlay-title">{task.id} — {task.title.slice(0, 30)}…</div>
//           <button className="close-btn" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
//         </div>
//         <div className="overlay-body">
//           <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
//             <Badge label={task.status} />
//             <Badge label={task.priority} />
//             <span className="tag">{task.category}</span>
//           </div>
//           <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.4 }}>
//             {task.title}
//           </div>

//           {[
//             ['Task ID',     <code className="ref">{task.id}</code>],
//             ['Assigned To', (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
//                 <div className="row-avatar" style={{ background: color, width: 20, height: 20, fontSize: 9 }}>{initials(task.assignee)}</div>
//                 {task.assignee}
//               </div>
//             )],
//             ['Assigned By', task.assignedBy],
//             ['Due Date',    task.due],
//             ['Priority',    <Badge label={task.priority} />],
//             ['Status',      <Badge label={task.status} />],
//             ['Linked To',   task.linked !== '—' ? <span className="tag">{task.linked}</span> : '—'],
//           ].map(([k, v], i) => (
//             <div className="detail-row" key={i}>
//               <div className="detail-key">{k}</div>
//               <div className="detail-val">{v}</div>
//             </div>
//           ))}

//           <div style={{ marginTop: 12 }}>
//             <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 }}>
//               Progress — {task.progress}%
//             </div>
//             <ProgressBar pct={task.progress} color={barColor} />
//           </div>

//           <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

//           <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
//             {task.status !== 'Done' && (
//               <button className="t-btn primary" onClick={() => onMarkDone(task.id)}>
//                 <i className="fa-solid fa-check" /> Mark Done
//               </button>
//             )}
//             {(task.status === 'Pending' || task.status === 'In Progress') && (
//               <button className="t-btn"><i className="fa-solid fa-pen" /> Edit</button>
//             )}
//             <button className="t-btn danger"><i className="fa-solid fa-trash" /> Delete</button>
//             <button className="t-btn" onClick={onClose}>Close</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // ALL TASKS PANEL
// // ═══════════════════════════════════════════════════════════

// interface AllTasksPanelProps {
//   tasks: Task[];
//   onOpenTask: (id: string) => void;
//   onMarkDone: (id: string) => void;
//   onNewTask: () => void;
// }

// const AllTasksPanel: React.FC<AllTasksPanelProps> = ({ tasks, onOpenTask, onMarkDone, onNewTask }) => {
//   const [search, setSearch] = useState('');
//   const [chipFilter, setChipFilter] = useState('');
//   const [assigneeFilter, setAssigneeFilter] = useState('');

//   const chips = [
//     { label: 'All',       value: '',           icon: 'fa-list'               },
//     { label: 'Pending',   value: 'Pending',    icon: ''                      },
//     { label: 'In Progress',value:'In Progress', icon: ''                     },
//     { label: 'Done',      value: 'Done',       icon: ''                      },
//     { label: 'Overdue',   value: 'Overdue',    icon: 'fa-triangle-exclamation'},
//     { label: '🔴 High',   value: 'High',       icon: ''                      },
//     { label: '🟡 Medium', value: 'Medium',     icon: ''                      },
//     { label: '🟢 Low',    value: 'Low',        icon: ''                      },
//   ];

//   const filtered = tasks.filter(t => {
//     const q = search.toLowerCase();
//     const matchSearch = !search || t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
//     const matchChip = !chipFilter || t.status === chipFilter || t.priority === chipFilter;
//     const matchAssignee = !assigneeFilter || t.assignee === assigneeFilter;
//     return matchSearch && matchChip && matchAssignee;
//   });

//   return (
//     <>
//       <div className="chip-group">
//         {chips.map(c => (
//           <div key={c.value} className={`chip ${chipFilter === c.value ? 'active' : ''}`} onClick={() => setChipFilter(c.value)}>
//             {c.icon && <i className={`fa-solid ${c.icon}`} style={c.value === 'Overdue' ? { color: 'var(--red)' } : undefined} />}
//             {c.label}
//           </div>
//         ))}
//       </div>

//       <div className="card">
//         <div className="table-toolbar">
//           <div className="toolbar-left">
//             <div className="t-search">
//               <i className="fa-solid fa-magnifying-glass" />
//               <input
//                 type="text"
//                 placeholder="Search task or staff..."
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//               />
//             </div>
//             <button className="t-btn"><i className="fa-solid fa-calendar" /> Due Date</button>
//             <select
//               className="form-select"
//               style={{ height: 27, fontSize: '10.5px' }}
//               value={assigneeFilter}
//               onChange={e => setAssigneeFilter(e.target.value)}
//             >
//               <option value="">All Staff</option>
//               {STAFF_LIST.map(s => <option key={s.name}>{s.name}</option>)}
//             </select>
//           </div>
//           <div className="toolbar-right">
//             <button className="t-btn"><i className="fa-solid fa-file-export" /> Export</button>
//             <button className="t-btn primary" onClick={onNewTask}><i className="fa-solid fa-plus" /> New Task</button>
//           </div>
//         </div>

//         <div className="tbl-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th><input type="checkbox" /></th>
//                 <th>Task Title</th>
//                 <th>Category</th>
//                 <th>Assigned To</th>
//                 <th>Assigned By</th>
//                 <th>Due Date</th>
//                 <th>Priority</th>
//                 <th>Status</th>
//                 <th>Progress</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map(t => {
//                 const color = getStaffColor(t.assignee);
//                 const barColor = progressColor(t.status);
//                 return (
//                   <tr key={t.id} onClick={() => onOpenTask(t.id)}>
//                     <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
//                     <td>
//                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
//                         <PriorityDot priority={t.priority} />
//                         <div>
//                           <div style={{ fontWeight: 600, fontSize: 11 }}>{t.title}</div>
//                           <div className="td-sub">
//                             <code className="ref">{t.id}</code>
//                             {t.linked !== '—' && <> · <span className="tag">{t.linked}</span></>}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className="tag">{t.category}</span></td>
//                     <td>
//                       <div className="td-flex">
//                         <div className="row-avatar" style={{ background: color }}>{initials(t.assignee)}</div>
//                         <div>
//                           <div style={{ fontSize: '10.5px', fontWeight: 500 }}>{t.assignee}</div>
//                           <div className="td-sub">{getStaffRole(t.assignee)}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{t.assignedBy}</td>
//                     <td style={{ fontSize: 10, whiteSpace: 'nowrap', color: t.status === 'Overdue' ? 'var(--red)' : undefined, fontWeight: t.status === 'Overdue' ? 600 : undefined }}>
//                       {t.due}
//                     </td>
//                     <td><Badge label={t.priority} /></td>
//                     <td><Badge label={t.status} /></td>
//                     <td style={{ minWidth: 80 }}>
//                       <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginBottom: 2 }}>{t.progress}%</div>
//                       <ProgressBar pct={t.progress} color={barColor} />
//                     </td>
//                     <td onClick={e => e.stopPropagation()}>
//                       {t.status !== 'Done' && (
//                         <button className="t-btn primary" style={{ height: 22, fontSize: 9.5 }} onClick={() => onMarkDone(t.id)}>
//                           <i className="fa-solid fa-check" />
//                         </button>
//                       )}
//                       <button className="t-btn" style={{ height: 22, fontSize: 9.5, marginLeft: 3 }} onClick={() => onOpenTask(t.id)}>
//                         <i className="fa-solid fa-eye" />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         <div className="pagination">
//           <div>Showing 1–{filtered.length} of {filtered.length} tasks</div>
//           <div className="pag-controls">
//             <button className="pag-btn active">1</button>
//             {filtered.length > 10 && <button className="pag-btn">2</button>}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // KANBAN PANEL
// // ═══════════════════════════════════════════════════════════

// interface KanbanPanelProps {
//   tasks: Task[];
//   onOpenTask: (id: string) => void;
// }

// const KanbanPanel: React.FC<KanbanPanelProps> = ({ tasks, onOpenTask }) => {
//   const columns: { key: TaskStatus | 'Overdue'; label: string; icon: string; color: string }[] = [
//     { key: 'Pending',     label: 'Pending',     icon: 'fa-clock',        color: 'var(--text-muted)' },
//     { key: 'In Progress', label: 'In Progress', icon: 'fa-spinner',      color: 'var(--blue)'       },
//     { key: 'Done',        label: 'Done',        icon: 'fa-circle-check', color: 'var(--green)'      },
//   ];

//   return (
//     <div className="kanban-board">
//       {columns.map(col => {
//         const items = tasks.filter(t => {
//           if (col.key === 'Pending') return t.status === 'Pending' || t.status === 'Overdue';
//           return t.status === col.key;
//         });
//         const countStyle = col.key === 'Done'
//           ? 'background:var(--green-bg);color:var(--green)'
//           : col.key === 'In Progress'
//           ? 'background:var(--blue-bg);color:var(--blue)'
//           : 'background:var(--divider);color:var(--text-muted)';

//         return (
//           <div className="kanban-col" key={col.key}>
//             <div className="kanban-col-header">
//               <div className="kanban-col-title">
//                 <i className={`fa-solid ${col.icon}`} style={{ color: col.color, fontSize: 10 }} />
//                 {col.label}
//               </div>
//               <span className="kanban-col-count" style={Object.fromEntries(countStyle.split(';').map(s => s.split(':')))}>{items.length}</span>
//             </div>
//             <div className="kanban-col-body">
//               {items.length === 0
//                 ? <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-muted)', fontSize: '10.5px' }}>No tasks</div>
//                 : items.map(t => {
//                   const color = getStaffColor(t.assignee);
//                   const barColor = progressColor(t.status);
//                   return (
//                     <div className="kanban-card" key={t.id} onClick={() => onOpenTask(t.id)}>
//                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 4 }}>
//                         <PriorityDot priority={t.priority} />
//                         <div className="kanban-card-title">{t.title}</div>
//                       </div>
//                       <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
//                         <span className="tag">{t.category}</span>
//                         {t.status === 'Overdue' && <Badge label="Overdue" />}
//                       </div>
//                       <ProgressBar pct={t.progress} color={barColor} />
//                       <div className="kanban-card-meta">
//                         <div className="kanban-card-assignee">
//                           <div className="row-avatar" style={{ background: color, width: 18, height: 18, fontSize: 8 }}>{initials(t.assignee)}</div>
//                           {t.assignee.split(' ')[0]}
//                         </div>
//                         <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.due.split(',')[0]}</div>
//                       </div>
//                     </div>
//                   );
//                 })
//               }
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // BY STAFF PANEL
// // ═══════════════════════════════════════════════════════════

// interface ByStaffPanelProps {
//   tasks: Task[];
//   onOpenTask: (id: string) => void;
// }

// const ByStaffPanel: React.FC<ByStaffPanelProps> = ({ tasks, onOpenTask }) => {
//   const grouped: Record<string, Task[]> = {};
//   tasks.forEach(t => {
//     if (!grouped[t.assignee]) grouped[t.assignee] = [];
//     grouped[t.assignee].push(t);
//   });

//   const staffRates = Object.entries(grouped).map(([name, staffTasks]) => ({
//     name,
//     pct: Math.round((staffTasks.filter(t => t.status === 'Done').length / staffTasks.length) * 100),
//   }));

//   const topPerformers = [...staffRates].sort((a, b) => b.pct - a.pct).slice(0, 3);
//   const medals = ['🥇', '🥈', '🥉'];

//   return (
//     <div className="tasks-layout">
//       <div>
//         {Object.entries(grouped).map(([name, staffTasks]) => {
//           const color = getStaffColor(name);
//           const done = staffTasks.filter(t => t.status === 'Done').length;
//           const total = staffTasks.length;
//           const pct = Math.round((done / total) * 100);
//           const role = getStaffRole(name);
//           const pctColor = pct === 100 ? 'var(--green)' : pct > 50 ? 'var(--blue)' : 'var(--accent)';

//           return (
//             <div className="staff-col" key={name}>
//               <div className="staff-col-head">
//                 <div className="row-avatar" style={{ background: color, width: 30, height: 30, fontSize: 11 }}>{initials(name)}</div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 12, fontWeight: 700 }}>{name}</div>
//                   <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{role}</div>
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                   <div style={{ fontSize: 13, fontWeight: 800, color: pctColor }}>{pct}%</div>
//                   <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{done}/{total} done</div>
//                 </div>
//               </div>
//               <div className="staff-col-body">
//                 <div className="prog-bar" style={{ marginBottom: 8 }}>
//                   <div className="prog-fill" style={{ width: `${pct}%`, background: pctColor }} />
//                 </div>
//                 {staffTasks.map(t => {
//                   const iconClass = t.status === 'Done' ? 'fa-circle-check ic-green'
//                     : t.status === 'Overdue' ? 'fa-triangle-exclamation ic-red'
//                     : t.status === 'In Progress' ? 'fa-spinner ic-blue'
//                     : 'fa-clock ic-muted';
//                   const bgColor = t.status === 'Done' ? 'var(--green-bg)'
//                     : t.status === 'Overdue' ? 'var(--red-bg)'
//                     : t.status === 'In Progress' ? 'var(--blue-bg)'
//                     : 'var(--bg)';
//                   return (
//                     <div className="list-item" key={t.id} onClick={() => onOpenTask(t.id)} style={{ cursor: 'pointer' }}>
//                       <div className="list-icon" style={{ background: bgColor }}>
//                         <i className={`fa-solid ${iconClass}`} style={{ fontSize: 10 }} />
//                       </div>
//                       <div className="list-content">
//                         <div className="list-title" style={{ fontSize: '10.5px' }}>{t.title}</div>
//                         <div className="list-meta">{t.category} · Due: {t.due}</div>
//                       </div>
//                       <div className="list-right"><Badge label={t.priority} /></div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div>
//         <div className="card" style={{ marginBottom: 12 }}>
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-chart-simple ic-orange" /> Staff Completion Rates</div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 14px' }}>
//             {staffRates.map(s => {
//               const color = getStaffColor(s.name);
//               const pctColor = s.pct === 100 ? 'var(--green)' : s.pct > 50 ? 'var(--blue)' : 'var(--accent)';
//               return (
//                 <div className="list-item" key={s.name}>
//                   <div className="row-avatar" style={{ background: color, width: 22, height: 22, fontSize: 9, flexShrink: 0 }}>{initials(s.name)}</div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ fontSize: '10.5px', fontWeight: 500, marginBottom: 3 }}>{s.name.split(' ')[0]}</div>
//                     <ProgressBar pct={s.pct} color={pctColor} />
//                   </div>
//                   <div style={{ fontSize: 11, fontWeight: 700, color: pctColor, marginLeft: 8 }}>{s.pct}%</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-trophy" style={{ color: 'var(--yellow)' }} /> Top Performers Today</div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 14px' }}>
//             {topPerformers.map((s, i) => {
//               const color = getStaffColor(s.name);
//               return (
//                 <div className="list-item" key={s.name}>
//                   <div style={{ fontSize: 16, lineHeight: 1, marginTop: 2 }}>{medals[i]}</div>
//                   <div className="row-avatar" style={{ background: color, width: 24, height: 24, fontSize: 9 }}>{initials(s.name)}</div>
//                   <div className="list-content">
//                     <div style={{ fontSize: 11, fontWeight: 600 }}>{s.name}</div>
//                     <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{s.pct}% completion rate</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // CALENDAR PANEL
// // ═══════════════════════════════════════════════════════════

// interface CalendarPanelProps {
//   tasks: Task[];
//   onOpenTask: (id: string) => void;
// }

// const CalendarPanel: React.FC<CalendarPanelProps> = ({ tasks, onOpenTask }) => {
//   const [selectedDay, setSelectedDay] = useState(11);

//   const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const START_DAY = 4; // May 2026 starts on Thursday
//   const DAYS_IN_MONTH = 31;

//   const getTasksForDay = (d: number) => tasks.filter(t => t.due.includes(`${d} May`));

//   const getDotColor = (t: Task) => {
//     if (t.status === 'Done') return 'var(--green)';
//     if (t.status === 'Overdue') return 'var(--red)';
//     if (t.status === 'In Progress') return 'var(--blue)';
//     return 'var(--text-muted)';
//   };

//   const dayTasks = getTasksForDay(selectedDay);

//   return (
//     <>
//       <div className="card" style={{ marginBottom: 14 }}>
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-calendar-days ic-orange" /> May 2026</div>
//           <div style={{ display: 'flex', gap: 6 }}>
//             <button className="t-btn"><i className="fa-solid fa-chevron-left" /></button>
//             <button className="t-btn">Today</button>
//             <button className="t-btn"><i className="fa-solid fa-chevron-right" /></button>
//           </div>
//         </div>
//         <div className="card-body">
//           {/* Day labels */}
//           <div className="cal-grid">
//             {DAY_LABELS.map(d => <div className="cal-day-label" key={d}>{d}</div>)}
//           </div>
//           {/* Calendar cells */}
//           <div className="cal-grid">
//             {/* Leading empty cells */}
//             {Array.from({ length: START_DAY }).map((_, i) => (
//               <div className="cal-cell other-month" key={`pre-${i}`}>
//                 <div className="cal-date">{30 - START_DAY + 1 + i}</div>
//               </div>
//             ))}
//             {/* Month days */}
//             {Array.from({ length: DAYS_IN_MONTH }).map((_, idx) => {
//               const d = idx + 1;
//               const dayTaskList = getTasksForDay(d);
//               const isToday = d === 11;
//               const isSelected = d === selectedDay;
//               return (
//                 <div
//                   key={d}
//                   className={`cal-cell ${isToday || isSelected ? 'today' : ''}`}
//                   onClick={() => setSelectedDay(d)}
//                 >
//                   <div className="cal-date">{d}</div>
//                   {dayTaskList.slice(0, 3).map((t, i) => (
//                     <div key={i} className="cal-dot" style={{ background: getDotColor(t), opacity: 0.7 }} />
//                   ))}
//                   {dayTaskList.length > 3 && (
//                     <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>+{dayTaskList.length - 3}</div>
//                   )}
//                 </div>
//               );
//             })}
//             {/* Trailing empty cells */}
//             {Array.from({ length: (7 - ((START_DAY + DAYS_IN_MONTH) % 7)) % 7 }).map((_, i) => (
//               <div className="cal-cell other-month" key={`post-${i}`}>
//                 <div className="cal-date">{i + 1}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="detail-grid-2">
//         <div className="card" style={{ marginBottom: 0 }}>
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-calendar-day" /> Tasks for {selectedDay} May 2026</div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 14px' }}>
//             {dayTasks.length === 0
//               ? <EmptyState icon="fa-calendar-xmark" title="No tasks this day" />
//               : dayTasks.map(t => {
//                 const iconClass = t.status === 'Done' ? 'fa-check ic-green'
//                   : t.status === 'Overdue' ? 'fa-triangle-exclamation ic-red'
//                   : 'fa-clock ic-blue';
//                 const bgColor = t.status === 'Done' ? 'var(--green-bg)'
//                   : t.status === 'Overdue' ? 'var(--red-bg)'
//                   : 'var(--blue-bg)';
//                 return (
//                   <div className="list-item" key={t.id} onClick={() => onOpenTask(t.id)} style={{ cursor: 'pointer' }}>
//                     <div className="list-icon" style={{ background: bgColor }}>
//                       <i className={`fa-solid ${iconClass}`} style={{ fontSize: 10 }} />
//                     </div>
//                     <div className="list-content">
//                       <div className="list-title" style={{ fontSize: '10.5px' }}>{t.title}</div>
//                       <div className="list-meta">{t.assignee} · {t.due.split(',')[1] || ''}</div>
//                     </div>
//                     <div className="list-right"><Badge label={t.status} /></div>
//                   </div>
//                 );
//               })
//             }
//           </div>
//         </div>

//         <div className="card" style={{ marginBottom: 0 }}>
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-circle-info ic-blue" /> Weekly Overview</div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 14px' }}>
//             {WEEKLY_DAYS.map(w => {
//               const dayTaskCount = getTasksForDay(w.day);
//               const done = dayTaskCount.filter(t => t.status === 'Done').length;
//               const pct = dayTaskCount.length > 0 ? Math.round((done / dayTaskCount.length) * 100) : Math.floor(Math.random() * 40 + 50);
//               const barColor = pct > 80 ? 'var(--green)' : pct > 50 ? 'var(--blue)' : 'var(--accent)';
//               return (
//                 <div className="list-item" key={w.label}>
//                   <div style={{ width: 40, fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{w.label}</div>
//                   <div style={{ flex: 1 }}><ProgressBar pct={pct} color={barColor} /></div>
//                   <div style={{ fontSize: 10, fontWeight: 600, marginLeft: 8, color: 'var(--text-secondary)', width: 30, textAlign: 'right' }}>{pct}%</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // NEW TASK PANEL
// // ═══════════════════════════════════════════════════════════

// interface NewTaskPanelProps {
//   tasks: Task[];
//   onCancel: () => void;
// }

// const NewTaskPanel: React.FC<NewTaskPanelProps> = ({ tasks, onCancel }) => {
//   const workload: Record<string, number> = {};
//   tasks.forEach(t => { workload[t.assignee] = (workload[t.assignee] || 0) + 1; });

//   return (
//     <div className="detail-grid-2" style={{ alignItems: 'start' }}>
//       <div className="card" style={{ marginBottom: 0 }}>
//         <div className="card-header">
//           <div className="card-title"><i className="fa-solid fa-circle-plus ic-orange" /> Create New Task</div>
//         </div>
//         <div className="card-body">
//           <div className="form-row single">
//             <div className="form-group">
//               <div className="form-label">Task Title *</div>
//               <input className="form-input" placeholder="e.g. Restock warehouse shelves — Section B" />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <div className="form-label">Category *</div>
//               <select className="form-select">
//                 {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//             <div className="form-group">
//               <div className="form-label">Priority *</div>
//               <select className="form-select">
//                 <option>High</option><option>Medium</option><option>Low</option>
//               </select>
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <div className="form-label">Assign To *</div>
//               <select className="form-select">
//                 {STAFF_LIST.map(s => <option key={s.name}>{s.name}</option>)}
//               </select>
//             </div>
//             <div className="form-group">
//               <div className="form-label">Assigned By</div>
//               <select className="form-select">
//                 <option>Admin Khan (Self)</option>
//                 <option>Operations Manager</option>
//               </select>
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <div className="form-label">Due Date *</div>
//               <input className="form-input" type="date" />
//             </div>
//             <div className="form-group">
//               <div className="form-label">Due Time</div>
//               <input className="form-input" type="time" defaultValue="17:00" />
//             </div>
//           </div>
//           <div className="form-row single">
//             <div className="form-group">
//               <div className="form-label">Linked To (Optional)</div>
//               <select className="form-select">
//                 <option value="">— None —</option>
//                 <option>Order: ORD-1045</option>
//                 <option>Order: ORD-1040</option>
//                 <option>Product: Classic Lawn Suit</option>
//                 <option>Supplier: Al-Karam Textile</option>
//               </select>
//             </div>
//           </div>
//           <div className="form-row single">
//             <div className="form-group">
//               <div className="form-label">Description / Instructions</div>
//               <textarea className="form-textarea" placeholder="Detailed instructions for this task..." />
//             </div>
//           </div>
//           <div className="form-row single">
//             <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//               <div>
//                 <div className="form-label" style={{ marginBottom: 0 }}>Notify Assignee</div>
//                 <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Send notification when task is created</div>
//               </div>
//               <ToggleSwitch defaultChecked />
//             </div>
//           </div>
//           <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
//           <div style={{ display: 'flex', gap: 8 }}>
//             <button className="t-btn primary"><i className="fa-solid fa-check" /> Create Task</button>
//             <button className="t-btn" onClick={onCancel}>Cancel</button>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="card" style={{ marginBottom: 12 }}>
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Tasks Created</div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 14px' }}>
//             {tasks.slice(0, 5).map(t => (
//               <div className="list-item" key={t.id}>
//                 <div className="list-content">
//                   <div className="list-title" style={{ fontSize: '10.5px' }}>{t.title.slice(0, 45)}…</div>
//                   <div className="list-meta">{t.assignee} · {t.category}</div>
//                 </div>
//                 <div className="list-right"><Badge label={t.status} /></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="card" style={{ marginBottom: 0 }}>
//           <div className="card-header">
//             <div className="card-title"><i className="fa-solid fa-users ic-blue" /> Staff Workload</div>
//           </div>
//           <div className="card-body" style={{ padding: '8px 14px' }}>
//             {Object.entries(workload).sort((a, b) => b[1] - a[1]).map(([name, count]) => {
//               const color = getStaffColor(name);
//               const pct = Math.round((count / 15) * 100);
//               const barColor = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--yellow)' : 'var(--green)';
//               return (
//                 <div className="list-item" key={name}>
//                   <div className="row-avatar" style={{ background: color, width: 22, height: 22, fontSize: 9 }}>{initials(name)}</div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: '10.5px', fontWeight: 500, marginBottom: 3 }}>
//                       {name.split(' ')[0]} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({count} tasks)</span>
//                     </div>
//                     <ProgressBar pct={pct} color={barColor} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════
// // MAIN PAGE COMPONENT
// // ═══════════════════════════════════════════════════════════

// const TasksPage: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
//   const [activeTab, setActiveTab] = useState<ActiveTab>('all');
//   const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);

//   const openTask = useCallback((id: string) => {
//     const t = tasks.find(x => x.id === id);
//     if (t) setSelectedTask(t);
//   }, [tasks]);

//   const closeTask = useCallback(() => setSelectedTask(null), []);

//   const markDone = useCallback((id: string) => {
//     setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Done' as TaskStatus, progress: 100 } : t));
//     setSelectedTask(null);
//   }, []);

//   const overdueCnt = tasks.filter(t => t.status === 'Overdue').length;
//   const doneCnt    = tasks.filter(t => t.status === 'Done').length;
//   const inProgCnt  = tasks.filter(t => t.status === 'In Progress').length;

//   const mainTabs: { id: ActiveTab; label: React.ReactNode }[] = [
//     { id: 'all',      label: 'All Tasks'  },
//     { id: 'kanban',   label: 'Board View' },
//     { id: 'bystaff',  label: 'By Staff'   },
//     { id: 'calendar', label: 'Calendar'   },
//     { id: 'add',      label: '+ New Task' },
//   ];

//   const renderPanel = () => {
//     switch (activeTab) {
//       case 'all':
//         return <AllTasksPanel tasks={tasks} onOpenTask={openTask} onMarkDone={markDone} onNewTask={() => setActiveTab('add')} />;
//       case 'kanban':
//         return <KanbanPanel tasks={tasks} onOpenTask={openTask} />;
//       case 'bystaff':
//         return <ByStaffPanel tasks={tasks} onOpenTask={openTask} />;
//       case 'calendar':
//         return <CalendarPanel tasks={tasks} onOpenTask={openTask} />;
//       case 'add':
//         return <NewTaskPanel tasks={tasks} onCancel={() => setActiveTab('all')} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div id="page-tasks">
//       <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
//       {/* PAGE HERO */}
//       <div className="page-hero">
//         <div className="page-hero-title">Task Management</div>
//         <div className="page-hero-sub">Create, assign, and track daily tasks across staff members. Monitor completion rates and operational efficiency.</div>
//       </div>

//       {/* ALERT */}
//       {overdueCnt > 0 && (
//         <div className="alert-strip warn">
//           <i className="fa-solid fa-triangle-exclamation" />
//           <div><strong>{overdueCnt} tasks overdue</strong> — assigned to staff with no update in the last 24 hours.</div>
//           <button className="t-btn" style={{ marginLeft: 'auto' }} onClick={() => setActiveTab('all')}>
//             <i className="fa-solid fa-eye" /> View Overdue
//           </button>
//         </div>
//       )}

//       {/* MINI STATS */}
//       <div className="mini-stats">
//         <div className="mini-stat">
//           <div className="ms-label">Total Tasks (Today)</div>
//           <div className="ms-value">{tasks.length}</div>
//           <div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +4 vs yesterday</div>
//         </div>
//         <div className="mini-stat">
//           <div className="ms-label">Completed</div>
//           <div className="ms-value" style={{ color: 'var(--green)' }}>{doneCnt}</div>
//           <div className="ms-trend up"><i className="fa-solid fa-circle-check" /> {Math.round((doneCnt / tasks.length) * 100)}% completion rate</div>
//         </div>
//         <div className="mini-stat">
//           <div className="ms-label">In Progress</div>
//           <div className="ms-value" style={{ color: 'var(--blue)' }}>{inProgCnt}</div>
//           <div className="ms-trend"><i className="fa-solid fa-spinner" /> Across {new Set(tasks.filter(t => t.status === 'In Progress').map(t => t.assignee)).size} staff</div>
//         </div>
//         <div className="mini-stat">
//           <div className="ms-label">Overdue</div>
//           <div className="ms-value" style={{ color: 'var(--red)' }}>{overdueCnt}</div>
//           <div className="ms-trend down"><i className="fa-solid fa-circle-exclamation" /> Needs attention</div>
//         </div>
//       </div>

//       {/* INNER TABS */}
//       <InnerTabs tabs={mainTabs} active={activeTab} onChange={id => switchTab(id as ActiveTab)} />

//       {/* PANEL */}
//       {renderPanel()}

//       {/* TASK OVERLAY */}
//       <TaskOverlay task={selectedTask} onClose={closeTask} onMarkDone={markDone} />
//     </div>
//   );
// };

// export default TasksPage;