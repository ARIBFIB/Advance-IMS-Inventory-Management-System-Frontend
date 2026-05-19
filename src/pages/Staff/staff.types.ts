// ═══════════════════════════════════════════════════════════
// TYPES — staff.types.ts
// ═══════════════════════════════════════════════════════════

export type StaffTab     = 'members' | 'roles' | 'performance' | 'activity' | 'integrations';
export type StaffStatus  = 'Active' | 'Offline' | 'Suspended';
export type StaffFilter  = 'all' | 'active' | 'offline' | 'suspended';
export type AccessLevel  = 'Full' | 'High' | 'Medium' | 'Limited' | 'Minimal';
export type Severity     = 'Info' | 'Warning' | 'Critical';
export type PerfPeriod   = 'month' | 'week' | 'all';
export type StaffPanelTab = 'profile' | 'permissions' | 'tasks' | 'activity';

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  dept: string;
  email: string;
  phone: string;
  tasks: number;
  completed: number;
  orders: number;
  errors: number;
  score: number;
  status: StaffStatus;
  joined: string;
  lastActive: string;
  avatar: string;
  color: string;
}

export interface Role {
  name: string;
  members: number;
  level: AccessLevel;
  color: string;
  desc: string;
}

export interface ActivityEntry {
  time: string;
  staff: string;
  action: string;
  module: string;
  detail: string;
  severity: Severity;
}

export interface MatrixModule {
  mod: string;
  perms: boolean[];
}

export interface IntegrationConfig {
  id: string;
  name: string;
  sub: string;
  desc: string;
  imgUrl: string;
  fallbackBg: string;
  fallbackChar: string;
  iconClass: string;
  connected: boolean;
}