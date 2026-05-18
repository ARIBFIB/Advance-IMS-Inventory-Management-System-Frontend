export type TaskStatus = 'Pending' | 'In Progress' | 'Done' | 'Cancelled';
export type TaskPriority = 'Low' | 'Normal' | 'High' | 'Critical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}