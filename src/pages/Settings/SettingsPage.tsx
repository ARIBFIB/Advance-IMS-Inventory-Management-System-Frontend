import React, { useState, useEffect, useRef } from 'react';
import './SettingsPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { useTabLoading } from '../../hooks/useTabLoading';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type SettingsTab =
  | 'general'
  | 'business'
  | 'orders'
  | 'inventory'
  | 'notifications'
  | 'integrations'
  | 'users'
  | 'security'
  | 'backup';

interface CourierApi {
  courier: string;
  endpoint: string;
  key: string;
  status: 'Connected' | 'Error';
  lastSync: string;
}

interface UserOverview {
  name: string;
  role: string;
  lastLogin: string;
  device: string;
  status: 'Active' | 'Suspended';
}

interface SecurityEvent {
  time: string;
  event: string;
  user: string;
  ip: string;
  device: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

interface BackupRecord {
  date: string;
  size: string;
  duration: string;
  status: 'Success' | 'Failed';
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const COURIER_API_DATA: CourierApi[] = [
  { courier: 'TCS Express',      endpoint: 'https://api.tcs.com.pk/track',   key: 'TCS-••••7f2a', status: 'Connected', lastSync: '11 May 08:00' },
  { courier: 'Leopards Courier', endpoint: 'https://api.leopards.com.pk/',   key: 'LCS-••••3b19', status: 'Connected', lastSync: '11 May 08:00' },
  { courier: 'M&P Express',      endpoint: 'https://mpm.com.pk/api/v2/',     key: 'MNP-••••9c44', status: 'Connected', lastSync: '11 May 08:00' },
  { courier: 'Trax',             endpoint: 'https://api.traxlogistics.com/', key: 'Not configured', status: 'Error',   lastSync: 'N/A' },
];

const USERS_OVERVIEW: UserOverview[] = [
  { name: 'Admin Khan',    role: 'Administrator',  lastLogin: 'Just now',    device: 'Chrome / Windows',  status: 'Active'    },
  { name: 'Sara Khan',     role: 'Ops Manager',    lastLogin: '5 min ago',   device: 'Chrome / Windows',  status: 'Active'    },
  { name: 'Bilal Raza',    role: 'Inventory Mgr',  lastLogin: '20 min ago',  device: 'Safari / iPhone',   status: 'Active'    },
  { name: 'Amna Siddiqui', role: 'Sales Operator', lastLogin: '1 hr ago',    device: 'Chrome / Android',  status: 'Active'    },
  { name: 'Fatima Noor',   role: 'Accounts',       lastLogin: '45 min ago',  device: 'Firefox / Windows', status: 'Active'    },
  { name: 'Rabia Tanvir',  role: 'Sales Operator', lastLogin: '1 week ago',  device: 'Chrome / Android',  status: 'Suspended' },
];

const SECURITY_LOG: SecurityEvent[] = [
  { time: '11 May 09:12', event: 'Successful Login',  user: 'Admin Khan',  ip: '192.168.1.5',   device: 'Chrome / Windows',  severity: 'Info'     },
  { time: '11 May 09:30', event: 'Password Changed',  user: 'Sara Khan',   ip: '192.168.1.8',   device: 'Chrome / Windows',  severity: 'Info'     },
  { time: '11 May 10:00', event: 'Failed Login (x3)', user: 'Unknown',     ip: '203.55.41.12',  device: 'Unknown',            severity: 'Critical' },
  { time: '11 May 10:15', event: 'IP Blocked',        user: 'System',      ip: '203.55.41.12',  device: '—',                  severity: 'Warning'  },
  { time: '11 May 11:30', event: 'Role Changed',      user: 'Admin Khan',  ip: '192.168.1.5',   device: 'Chrome / Windows',  severity: 'Warning'  },
  { time: '10 May 18:00', event: 'Successful Login',  user: 'Bilal Raza',  ip: '10.0.0.14',     device: 'Safari / iPhone',   severity: 'Info'     },
  { time: '10 May 16:30', event: 'Export Triggered',  user: 'Fatima Noor', ip: '192.168.1.12',  device: 'Firefox / Windows', severity: 'Info'     },
];

const INITIAL_BACKUP_HISTORY: BackupRecord[] = [
  { date: '11 May 2026, 08:00', size: '4.2 MB', duration: '12s', status: 'Success' },
  { date: '10 May 2026, 08:00', size: '4.1 MB', duration: '11s', status: 'Success' },
  { date: '09 May 2026, 08:00', size: '4.0 MB', duration: '13s', status: 'Success' },
  { date: '08 May 2026, 08:00', size: '3.9 MB', duration: '10s', status: 'Success' },
  { date: '07 May 2026, 08:00', size: '3.8 MB', duration: '14s', status: 'Failed'  },
  { date: '06 May 2026, 08:00', size: '3.8 MB', duration: '11s', status: 'Success' },
];

const AVATAR_COLORS = ['#FF6A00', '#8B5CF6', '#2563EB', '#EC4899', '#059669', '#6B7280'];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('');
}

function severityBadgeColor(s: SecurityEvent['severity']): string {
  const map: Record<string, string> = { Info: 'blue', Warning: 'yellow', Critical: 'red' };
  return map[s] || 'gray';
}

// ═══════════════════════════════════════════════════════════
// SHARED SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

/* ── Toggle Switch ── */
interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (v: boolean) => void;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked = false, onChange }) => {
  const [on, setOn] = useState(checked);
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={on}
        onChange={e => { setOn(e.target.checked); onChange?.(e.target.checked); }}
      />
      <span className="toggle-track" />
    </label>
  );
};

