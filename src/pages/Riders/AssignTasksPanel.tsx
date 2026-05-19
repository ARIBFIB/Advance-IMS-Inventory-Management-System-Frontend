// AssignTasksPanel.tsx
import React from 'react';
import {
  RIDERS, UNASSIGNED_ORDERS,
  Badge, RiderAvatar,
} from './shared';

const AssignTasksPanel: React.FC = () => {
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <>
      <div className="panel-heading">Assign Delivery Tasks</div>
      <div className="panel-desc">
        Orders ready for internal rider assignment. Review customer location and available riders,
        then assign. Supports bulk assignment.
      </div>

      <div className="detail-grid-2" style={{ marginBottom: 14 }}>
        {/* Unassigned Orders */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-clipboard-list" /> Unassigned Orders (5)</div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Order ID</th><th>Customer</th><th>Area</th><th>COD</th><th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {UNASSIGNED_ORDERS.map(o => (
                  <tr key={o.order}>
                    <td><input type="checkbox" /></td>
                    <td><strong>{o.order}</strong></td>
                    <td>{o.customer}</td>
                    <td><span className="tag">{o.area}</span></td>
                    <td><strong>{o.cod}</strong></td>
                    <td><Badge label={o.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Riders */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-person-biking" /> Available Riders</div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {activeRiders.map(r => (
              <div className="list-item" key={r.id}>
                <RiderAvatar rider={r} fontSize={9} />
                <div className="list-content">
                  <div className="list-title">{r.name}</div>
                  <div className="list-meta">{r.zone} · {r.vehicle}</div>
                </div>
                <div className="list-right">
                  <Badge label={r.availability} />
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3 }}>
                    {r.deliveries % 5} today
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Assign Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-paper-plane" /> Quick Assign</div>
        </div>
        <div className="card-body">
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Select Order</div>
              <select className="c-form-select">
                {UNASSIGNED_ORDERS.map(o => (
                  <option key={o.order}>{o.order} — {o.customer} ({o.area})</option>
                ))}
              </select>
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Assign To Rider</div>
              <select className="c-form-select">
                {activeRiders.map(r => <option key={r.id}>{r.name} ({r.zone})</option>)}
              </select>
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Priority</div>
              <select className="c-form-select">
                <option>Normal</option><option>High</option><option>Urgent</option>
              </select>
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Expected Delivery By</div>
              <input className="c-form-input" type="time" defaultValue="17:00" />
            </div>
          </div>
          <div className="c-form-row single">
            <div className="c-form-group">
              <div className="c-form-label">Notes for Rider</div>
              <textarea className="c-form-textarea" placeholder="e.g. Call on arrival, leave at gate..." />
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="c-btn primary">
              <i className="fa-solid fa-paper-plane" /> Assign &amp; Notify Rider
            </button>
            <button className="c-btn"><i className="fa-solid fa-layer-group" /> Bulk Assign</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignTasksPanel;