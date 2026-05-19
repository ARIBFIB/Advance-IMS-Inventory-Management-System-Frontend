// FailedDeliveriesPanel.tsx
import React from 'react';
import { FAILED_DELIVERIES, Badge } from './shared';

const FailedDeliveriesPanel: React.FC = () => (
  <>
    <div className="panel-heading">Failed Deliveries &amp; Returns</div>
    <div className="panel-desc">
      Deliveries that could not be completed by internal riders. Review failure reason,
      re-attempt or mark as returned.
    </div>

    <div className="alert-strip danger">
      <i className="fa-solid fa-circle-xmark" />
      <strong>3 deliveries</strong> marked as failed after maximum attempts.
    </div>

    <div className="card">
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Rider</th><th>Customer</th><th>Phone</th><th>Attempts</th>
              <th>Last Attempt</th><th>Failure Reason</th><th>Action</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {FAILED_DELIVERIES.map(f => (
              <tr key={f.order}>
                <td><strong>{f.order}</strong></td>
                <td>{f.rider.split(' ')[0]}</td>
                <td>{f.customer}</td>
                <td>{f.phone}</td>
                <td style={{ fontWeight: 700, color: 'var(--red)' }}>{f.attempts}</td>
                <td>{f.last}</td>
                <td>{f.reason}</td>
                <td><Badge label={f.action} /></td>
                <td style={{ display: 'flex', gap: 4 }}>
                  <button className="c-btn primary" style={{ height: 22, fontSize: 9.5 }}>
                    <i className="fa-solid fa-rotate" /> Re-attempt
                  </button>
                  <button className="c-btn" style={{ height: 22, fontSize: 9.5, color: 'var(--red)' }}>
                    <i className="fa-solid fa-xmark" />
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

export default FailedDeliveriesPanel;