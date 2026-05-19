// TrackingPanel.tsx
import React, { useState } from 'react';
import { COURIERS, BULK_SYNC, Badge, InnerTabs, EmptyState } from './shared';

const TrackingPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('lookup');

  const timeline = [
    { title: 'Order Dispatched',               meta: '07 May 2026, 09:30 · Lahore Hub',        done: true,  active: false },
    { title: 'Picked up from Shipper',          meta: '07 May 2026, 11:00 · Gulberg, Lahore',   done: true,  active: false },
    { title: 'In Transit — Lahore → Islamabad', meta: '08 May 2026, 02:15',                     done: true,  active: false },
    { title: 'Arrived at Destination Hub',      meta: '09 May 2026, 08:45 · Islamabad Hub',     done: false, active: true  },
    { title: 'Out for Delivery',                meta: 'Pending',                                done: false, active: false },
  ];

  return (
    <>
      <div className="panel-heading">Live Tracking</div>
      <div className="panel-desc">
        Pull real-time shipment status from connected courier APIs. Enter a tracking number for a
        full timeline or bulk refresh all active shipments.
      </div>

      <InnerTabs
        tabs={[
          { id: 'lookup',  label: 'Tracking Lookup' },
          { id: 'bulk',    label: 'Bulk Refresh'    },
          { id: 'history', label: 'Status History'  },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── LOOKUP ── */}
      {innerTab === 'lookup' && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-location-dot" /> Track a Shipment</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <input className="c-form-input" style={{ flex: 1, maxWidth: 300 }} placeholder="Enter tracking number or order ID..." />
              <select className="c-form-select" style={{ minWidth: 120 }}>
                <option>All Couriers</option>
                {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
              <button className="c-btn primary"><i className="fa-solid fa-magnifying-glass" /> Track</button>
            </div>

            <div className="detail-grid-2">
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Shipment Details
                </div>
                {[
                  ['Tracking No.', <code className="sku">TCS-2026-04821</code>],
                  ['Order', 'ORD-1046'],
                  ['Customer', 'Sara Khan · 0333-5552211'],
                  ['Courier', 'TCS Express'],
                  ['Destination', 'Islamabad'],
                  ['Est. Delivery', '12 May 2026'],
                  ['COD Amount', '₨3,600'],
                  ['Current Status', <Badge label="In Transit" />],
                ].map(([k, v], i) => (
                  <div className="detail-row" key={i}>
                    <div className="detail-key">{k}</div>
                    <div className="detail-val">{v}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Tracking Timeline
                </div>
                <div className="timeline">
                  {timeline.map((tl, i) => (
                    <div className="tl-item" key={i}>
                      <div className="tl-dot-col">
                        <div className={`tl-dot ${tl.done ? 'done' : ''} ${tl.active ? 'active' : ''}`} />
                        {i < timeline.length - 1 && <div className="tl-line" />}
                      </div>
                      <div className="tl-content">
                        <div className="tl-title" style={{ color: !tl.done && !tl.active ? 'var(--text-muted)' : undefined }}>
                          {tl.title}
                        </div>
                        <div className="tl-meta">{tl.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BULK REFRESH ── */}
      {innerTab === 'bulk' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-rotate" /> Bulk Tracking Refresh</div>
            <button className="c-btn primary"><i className="fa-solid fa-rotate" /> Sync All Now</button>
          </div>
          <div className="card-body">
            <div className="alert-strip info">
              <i className="fa-solid fa-circle-info" />
              Last full sync: 11 May 2026, 08:00. Next scheduled: 11 May 2026, 14:00 (auto).
            </div>
            {BULK_SYNC.map(s => (
              <div className="list-item" key={s.courier}>
                <div className="list-icon" style={{ background: s.status === 'OK' ? 'var(--green-bg)' : 'var(--red-bg)' }}>
                  <i
                    className={`fa-solid fa-${s.status === 'OK' ? 'circle-check ic-green' : 'circle-xmark ic-red'}`}
                    style={{ fontSize: 12 }}
                  />
                </div>
                <div className="list-content">
                  <div className="list-title">{s.courier}</div>
                  <div className="list-meta">
                    Last: {s.lastSync} · {s.shipments} shipments · {s.updated} updated · {s.errors} errors
                  </div>
                </div>
                <div className="list-right">
                  <Badge label={s.status === 'OK' ? 'Active' : 'Error'} />
                  <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginTop: 4 }}>
                    <i className="fa-solid fa-rotate" /> Sync Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === 'history' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-clock-rotate-left" title="Tracking History" desc="Select a shipment from the lookup to see full history." />
          </div>
        </div>
      )}
    </>
  );
};

export default TrackingPanel;