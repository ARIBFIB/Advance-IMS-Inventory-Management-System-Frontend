import React from 'react';
import { StgToggleRow } from './SettingsShared';

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

export default NotificationsTab;