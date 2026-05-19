// ═══════════════════════════════════════════════════════════
// TASKS — SHARED HELPERS
// ═══════════════════════════════════════════════════════════

import { Task, TaskStatus } from './types';
import { STAFF_LIST } from './constants';

export const initials = (name: string): string =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export const getStaffColor = (name: string): string => {
  const s = STAFF_LIST.find(x => x.name === name);
  return s ? s.color : '#FF6A00';
};

export const getStaffRole = (name: string): string => {
  const s = STAFF_LIST.find(x => x.name === name);
  return s ? s.role : 'Staff';
};

export function badgeClass(s: string): string {
  const m: Record<string, string> = {
    'Done':        'green',
    'In Progress': 'blue',
    'Pending':     'gray',
    'Overdue':     'red',
    'High':        'red',
    'Medium':      'yellow',
    'Low':         'green',
  };
  return m[s] || 'gray';
}

export const progressColor = (status: TaskStatus): string => {
  if (status === 'Done')    return 'var(--green)';
  if (status === 'Overdue') return 'var(--red)';
  return 'var(--accent)';
};

export const getTasksForDay = (tasks: Task[], day: number): Task[] =>
  tasks.filter(t => t.due.includes(`${day} May`));