/* ── Section Divider ── */
const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="section-divider"><span>{label}</span></div>
);

/* ── Stg Row with Toggle ── */
interface StgToggleRowProps {
  label: string;
  desc?: string;
  defaultChecked?: boolean;
}
const StgToggleRow: React.FC<StgToggleRowProps> = ({ label, desc, defaultChecked = false }) => (
  <div className="stg-row">
    <div>
      <div className="stg-key">{label}</div>
      {desc && <div className="stg-desc">{desc}</div>}
    </div>
    <ToggleSwitch checked={defaultChecked} />
  </div>
);

/* ── Stg Row with input/select ── */
interface StgRowProps {
  label: string;
  children: React.ReactNode;
}
const StgRow: React.FC<StgRowProps> = ({ label, children }) => (
  <div className="stg-row">
    <div><div className="stg-key">{label}</div></div>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════
// TAB: GENERAL
// ═══════════════════════════════════════════════════════════

const GeneralTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        General settings control system-wide defaults. Changes take effect immediately and apply to all users.
      </div>
    </div>

    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Localisation */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-globe" /> Localisation</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Country</div>
              <select className="form-select">
                <option>Pakistan</option><option>India</option><option>UAE</option><option>UK</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Language</div>
              <select className="form-select">
                <option>English (UK)</option><option>English (US)</option><option>Urdu</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Currency</div>
              <select className="form-select">
                <option>PKR — Pakistani Rupee (₨)</option>
                <option>USD — US Dollar ($)</option>
                <option>AED — UAE Dirham (د.إ)</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Currency Position</div>
              <select className="form-select">
                <option>Before amount — ₨1,200</option>
                <option>After amount — 1,200₨</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Date Format</div>
              <select className="form-select">
                <option>DD MMM YYYY (07 May 2026)</option>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Time Format</div>
              <select className="form-select">
                <option>12-hour (2:30 PM)</option>
                <option>24-hour (14:30)</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Timezone</div>
              <select className="form-select">
                <option>PKT — Pakistan Standard Time (UTC+5)</option>
                <option>GMT — Greenwich Mean Time</option>
                <option>EST — Eastern Standard Time</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Week Starts On</div>
              <select className="form-select">
                <option>Monday</option><option>Sunday</option><option>Saturday</option>
              </select>
            </div>
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Localisation</button>
        </div>
      </div>

      {/* Display & UI */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-display" /> Display & UI</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <StgToggleRow label="Compact Table Rows" desc="Reduce row height to show more data per screen" />
            <StgToggleRow label="Show Cost Price in Tables" desc="Visible to Admin and Manager roles only" defaultChecked />
            <StgToggleRow label="Show Profit Margin in Products" desc="Display gross margin % next to each product" defaultChecked />
            <StgRow label="Rows Per Page (default)">
              <select className="form-select" style={{ height: 26, fontSize: 11, minWidth: 80 }}>
                <option>10</option><option selected>15</option><option>25</option><option>50</option>
              </select>
            </StgRow>
            <StgRow label="Default Sort Order">
              <select className="form-select" style={{ height: 26, fontSize: 11, minWidth: 130 }}>
                <option>Newest First</option><option>Oldest First</option><option>Alphabetical</option>
              </select>
            </StgRow>
            <StgToggleRow label="Sidebar Collapsed by Default" desc="Start with sidebar collapsed on login" />
            <StgToggleRow label="Show Onboarding Tips" desc="Display contextual help tooltips for new users" defaultChecked />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Display Settings</button>
        </div>
      </div>
    </div>

    {/* Printing & Export */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-print" /> Printing & Export Defaults</div>
      </div>
      <div className="card-body">
        <div className="grid-2">
          <div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Default Export Format</div>
                <select className="form-select"><option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>PDF</option></select>
              </div>
              <div className="form-group">
                <div className="form-label">Paper Size (Printing)</div>
                <select className="form-select"><option>A4</option><option>Letter</option><option>A5</option></select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Invoice Logo</div>
                <input className="form-input" placeholder="Upload or paste URL..." />
              </div>
              <div className="form-group">
                <div className="form-label">Footer Text on Invoices</div>
                <input className="form-input" placeholder="e.g. Thank you for your order!" />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <StgToggleRow label="Print Cost Price on Invoices" />
            <StgToggleRow label="Include Barcode on Packing Slips" defaultChecked />
            <StgToggleRow label="Auto-generate PDF on Order Confirm" />
          </div>
        </div>
        <hr />
        <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Print & Export Settings</button>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: BUSINESS PROFILE
// ═══════════════════════════════════════════════════════════

const BusinessTab: React.FC = () => (
  <div className="grid-2" style={{ marginBottom: 14 }}>
    {/* Business Details */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-store" /> Business Details</div>
      </div>
      <div className="card-body">
        <div className="form-row" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group">
            <div className="form-label">Business Name *</div>
            <input className="form-input" defaultValue="My Fashion Store" style={{ width: '100%' }} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">Business Type</div>
            <select className="form-select">
              <option>Retail — Fashion & Apparel</option>
              <option>Wholesale</option>
              <option>Manufacturing</option>
              <option>E-commerce</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">NTN / Tax ID</div>
            <input className="form-input" placeholder="e.g. 1234567-8" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">Phone Number</div>
            <input className="form-input" defaultValue="0321-1234567" />
          </div>
          <div className="form-group">
            <div className="form-label">Email Address</div>
            <input className="form-input" type="email" defaultValue="hello@mystore.pk" />
          </div>
        </div>
        <div className="form-row" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group">
            <div className="form-label">Website / Shopify URL</div>
            <input className="form-input" placeholder="https://mystore.myshopify.com" style={{ width: '100%' }} />
          </div>
        </div>
        <div className="form-row" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group">
            <div className="form-label">Business Address (Line 1)</div>
            <input className="form-input" placeholder="Street, Building" style={{ width: '100%' }} />
          </div>
        </div>
        <div className="form-row triple">
          <div className="form-group">
            <div className="form-label">City</div>
            <input className="form-input" defaultValue="Lahore" />
          </div>
          <div className="form-group">
            <div className="form-label">Province</div>
            <select className="form-select">
              <option>Punjab</option><option>Sindh</option><option>KPK</option><option>Balochistan</option>
            </select>
          </div>
          <div className="form-group">
            <div className="form-label">Postal Code</div>
            <input className="form-input" placeholder="54000" />
          </div>
        </div>
        <hr />
        <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Business Details</button>
      </div>
    </div>

    <div>
      {/* Branding */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-image" /> Branding</div>
        </div>
        <div className="card-body">
          <div className="form-group" style={{ marginBottom: 12 }}>
            <div className="form-label">Business Logo</div>
            <div className="upload-zone">
              <i className="fa-solid fa-cloud-arrow-up ic-orange upload-zone-icon" />
              <div className="upload-zone-title">Upload Logo</div>
              <div className="upload-zone-hint">PNG, JPG · Max 2MB · Recommended: 300×100px</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Primary Accent Color</div>
              <input className="form-input" type="color" defaultValue="#FF6A00" style={{ padding: '2px 4px', height: 28, cursor: 'pointer' }} />
            </div>
            <div className="form-group">
              <div className="form-label">Invoice Color Theme</div>
              <select className="form-select">
                <option>Orange (Default)</option><option>Blue</option><option>Green</option><option>Monochrome</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <div className="form-label">SMS Sender Name (for customer alerts)</div>
            <input className="form-input" placeholder="MyStore" style={{ width: '100%' }} />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Branding</button>
        </div>
      </div>

      {/* Social Media */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-share-nodes" /> Social Media Links</div>
        </div>
        <div className="card-body">
          <div className="form-group" style={{ marginBottom: 8 }}>
            <div className="form-label"><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }} /> WhatsApp Business</div>
            <input className="form-input" placeholder="https://wa.me/923XX..." style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <div className="form-label"><i className="fa-brands fa-instagram" style={{ color: '#E1306C' }} /> Instagram</div>
            <input className="form-input" placeholder="https://instagram.com/..." style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <div className="form-label"><i className="fa-brands fa-facebook" style={{ color: '#1877F2' }} /> Facebook Page</div>
            <input className="form-input" placeholder="https://facebook.com/..." style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <div className="form-label"><i className="fa-brands fa-tiktok" /> TikTok</div>
            <input className="form-input" placeholder="https://tiktok.com/@..." style={{ width: '100%' }} />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Social Links</button>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// TAB: ORDERS
// ═══════════════════════════════════════════════════════════

const OrdersTab: React.FC = () => (
  <>
    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Order Defaults */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-bag-shopping" /> Order Defaults</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Default Order Status (on Create)</div>
              <select className="form-select"><option>Pending</option><option>Confirmed</option></select>
            </div>
            <div className="form-group">
              <div className="form-label">Default Payment Type</div>
              <select className="form-select"><option>COD</option><option>Prepaid</option></select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Default Order Channel</div>
              <select className="form-select"><option>WhatsApp</option><option>Shopify</option><option>Manual</option></select>
            </div>
            <div className="form-group">
              <div className="form-label">Auto-confirm After (hours)</div>
              <input className="form-input" type="number" defaultValue={24} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            <StgToggleRow label="Auto-deduct Stock on Order Confirm" desc="Reduce inventory when order is confirmed" defaultChecked />
            <StgToggleRow label="Reserve Stock on Pending Orders" desc="Hold stock while order awaits confirmation" defaultChecked />
            <StgToggleRow label="Allow Orders on Out-of-Stock Items" desc="Accept orders even if stock is zero" />
            <StgToggleRow label="Auto-assign Courier on Confirm" desc="Use assignment rules to auto-pick courier" defaultChecked />
            <StgToggleRow label="Alert Manager on Cancellation" defaultChecked />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Order Defaults</button>
        </div>
      </div>

      {/* COD Settings */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-money-bills" /> COD Settings</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Max COD Amount Per Order (₨)</div>
              <input className="form-input" type="number" defaultValue={20000} />
            </div>
            <div className="form-group">
              <div className="form-label">High-Value COD Flag Threshold (₨)</div>
              <input className="form-input" type="number" defaultValue={10000} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">COD Submission Deadline</div>
              <select className="form-select">
                <option>End of Shift</option><option>Daily 6 PM</option><option>Next Morning 10 AM</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Max COD Per Rider (₨)</div>
              <input className="form-input" type="number" defaultValue={15000} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            <StgToggleRow label="Require Manager Approval for High COD" defaultChecked />
            <StgToggleRow label="Auto-mark COD Collected on Delivery Confirm" defaultChecked />
            <StgToggleRow label="Alert Accounts on COD Submission Delay" defaultChecked />
            <StgToggleRow label="Record COD in Financial Module Automatically" defaultChecked />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save COD Settings</button>
        </div>
      </div>
    </div>

    {/* Order ID Format */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-id-card" /> Order ID & Reference Format</div>
      </div>
      <div className="card-body">
        <div className="grid-2">
          <div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Order ID Prefix</div>
                <input className="form-input" defaultValue="ORD-" />
              </div>
              <div className="form-group">
                <div className="form-label">Starting Number</div>
                <input className="form-input" type="number" defaultValue={1001} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Invoice Prefix</div>
                <input className="form-input" defaultValue="INV-" />
              </div>
              <div className="form-group">
                <div className="form-label">Invoice Starting Number</div>
                <input className="form-input" type="number" defaultValue={1001} />
              </div>
            </div>
          </div>
          <div className="order-id-preview">
            <div className="order-id-preview-label">Preview</div>
            <div className="detail-row">
              <div className="detail-key">Next Order ID</div>
              <div className="detail-val">
                <code style={{ fontSize: 11, background: 'var(--card)', padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace', border: '1px solid var(--border)' }}>
                  ORD-1049
                </code>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-key">Next Invoice No.</div>
              <div className="detail-val">
                <code style={{ fontSize: 11, background: 'var(--card)', padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace', border: '1px solid var(--border)' }}>
                  INV-1049
                </code>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <button className="header-btn primary"><i className="fa-solid fa-check" /> Save ID Format</button>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: INVENTORY SETTINGS
// ═══════════════════════════════════════════════════════════

const InventorySettingsTab: React.FC = () => (
  <>
    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Stock Management */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-cubes" /> Stock Management</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Default Low Stock Threshold</div>
              <input className="form-input" type="number" defaultValue={10} />
            </div>
            <div className="form-group">
              <div className="form-label">Critical Stock Threshold</div>
              <input className="form-input" type="number" defaultValue={3} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Alert Notifications To</div>
              <select className="form-select">
                <option>Inventory Manager</option><option>Admin</option><option>Both</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Alert Frequency</div>
              <select className="form-select">
                <option>Real-time</option><option>Daily Digest</option><option>Weekly Digest</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            <StgToggleRow label="Allow Negative Stock" desc="Accept orders when stock is at zero" />
            <StgToggleRow label="Track Variants Independently" desc="Separate stock counts per size/color" defaultChecked />
            <StgToggleRow label="Auto-reorder Notifications" desc="Notify buyer when threshold is hit" defaultChecked />
            <StgToggleRow label="Require Reason on Manual Adjustment" defaultChecked />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Stock Settings</button>
        </div>
      </div>

      {/* SKU Configuration */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-barcode" /> SKU Configuration</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">SKU Prefix</div>
              <input className="form-input" defaultValue="SKU-" />
            </div>
            <div className="form-group">
              <div className="form-label">Starting Number</div>
              <input className="form-input" type="number" defaultValue={1} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">SKU Format</div>
              <select className="form-select">
                <option>PREFIX-NNNN (SKU-0041)</option>
                <option>PREFIX-NAME (SKU-KURTA)</option>
                <option>Auto-increment only</option>
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Variant SKU Separator</div>
              <select className="form-select">
                <option>Dash — SKU-0041-XL</option>
                <option>Slash — SKU-0041/XL</option>
                <option>Underscore — SKU-0041_XL</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            <StgToggleRow label="Auto-generate SKU on Add" desc="Assign SKU automatically when product is created" defaultChecked />
            <StgToggleRow label="Allow Manual SKU Override" defaultChecked />
            <StgToggleRow label="Enforce SKU Uniqueness" desc="Block duplicate SKUs on import or add" defaultChecked />
          </div>
          <hr />
          <div className="sku-preview-box">
            <div className="sku-preview-label">Next SKU Preview</div>
            <code className="sku-preview-value">SKU-0249</code>
          </div>
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save SKU Settings</button>
        </div>
      </div>
    </div>

    {/* Bulk Import */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-file-import" /> Bulk Import Defaults</div>
      </div>
      <div className="card-body">
        <div className="grid-2">
          <div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">On Duplicate SKU</div>
                <select className="form-select">
                  <option>Skip (keep existing)</option><option>Update existing</option><option>Error and stop</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Max Rows Per Import</div>
                <input className="form-input" type="number" defaultValue={500} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Default Category for Unspecified</div>
                <select className="form-select">
                  <option>— None —</option><option>Suits</option><option>Kurtas</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Notify on Import Completion</div>
                <select className="form-select">
                  <option>Yes — Dashboard</option><option>Yes — Email</option><option>No</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <StgToggleRow label="Auto-generate Missing SKUs on Import" defaultChecked />
            <StgToggleRow label="Validate Prices Before Import" desc="Reject rows where sale price < cost price" defaultChecked />
            <StgToggleRow label="Log Import History" defaultChecked />
          </div>
        </div>
        <hr />
        <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Import Settings</button>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

const NotificationsTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        Notification settings control which events trigger alerts and which channels are used. Some channels require integrations to be connected first.
      </div>
    </div>

    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Order Notifications */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-bell" /> Order Notifications</div>
        </div>
        <div className="card-body" style={{ padding: '10px 14px' }}>
          <StgToggleRow label="New Order Created" desc="Notify Sales Ops and Ops Manager" defaultChecked />
          <StgToggleRow label="Order Confirmed" defaultChecked />
          <StgToggleRow label="Order Dispatched (Shipped)" defaultChecked />
          <StgToggleRow label="Order Delivered" desc="Notify Accounts for COD follow-up" defaultChecked />
          <StgToggleRow label="Order Cancelled" desc="Alert Admin and Ops Manager" defaultChecked />
          <StgToggleRow label="Return / RTO Received" desc="Notify Inventory Manager" defaultChecked />
          <StgToggleRow label="Failed Delivery" desc="Alert Ops Manager immediately" defaultChecked />
        </div>
      </div>

      {/* Inventory & Finance */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-warehouse" /> Inventory & Finance Notifications</div>
        </div>
        <div className="card-body" style={{ padding: '10px 14px' }}>
          <StgToggleRow label="Low Stock Alert" desc="When stock falls below threshold" defaultChecked />
          <StgToggleRow label="Out-of-Stock Alert" defaultChecked />
          <StgToggleRow label="Stock Adjustment Made" desc="Log and notify Admin on any manual change" defaultChecked />
          <StgToggleRow label="COD Submission Delayed" defaultChecked />
          <StgToggleRow label="Supplier Balance Overdue" defaultChecked />
          <StgToggleRow label="Large Expense Logged" desc="Alert when expense exceeds threshold" defaultChecked />
          <StgToggleRow label="Daily Financial Summary" desc="End-of-day P&L sent to Admin" defaultChecked />
        </div>
      </div>
    </div>

    {/* Channels */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-satellite-dish" /> Notification Channels</div>
      </div>
      <div className="card-body">
        <div className="grid-2">
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Delivery Channels
            </div>
            <StgToggleRow label="In-app Dashboard" defaultChecked />
            <StgToggleRow label="WhatsApp (if connected)" defaultChecked />
            <StgToggleRow label="Slack (if connected)" />
            <StgToggleRow label="Email" />
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Threshold Settings
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Large Expense Alert Threshold (₨)</div>
                <input className="form-input" type="number" defaultValue={10000} />
              </div>
              <div className="form-group">
                <div className="form-label">Delay Alert After (minutes)</div>
                <input className="form-input" type="number" defaultValue={20} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Weekly Report Day</div>
                <select className="form-select">
                  <option>Sunday</option><option>Monday</option><option>Saturday</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Notify Who by Default</div>
                <select className="form-select">
                  <option>Admin Only</option><option>Ops Manager</option><option>Admin + Ops Manager</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Notification Settings</button>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: INTEGRATIONS
// ═══════════════════════════════════════════════════════════

interface IntegrationCardProps {
  id: string;
  logoChar?: string;
  logoIcon?: string;
  logoColor: string;
  title: string;
  subtitle: string;
  desc: string;
  connected?: boolean;
  children?: React.ReactNode;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  id, logoChar, logoIcon, logoColor, title, subtitle, desc, connected = false, children
}) => {
  const [isConnected, setIsConnected] = useState(connected);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setIsConnected(true); }, 1500);
  };

  return (
    <div className="card">
      <div className="card-body" style={{ padding: 16 }}>
        <div className="int-card-header">
          <div className="int-logo" style={{ background: `${logoColor}20`, color: logoColor }}>
            {logoIcon
              ? <i className={`${logoIcon} int-logo-icon`} style={{ color: logoColor }} />
              : logoChar}
          </div>
          <div>
            <div className="int-card-title">{title}</div>
            <div className="int-card-sub">{subtitle}</div>
          </div>
          <span className={`badge ${isConnected ? 'green' : 'gray'}`} style={{ marginLeft: 'auto' }}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        <div className="int-card-desc">{desc}</div>
        {isConnected ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="header-btn" style={{ flex: 1, justifyContent: 'center' }}>
              <i className="fa-solid fa-gear" /> Configure
            </button>
            <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={() => setIsConnected(false)}>
              <i className="fa-solid fa-unlink" />
            </button>
          </div>
        ) : (
          <>
            {children}
            <button className="header-btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={handleConnect} disabled={loading}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin" /> Connecting...</>
                : <><i className="fa-solid fa-plug" /> Connect {title}</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const IntegrationsTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        Connect third-party platforms to automate order import, courier tracking, payment verification, and financial reconciliation.
        All credentials are encrypted at rest.
      </div>
    </div>

    <SectionDivider label="E-Commerce Platforms" />
    <div className="grid-3" style={{ marginBottom: 14 }}>
      <IntegrationCard
        id="shopify" logoChar="S" logoColor="#96BF48"
        title="Shopify" subtitle="Order & inventory sync"
        desc="Automatically pull confirmed Shopify orders, sync stock levels, and mark products as sold-out when inventory hits zero."
      >
        <div className="form-group" style={{ marginBottom: 8 }}>
          <div className="form-label">Store URL</div>
          <input className="form-input" placeholder="mystore.myshopify.com" style={{ width: '100%' }} />
        </div>
        <div className="form-group" style={{ marginBottom: 4 }}>
          <div className="form-label">API Key</div>
          <input className="form-input" type="password" placeholder="shpat_••••••••••••" style={{ width: '100%' }} />
        </div>
      </IntegrationCard>

      <IntegrationCard
        id="woocommerce" logoChar="W" logoColor="#7F54B3"
        title="WooCommerce" subtitle="WordPress order sync"
        desc="Import WooCommerce orders into the system. Stock is deducted automatically when orders are placed and confirmed."
      >
        <div className="form-group" style={{ marginBottom: 8 }}>
          <div className="form-label">Site URL</div>
          <input className="form-input" placeholder="https://mystore.com" style={{ width: '100%' }} />
        </div>
        <div className="form-group" style={{ marginBottom: 4 }}>
          <div className="form-label">Consumer Key</div>
          <input className="form-input" type="password" placeholder="ck_••••••••••••" style={{ width: '100%' }} />
        </div>
      </IntegrationCard>

      <IntegrationCard
        id="whatsapp" logoIcon="fa-brands fa-whatsapp" logoColor="#25D366"
        title="WhatsApp Business" subtitle="Order alerts & notifications"
        desc="Send order confirmations, dispatch updates, and staff task notifications via WhatsApp Business API."
        connected
      />
    </div>

    <SectionDivider label="Courier APIs" />
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-truck" /> Courier API Credentials</div>
        <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add Courier API</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Courier</th><th>Endpoint</th><th>API Key</th><th>Status</th><th>Last Sync</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {COURIER_API_DATA.map((c, i) => (
              <tr key={i}>
                <td><strong>{c.courier}</strong></td>
                <td><code className="courier-endpoint-code">{c.endpoint}</code></td>
                <td><code className="courier-endpoint-code">{c.key}</code></td>
                <td>
                  <span className={`badge ${c.status === 'Connected' ? 'green' : 'red'}`}>{c.status}</span>
                </td>
                <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{c.lastSync}</span></td>
                <td>
                  <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', marginRight: 4 }}>
                    <i className="fa-solid fa-rotate" /> Test
                  </button>
                  <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px' }}>
                    <i className="fa-solid fa-key" /> Update Key
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <SectionDivider label="Payment Gateways" />
    <div className="grid-3">
      <IntegrationCard
        id="paymob" logoChar="Pm" logoColor="#2CA01C"
        title="Paymob" subtitle="Card payment gateway"
        desc="Accept card payments online and auto-mark Paymob transactions as prepaid orders when payment is confirmed."
      />
      <IntegrationCard
        id="jazzcash" logoChar="JC" logoColor="#AA1F27"
        title="JazzCash" subtitle="Mobile wallet payments"
        desc="Receive JazzCash payments for prepaid orders and log rider payouts digitally through the earnings module."
      />
      <IntegrationCard
        id="easypaisa" logoChar="EP" logoColor="#02a550"
        title="EasyPaisa" subtitle="Mobile wallet payments"
        desc="Verify EasyPaisa transactions for prepaid orders and log rider payout history automatically in finance."
      />
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: USERS & ACCESS
// ═══════════════════════════════════════════════════════════

const UsersTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        Manage who can access the system and what they can do. Role-based access control restricts modules per user role.
      </div>
    </div>

    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Access Policies */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-user-gear" /> Access Policies</div>
        </div>
        <div className="card-body" style={{ padding: '10px 14px' }}>
          <StgToggleRow label="Enforce Role-Based Access Control (RBAC)" desc="Users can only access modules assigned to their role" defaultChecked />
          <StgToggleRow label="Allow Staff to View Own Performance Only" desc="Hide other staff metrics from non-admin users" defaultChecked />
          <StgToggleRow label="Hide Cost Price from Sales Operators" defaultChecked />
          <StgToggleRow label="Hide Financial Reports from Non-Finance Roles" defaultChecked />
          <StgToggleRow label="Require Manager Approval for Stock Adjustments" defaultChecked />
          <StgToggleRow label="Allow Staff to Self Check-In (Attendance)" defaultChecked />
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Access Policies</button>
        </div>
      </div>

      {/* Password Policy */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-key" /> Password & Login Policy</div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Minimum Password Length</div>
              <input className="form-input" type="number" defaultValue={8} />
            </div>
            <div className="form-group">
              <div className="form-label">Password Expiry (days)</div>
              <input className="form-input" type="number" placeholder="Never" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Max Failed Login Attempts</div>
              <input className="form-input" type="number" defaultValue={5} />
            </div>
            <div className="form-group">
              <div className="form-label">Lockout Duration (minutes)</div>
              <input className="form-input" type="number" defaultValue={30} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
            <StgToggleRow label="Require Uppercase Letter in Password" defaultChecked />
            <StgToggleRow label="Require Number in Password" defaultChecked />
            <StgToggleRow label="Require Special Character" />
            <StgToggleRow label="Force Password Change on First Login" defaultChecked />
          </div>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Password Policy</button>
        </div>
      </div>
    </div>

    {/* Active Users */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-users" /> Active Users Overview</div>
        <button className="header-btn">
          <i className="fa-solid fa-arrow-up-right-from-square" /> Manage Staff
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Staff Member</th><th>Role</th><th>Last Login</th><th>Login Device</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {USERS_OVERVIEW.map((u, i) => {
              const initials = getInitials(u.name);
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <tr key={i}>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar" style={{ background: `${color}20`, color, fontSize: 9.5, fontWeight: 700 }}>
                        {initials}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td><span className="tag">{u.role}</span></td>
                  <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{u.lastLogin}</span></td>
                  <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{u.device}</span></td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'green' : 'orange'}`}>{u.status}</span>
                  </td>
                  <td>
                    <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', marginRight: 4 }}>
                      <i className="fa-solid fa-key" /> Reset PW
                    </button>
                    {u.status === 'Active'
                      ? <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', color: 'var(--red)' }}>
                          <i className="fa-solid fa-ban" />
                        </button>
                      : <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', color: 'var(--green)' }}>
                          <i className="fa-solid fa-circle-check" />
                        </button>}
                  </td>
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
// TAB: SECURITY
// ═══════════════════════════════════════════════════════════

const SecurityTab: React.FC = () => (
  <>
    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/* Security Settings */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-shield-halved" /> Security Settings</div>
        </div>
        <div className="card-body" style={{ padding: '10px 14px' }}>
          <StgToggleRow label="Two-Factor Authentication (2FA)" desc="Require 2FA for Admin and Manager logins" />
          <StgRow label="Session Timeout (minutes)">
            <input type="number" defaultValue={60} className="form-input" style={{ width: 70, height: 26, fontSize: 11 }} />
          </StgRow>
          <StgToggleRow label="Single Device Login" desc="Log out previous session on new login" />
          <StgToggleRow label="Restrict Login to Office IP" desc="Block logins from unknown IP addresses" />
          <StgToggleRow label="Alert on Login from New Device" defaultChecked />
          <StgToggleRow label="Log All Admin Actions to Audit Trail" defaultChecked />
          <StgRow label="Audit Log Retention (days)">
            <input type="number" defaultValue={90} className="form-input" style={{ width: 70, height: 26, fontSize: 11 }} />
          </StgRow>
          <hr />
          <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Security Settings</button>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-network-wired" /> IP Whitelist</div>
          <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add IP</button>
        </div>
        <div className="card-body">
          <div className="alert-strip info" style={{ marginBottom: 10 }}>
            <i className="fa-solid fa-circle-info" />
            Only whitelisted IPs can access the admin panel. Leave empty to allow all IPs.
          </div>
          <div className="list-item">
            <div className="list-content">
              <div className="list-title"><code className="ip-code">192.168.1.0/24</code></div>
              <div className="list-meta">Office LAN — Lahore HQ</div>
            </div>
            <div className="list-right"><span className="badge green">Active</span></div>
          </div>
          <div className="list-item">
            <div className="list-content">
              <div className="list-title"><code className="ip-code">203.55.11.10</code></div>
              <div className="list-meta">Admin Home — Static IP</div>
            </div>
            <div className="list-right"><span className="badge green">Active</span></div>
          </div>
          <hr />
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">IP Address / Range</div>
              <input className="form-input" placeholder="e.g. 192.168.1.100" />
            </div>
            <div className="form-group">
              <div className="form-label">Label</div>
              <input className="form-input" placeholder="e.g. Office Network" />
            </div>
          </div>
          <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add to Whitelist</button>
        </div>
      </div>
    </div>

    {/* Security Events */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Security Events</div>
        <button className="header-btn"><i className="fa-solid fa-file-export" /> Export Log</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Timestamp</th><th>Event</th><th>User</th><th>IP Address</th><th>Device</th><th>Severity</th></tr>
          </thead>
          <tbody>
            {SECURITY_LOG.map((l, i) => (
              <tr key={i}>
                <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l.time}</span></td>
                <td><strong style={{ fontSize: 11.5 }}>{l.event}</strong></td>
                <td>{l.user}</td>
                <td><code style={{ fontSize: 10, fontFamily: 'monospace', background: 'var(--bg)', padding: '1px 4px', borderRadius: 3 }}>{l.ip}</code></td>
                <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{l.device}</span></td>
                <td><span className={`badge ${severityBadgeColor(l.severity)}`}>{l.severity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════
// TAB: BACKUP & DATA
// ═══════════════════════════════════════════════════════════

const BackupTab: React.FC = () => {
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>(INITIAL_BACKUP_HISTORY);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupDone, setBackupDone] = useState(false);

  const runBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      setBackupDone(true);
      const now = new Date();
      const label = `${now.getDate()} May ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setBackupHistory(prev => [
        { date: label, size: '4.3 MB', duration: '11s', status: 'Success' },
        ...prev,
      ]);
      setTimeout(() => setBackupDone(false), 3000);
    }, 2000);
  };

  return (
    <>
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Last Backup</div>
            <div className="stat-icon" style={{ background: 'var(--green-bg)' }}>
              <i className="fa-solid fa-circle-check ic-green" />
            </div>
          </div>
          <div className="stat-value stat-value-sm">11 May</div>
          <div className="stat-trend up"><i className="fa-solid fa-circle-check" /> 08:00 AM · Success</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Backup Size</div>
            <div className="stat-icon" style={{ background: '#EFF6FF' }}>
              <i className="fa-solid fa-database" style={{ color: 'var(--blue)' }} />
            </div>
          </div>
          <div className="stat-value">4.2 MB</div>
          <div className="stat-trend neutral">Compressed archive</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Backups Stored</div>
            <div className="stat-icon" style={{ background: '#FFFBEB' }}>
              <i className="fa-solid fa-boxes-stacked ic-yellow" />
            </div>
          </div>
          <div className="stat-value">30</div>
          <div className="stat-trend neutral">Last 30 days retained</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Next Scheduled</div>
            <div className="stat-icon" style={{ background: '#FFF5EE' }}>
              <i className="fa-solid fa-clock ic-orange" />
            </div>
          </div>
          <div className="stat-value stat-value-sm">12 May</div>
          <div className="stat-trend neutral">08:00 AM · Auto</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        {/* Backup Config */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-database" /> Backup Configuration</div>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Auto-backup Frequency</div>
                <select className="form-select">
                  <option>Daily</option><option>Weekly</option><option>Twice Daily</option><option>Manual Only</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Backup Time</div>
                <input className="form-input" type="time" defaultValue="08:00" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Retention Period (days)</div>
                <input className="form-input" type="number" defaultValue={30} />
              </div>
              <div className="form-group">
                <div className="form-label">Backup Format</div>
                <select className="form-select">
                  <option>Compressed ZIP</option><option>SQL Dump</option><option>JSON Export</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Storage Destination</div>
                <select className="form-select">
                  <option>Local Server</option><option>Google Drive</option><option>AWS S3</option><option>Dropbox</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Notify Admin on Failure</div>
                <select className="form-select">
                  <option>Yes — Dashboard</option><option>Yes — Email</option><option>No</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
              <StgToggleRow label="Include Product Images in Backup" />
              <StgToggleRow label="Encrypt Backup File" desc="AES-256 encryption applied to all backups" defaultChecked />
            </div>
            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Backup Settings</button>
              <button className="header-btn" onClick={runBackup} disabled={backupLoading}>
                {backupLoading
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Running...</>
                  : backupDone
                    ? <><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }} /> Done!</>
                    : <><i className="fa-solid fa-play" /> Run Backup Now</>}
              </button>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Backup History</div>
          </div>
          <div className="backup-list-wrap">
            {backupHistory.map((b, i) => (
              <div key={i} className="list-item">
                <div className="list-icon" style={{ background: b.status === 'Success' ? 'var(--green-bg)' : 'var(--red-bg)' }}>
                  <i className={`fa-solid fa-${b.status === 'Success' ? 'circle-check ic-green' : 'circle-xmark ic-red'}`}
                    style={{ fontSize: 11 }} />
                </div>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 11 }}>{b.date}</div>
                  <div className="list-meta">{b.size} · {b.duration} · {b.status}</div>
                </div>
                <div className="list-right">
                  {b.status === 'Success'
                    ? <button className="header-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button>
                    : <button className="header-btn" style={{ height: 23, fontSize: 9.5, color: 'var(--red)' }}><i className="fa-solid fa-rotate" /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Data Export */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-export" /> Data Export</div>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Export all your data in a portable format. Use for migration, compliance, or archiving purposes.
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Export Type</div>
                <select className="form-select">
                  <option>Full System Export</option>
                  <option>Products Only</option>
                  <option>Orders Only</option>
                  <option>Customers Only</option>
                  <option>Financial Records</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">File Format</div>
                <select className="form-select">
                  <option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>JSON</option>
                </select>
              </div>
            </div>
            <button className="header-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fa-solid fa-file-export" /> Export Data
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-triangle-exclamation ic-red" /> Danger Zone</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="danger-item">
                <div>
                  <div className="danger-item-title">Clear All Order History</div>
                  <div className="danger-item-desc">Permanently delete all orders. Cannot be undone.</div>
                </div>
                <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)', flexShrink: 0 }}>
                  <i className="fa-solid fa-trash" /> Clear
                </button>
              </div>
              <div className="danger-item">
                <div>
                  <div className="danger-item-title">Reset Inventory Counts</div>
                  <div className="danger-item-desc">Set all stock quantities to zero. Use before a full recount.</div>
                </div>
                <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)', flexShrink: 0 }}>
                  <i className="fa-solid fa-rotate-left" /> Reset
                </button>
              </div>
              <div className="danger-item">
                <div>
                  <div className="danger-item-title">Factory Reset</div>
                  <div className="danger-item-desc">Wipe all data and return system to default state.</div>
                </div>
                <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)', flexShrink: 0 }}>
                  <i className="fa-solid fa-bomb" /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

  const tabs: { id: SettingsTab; icon: string; label: string }[] = [
    { id: 'general',       icon: 'fa-sliders',        label: 'General'        },
    { id: 'business',      icon: 'fa-store',           label: 'Business Profile' },
    { id: 'orders',        icon: 'fa-bag-shopping',    label: 'Orders'         },
    { id: 'inventory',     icon: 'fa-warehouse',       label: 'Inventory'      },
    { id: 'notifications', icon: 'fa-bell',            label: 'Notifications'  },
    { id: 'integrations',  icon: 'fa-plug',            label: 'Integrations'   },
    { id: 'users',         icon: 'fa-users-gear',      label: 'Users & Access' },
    { id: 'security',      icon: 'fa-shield-halved',   label: 'Security'       },
    { id: 'backup',        icon: 'fa-database',        label: 'Backup & Data'  },
  ];

  return (
    <div id="page-settings">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      <div className="section-heading">Settings</div>
      <div className="section-subheading">
        Configure system-wide preferences, business information, integrations, and operational defaults for your inventory management system.
      </div>

      {/* Horizontal Tabs */}
      <div className="h-tabs">
        {tabs.map(t => (
          <div
            key={t.id}
            className={`h-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => switchTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'general'       && <GeneralTab />}
      {activeTab === 'business'      && <BusinessTab />}
      {activeTab === 'orders'        && <OrdersTab />}
      {activeTab === 'inventory'     && <InventorySettingsTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'integrations'  && <IntegrationsTab />}
      {activeTab === 'users'         && <UsersTab />}
      {activeTab === 'security'      && <SecurityTab />}
      {activeTab === 'backup'        && <BackupTab />}
    </div>
  );
};

export default SettingsPage;