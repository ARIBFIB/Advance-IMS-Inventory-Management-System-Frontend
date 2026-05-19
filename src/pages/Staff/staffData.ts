// ═══════════════════════════════════════════════════════════
// STATIC DATA — staffData.ts
// ═══════════════════════════════════════════════════════════

import {
  StaffMember, Role, ActivityEntry, MatrixModule,
  IntegrationConfig, StaffStatus, AccessLevel, Severity,
} from './staff.types';

// ── Lookup Maps ────────────────────────────────────────────

export const statusDotClass: Record<StaffStatus, string> = {
  Active:    'online',
  Offline:   'offline',
  Suspended: 'suspended',
};

export const statusBadgeClass: Record<StaffStatus, string> = {
  Active:    'green',
  Offline:   'gray',
  Suspended: 'orange',
};

export const severityBadgeClass: Record<Severity, string> = {
  Info:     'blue',
  Warning:  'orange',
  Critical: 'red',
};

export const levelBadgeClass: Record<AccessLevel, string> = {
  Full:    'orange',
  High:    'blue',
  Medium:  'blue',
  Limited: 'gray',
  Minimal: 'gray',
};

// ── Helpers ────────────────────────────────────────────────

export const scoreColor = (s: number) =>
  s >= 90 ? '#16A34A' : s >= 75 ? '#D97706' : '#DC2626';

export const scoreFill = (s: number) =>
  s >= 90 ? 'green' : s >= 75 ? 'yellow' : 'red';

export const completionPct = (s: StaffMember) =>
  Math.round((s.completed / s.tasks) * 100);

// ── Constants ──────────────────────────────────────────────

export const STAFF_PER_PAGE = 14;

// ── Staff Members ──────────────────────────────────────────

export const STAFF_DATA: StaffMember[] = [
  { id:1,  name:'Admin Khan',     role:'Administrator',      dept:'Management', email:'admin@inventoryos.pk',  phone:'0321-1112233', tasks:52, completed:51, orders:0,   errors:0,  score:98, status:'Active',    joined:'01 Jan 2026', lastActive:'Just now',   avatar:'AK', color:'#FF6A00' },
  { id:2,  name:'Sara Khan',      role:'Ops Manager',        dept:'Operations', email:'sara@inventoryos.pk',   phone:'0300-2223344', tasks:44, completed:43, orders:124, errors:2,  score:97, status:'Active',    joined:'05 Jan 2026', lastActive:'2 min ago',  avatar:'SK', color:'#8B5CF6' },
  { id:3,  name:'Bilal Raza',     role:'Inventory Manager',  dept:'Inventory',  email:'bilal@inventoryos.pk',  phone:'0311-3334455', tasks:38, completed:35, orders:0,   errors:3,  score:92, status:'Active',    joined:'10 Jan 2026', lastActive:'15 min ago', avatar:'BR', color:'#2563EB' },
  { id:4,  name:'Amna Siddiqui', role:'Sales Operator',     dept:'Sales',      email:'amna@inventoryos.pk',   phone:'0333-4445566', tasks:61, completed:54, orders:310, errors:8,  score:88, status:'Active',    joined:'12 Jan 2026', lastActive:'1 hr ago',   avatar:'AS', color:'#EC4899' },
  { id:5,  name:'Tariq Mehmood', role:'Sales Operator',     dept:'Sales',      email:'tariq@inventoryos.pk',  phone:'0345-5556677', tasks:58, completed:49, orders:278, errors:11, score:84, status:'Active',    joined:'15 Jan 2026', lastActive:'3 hrs ago',  avatar:'TM', color:'#0891B2' },
  { id:6,  name:'Fatima Noor',   role:'Accounts',           dept:'Finance',    email:'fatima@inventoryos.pk', phone:'0312-6667788', tasks:29, completed:27, orders:0,   errors:1,  score:93, status:'Active',    joined:'20 Jan 2026', lastActive:'30 min ago', avatar:'FN', color:'#059669' },
  { id:7,  name:'Hassan Ali',    role:'Courier Handler',    dept:'Logistics',  email:'hassan@inventoryos.pk', phone:'0321-7778899', tasks:33, completed:28, orders:89,  errors:4,  score:85, status:'Active',    joined:'25 Jan 2026', lastActive:'Yesterday',  avatar:'HA', color:'#7C3AED' },
  { id:8,  name:'Zara Hussain',  role:'Sales Operator',     dept:'Sales',      email:'zara@inventoryos.pk',   phone:'0300-8889900', tasks:47, completed:40, orders:198, errors:7,  score:85, status:'Active',    joined:'01 Feb 2026', lastActive:'4 hrs ago',  avatar:'ZH', color:'#DB2777' },
  { id:9,  name:'Omar Farooq',   role:'Rider',              dept:'Logistics',  email:'omar@inventoryos.pk',   phone:'0311-9990011', tasks:22, completed:22, orders:112, errors:2,  score:100,status:'Active',    joined:'05 Feb 2026', lastActive:'10 min ago', avatar:'OF', color:'#16A34A' },
  { id:10, name:'Sana Bukhari',  role:'Inventory Manager',  dept:'Inventory',  email:'sana@inventoryos.pk',   phone:'0333-0001122', tasks:31, completed:26, orders:0,   errors:5,  score:84, status:'Offline',   joined:'10 Feb 2026', lastActive:'2 days ago', avatar:'SB', color:'#0284C7' },
  { id:11, name:'Imran Qureshi', role:'Rider',              dept:'Logistics',  email:'imran@inventoryos.pk',  phone:'0345-1112233', tasks:19, completed:17, orders:94,  errors:3,  score:89, status:'Active',    joined:'15 Feb 2026', lastActive:'5 min ago',  avatar:'IQ', color:'#DC2626' },
  { id:12, name:'Nadia Malik',   role:'Sales Operator',     dept:'Sales',      email:'nadia@inventoryos.pk',  phone:'0312-2223344', tasks:40, completed:30, orders:156, errors:12, score:75, status:'Offline',   joined:'20 Feb 2026', lastActive:'3 days ago', avatar:'NM', color:'#9333EA' },
  { id:13, name:'Usman Ghani',   role:'Accounts',           dept:'Finance',    email:'usman@inventoryos.pk',  phone:'0321-3334455', tasks:25, completed:20, orders:0,   errors:4,  score:80, status:'Offline',   joined:'01 Mar 2026', lastActive:'1 day ago',  avatar:'UG', color:'#0369A1' },
  { id:14, name:'Rabia Tanvir',  role:'Sales Operator',     dept:'Sales',      email:'rabia@inventoryos.pk',  phone:'0300-4445566', tasks:35, completed:24, orders:143, errors:9,  score:68, status:'Suspended', joined:'15 Mar 2026', lastActive:'1 week ago', avatar:'RT', color:'#6B7280' },
];

