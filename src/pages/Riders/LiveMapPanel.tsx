// LiveMapPanel.tsx
import React from 'react';
import { RIDERS, ACTIVE_DELIVERIES, Badge, RiderAvatar } from './shared';

const LiveMapPanel: React.FC = () => {
  const onlineRiders = RIDERS.filter(r => r.availability === 'Online');

  return (
    <>
      <div className="panel-heading">Live Map</div>
      <div className="panel-desc">
        Real-time GPS tracking of all active riders. Requires mobile app integration for riders
        to share live location.
      </div>

      <div className="alert-strip info">
        <i className="fa-solid fa-circle-info" />
        Live GPS tracking requires the <strong>Rider Mobile App</strong> integration. Connect via
        the <strong>App Integrations</strong> panel.
      </div>

      {/* Map placeholder */}
      <div className="map-placeholder tall">
        <div className="map-rider-dot large" style={{ background: '#FF6A00', top: '30%', left: '40%' }} />
        <div className="map-label-popup" style={{ top: 'calc(30% - 28px)', left: 'calc(40% + 8px)' }}>
          Usman · ORD-1052
        </div>
        <div className="map-rider-dot large" style={{ background: '#16A34A', top: '55%', left: '65%' }} />
        <div className="map-label-popup" style={{ top: 'calc(55% - 28px)', left: 'calc(65% + 8px)' }}>
          Bilal · ORD-1053
        </div>
        <div className="map-rider-dot large" style={{ background: '#2563EB', top: '25%', left: '70%' }} />
        <div className="map-rider-dot large" style={{ background: '#7C3AED', top: '68%', left: '35%' }} />
        <div className="map-rider-dot large" style={{ background: '#D97706', top: '45%', left: '50%' }} />
        <div className="map-rider-dot large" style={{ background: '#DC2626', top: '72%', left: '58%' }} />

        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 8 }}>
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--accent)', fontSize: 8 }} /> Delivering</div>
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 8 }} /> Idle / Available</div>
          <div className="map-badge"><i className="fa-solid fa-circle" style={{ color: 'var(--red)', fontSize: 8 }} /> Delayed</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '10px 16px', textAlign: 'center' }}>
          <i className="fa-solid fa-map-location-dot" style={{ fontSize: 22, color: 'var(--accent)', display: 'block', marginBottom: 4 }} />
          <div style={{ fontSize: 11, fontWeight: 700 }}>Live GPS Map</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>6 riders being tracked · Last update: just now</div>
        </div>
      </div>

      {/* Rider Locations List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-list" /> Rider Locations (Live)</div>
          <button className="c-btn"><i className="fa-solid fa-rotate" /> Refresh</button>
        </div>
        <div className="card-body" style={{ padding: '8px 14px' }}>
          {onlineRiders.map(r => {
            const active = ACTIVE_DELIVERIES.find(d => d.rider === r.name);
            return (
              <div className="list-item" key={r.id}>
                <RiderAvatar rider={r} fontSize={9} />
                <div className="list-content">
                  <div className="list-title">
                    {r.name}
                    {active && (
                      <span className="badge orange" style={{ fontSize: 8.5, marginLeft: 4 }}>
                        {active.order}
                      </span>
                    )}
                  </div>
                  <div className="list-meta">
                    {r.zone} · <i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 7 }} /> Last seen just now
                  </div>
                </div>
                <div className="list-right">
                  <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                    <i className="fa-solid fa-location-dot" /> Track
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LiveMapPanel;