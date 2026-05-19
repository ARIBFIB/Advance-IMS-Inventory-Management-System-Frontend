// InTransitPanel.tsx
import React, { useState } from 'react';
import { TRANSIT_ITEMS, Badge, InnerTabs, EmptyState } from './shared';

const InTransitPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');

  return (
    <>
      <div className="panel-heading">In Transit</div>
      <div className="panel-desc">
        Shipments currently on the way to customers. Monitor location, expected delivery, and flag
        delayed shipments.
      </div>

      <InnerTabs
        tabs={[
          { id: 'all',     label: 'All In Transit' },
          {
            id: 'delayed', label: (
              <span>
                Delayed{' '}
                <span style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>
                  7
                </span>
              </span>
            ),
          },
          { id: 'ofd', label: 'Out for Delivery' },
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
                <input placeholder="Search tracking no..." />
              </div>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn"><i className="fa-solid fa-rotate" /> Sync Tracking</button>
            </div>
          </div>

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tracking No.</th><th>Order</th><th>Customer</th><th>Courier</th>
                  <th>Current Location</th><th>Status</th><th>Dispatched</th>
                  <th>Est. Delivery</th><th>Days Left</th><th>COD</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {TRANSIT_ITEMS.map(t => (
                  <tr key={t.track}>
                    <td><code className="sku">{t.track}</code></td>
                    <td>{t.order}</td>
                    <td>{t.customer}</td>
                    <td><span className="tag">{t.courier}</span></td>
                    <td>{t.location}</td>
                    <td><Badge label={t.status} /></td>
                    <td>{t.dispatched}</td>
                    <td>{t.est}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: t.daysLeft === 0 ? 'var(--red)' : 'var(--text-primary)' }}>
                        {t.daysLeft === 0 ? 'Today' : `${t.daysLeft} day(s)`}
                      </span>
                    </td>
                    <td>{t.cod}</td>
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-location-dot" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {innerTab === 'delayed' && (
        <>
          <div className="alert-strip danger">
            <i className="fa-solid fa-circle-xmark" />
            <strong>7 shipments</strong> are past their estimated delivery date. Contact couriers immediately.
          </div>
          <div className="card">
            <div className="card-body">
              <EmptyState icon="fa-truck" title="7 Shipments Delayed" desc="Contact respective couriers for status update." />
            </div>
          </div>
        </>
      )}

      {innerTab === 'ofd' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-person-walking-arrow-right" title="Out for Delivery Today" desc="12 shipments out for delivery — awaiting confirmation." />
          </div>
        </div>
      )}
    </>
  );
};

export default InTransitPanel;