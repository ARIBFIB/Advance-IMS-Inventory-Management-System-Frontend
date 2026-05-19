// DeliveredPanel.tsx
import React, { useState } from 'react';
import { DELIVERED_ITEMS, fmt, Badge, InnerTabs, EmptyState } from './shared';

const DeliveredPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');

  return (
    <>
      <div className="panel-heading">Delivered</div>
      <div className="panel-desc">
        Confirmed successful deliveries. Verify COD collection status and view proof of delivery.
      </div>

      <InnerTabs
        tabs={[
          { id: 'all',      label: 'All Delivered'      },
          { id: 'cod-pend', label: 'COD Not Collected'  },
          { id: 'cod-done', label: 'COD Collected'      },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {innerTab === 'all' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search..." />
              </div>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
            </div>
          </div>

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tracking No.</th><th>Order</th><th>Customer</th><th>Courier</th>
                  <th>Delivered On</th><th>Days Taken</th><th>COD Amount</th>
                  <th>COD Status</th><th>Proof</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERED_ITEMS.map(d => (
                  <tr key={d.track}>
                    <td><code className="sku">{d.track}</code></td>
                    <td>{d.order}</td>
                    <td>{d.customer}</td>
                    <td><span className="tag">{d.courier}</span></td>
                    <td>{d.deliveredOn}</td>
                    <td>{d.days}d</td>
                    <td><strong>{fmt(d.cod)}</strong></td>
                    <td><Badge label={d.codStatus} /></td>
                    <td>
                      <span className={`badge ${d.proof === 'Yes' ? 'green' : 'gray'}`}>
                        {d.proof === 'Yes' ? 'Available' : 'None'}
                      </span>
                    </td>
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-coins" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {innerTab === 'cod-pend' && (
        <>
          <div className="alert-strip warn">
            <i className="fa-solid fa-coins" />
            ₨38,400 in COD has been delivered but not yet collected from couriers.
          </div>
          <div className="card">
            <div className="card-body">
              <EmptyState icon="fa-money-bill-wave" title="COD Not Yet Collected" desc="14 deliveries pending COD remittance from courier." />
            </div>
          </div>
        </>
      )}

      {innerTab === 'cod-done' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-circle-check" title="COD Fully Collected" desc="54 deliveries with COD fully remitted and confirmed." />
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveredPanel;