import React, { useState, useCallback } from 'react';
import './AuditPage.css';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type AuditTab =
  | 'all'
  | 'security'
  | 'data'
  | 'access'
  | 'exports'
  | 'analytics'
  | 'settings';

type Severity = 'Critical' | 'Warning' | 'Info';
type ChangeType = 'Create' | 'Update' | 'Delete' | 'Bulk Import' | 'Stock Adjustment';
type AccessResult = 'Success' | 'Warning' | 'Blocked' | 'Completed' | 'Flagged' | 'Allowed' | 'Noted';

interface AuditLog {
  id: string;
  ts: string;
  staff: string;
  action: string;
  module: string;
  detail: string;
  ip: string;
  device: string;
  severity: Severity;
}

interface SecurityEvent {
  ts: string;
  event: string;
  user: string;
  ip: string;
  device: string;
  location: string;
  severity: Severity;
  outcome: AccessResult;
}

interface DataChange {
  ts: string;
  staff: string;
  module: string;
  type: ChangeType;
  record: string;
  field: string;
  oldVal: string;
  newVal: string;
}

interface AccessLog {
  ts: string;
  user: string;
  role: string;
  event: string;
  ip: string;
  device: string;
  location: string;
  result: AccessResult;
}

interface ExportLog {
  ts: string;
  by: string;
  type: string;
  range: string;
  records: string;
  format: string;
  size: string;
  sensitive: boolean;
  status: AccessResult;
}

