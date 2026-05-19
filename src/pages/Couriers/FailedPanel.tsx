// FailedPanel.tsx
import React from 'react';
import { FAILED_ITEMS, Badge } from './shared';

const FailedPanel: React.FC = () => (
  <>
    <div className="panel-heading">Failed Deliveries</div>
    <div className="panel-desc">
      Delivery attempts that could not be completed after maximum attempts. Re-dispatch or cancel.
    </div>

    <div className="alert-strip danger">
      <i className="fa-solid fa-circle-xmark" />
      <strong>4 deliveries</strong> failed after maximum attempts. Review and take action immediately.
    </div>

    <div className="card">
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking No.</th><th>Order</th><th>Customer</th><th>Phone</th><th>Courier</th>
              <th>Attempts</th><th>Last Attempt</th><th>Failure Reason</th><th>Action Taken</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {FAILED_ITEMS.map(f => (
              <tr key={f.track}>
                <td><code className="sku">{f.track}</code></td>
                <td>{f.order}</td>
                <td>{f.customer}</td>
                <td>{f.phone}</td>
                <td><span className="tag">{f.courier}</span></td>
                <td style={{ fontWeight: 700, color: 'var(--red)' }}>{f.attempts}</td>
                <td>{f.last}</td>
                <td>{f.reason}</td>
                <td><Badge label={f.action} /></td>
                <td style={{ display: 'flex', gap: 4 }}>
                  <button className="c-btn primary" style={{ height: 23, fontSize: 9.5 }}>
                    <i className="fa-solid fa-truck" /> Re-dispatch
                  </button>
                  <button className="c-btn" style={{ height: 23, fontSize: 9.5, color: 'var(--red)' }}>
                    <i className="fa-solid fa-xmark" /> Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default FailedPanel;