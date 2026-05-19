// ═══════════════════════════════════════════════════════════
// TASKS — SHARED TYPES
// ═══════════════════════════════════════════════════════════

export type TaskStatus   = 'Pending' | 'In Progress' | 'Done' | 'Overdue';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type ActiveTab    = 'all' | 'kanban' | 'bystaff' | 'calendar' | 'add';

export interface Task {
  id: string;
  title: string;
  category: string;
  assignee: string;
  assignedBy: string;
  due: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  linked: string;
}

export interface StaffMember {
  name: string;
  role: string;
  color: string;
}