interface ActiveSession {
  user: string;
  role: string;
  color: string;
  ip: string;
  device: string;
  since: string;
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const STAFF_COLORS: Record<string, string> = {
  'Admin Khan': '#FF6A00', 'Sara Khan': '#8B5CF6', 'Bilal Raza': '#2563EB',
  'Amna Siddiqui': '#EC4899', 'Tariq Mehmood': '#0891B2', 'Fatima Noor': '#059669',
  'Hassan Ali': '#7C3AED', 'Omar Farooq': '#16A34A', 'System': '#6B7280',
  'Imran Qureshi': '#DC2626', 'Nadia Malik': '#D97706', 'Usman Ghani': '#0369A1',
  'Unknown': '#DC2626', 'Zara Hussain': '#DB2777',
};

const MODULE_ICONS: Record<string, string> = {
  Orders: 'fa-bag-shopping', Products: 'fa-box-open', Inventory: 'fa-warehouse',
  Finance: 'fa-coins', Customers: 'fa-users', Couriers: 'fa-truck',
  Riders: 'fa-person-biking', Staff: 'fa-id-badge', Reports: 'fa-chart-pie',
  Settings: 'fa-gear', System: 'fa-server', Security: 'fa-shield-halved',
};

const ALL_LOGS_DATA: AuditLog[] = [
  { id: 'EVT-00348', ts: '11 May 2026 16:30', staff: 'Admin Khan',    action: 'Database backup triggered manually',         module: 'System',    detail: 'Backup size: 4.2MB. Destination: Local Server.',                                    ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11',  severity: 'Info'     },
  { id: 'EVT-00347', ts: '11 May 2026 16:00', staff: 'Zara Hussain',  action: 'Edited customer delivery address',           module: 'Customers', detail: 'Customer: Sara Bano · ORD-1051 address updated.',                                    ip: '192.168.1.22', device: 'Chrome 124 / Android',     severity: 'Info'     },
  { id: 'EVT-00346', ts: '11 May 2026 15:45', staff: 'Fatima Noor',   action: 'Supplier payment recorded',                  module: 'Finance',   detail: 'Supplier: Gul Ahmed · Amount: ₨45,000 via Bank Transfer.',                         ip: '192.168.1.12', device: 'Firefox 126 / Windows 10', severity: 'Info'     },
  { id: 'EVT-00345', ts: '11 May 2026 15:20', staff: 'Imran Qureshi', action: 'Updated delivery status to In Transit',      module: 'Riders',    detail: 'Order ORD-1050 · Tracking updated from Pending to In Transit.',                     ip: '10.0.0.22',    device: 'Chrome 124 / Android',     severity: 'Info'     },
  { id: 'EVT-00344', ts: '11 May 2026 15:00', staff: 'Admin Khan',    action: 'Email notification settings updated',        module: 'Settings',  detail: 'Setting changed: Email notifications for Orders → Enabled.',                        ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11',  severity: 'Warning'  },
  { id: 'EVT-00343', ts: '11 May 2026 14:30', staff: 'Bilal Raza',    action: 'Low stock threshold overridden',             module: 'Inventory', detail: 'SKU-0028 threshold changed from 10 → 5. Reason: Seasonal adjustment.',               ip: '10.0.0.14',    device: 'Safari 17 / iPhone 15',    severity: 'Warning'  },
  { id: 'EVT-00342', ts: '11 May 2026 14:00', staff: 'Sara Khan',     action: 'Created 5 new orders (batch entry)',         module: 'Orders',    detail: 'Orders ORD-1053 to ORD-1057 created in batch from WhatsApp.',                       ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10',  severity: 'Info'     },
  { id: 'EVT-00341', ts: '11 May 2026 13:20', staff: 'Usman Ghani',   action: 'Expense entry logged',                       module: 'Finance',   detail: 'Category: Operations · Amount: ₨2,200 · Ref: Packaging supplies.',                 ip: '192.168.1.18', device: 'Firefox 126 / Windows 10', severity: 'Info'     },
  { id: 'EVT-00340', ts: '11 May 2026 13:00', staff: 'Admin Khan',    action: 'Product pricing modified',                  module: 'Products',  detail: 'SKU-0183 (Chiffon Saree Pink) · Price changed: ₨7,200 → ₨7,500.',               ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11',  severity: 'Warning'  },
  { id: 'EVT-00339', ts: '11 May 2026 12:30', staff: 'Nadia Malik',   action: 'Order ORD-1046 cancelled',                  module: 'Orders',    detail: 'Reason: Customer request. COD refund initiated.',                                   ip: '192.168.1.20', device: 'Chrome 124 / Windows 10',  severity: 'Warning'  },
  { id: 'EVT-00338', ts: '11 May 2026 12:15', staff: 'Tariq Mehmood', action: 'Failed login attempt',                      module: 'Security',  detail: '5th consecutive failed login from IP 203.55.41.12. IP auto-blocked.',               ip: '203.55.41.12', device: 'Unknown',                  severity: 'Critical' },
  { id: 'EVT-00337', ts: '11 May 2026 12:00', staff: 'Omar Farooq',   action: 'Delivery confirmed as Delivered',           module: 'Riders',    detail: 'Order ORD-1044 · Customer: Rabia Ahmed · COD collected: ₨2,200.',                 ip: '10.0.0.35',    device: 'Samsung Internet / Android',severity: 'Info'     },
  { id: 'EVT-00336', ts: '11 May 2026 11:30', staff: 'Admin Khan',    action: 'Role changed for Rabia Tanvir',             module: 'Staff',     detail: 'Role: Sales Operator → Status: Suspended. Reason logged by Admin.',                 ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11',  severity: 'Warning'  },
  { id: 'EVT-00335', ts: '11 May 2026 11:00', staff: 'Sara Khan',     action: 'Sales report exported',                     module: 'Reports',   detail: 'May 2026 Sales Data · Format: CSV · 312 records.',                                  ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10',  severity: 'Info'     },
  { id: 'EVT-00334', ts: '11 May 2026 10:44', staff: 'Fatima Noor',   action: 'COD collection recorded',                   module: 'Finance',   detail: 'Order ORD-1052 · Rider: Usman Ahmed · Amount: ₨5,400.',                           ip: '192.168.1.12', device: 'Firefox 126 / Windows 10', severity: 'Info'     },
  { id: 'EVT-00333', ts: '11 May 2026 10:20', staff: 'Amna Siddiqui', action: 'New customer profile created',              module: 'Customers', detail: 'Customer: Aisha Bhatti · Phone: 0300-1122334 · Lahore.',                            ip: '192.168.1.22', device: 'Chrome 124 / Android',     severity: 'Info'     },
  { id: 'EVT-00332', ts: '11 May 2026 10:03', staff: 'Bilal Raza',    action: 'Stock added for SKU-0041',                  module: 'Inventory', detail: 'SKU-0041 (Classic Lawn Suit) · Qty: +30 · Reason: Supplier restock.',              ip: '10.0.0.14',    device: 'Safari 17 / iPhone 15',    severity: 'Info'     },
  { id: 'EVT-00331', ts: '11 May 2026 10:00', staff: 'Unknown',       action: 'Failed login attempt (x3)',                 module: 'Security',  detail: '3 failed attempts in 10 minutes from IP 203.55.41.12.',                             ip: '203.55.41.12', device: 'Unknown',                  severity: 'Critical' },
  { id: 'EVT-00330', ts: '11 May 2026 09:45', staff: 'Sara Khan',     action: 'Order ORD-1052 status updated to Packed',  module: 'Orders',    detail: 'Order status changed: Confirmed → Packed by Sara Khan.',                           ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10',  severity: 'Info'     },
  { id: 'EVT-00329', ts: '11 May 2026 09:30', staff: 'Sara Khan',     action: 'Password changed',                          module: 'Security',  detail: 'Password updated by user via profile settings.',                                    ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10',  severity: 'Warning'  },
  { id: 'EVT-00328', ts: '11 May 2026 09:15', staff: 'Bilal Raza',    action: 'Logged in successfully',                    module: 'System',    detail: 'Login from new device: Safari 17 / iPhone 15.',                                    ip: '10.0.0.14',    device: 'Safari 17 / iPhone 15',    severity: 'Warning'  },
  { id: 'EVT-00327', ts: '11 May 2026 09:10', staff: 'Sara Khan',     action: 'Logged in successfully',                    module: 'System',    detail: 'Regular login from known device.',                                                  ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10',  severity: 'Info'     },
  { id: 'EVT-00326', ts: '11 May 2026 09:02', staff: 'Admin Khan',    action: 'Logged in successfully',                    module: 'System',    detail: 'Regular login from known device.',                                                  ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11',  severity: 'Info'     },
  { id: 'EVT-00325', ts: '11 May 2026 09:00', staff: 'System',        action: 'Scheduled backup completed',                module: 'System',    detail: 'Daily backup successful. Size: 4.2MB. Duration: 12s.',                              ip: '127.0.0.1',    device: 'System Process',           severity: 'Info'     },
  { id: 'EVT-00324', ts: '10 May 2026 18:00', staff: 'Bilal Raza',    action: 'Logged in successfully',                    module: 'System',    detail: 'Regular login from known IP.',                                                      ip: '192.168.1.8',  device: 'Safari 17 / iPhone 15',    severity: 'Info'     },
  { id: 'EVT-00323', ts: '10 May 2026 17:30', staff: 'System',        action: 'IP address blocked',                        module: 'Security',  detail: 'IP 203.55.41.12 blocked after 5 failed login attempts.',                           ip: '127.0.0.1',    device: 'System Process',           severity: 'Critical' },
  { id: 'EVT-00322', ts: '10 May 2026 17:00', staff: 'Fatima Noor',   action: 'Financial report exported',                 module: 'Reports',   detail: 'April 2026 Financial Records · Format: Excel · 892 records.',                      ip: '192.168.1.12', device: 'Firefox 126 / Windows 10', severity: 'Info'     },
  { id: 'EVT-00321', ts: '10 May 2026 16:30', staff: 'Amna Siddiqui', action: 'Bulk order import completed',               module: 'Orders',    detail: '12 orders imported from Shopify sync. 0 errors.',                                   ip: '192.168.1.22', device: 'Chrome 124 / Android',     severity: 'Info'     },
  { id: 'EVT-00320', ts: '10 May 2026 15:00', staff: 'Admin Khan',    action: 'Courier API key updated for Trax',          module: 'Settings',  detail: 'Trax courier API credentials updated. New key tested successfully.',               ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11',  severity: 'Warning'  },
  { id: 'EVT-00319', ts: '10 May 2026 14:20', staff: 'Sara Khan',     action: 'Stock adjustment — damage write-off',       module: 'Inventory', detail: 'SKU-0055 (Printed Lawn 3PC) · -1 unit · Reason: Damage.',                        ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10',  severity: 'Warning'  },
];

const SECURITY_DATA: SecurityEvent[] = [
  { ts: '11 May 2026 12:15', event: 'IP Auto-Blocked',      user: 'System',        ip: '203.55.41.12',   device: 'System Process',     location: 'Unknown',        severity: 'Critical', outcome: 'Blocked'   },
  { ts: '11 May 2026 12:00', event: '5x Failed Login',      user: 'Unknown',       ip: '203.55.41.12',   device: 'Unknown Browser',    location: 'Unknown',        severity: 'Critical', outcome: 'Blocked'   },
  { ts: '11 May 2026 10:00', event: '3x Failed Login',      user: 'Unknown',       ip: '203.55.41.12',   device: 'Unknown Browser',    location: 'Unknown',        severity: 'Critical', outcome: 'Flagged'   },
  { ts: '11 May 2026 11:30', event: 'Role Changed',         user: 'Admin Khan',    ip: '192.168.1.5',    device: 'Chrome / Windows',   location: 'Lahore, PK',     severity: 'Warning',  outcome: 'Completed' },
  { ts: '11 May 2026 09:30', event: 'Password Changed',     user: 'Sara Khan',     ip: '192.168.1.8',    device: 'Chrome / Windows',   location: 'Lahore, PK',     severity: 'Warning',  outcome: 'Completed' },
  { ts: '11 May 2026 09:15', event: 'Login — New Device',   user: 'Bilal Raza',    ip: '10.0.0.14',      device: 'Safari / iPhone 15', location: 'Lahore, PK',     severity: 'Warning',  outcome: 'Allowed'   },
  { ts: '10 May 2026 17:30', event: 'IP Auto-Blocked',      user: 'System',        ip: '185.220.101.33', device: 'System Process',     location: 'Unknown (VPN)',  severity: 'Critical', outcome: 'Blocked'   },
  { ts: '10 May 2026 15:00', event: 'API Key Updated',      user: 'Admin Khan',    ip: '192.168.1.5',    device: 'Chrome / Windows',   location: 'Lahore, PK',     severity: 'Warning',  outcome: 'Completed' },
  { ts: '09 May 2026 16:30', event: 'Failed Login',         user: 'Unknown',       ip: '185.220.101.33', device: 'Tor Browser',        location: 'Unknown (VPN)',  severity: 'Critical', outcome: 'Blocked'   },
  { ts: '09 May 2026 11:00', event: '2FA Setup Skipped',    user: 'Tariq Mehmood', ip: '10.0.0.22',      device: 'Chrome / Android',   location: 'Lahore, PK',     severity: 'Warning',  outcome: 'Noted'     },
];

const DATA_CHANGES: DataChange[] = [
  { ts: '11 May 2026 16:00', staff: 'Zara Hussain',  module: 'Customers', type: 'Update',           record: 'Cust-03214',          field: 'Delivery Address',  oldVal: 'House 12, Gulberg III',  newVal: 'House 14, Gulberg III'    },
  { ts: '11 May 2026 15:00', staff: 'Admin Khan',    module: 'Settings',  type: 'Update',           record: 'System Config',       field: 'Email Notifications',oldVal: 'Disabled',              newVal: 'Enabled'                  },
  { ts: '11 May 2026 14:30', staff: 'Bilal Raza',    module: 'Inventory', type: 'Update',           record: 'SKU-0028',            field: 'Low Stock Threshold',oldVal: '10',                   newVal: '5'                        },
  { ts: '11 May 2026 14:00', staff: 'Sara Khan',     module: 'Orders',    type: 'Create',           record: 'ORD-1053 to ORD-1057',field: '—',                  oldVal: '—',                     newVal: '5 orders created'         },
  { ts: '11 May 2026 13:00', staff: 'Admin Khan',    module: 'Products',  type: 'Update',           record: 'SKU-0183',            field: 'Sale Price',         oldVal: '₨7,200',               newVal: '₨7,500'                  },
  { ts: '11 May 2026 12:30', staff: 'Nadia Malik',   module: 'Orders',    type: 'Update',           record: 'ORD-1046',            field: 'Status',             oldVal: 'Shipped',               newVal: 'Cancelled'                },
  { ts: '11 May 2026 10:03', staff: 'Bilal Raza',    module: 'Inventory', type: 'Stock Adjustment', record: 'SKU-0041',            field: 'Quantity',           oldVal: '3',                     newVal: '33'                       },
  { ts: '11 May 2026 09:45', staff: 'Sara Khan',     module: 'Orders',    type: 'Update',           record: 'ORD-1052',            field: 'Status',             oldVal: 'Confirmed',             newVal: 'Packed'                   },
  { ts: '10 May 2026 19:20', staff: 'Admin Khan',    module: 'Staff',     type: 'Update',           record: 'Rabia Tanvir',        field: 'Account Status',     oldVal: 'Active',                newVal: 'Suspended'                },
  { ts: '10 May 2026 17:00', staff: 'Sara Khan',     module: 'Inventory', type: 'Stock Adjustment', record: 'SKU-0055',            field: 'Quantity',           oldVal: '29',                    newVal: '28'                       },
  { ts: '10 May 2026 16:30', staff: 'Amna Siddiqui', module: 'Orders',    type: 'Bulk Import',      record: '12 orders',           field: '—',                  oldVal: '—',                     newVal: '12 orders from Shopify sync'},
  { ts: '10 May 2026 15:00', staff: 'Admin Khan',    module: 'Settings',  type: 'Update',           record: 'Trax API Key',        field: 'API Credentials',    oldVal: 'TRAX-••••OLD',          newVal: 'TRAX-••••NEW'             },
  { ts: '10 May 2026 11:00', staff: 'Bilal Raza',    module: 'Products',  type: 'Create',           record: 'SKU-0251',            field: '—',                  oldVal: '—',                     newVal: 'New product: Chikan Kari Kurti'},
  { ts: '09 May 2026 14:30', staff: 'Admin Khan',    module: 'Customers', type: 'Delete',           record: 'Cust-02891',          field: '—',                  oldVal: 'Duplicate Record',      newVal: '[Deleted]'                },
  { ts: '09 May 2026 10:00', staff: 'Sara Khan',     module: 'Orders',    type: 'Bulk Import',      record: '48 orders',           field: '—',                  oldVal: '—',                     newVal: '48 orders from CSV import'},
];

const ACCESS_DATA: AccessLog[] = [
  { ts: '11 May 2026 16:45', user: 'Admin Khan',    role: 'Administrator',      event: 'Logged Out',             ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11', location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 09:02', user: 'Admin Khan',    role: 'Administrator',      event: 'Logged In',              ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11', location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 09:10', user: 'Sara Khan',     role: 'Ops Manager',        event: 'Logged In',              ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10', location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 09:15', user: 'Bilal Raza',    role: 'Inventory Manager',  event: 'Logged In (New Device)', ip: '10.0.0.14',    device: 'Safari 17 / iPhone 15',   location: 'Lahore, PK',    result: 'Warning' },
  { ts: '11 May 2026 09:30', user: 'Amna Siddiqui', role: 'Sales Operator',     event: 'Logged In',              ip: '192.168.1.22', device: 'Chrome 124 / Android',    location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 09:45', user: 'Fatima Noor',   role: 'Accounts',           event: 'Logged In',              ip: '192.168.1.12', device: 'Firefox 126 / Windows 10',location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 10:00', user: 'Unknown',        role: '—',                  event: 'Failed Login (x3)',      ip: '203.55.41.12', device: 'Unknown',                 location: 'Unknown',        result: 'Blocked' },
  { ts: '11 May 2026 10:10', user: 'Hassan Ali',    role: 'Courier Handler',    event: 'Logged In',              ip: '192.168.1.18', device: 'Chrome 124 / Windows 11', location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 10:30', user: 'Omar Farooq',   role: 'Rider',              event: 'Logged In',              ip: '10.0.0.35',    device: 'Samsung Internet / Android',location:'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 11:00', user: 'Imran Qureshi', role: 'Rider',              event: 'Logged In',              ip: '10.0.0.22',    device: 'Chrome 124 / Android',    location: 'Lahore, PK',    result: 'Success' },
  { ts: '11 May 2026 12:00', user: 'Unknown',        role: '—',                  event: 'Failed Login (x5)',      ip: '203.55.41.12', device: 'Unknown',                 location: 'Unknown',        result: 'Blocked' },
  { ts: '10 May 2026 09:00', user: 'Admin Khan',    role: 'Administrator',      event: 'Logged In',              ip: '192.168.1.5',  device: 'Chrome 124 / Windows 11', location: 'Lahore, PK',    result: 'Success' },
  { ts: '10 May 2026 08:45', user: 'Sara Khan',     role: 'Ops Manager',        event: 'Logged In',              ip: '192.168.1.8',  device: 'Chrome 124 / Windows 10', location: 'Lahore, PK',    result: 'Success' },
  { ts: '09 May 2026 16:30', user: 'Unknown',        role: '—',                  event: 'Failed Login',           ip: '185.220.101.33',device: 'Tor Browser',            location: 'Unknown (VPN)', result: 'Blocked' },
];

const EXPORTS_DATA: ExportLog[] = [
  { ts: '11 May 2026 14:00', by: 'Admin Khan',    type: 'Orders (All)',             range: 'May 2026',    records: '1,284', format: 'CSV',   size: '48 KB',  sensitive: false, status: 'Completed' },
  { ts: '11 May 2026 11:00', by: 'Sara Khan',     type: 'Sales Data',               range: 'May 2026',    records: '312',   format: 'CSV',   size: '22 KB',  sensitive: false, status: 'Completed' },
  { ts: '11 May 2026 09:30', by: 'Fatima Noor',   type: 'Financial Records',        range: 'Apr 2026',    records: '892',   format: 'Excel', size: '61 KB',  sensitive: true,  status: 'Completed' },
  { ts: '10 May 2026 17:00', by: 'Admin Khan',    type: 'Full System Export',       range: 'All Data',    records: '—',     format: 'JSON',  size: '2.1 MB', sensitive: true,  status: 'Completed' },
  { ts: '10 May 2026 16:30', by: 'Amna Siddiqui', type: 'Customer Data',            range: 'All Time',    records: '3,142', format: 'CSV',   size: '180 KB', sensitive: true,  status: 'Completed' },
  { ts: '09 May 2026 14:00', by: 'Admin Khan',    type: 'Audit Logs',               range: 'Last 30 Days',records: '4,820', format: 'CSV',   size: '310 KB', sensitive: true,  status: 'Completed' },
  { ts: '08 May 2026 11:30', by: 'Sara Khan',     type: 'Inventory Data',           range: 'Snapshot',    records: '248',   format: 'Excel', size: '34 KB',  sensitive: false, status: 'Completed' },
  { ts: '07 May 2026 16:00', by: 'Admin Khan',    type: 'Staff Report',             range: 'Apr 2026',    records: '14',    format: 'Excel', size: '18 KB',  sensitive: true,  status: 'Completed' },
  { ts: '01 May 2026 08:30', by: 'Admin Khan',    type: 'Sales Data',               range: 'Apr 2026',    records: '421',   format: 'CSV',   size: '44 KB',  sensitive: false, status: 'Completed' },
  { ts: '01 May 2026 08:20', by: 'Fatima Noor',   type: 'COD Reconciliation Report',range: 'Apr 2026',    records: '186',   format: 'PDF',   size: '24 KB',  sensitive: false, status: 'Completed' },
];

const ACTIVE_SESSIONS: ActiveSession[] = [
  { user: 'Admin Khan',  role: 'Administrator', color: '#FF6A00', ip: '192.168.1.5',  device: 'Chrome / Windows 11',  since: '09:02' },
  { user: 'Sara Khan',   role: 'Ops Manager',   color: '#8B5CF6', ip: '192.168.1.8',  device: 'Chrome / Windows 10',  since: '09:10' },
  { user: 'Fatima Noor', role: 'Accounts',       color: '#059669', ip: '192.168.1.12', device: 'Firefox / Windows 10', since: '09:45' },
  { user: 'Omar Farooq', role: 'Rider',          color: '#16A34A', ip: '10.0.0.35',    device: 'Samsung / Android',    since: '10:30' },
];

const MODULE_BREAKDOWN = [
  { name: 'Orders',    count: 88, color: 'var(--accent)'  },
  { name: 'Inventory', count: 54, color: 'var(--green)'   },
  { name: 'System',    count: 48, color: '#6B7280'        },
  { name: 'Finance',   count: 40, color: 'var(--teal)'    },
  { name: 'Products',  count: 35, color: 'var(--blue)'    },
  { name: 'Security',  count: 22, color: 'var(--red)'     },
  { name: 'Settings',  count: 18, color: 'var(--yellow)'  },
  { name: 'Customers', count: 16, color: 'var(--purple)'  },
  { name: 'Reports',   count: 14, color: '#0891B2'        },
  { name: 'Staff',     count: 13, color: '#DB2777'        },
];

const STAFF_ACTIVITY_ANALYTICS = [
  { name: 'Admin Khan',    count: 72, color: '#FF6A00' },
  { name: 'Sara Khan',     count: 58, color: '#8B5CF6' },
  { name: 'Amna Siddiqui', count: 44, color: '#EC4899' },
  { name: 'Bilal Raza',    count: 38, color: '#2563EB' },
  { name: 'Tariq Mehmood', count: 32, color: '#0891B2' },
  { name: 'Fatima Noor',   count: 28, color: '#059669' },
  { name: 'Hassan Ali',    count: 22, color: '#7C3AED' },
  { name: 'Omar Farooq',   count: 18, color: '#16A34A' },
];

const HOURLY_COUNTS = [4, 12, 28, 35, 42, 38, 22, 45, 52, 48, 31, 18];
const HOURLY_LABELS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

const TOP_ACTIONS = [
  { action: 'Order Status Updated',      count: 68 },
  { action: 'Staff Login',               count: 42 },
  { action: 'Stock Level Changed',       count: 38 },
  { action: 'COD Collection Recorded',   count: 24 },
  { action: 'Customer Record Updated',   count: 19 },
  { action: 'Order Created',             count: 17 },
  { action: 'Report Exported',           count: 14 },
  { action: 'Settings Modified',         count: 11 },
  { action: 'Product Price Changed',     count: 8  },
  { action: 'Failed Login Attempt',      count: 7  },
];

const SEV_DATA = [
  { s: 'Info',     n: 298, c: 'var(--blue)'   },
  { s: 'Warning',  n: 42,  c: 'var(--yellow)' },
  { s: 'Critical', n: 8,   c: 'var(--red)'    },
];

const SPARKLINE_DAYS    = ['5 May','6 May','7 May','8 May','9 May','10 May','11 May'];
const SPARKLINE_SUCCESS = [14, 18, 12, 22, 16, 20, 9];
const SPARKLINE_FAILED  = [1,  0,  2,  0,  3,  1,  5];

const CHIPS = [
  { label: 'All Events', filter: '',         icon: 'fa-list'               },
  { label: 'Critical',   filter: 'Critical', icon: 'fa-circle-exclamation', iconColor: 'var(--red)'    },
  { label: 'Warning',    filter: 'Warning',  icon: 'fa-triangle-exclamation',iconColor: 'var(--yellow)' },
  { label: 'Info',       filter: 'Info',     icon: 'fa-circle-info',        iconColor: 'var(--blue)'   },
  { label: 'Orders',     filter: 'Orders'  },
  { label: 'Inventory',  filter: 'Inventory'},
  { label: 'Finance',    filter: 'Finance'  },
  { label: 'Settings',   filter: 'Settings' },
  { label: 'System',     filter: 'System'   },
];

const AUDIT_LOG_SETTINGS = [
  { key: 'Log All Admin Actions',      desc: 'Record every action by Administrator role', checked: true  },
  { key: 'Log Staff Login / Logout',   desc: '',                                          checked: true  },
  { key: 'Log Data Modifications',     desc: 'Track creates, updates, deletes',          checked: true  },
  { key: 'Log Report Exports',         desc: '',                                          checked: true  },
  { key: 'Log Settings Changes',       desc: '',                                          checked: true  },
  { key: 'Log API Access',             desc: 'Record external API calls',                checked: false },
];

const ALERT_SETTINGS = [
  { key: 'Alert on Critical Events',         desc: 'Notify Admin immediately',               checked: true  },
  { key: 'Alert on Failed Login Attempts',   desc: '',                                       checked: true  },
  { key: 'Alert on Data Deletion',           desc: 'Notify Admin on any delete action',      checked: true  },
  { key: 'Alert on Role / Permission Change',desc: '',                                       checked: true  },
  { key: 'Alert on Bulk Export',             desc: 'Notify when large data export occurs',   checked: true  },
  { key: 'Daily Audit Summary Email',        desc: 'End-of-day digest to Administrator',     checked: true  },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const truncate = (s: string, n: number) =>
  s.length > n ? s.slice(0, n) + '…' : s;

const PER_PAGE = 15;

// ═══════════════════════════════════════════════════════════
// SMALL SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════

const SevBadge: React.FC<{ s: Severity }> = ({ s }) => {
  const cls: Record<Severity, string> = { Critical: 'red', Warning: 'yellow', Info: 'blue' };
  return <span className={`badge ${cls[s]}`}>{s}</span>;
};

const ResultBadge: React.FC<{ r: AccessResult }> = ({ r }) => {
  const cls: Record<AccessResult, string> = {
    Success: 'green', Warning: 'yellow', Blocked: 'red',
    Completed: 'green', Flagged: 'orange', Allowed: 'green', Noted: 'gray',
  };
  return <span className={`badge ${cls[r]}`}>{r}</span>;
};

const ChangeBadge: React.FC<{ t: ChangeType }> = ({ t }) => {
  const cls: Record<ChangeType, string> = {
    Create: 'green', Update: 'blue', Delete: 'red',
    'Bulk Import': 'purple', 'Stock Adjustment': 'orange',
  };
  return <span className={`badge ${cls[t]}`}>{t}</span>;
};

const ModChip: React.FC<{ m: string }> = ({ m }) => (
  <span className="tag">
    <i className={`fa-solid ${MODULE_ICONS[m] ?? 'fa-cube'}`} style={{ fontSize: 9, marginRight: 3 }} />
    {m}
  </span>
);

const AvatarEl: React.FC<{ name: string; size?: number }> = ({ name, size = 26 }) => {
  const color = STAFF_COLORS[name] ?? '#6B7280';
  const isUnknown = name === 'Unknown';
  const isSystem = name === 'System';
  return (
    <div
      className="row-avatar"
      style={{ background: isUnknown ? 'var(--red)' : color, width: size, height: size, fontSize: size * 0.38 }}
    >
      {isSystem ? 'SY' : isUnknown ? '?' : initials(name)}
    </div>
  );
};

const ProgBar: React.FC<{ pct: number; color?: string }> = ({ pct, color }) => (
  <div className="audit-prog-bar">
    <div className="audit-prog-fill" style={{ width: `${pct}%`, background: color }} />
  </div>
);

// Simple pagination component
const Pagination: React.FC<{
  page: number; total: number; perPage: number;
  onChange: (p: number) => void;
}> = ({ page, total, perPage, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = total ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(page * perPage, total);
  const nums: (number | '…')[] = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) nums.push(i);
  } else {
    nums.push(1);
    if (page > 3) nums.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
    if (page < pages - 2) nums.push('…');
    nums.push(pages);
  }
  return (
    <div className="pagination">
      <div id="audit-pag-info">
        Showing <strong>{start}–{end}</strong> of <strong>{total}</strong>
      </div>
      <div className="pag-controls">
        <button className="pag-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
        {nums.map((n, i) =>
          n === '…'
            ? <button key={`d${i}`} className="pag-btn" style={{ pointerEvents: 'none' }}>…</button>
            : <button key={n} className={`pag-btn ${n === page ? 'active' : ''}`} onClick={() => onChange(n as number)}>{n}</button>
        )}
        <button className="pag-btn" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// OVERLAY
// ═══════════════════════════════════════════════════════════

const AuditOverlay: React.FC<{ log: AuditLog; onClose: () => void }> = ({ log, onClose }) => (
  <>
    <div className="backdrop open" onClick={onClose} />
    <div className="overlay open">
      <div className="overlay-header">
        <div className="overlay-title">{log.id} — Event Detail</div>
        <button className="close-btn" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
      </div>
      <div className="overlay-body">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <SevBadge s={log.severity} />
          <ModChip m={log.module} />
        </div>
        <div className="overlay-action-title">{log.action}</div>
        <div className="detail-row"><div className="detail-key">Event ID</div><div className="detail-val"><code className="ref">{log.id}</code></div></div>
        <div className="detail-row">
          <div className="detail-key">Staff Member</div>
          <div className="detail-val">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <AvatarEl name={log.staff} /><strong>{log.staff}</strong>
            </div>
          </div>
        </div>
        <div className="detail-row"><div className="detail-key">Timestamp</div><div className="detail-val">{log.ts}</div></div>
        <div className="detail-row"><div className="detail-key">Module</div><div className="detail-val"><ModChip m={log.module} /></div></div>
        <div className="detail-row"><div className="detail-key">Severity</div><div className="detail-val"><SevBadge s={log.severity} /></div></div>
        <div className="detail-row"><div className="detail-key">IP Address</div><div className="detail-val"><code className="ref">{log.ip}</code></div></div>
        <div className="detail-row"><div className="detail-key">Device / Browser</div><div className="detail-val" style={{ fontSize: 10.5 }}>{log.device}</div></div>
        <hr />
        <div className="overlay-section-label">Event Details</div>
        <div className="overlay-detail-box">{log.detail}</div>
        <hr />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="t-btn" onClick={onClose}><i className="fa-solid fa-xmark" /> Close</button>
          {log.severity === 'Critical' && (
            <button className="t-btn danger"><i className="fa-solid fa-ban" /> Block IP</button>
          )}
          <button className="t-btn primary" style={{ marginLeft: 'auto' }}>
            <i className="fa-solid fa-file-export" /> Export This Event
          </button>
        </div>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: ALL LOGS
// ═══════════════════════════════════════════════════════════

const AllLogsTab: React.FC = () => {
  const [search,      setSearch]      = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [modFilter,   setModFilter]   = useState('');
  const [chip,        setChip]        = useState('');
  const [page,        setPage]        = useState(1);
  const [overlay,     setOverlay]     = useState<AuditLog | null>(null);

  const filtered = ALL_LOGS_DATA.filter(d => {
    if (chip && !d.severity.includes(chip) && !d.module.includes(chip)) return false;
    if (staffFilter && d.staff !== staffFilter) return false;
    if (modFilter   && d.module !== modFilter)  return false;
    if (search) {
      const q = search.toLowerCase();
      return d.action.toLowerCase().includes(q) || d.staff.toLowerCase().includes(q)
          || d.module.toLowerCase().includes(q) || d.detail.toLowerCase().includes(q);
    }
    return true;
  });

  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const ALL_STAFF = ['Admin Khan','Sara Khan','Bilal Raza','Amna Siddiqui','Fatima Noor','Tariq Mehmood','Hassan Ali','Omar Farooq','System'];
  const ALL_MODS  = ['Orders','Inventory','Products','Customers','Finance','Couriers','Riders','Staff','Reports','Settings','Security','System'];

  return (
    <>
      {/* Chips */}
      <div className="chip-group">
        {CHIPS.map(c => (
          <div
            key={c.filter}
            className={`chip ${chip === c.filter ? 'active' : ''}`}
            onClick={() => { setChip(c.filter); setPage(1); }}
          >
            {c.icon && <i className={`fa-solid ${c.icon}`} style={c.iconColor ? { color: c.iconColor } : {}} />}
            {c.label}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="t-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search action, user, module..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select className="form-select" style={{ height: 27, fontSize: 10.5 }} value={staffFilter} onChange={e => { setStaffFilter(e.target.value); setPage(1); }}>
              <option value="">All Staff</option>
              {ALL_STAFF.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="form-select" style={{ height: 27, fontSize: 10.5 }} value={modFilter} onChange={e => { setModFilter(e.target.value); setPage(1); }}>
              <option value="">All Modules</option>
              {ALL_MODS.map(m => <option key={m}>{m}</option>)}
            </select>
            <button className="t-btn"><i className="fa-solid fa-calendar" /> Date Range</button>
          </div>
          <div className="toolbar-right">
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{filtered.length} records</span>
            <button className="t-btn"><i className="fa-solid fa-file-export" /> Export Logs</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Staff Member</th>
                <th>Action</th>
                <th>Module</th>
                <th>IP Address</th>
                <th>Device</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(d => (
                <tr key={d.id} onClick={() => setOverlay(d)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontSize: 10, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{d.ts}</td>
                  <td>
                    <div className="td-flex">
                      <AvatarEl name={d.staff} />
                      <div style={{ fontWeight: 600, fontSize: 10.5 }}>{d.staff}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 11, fontWeight: 500, maxWidth: 260 }}>{truncate(d.action, 55)}</div>
                    <div className="td-sub" style={{ maxWidth: 260 }}>{truncate(d.detail, 70)}</div>
                  </td>
                  <td><ModChip m={d.module} /></td>
                  <td><code className="ref">{d.ip}</code></td>
                  <td style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{truncate(d.device, 30)}</td>
                  <td><SevBadge s={d.severity} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="t-btn" style={{ height: 22, fontSize: 9.5 }} onClick={() => setOverlay(d)}>
                      <i className="fa-solid fa-eye" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      {overlay && <AuditOverlay log={overlay} onClose={() => setOverlay(null)} />}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: SECURITY
// ═══════════════════════════════════════════════════════════

const SecurityTab: React.FC = () => (
  <>
    <div className="alert-strip danger" style={{ marginBottom: 14 }}>
      <i className="fa-solid fa-shield-exclamation" />
      <div>
        <strong>3 critical events</strong> in the last 24 hours. One IP (<code style={{ fontFamily: 'monospace', fontSize: 9.5 }}>203.55.41.12</code>) has been automatically blocked after 5 failed login attempts.
      </div>
    </div>

    <div className="mini-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 14 }}>
      <div className="mini-stat">
        <div className="ms-label">Failed Logins (24h)</div>
        <div className="ms-value" style={{ color: 'var(--red)' }}>7</div>
        <div className="ms-trend down"><i className="fa-solid fa-circle-xmark" /> 3 from same IP</div>
      </div>
      <div className="mini-stat">
        <div className="ms-label">Blocked IPs</div>
        <div className="ms-value" style={{ color: 'var(--accent)' }}>2</div>
        <div className="ms-trend"><i className="fa-solid fa-ban" /> 1 auto-blocked today</div>
      </div>
      <div className="mini-stat">
        <div className="ms-label">Permission Changes</div>
        <div className="ms-value" style={{ color: 'var(--yellow)' }}>2</div>
        <div className="ms-trend"><i className="fa-solid fa-shield-halved" /> Role &amp; access edits</div>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-shield-exclamation ic-red" /> Security Event Log</div>
        <button className="t-btn"><i className="fa-solid fa-file-export" /> Export</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th><th>Event</th><th>User / Actor</th>
              <th>IP Address</th><th>Device</th><th>Location</th>
              <th>Severity</th><th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {SECURITY_DATA.map((d, i) => {
              const isBadIp = d.ip.includes('203.55') || d.ip.includes('185.220');
              const isBadLoc = d.location === 'Unknown' || d.location.includes('VPN');
              return (
                <tr key={i}>
                  <td style={{ fontSize: 10, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{d.ts}</td>
                  <td><strong style={{ fontSize: 11.5 }}>{d.event}</strong></td>
                  <td>
                    <div className="td-flex">
                      <AvatarEl name={d.user} />
                      <span style={{ fontSize: 10.5 }}>{d.user}</span>
                    </div>
                  </td>
                  <td>
                    <code className="ref" style={isBadIp ? { color: 'var(--red)', borderColor: 'var(--red)' } : {}}>{d.ip}</code>
                  </td>
                  <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.device}</td>
                  <td style={{ fontSize: 10.5, color: isBadLoc ? 'var(--red)' : 'var(--text-secondary)' }}>{d.location}</td>
                  <td><SevBadge s={d.severity} /></td>
                  <td><ResultBadge r={d.outcome} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: DATA CHANGES
// ═══════════════════════════════════════════════════════════

const DataChangesTab: React.FC = () => {
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modFilter,  setModFilter]  = useState('');
  const [page,       setPage]       = useState(1);

  const filtered = DATA_CHANGES.filter(d => {
    if (typeFilter && d.type !== typeFilter) return false;
    if (modFilter  && d.module !== modFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.record.toLowerCase().includes(q) || d.staff.toLowerCase().includes(q) || d.field.toLowerCase().includes(q);
    }
    return true;
  });

  const pageItems = filtered.slice((page - 1) * 12, page * 12);

  return (
    <>
      <div className="mini-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="mini-stat"><div className="ms-label">Data Changes (24h)</div><div className="ms-value">142</div><div className="ms-trend">Orders, Inventory, Products</div></div>
        <div className="mini-stat"><div className="ms-label">Deletions</div><div className="ms-value" style={{ color: 'var(--red)' }}>4</div><div className="ms-trend down"><i className="fa-solid fa-trash" /> All by Admin Khan</div></div>
        <div className="mini-stat"><div className="ms-label">Stock Adjustments</div><div className="ms-value" style={{ color: 'var(--accent)' }}>11</div><div className="ms-trend"><i className="fa-solid fa-cubes" /> Manual overrides</div></div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="t-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search record or field..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            <select className="form-select" style={{ height: 27, fontSize: 10.5 }} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="">All Change Types</option>
              {['Create','Update','Delete','Bulk Import','Stock Adjustment'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="form-select" style={{ height: 27, fontSize: 10.5 }} value={modFilter} onChange={e => { setModFilter(e.target.value); setPage(1); }}>
              <option value="">All Modules</option>
              {['Orders','Products','Inventory','Customers','Finance'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="toolbar-right"><button className="t-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th><th>Staff Member</th><th>Module</th><th>Change Type</th>
                <th>Record</th><th>Field Changed</th><th>Old Value</th><th>New Value</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 10, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{d.ts}</td>
                  <td><div className="td-flex"><AvatarEl name={d.staff} /><span style={{ fontSize: 10.5, fontWeight: 500 }}>{d.staff}</span></div></td>
                  <td><ModChip m={d.module} /></td>
                  <td><ChangeBadge t={d.type} /></td>
                  <td><code className="ref">{d.record}</code></td>
                  <td style={{ fontSize: 10.5 }}>{d.field}</td>
                  <td style={{ fontSize: 10.5, color: 'var(--text-muted)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.oldVal}</td>
                  <td style={{ fontSize: 10.5, fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: d.type === 'Delete' ? 'var(--red)' : 'var(--text-primary)' }}>{d.newVal}</td>
                  <td><button className="t-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={12} onChange={setPage} />
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: ACCESS & LOGINS
// ═══════════════════════════════════════════════════════════

const AccessTab: React.FC = () => {
  const [search,      setSearch]      = useState('');
  const [accessFilter,setAccessFilter]= useState<'all'|'success'|'failed'|'suspicious'>('all');
  const [page,        setPage]        = useState(1);

  const maxSparkline = Math.max(...SPARKLINE_SUCCESS.map((s, i) => s + SPARKLINE_FAILED[i]));

  const filtered = ACCESS_DATA.filter(d => {
    if (accessFilter === 'success'    && d.result !== 'Success') return false;
    if (accessFilter === 'failed'     && d.result !== 'Blocked') return false;
    if (accessFilter === 'suspicious' && d.result !== 'Warning') return false;
    if (search) {
      const q = search.toLowerCase();
      return d.user.toLowerCase().includes(q) || d.ip.includes(q);
    }
    return true;
  });
  const pageItems = filtered.slice((page - 1) * 12, page * 12);

  return (
    <>
      <div className="detail-grid-2" style={{ marginBottom: 14 }}>
        {/* Login sparkline */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-right-to-bracket ic-green" /> Login Activity — Last 7 Days</div></div>
          <div className="card-body">
            <div className="spark-bar-wrap">
              {SPARKLINE_DAYS.map((_, i) => {
                const sH = Math.round((SPARKLINE_SUCCESS[i] / maxSparkline) * 100);
                const fH = Math.max(Math.round((SPARKLINE_FAILED[i] / maxSparkline) * 100), SPARKLINE_FAILED[i] > 0 ? 4 : 0);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, height: '100%' }}>
                    <div className="spark-bar" style={{ width: '100%', height: `${sH}%`, background: 'var(--green)', minHeight: 2, opacity: 0.85 }} title={`${SPARKLINE_SUCCESS[i]} successful`} />
                    {SPARKLINE_FAILED[i] > 0 && (
                      <div className="spark-bar" style={{ width: '100%', height: `${fH}%`, background: 'var(--red)', minHeight: 2, opacity: 0.85 }} title={`${SPARKLINE_FAILED[i]} failed`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="spark-labels">
              {SPARKLINE_DAYS.map(d => <span key={d}>{d}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)' }} /> Successful</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--red)' }} /> Failed</div>
            </div>
          </div>
        </div>

        {/* Active sessions */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-users ic-blue" /> Current Active Sessions</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {ACTIVE_SESSIONS.map(s => (
              <div className="list-item" key={s.user}>
                <div className="row-avatar" style={{ background: s.color }}>{initials(s.user)}</div>
                <div className="list-content">
                  <div className="list-title">{s.user}</div>
                  <div className="list-meta">{s.role} · {s.device} · Since {s.since}</div>
                </div>
                <div className="list-right">
                  <code className="ref" style={{ fontSize: 9 }}>{s.ip}</code>
                  <div style={{ marginTop: 3 }}><span className="badge green" style={{ fontSize: 8.5 }}>● Online</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="t-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search user or IP..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            {(['all','success','failed','suspicious'] as const).map(f => (
              <button
                key={f}
                className={`t-btn ${accessFilter === f ? 'active' : ''}`}
                style={f === 'success' ? { color: 'var(--green)' } : f === 'failed' ? { color: 'var(--red)' } : f === 'suspicious' ? { color: 'var(--accent)' } : {}}
                onClick={() => { setAccessFilter(f); setPage(1); }}
              >
                {f === 'all' ? 'All' : f === 'success' ? <><i className="fa-solid fa-circle-check" /> Successful</> : f === 'failed' ? <><i className="fa-solid fa-circle-xmark" /> Failed</> : <><i className="fa-solid fa-triangle-exclamation" /> Suspicious</>}
              </button>
            ))}
          </div>
          <div className="toolbar-right"><button className="t-btn"><i className="fa-solid fa-file-export" /> Export</button></div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Role</th><th>Event</th><th>IP Address</th><th>Device / Browser</th><th>Location</th><th>Result</th></tr>
            </thead>
            <tbody>
              {pageItems.map((d, i) => {
                const isBlocked = d.result === 'Blocked';
                const isBadLoc = d.location === 'Unknown' || d.location.includes('VPN');
                return (
                  <tr key={i}>
                    <td style={{ fontSize: 10, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{d.ts}</td>
                    <td><div className="td-flex"><AvatarEl name={d.user} /><div style={{ fontWeight: 600, fontSize: 10.5 }}>{d.user}</div></div></td>
                    <td><span className="tag">{d.role}</span></td>
                    <td style={{ fontSize: 11 }}>{d.event}</td>
                    <td><code className="ref" style={isBlocked ? { color: 'var(--red)', borderColor: 'var(--red)' } : {}}>{d.ip}</code></td>
                    <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.device}</td>
                    <td style={{ fontSize: 10.5, color: isBadLoc ? 'var(--red)' : 'var(--text-secondary)' }}>{d.location}</td>
                    <td><ResultBadge r={d.result} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={12} onChange={setPage} />
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: EXPORTS
// ═══════════════════════════════════════════════════════════

const ExportsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  const filtered = EXPORTS_DATA.filter(d =>
    !search || d.type.toLowerCase().includes(search.toLowerCase()) || d.by.toLowerCase().includes(search.toLowerCase())
  );
  const pageItems = filtered.slice((page - 1) * 10, page * 10);

  return (
    <>
      <div className="alert-strip info">
        <i className="fa-solid fa-circle-info" />
        All data exports from the system are logged here. Each export captures who requested it, what data was included, and when it was downloaded.
      </div>
      <div className="card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="t-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search export type or user..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            <select className="form-select" style={{ height: 27, fontSize: 10.5 }}>
              <option>All Export Types</option>
              {['Sales Data','Inventory Data','Customer Data','Financial Records','Staff Report','Audit Logs','Full System Export'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="toolbar-right">
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>28 exports this month</span>
            <button className="t-btn"><i className="fa-solid fa-file-export" /> Export This Log</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Timestamp</th><th>Requested By</th><th>Export Type</th><th>Date Range</th><th>Records</th><th>Format</th><th>File Size</th><th>Contains Sensitive Data</th><th>Status</th></tr>
            </thead>
            <tbody>
              {pageItems.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 10, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{d.ts}</td>
                  <td><div className="td-flex"><AvatarEl name={d.by} /><span style={{ fontSize: 10.5, fontWeight: 500 }}>{d.by}</span></div></td>
                  <td><strong style={{ fontSize: 11 }}>{d.type}</strong></td>
                  <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{d.range}</td>
                  <td style={{ textAlign: 'center' }}>{d.records}</td>
                  <td><span className="tag">{d.format}</span></td>
                  <td style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{d.size}</td>
                  <td style={{ textAlign: 'center' }}>
                    {d.sensitive
                      ? <span className="badge red"><i className="fa-solid fa-triangle-exclamation" /> Yes</span>
                      : <span className="badge gray">No</span>
                    }
                  </td>
                  <td><ResultBadge r={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={10} onChange={setPage} />
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: ANALYTICS
// ═══════════════════════════════════════════════════════════

const AnalyticsTab: React.FC = () => {
  const maxMod    = Math.max(...MODULE_BREAKDOWN.map(m => m.count));
  const maxAct    = STAFF_ACTIVITY_ANALYTICS[0].count;
  const maxHourly = Math.max(...HOURLY_COUNTS);
  const maxTop    = TOP_ACTIONS[0].count;
  const total     = 348;

  return (
    <>
      <div className="detail-grid-3" style={{ marginBottom: 14 }}>
        {/* Events by Module */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-bar ic-orange" /> Events by Module</div></div>
          <div className="card-body" style={{ padding: '10px 14px' }}>
            {MODULE_BREAKDOWN.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 70, fontSize: 10.5, color: 'var(--text-muted)', flexShrink: 0 }}>{m.name}</div>
                <ProgBar pct={m.count / maxMod * 100} color={m.color} />
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-primary)', width: 24, textAlign: 'right' }}>{m.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Events by Severity */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-pie ic-orange" /> Events by Severity</div></div>
          <div className="card-body" style={{ padding: '10px 14px' }}>
            {SEV_DATA.map(s => (
              <div key={s.s} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.c }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{s.s}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    {s.n} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({Math.round(s.n / total * 100)}%)</span>
                  </span>
                </div>
                <ProgBar pct={s.n / total * 100} color={s.c} />
              </div>
            ))}
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--divider)' }}>
              Total events today: <strong style={{ color: 'var(--text-primary)' }}>{total}</strong>
            </div>
          </div>
        </div>

        {/* Most Active Staff */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-ranking-star ic-orange" /> Most Active Staff</div></div>
          <div className="card-body" style={{ padding: '10px 14px' }}>
            {STAFF_ACTIVITY_ANALYTICS.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 16, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</div>
                <div className="row-avatar" style={{ background: s.color, width: 22, height: 22, fontSize: 9, flexShrink: 0 }}>{initials(s.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 500, marginBottom: 2 }}>{s.name.split(' ')[0]}</div>
                  <ProgBar pct={s.count / maxAct * 100} color={s.color} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', width: 24, textAlign: 'right' }}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-chart-line" /> Hourly Activity — 11 May 2026</div>
          <div className="card-actions">
            <select className="form-select" style={{ height: 26, fontSize: 10.5 }}>
              <option>Today</option><option>Yesterday</option><option>Last 7 Days</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, marginBottom: 6 }}>
            {HOURLY_COUNTS.map((c, i) => {
              const h = Math.max(4, Math.round((c / maxHourly) * 80));
              const color = c >= 40 ? 'var(--accent)' : 'var(--blue)';
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 80, cursor: 'pointer' }} title={`${c} events at ${HOURLY_LABELS[i]}`}>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 3 }}>{c}</div>
                  <div className="hourly-bar" style={{ width: '100%', height: h, background: color }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted)' }}>
            {HOURLY_LABELS.map(l => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>

      {/* Bottom two cards */}
      <div className="detail-grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-list-ol" /> Top Actions Today</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {TOP_ACTIONS.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
                <div style={{ width: 16, fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 500, marginBottom: 2 }}>{a.action}</div>
                  <ProgBar pct={a.count / maxTop * 100} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', width: 24, textAlign: 'right' }}>{a.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Audit Trail Summary</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {[
              ['Total Events (All Time)',  '4,820',         ''],
              ['Today\'s Events',          '348',           ''],
              ['This Week',               '1,842',          ''],
              ['Critical Events (30d)',   '12',             'var(--red)'   ],
              ['Data Deletions (30d)',    '18',             'var(--red)'   ],
              ['Export Requests (30d)',   '28',             ''],
              ['Failed Logins (30d)',     '34',             'var(--yellow)'],
              ['Oldest Log Entry',        '01 Mar 2026',    ''],
              ['Log Retention Period',    '90 Days',        ''],
              ['Storage Used',            '2.8 MB',         ''],
            ].map(([k, v, c]) => (
              <div className="detail-row" key={String(k)}>
                <div className="detail-key">{k}</div>
                <div className="detail-val" style={c ? { color: String(c) } : {}}><strong>{v}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: SETTINGS
// ═══════════════════════════════════════════════════════════

const ToggleRow: React.FC<{ label: string; desc?: string; defaultChecked: boolean }> = ({ label, desc, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="stg-row">
      <div>
        <div className="stg-key">{label}</div>
        {desc && <div className="stg-desc">{desc}</div>}
      </div>
      <label className="toggle-switch" onClick={() => setChecked(v => !v)}>
        <input type="checkbox" checked={checked} onChange={() => {}} />
        <span className="toggle-track" />
      </label>
    </div>
  );
};

const SettingsTab: React.FC = () => (
  <>
    <div className="settings-grid">
      {/* Log Config */}
      <div className="settings-section">
        <div className="settings-section-head"><i className="fa-solid fa-sliders" /> Audit Log Configuration</div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Log Retention Period</div><div className="stg-desc">How long to keep audit records</div></div>
            <select className="stg-select"><option>30 Days</option><option>90 Days</option><option>180 Days</option><option>1 Year</option><option>Forever</option></select>
          </div>
          <ToggleRow label="Auto-purge Expired Logs"    desc="Delete logs older than retention period" defaultChecked={true}  />
          <ToggleRow label="Log All Admin Actions"       desc="Record every action by Administrator role" defaultChecked={true}  />
          <ToggleRow label="Log Staff Login / Logout"    defaultChecked={true}  />
          <ToggleRow label="Log Data Modifications"      desc="Track creates, updates, deletes"        defaultChecked={true}  />
          <ToggleRow label="Log Report Exports"          defaultChecked={true}  />
          <ToggleRow label="Log Settings Changes"        defaultChecked={true}  />
          <ToggleRow label="Log API Access"              desc="Record external API calls"              defaultChecked={false} />
        </div>
      </div>

      {/* Alerts */}
      <div className="settings-section">
        <div className="settings-section-head"><i className="fa-solid fa-bell" /> Alert &amp; Notification Settings</div>
        <div className="settings-section-body">
          <ToggleRow label="Alert on Critical Events"          desc="Notify Admin immediately"                 defaultChecked={true}  />
          <ToggleRow label="Alert on Failed Login Attempts"    defaultChecked={true}  />
          <div className="stg-row">
            <div><div className="stg-key">Failed Login Threshold</div><div className="stg-desc">Alert after N consecutive failures</div></div>
            <input type="number" defaultValue={3} className="stg-input" style={{ width: 60 }} />
          </div>
          <ToggleRow label="Alert on Data Deletion"            desc="Notify Admin on any delete action"        defaultChecked={true}  />
          <ToggleRow label="Alert on Role / Permission Change" defaultChecked={true}  />
          <ToggleRow label="Alert on Bulk Export"              desc="Notify when large data export occurs"    defaultChecked={true}  />
          <ToggleRow label="Daily Audit Summary Email"         desc="End-of-day digest to Administrator"      defaultChecked={true}  />
          <div className="stg-row">
            <div><div className="stg-key">Notify Who</div></div>
            <select className="stg-select"><option>Administrator</option><option>Ops Manager</option><option>Both</option></select>
          </div>
        </div>
      </div>
    </div>

    <div className="settings-grid">
      {/* Export & Archive */}
      <div className="settings-section" style={{ marginBottom: 0 }}>
        <div className="settings-section-head"><i className="fa-solid fa-file-export" /> Export &amp; Archive</div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Default Export Format</div></div>
            <select className="stg-select"><option>CSV</option><option>Excel (.xlsx)</option><option>JSON</option><option>PDF</option></select>
          </div>
          <ToggleRow label="Auto-archive Monthly Logs"  desc="Compress and archive each month's logs" defaultChecked={true}  />
          <div className="stg-row">
            <div><div className="stg-key">Archive Storage</div></div>
            <select className="stg-select"><option>Local Server</option><option>Google Drive</option><option>AWS S3</option></select>
          </div>
          <ToggleRow label="Encrypt Archived Logs"      defaultChecked={true}  />
        </div>
      </div>

      {/* Compliance */}
      <div className="settings-section" style={{ marginBottom: 0 }}>
        <div className="settings-section-head"><i className="fa-solid fa-shield-halved" /> Compliance &amp; Access</div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Restrict Log Access To</div><div className="stg-desc">Who can view audit logs</div></div>
            <select className="stg-select"><option>Admin Only</option><option>Admin + Ops Manager</option><option>All Managers</option></select>
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Allow Log Export By</div></div>
            <select className="stg-select"><option>Admin Only</option><option>Admin + Ops Manager</option></select>
          </div>
          <ToggleRow label="Tamper-proof Mode"  desc="Logs cannot be edited or deleted by any user" defaultChecked={true}  />
          <ToggleRow label="Show Raw IP in Logs" desc="Display full IP or partially mask it"         defaultChecked={true}  />
        </div>
      </div>
    </div>

    <div style={{ marginTop: 14 }}>
      <button className="t-btn primary"><i className="fa-solid fa-check" /> Save Audit Settings</button>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const AuditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuditTab>('all');

  const tabs: { id: AuditTab; label: string; badge?: React.ReactNode }[] = [
    { id: 'all',       label: 'All Logs' },
    { id: 'security',  label: 'Security', badge: <span className="tab-badge-red">3</span> },
    { id: 'data',      label: 'Data Changes' },
    { id: 'access',    label: 'Access & Logins' },
    { id: 'exports',   label: 'Exports' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings',  label: 'Settings' },
  ];

  return (
    <div id="page-audit">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-title">Audit Logs</div>
        <div className="page-hero-sub">
          Complete record of all system actions performed by staff — logins, data changes, exports, and critical events. Retained for 90 days.
        </div>
      </div>

      {/* Alert Strip */}
      <div className="alert-strip danger">
        <i className="fa-solid fa-shield-exclamation" />
        <div>
          <strong>3 critical security events</strong> logged in the last 24 hours — failed logins and a suspicious IP attempt. <strong>1 IP has been auto-blocked.</strong>
        </div>
        <button className="t-btn" style={{ marginLeft: 'auto' }} onClick={() => setActiveTab('security')}>
          <i className="fa-solid fa-eye" /> View Security Events
        </button>
      </div>

      {/* Mini Stats */}
      <div className="mini-stats">
        <div className="mini-stat">
          <div className="ms-label">Total Events (24h)</div>
          <div className="ms-value">348</div>
          <div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +22% vs yesterday</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Critical Events</div>
          <div className="ms-value" style={{ color: 'var(--red)' }}>3</div>
          <div className="ms-trend down"><i className="fa-solid fa-triangle-exclamation" /> Requires attention</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Active Users (Today)</div>
          <div className="ms-value">9</div>
          <div className="ms-trend"><i className="fa-solid fa-users" /> Across 7 roles</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Log Retention</div>
          <div className="ms-value" style={{ fontSize: 14 }}>90 days</div>
          <div className="ms-trend"><i className="fa-solid fa-database" /> 4,820 total records</div>
        </div>
      </div>

      {/* Inner Tabs */}
      <div className="inner-tabs">
        {tabs.map(t => (
          <div
            key={t.id}
            className={`itab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label} {t.badge}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'all'       && <AllLogsTab />}
      {activeTab === 'security'  && <SecurityTab />}
      {activeTab === 'data'      && <DataChangesTab />}
      {activeTab === 'access'    && <AccessTab />}
      {activeTab === 'exports'   && <ExportsTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'settings'  && <SettingsTab />}
    </div>
  );
};

export default AuditPage;