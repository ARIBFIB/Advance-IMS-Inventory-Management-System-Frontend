// ═══════════════════════════════════════════════════════════
// TASKS — SHARED CONSTANTS / STATIC DATA
// ═══════════════════════════════════════════════════════════

import { Task, StaffMember } from './types';

export const STAFF_LIST: StaffMember[] = [
  { name: 'Usman Ahmed',  role: 'Rider',              color: '#FF6A00' },
  { name: 'Sara Khan',    role: 'Inventory Manager',  color: '#16A34A' },
  { name: 'Bilal Raza',   role: 'Sales Operator',     color: '#2563EB' },
  { name: 'Nadia Malik',  role: 'Accounts',           color: '#7C3AED' },
  { name: 'Hamza Iqbal',  role: 'Operations',         color: '#D97706' },
  { name: 'Tariq Saleem', role: 'Rider',              color: '#DC2626' },
  { name: 'Asad Khan',    role: 'Courier Handler',    color: '#0284C7' },
];

export const CATEGORIES: string[] = [
  'Inventory', 'Operations', 'Logistics', 'Finance',
  'Customer Support', 'Packing', 'Rider / Delivery', 'Other',
];

export const WEEKLY_DAYS = [
  { label: 'Mon 6',  day: 6  },
  { label: 'Tue 7',  day: 7  },
  { label: 'Wed 8',  day: 8  },
  { label: 'Thu 9',  day: 9  },
  { label: 'Fri 10', day: 10 },
  { label: 'Sat 11', day: 11 },
  { label: 'Sun 12', day: 12 },
];

export const INITIAL_TASKS: Task[] = [
  { id: 'TSK-001', title: 'Restock warehouse shelves — Section B',           category: 'Inventory',        assignee: 'Sara Khan',    assignedBy: 'Admin Khan',         due: '11 May, 17:00', priority: 'High',   status: 'In Progress', progress: 60,  linked: '—'                },
  { id: 'TSK-002', title: 'Prepare COD submission report for accounts',       category: 'Finance',          assignee: 'Nadia Malik',  assignedBy: 'Admin Khan',         due: '11 May, 14:00', priority: 'High',   status: 'Done',        progress: 100, linked: '—'                },
  { id: 'TSK-003', title: 'Pack and dispatch ORD-1045, ORD-1043',            category: 'Packing',          assignee: 'Bilal Raza',   assignedBy: 'Operations Manager', due: '11 May, 12:00', priority: 'High',   status: 'Done',        progress: 100, linked: 'ORD-1045'         },
  { id: 'TSK-004', title: 'Call supplier Al-Karam re: overdue invoice',       category: 'Finance',          assignee: 'Nadia Malik',  assignedBy: 'Admin Khan',         due: '10 May, 18:00', priority: 'High',   status: 'Overdue',     progress: 0,   linked: 'Al-Karam Textile' },
  { id: 'TSK-005', title: 'Update stock count after new Gul Ahmed delivery',  category: 'Inventory',        assignee: 'Sara Khan',    assignedBy: 'Admin Khan',         due: '11 May, 11:00', priority: 'Medium', status: 'Done',        progress: 100, linked: 'Gul Ahmed'        },
  { id: 'TSK-006', title: 'Assign 6 pending orders to riders for afternoon',  category: 'Logistics',        assignee: 'Hamza Iqbal',  assignedBy: 'Operations Manager', due: '11 May, 13:00', priority: 'High',   status: 'Done',        progress: 100, linked: '—'                },
  { id: 'TSK-007', title: 'Review and approve 3 return requests',             category: 'Operations',       assignee: 'Hamza Iqbal',  assignedBy: 'Admin Khan',         due: '11 May, 16:00', priority: 'Medium', status: 'In Progress', progress: 33,  linked: '—'                },
  { id: 'TSK-008', title: 'Post evening WhatsApp product story',              category: 'Operations',       assignee: 'Bilal Raza',   assignedBy: 'Admin Khan',         due: '11 May, 20:00', priority: 'Low',    status: 'Pending',     progress: 0,   linked: '—'                },
  { id: 'TSK-009', title: 'Reconcile prepaid Shopify orders for May Week 2',  category: 'Finance',          assignee: 'Nadia Malik',  assignedBy: 'Admin Khan',         due: '09 May, 18:00', priority: 'High',   status: 'Overdue',     progress: 20,  linked: '—'                },
  { id: 'TSK-010', title: 'Daily rider debrief and COD collection',           category: 'Rider / Delivery', assignee: 'Tariq Saleem', assignedBy: 'Operations Manager', due: '11 May, 19:00', priority: 'Medium', status: 'In Progress', progress: 50,  linked: '—'                },
  { id: 'TSK-011', title: 'Scan and log 4 courier delivery confirmations',    category: 'Logistics',        assignee: 'Asad Khan',    assignedBy: 'Admin Khan',         due: '09 May, 17:00', priority: 'Medium', status: 'Overdue',     progress: 0,   linked: '—'                },
  { id: 'TSK-012', title: 'Prepare weekly inventory variance report',         category: 'Inventory',        assignee: 'Sara Khan',    assignedBy: 'Operations Manager', due: '12 May, 10:00', priority: 'Medium', status: 'Pending',     progress: 0,   linked: '—'                },
  { id: 'TSK-013', title: 'Fix wrong product image on Shopify listing',       category: 'Operations',       assignee: 'Bilal Raza',   assignedBy: 'Admin Khan',         due: '12 May, 14:00', priority: 'Low',    status: 'Pending',     progress: 0,   linked: '—'                },
  { id: 'TSK-014', title: 'Update rider delivery zones for next week',        category: 'Rider / Delivery', assignee: 'Usman Ahmed',  assignedBy: 'Operations Manager', due: '12 May, 09:00', priority: 'Low',    status: 'Pending',     progress: 0,   linked: '—'                },
  { id: 'TSK-015', title: 'Confirm new Nishat Textiles order with supplier',  category: 'Inventory',        assignee: 'Sara Khan',    assignedBy: 'Admin Khan',         due: '11 May, 10:00', priority: 'High',   status: 'Done',        progress: 100, linked: 'Nishat Textiles'  },
];