// ── Roles ──────────────────────────────────────────────────

export const ROLES_DATA: Role[] = [
  { name:'Administrator',    members:1, level:'Full',    color:'#FF6A00', desc:'Complete system access and configuration.' },
  { name:'Ops Manager',      members:1, level:'High',    color:'#8B5CF6', desc:'Oversight of operations, reports, and staff.' },
  { name:'Inventory Manager',members:2, level:'Medium',  color:'#2563EB', desc:'Product and stock management.' },
  { name:'Sales Operator',   members:5, level:'Limited', color:'#EC4899', desc:'Order entry and customer management.' },
  { name:'Accounts',         members:2, level:'Limited', color:'#059669', desc:'Financial tracking and supplier payments.' },
  { name:'Courier Handler',  members:1, level:'Limited', color:'#7C3AED', desc:'Courier assignment and shipment tracking.' },
  { name:'Rider',            members:2, level:'Minimal', color:'#16A34A', desc:'View and update own delivery assignments.' },
];

// ── Permissions Matrix ─────────────────────────────────────

export const MATRIX_MODULES: MatrixModule[] = [
  { mod:'Dashboard',  perms:[true, true, true, true, true, true, false] },
  { mod:'Products',   perms:[true, true, true, false,false,false,false] },
  { mod:'Orders',     perms:[true, true, false,true, true, true, true]  },
  { mod:'Inventory',  perms:[true, true, true, false,false,false,false] },
  { mod:'Customers',  perms:[true, true, false,true, false,false,false] },
  { mod:'Couriers',   perms:[true, true, false,false,false,true, false] },
  { mod:'Riders',     perms:[true, true, false,false,false,false,true]  },
  { mod:'Finance',    perms:[true, false,false,false,true, false,false] },
  { mod:'Tasks',      perms:[true, true, true, true, true, true, true]  },
  { mod:'Staff',      perms:[true, true, false,false,false,false,false] },
  { mod:'Reports',    perms:[true, true, false,false,true, false,false] },
  { mod:'Settings',   perms:[true, false,false,false,false,false,false] },
];

