// ReturnsPanel.tsx
import React, { useState } from 'react';
import { RTO_ITEMS, Badge, InnerTabs, EmptyState } from './shared';

const ReturnsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');
  const rtoReasons = [
    { r: 'Customer Refused', n: 2 },
    { r: 'Wrong Address',    n: 2 },
    { r: 'Not Reachable',    n: 1 },
    { r: 'Not Home',         n: 1 },
  ];

  return (
    <>
      <div className="panel-heading">Returns / RTO</div>
      <div className="panel-desc">
        Shipments returned to origin. Log receipt, process restocking, analyze return reasons, and
        track courier charges.
      </div>

      <InnerTabs
        tabs={[
          { id: 'all',      label: 'All Returns'          },
          { id: 'pending',  label: 'Awaiting Receipt'     },
          { id: 'received', label: 'Received & Processed' },
          { id: 'reasons',  label: 'Return Reasons'       },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {innerTab === 'all' && (
        <>
          <div className="mini-stats">
            <div className="mini-stat"><div className="ms-label">Total RTO</div><div className="ms-value">6</div><div className="ms-trend">4.2% of dispatched</div></div>
            <div className="mini-stat"><div className="ms-label">Awaiting Receipt</div><div className="ms-value">4</div><div className="ms-trend down">₨8,400 in transit back</div></div>
            <div className="mini-stat"><div className="ms-label">Restocked</div><div className="ms-value">2</div><div className="ms-trend up">Back in inventory</div></div>
            <div className="mini-stat"><div className="ms-label">RTO Courier Charge</div><div className="ms-value">₨1,200</div><div className="ms-trend down">Charged by courier</div></div>
          </div>
          <div className="card">
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tracking No.</th><th>Order</th><th>Customer</th><th>Courier</th>
                    <th>Return Reason</th><th>Dispatched</th><th>RTO Date</th>
                    <th>COD Recovered</th><th>Restock Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {RTO_ITEMS.map(r => (
                    <tr key={r.track}>
                      <td><code className="sku">{r.track}</code></td>
                      <td>{r.order}</td>
                      <td>{r.customer}</td>
                      <td><span className="tag">{r.courier}</span></td>
                      <td>{r.reason}</td>
                      <td>{r.dispatched}</td>
                      <td>{r.rtoDate}</td>
                      <td>{r.cod}</td>
                      <td><Badge label={r.restock} /></td>
                      <td>
                        <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                          <i className="fa-solid fa-plus" /> Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {innerTab === 'pending' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-truck" title="4 Returns In Transit" desc="Awaiting receipt from courier — mark as received once inventory is back." />
          </div>
        </div>
      )}

      {innerTab === 'received' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-boxes-stacked" title="2 Returns Processed" desc="Received and restocked into inventory." />
          </div>
        </div>
      )}

      {innerTab === 'reasons' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-pie" /> Return Reason Analysis</div>
          </div>
          <div className="card-body">
            {rtoReasons.map(x => (
              <div key={x.r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 130, fontSize: 10.5, color: 'var(--text-secondary)' }}>{x.r}</div>
                <div className="perf-bar">
                  <div className="perf-fill" style={{ width: `${x.n / 2 * 100}%`, background: 'var(--red)' }} />
                </div>
                <div style={{ width: 20, fontSize: 10.5, fontWeight: 700, textAlign: 'right' }}>{x.n}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnsPanel;