export type StaffRole = 'Administrator' | 'Sales Op' | 'Inventory Manager' | 'Finance Manager' | 'Rider Manager';
export type StaffStatus = 'Active' | 'Inactive';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  joinedAt: string;
  lastLogin?: string;
}