export const MODULE_PERMS: Record<string, Record<string, boolean>> = {
  'Administrator':    { Dashboard:true, Products:true, Orders:true, Inventory:true, Customers:true, Couriers:true, Riders:true, Finance:true, Tasks:true, Staff:true, Reports:true, Settings:true },
  'Ops Manager':      { Dashboard:true, Products:true, Orders:true, Inventory:true, Customers:true, Couriers:true, Riders:true, Finance:false,Tasks:true, Staff:true, Reports:true, Settings:false },
  'Inventory Manager':{ Dashboard:true, Products:true, Orders:false,Inventory:true, Customers:false,Couriers:false,Riders:false,Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
  'Sales Operator':   { Dashboard:true, Products:false,Orders:true, Inventory:false,Customers:true, Couriers:false,Riders:false,Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
  'Accounts':         { Dashboard:true, Products:false,Orders:true, Inventory:false,Customers:false,Couriers:false,Riders:false,Finance:true, Tasks:true, Staff:false,Reports:true, Settings:false },
  'Courier Handler':  { Dashboard:true, Products:false,Orders:true, Inventory:false,Customers:false,Couriers:true, Riders:false,Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
  'Rider':            { Dashboard:false,Products:false,Orders:true, Inventory:false,Customers:false,Couriers:false,Riders:true, Finance:false,Tasks:true, Staff:false,Reports:false,Settings:false },
};

// ── Activity Log ───────────────────────────────────────────

export const ACTIVITY_LOG: ActivityEntry[] = [
  { time:'11 May 09:12', staff:'Admin Khan',    action:'Logged in to system',                    module:'System',    detail:'IP: 192.168.1.1',              severity:'Info'     },
  { time:'11 May 09:45', staff:'Sara Khan',     action:'Updated order ORD-1052 to Packed',       module:'Orders',    detail:'Order ID: ORD-1052',            severity:'Info'     },
  { time:'11 May 10:03', staff:'Bilal Raza',    action:'Added 30 units for SKU-0041',            module:'Inventory', detail:'Stock: 3 → 33',                 severity:'Info'     },
  { time:'11 May 10:20', staff:'Amna Siddiqui', action:'Created new customer profile',           module:'Customers', detail:'Customer: Aisha Bhatti',        severity:'Info'     },
  { time:'11 May 10:44', staff:'Fatima Noor',   action:'Recorded COD collection',                module:'Finance',   detail:'Amount: ₨5,400',               severity:'Info'     },
  { time:'11 May 11:00', staff:'Sara Khan',     action:'Exported sales report',                  module:'Reports',   detail:'Format: CSV',                   severity:'Info'     },
  { time:'11 May 11:15', staff:'Hassan Ali',    action:'Assigned courier to ORD-1048',           module:'Couriers',  detail:'Courier: TCS Express',          severity:'Info'     },
  { time:'11 May 11:30', staff:'Admin Khan',    action:'Changed role for Rabia Tanvir',          module:'Staff',     detail:'Old: Sales Op → New: Suspended',severity:'Warning'  },
  { time:'11 May 12:00', staff:'Omar Farooq',   action:'Marked delivery as Delivered',           module:'Riders',    detail:'Order: ORD-1044',               severity:'Info'     },
  { time:'11 May 12:15', staff:'Tariq Mehmood', action:'Failed login attempt',                   module:'System',    detail:'IP: 203.55.11.4',               severity:'Critical' },
  { time:'11 May 12:30', staff:'Nadia Malik',   action:'Cancelled order ORD-1046',              module:'Orders',    detail:'Reason: Customer request',       severity:'Warning'  },
  { time:'11 May 13:00', staff:'Admin Khan',    action:'Modified product pricing for SKU-0183', module:'Products',  detail:'Price: ₨7,200 → ₨7,500',       severity:'Info'     },
  { time:'11 May 13:20', staff:'Usman Ghani',   action:'Logged expense entry',                   module:'Finance',   detail:'Category: Operations, ₨2,200', severity:'Info'     },
  { time:'11 May 14:00', staff:'Sara Khan',     action:'Created 5 new orders (batch)',           module:'Orders',    detail:'ORD-1053 to ORD-1057',          severity:'Info'     },
  { time:'11 May 14:30', staff:'Bilal Raza',    action:'Triggered low-stock alert override',     module:'Inventory', detail:'SKU-0028 threshold changed',     severity:'Warning'  },
  { time:'11 May 15:00', staff:'Admin Khan',    action:'Settings updated: Email notifications ON',module:'Settings', detail:'Changed by Admin Khan',          severity:'Info'     },
  { time:'11 May 15:20', staff:'Imran Qureshi', action:'Updated delivery status to In Transit',  module:'Riders',    detail:'Order: ORD-1050',               severity:'Info'     },
  { time:'11 May 15:45', staff:'Fatima Noor',   action:'Supplier payment recorded',              module:'Finance',   detail:'Supplier: Gul Ahmed, ₨45,000', severity:'Info'     },
  { time:'11 May 16:00', staff:'Zara Hussain',  action:'Edited customer address',                module:'Customers', detail:'Customer: Sara Bano',           severity:'Info'     },
  { time:'11 May 16:30', staff:'Admin Khan',    action:'Database backup triggered manually',     module:'Security',  detail:'Backup size: 4.2MB',            severity:'Info'     },
];

// ── Department Performance ─────────────────────────────────

export const DEPT_PERFORMANCE = [
  { dept:'Operations', score:94 },
  { dept:'Sales',      score:80 },
  { dept:'Inventory',  score:88 },
  { dept:'Finance',    score:86 },
  { dept:'Logistics',  score:91 },
  { dept:'Management', score:98 },
];

// ── Integrations ───────────────────────────────────────────

export const INTEGRATIONS: IntegrationConfig[] = [
  { id:'slack',    name:'Slack',             sub:'Team messaging & notifications',  desc:'Send automatic staff notifications for new task assignments, overdue tasks, and performance alerts directly to Slack channels.',                      imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/120px-Slack_icon_2019.svg.png',       fallbackBg:'#4A154B', fallbackChar:'S',  iconClass:'fa-brands fa-slack',        connected:false },
  { id:'whatsapp', name:'WhatsApp Business',  sub:'Staff alerts via WhatsApp',       desc:'Notify staff of task assignments and urgent alerts through WhatsApp Business API. Currently active and sending notifications.',                       imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png',                         fallbackBg:'#25D366', fallbackChar:'W',  iconClass:'fa-brands fa-whatsapp',     connected:true  },
  { id:'google',   name:'Google Workspace',   sub:'Calendar, Gmail, Drive sync',     desc:'Sync staff schedules with Google Calendar, send task email reminders via Gmail, and share reports on Drive automatically.',                           imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png',  fallbackBg:'#4285F4', fallbackChar:'G',  iconClass:'fa-brands fa-google',       connected:false },
  { id:'shopify',  name:'Shopify',            sub:'E-commerce staff sync',           desc:'Assign staff roles to handle Shopify-synced orders. Staff will be automatically assigned tasks when new Shopify orders arrive.',                      imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/120px-Shopify_logo_2018.svg.png',      fallbackBg:'#96BF48', fallbackChar:'SH', iconClass:'fa-solid fa-store',         connected:false },
  { id:'zoom',     name:'Zoom',               sub:'Team meetings & standups',        desc:'Schedule and launch team meetings directly from the staff dashboard. Automatic standup reminders for daily team syncs.',                               imgUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Zoom_Logo_2022.svg/120px-Zoom_Logo_2022.svg.png',             fallbackBg:'#2D8CFF', fallbackChar:'Z',  iconClass:'fa-solid fa-video',         connected:false },
  { id:'trello',   name:'Trello',             sub:'Visual task board sync',          desc:'Sync tasks assigned in this system to Trello boards. Cards are automatically created and moved as task status changes.',                               imgUrl:'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/120px-Trello_logo.svg.png',                         fallbackBg:'#0052CC', fallbackChar:'T',  iconClass:'fa-solid fa-table-columns', connected:false },
];

// ── Notification Settings ──────────────────────────────────

export const NOTIF_TRIGGERS = [
  { label: 'New task assigned to staff member', checked: true  },
  { label: 'Task overdue (past due date)',       checked: true  },
  { label: 'Task marked as completed',           checked: false },
  { label: 'New staff member added',             checked: true  },
  { label: 'Staff login from new device',        checked: false },
  { label: 'Role or permission changed',         checked: true  },
];

export const NOTIF_CHANNELS = [
  { label: 'In-app dashboard notification', checked: true  },
  { label: 'WhatsApp (if connected)',        checked: true  },
  { label: 'Slack (if connected)',           checked: false },
  { label: 'Email (Google Workspace)',       checked: false },
  { label: 'Weekly performance digest',     checked: false },
];

// ── Panel Static Data ──────────────────────────────────────

export const PANEL_TASKS = [
  { title: 'Review low-stock items',     due: 'Today',   status: 'In Progress', priority: 'High'   },
  { title: 'Process pending returns',    due: 'Today',   status: 'Done',        priority: 'Normal' },
  { title: 'Update supplier payments',   due: '11 May',  status: 'Pending',     priority: 'High'   },
  { title: 'Prepare daily sales report', due: '11 May',  status: 'Done',        priority: 'Normal' },
  { title: 'Follow up on overdue COD',   due: '12 May',  status: 'Pending',     priority: 'High'   },
];

export const PANEL_ACTIVITY = [
  { action: 'Logged in',                      module: 'System',    time: 'Today 09:12'     },
  { action: 'Updated order status to Packed',  module: 'Orders',    time: 'Today 09:45'     },
  { action: 'Added stock for SKU-0041',        module: 'Inventory', time: 'Today 10:20'     },
  { action: 'Marked task as complete',         module: 'Tasks',     time: 'Today 11:00'     },
  { action: 'Exported sales report',           module: 'Reports',   time: 'Yesterday 16:30' },
];