// ActiveDeliveriesPanel.tsx
import React, { useState } from 'react';
import {
  ACTIVE_DELIVERIES, RIDERS,
  avatarColor, initials,
  Badge, InnerTabs, EmptyState, CPagination,
} from './shared';

const ActiveDeliveriesPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const PER_PAGE = 6;

  const filtered = ACTIVE_DELIVERIES.filter(d =>
    !search ||
    d.order.toLowerCase().includes(search.toLowerCase()) ||
    d.rider.toLowerCase().includes(search.toLowerCase()) ||
    d.customer.toLowerCase().includes(search.toLowerCase())
  );
  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">Active Deliveries</div>
      <div className="panel-desc">
        All deliveries currently in progress by internal riders. Monitor real-time location updates,
        estimated arrival, and flag delays.
      </div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <strong>3 deliveries</strong> are running behind schedule by more than 20 minutes.
        <button className="c-btn" style={{ marginLeft: 'auto' }}>View Delayed</button>
      </div>

      <InnerTabs
        tabs={[
          { id: 'all',     label: 'All Active' },
          {
            id: 'delayed',
            label: (
              <span>
                Delayed{' '}
                <span style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '1px 5px', borderRadius: 8, fontSize: 9, marginLeft: 3 }}>3</span>
              </span>
            ),
          },
          { id: 'map', label: 'Live Map View' },
        ]}
        active={innerTab}
        onChange={t => { setInnerTab(t); setPage(1); }}
      />

      {/* ── ALL ACTIVE ── */}
      {innerTab === 'all' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  placeholder="Search order or rider..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button className="c-btn">All Riders</button>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn"><i className="fa-solid fa-rotate" /> Refresh</button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>Rider</th><th>Customer</th><th>Address</th>
                  <th>Assigned</th><th>ETA</th><th>COD</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(d => {
                  const r = RIDERS.find(x => x.name === d.rider);
                  return (
                    <tr key={d.order}>
                      <td><strong>{d.order}</strong></td>
                      <td>
                        <div className="td-flex">
                          <div className="row-avatar" style={{ background: avatarColor(r?.id || 1), width: 22, height: 22, fontSize: 8 }}>
                            {initials(d.rider)}
                          </div>
                          {d.rider.split(' ')[0]}
                        </div>
                      </td>
                      <td>{d.customer}</td>
                      <td style={{ fontSize: 10.5, maxWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.address}
                      </td>
                      <td>{d.assigned}</td>
                      <td><strong>{d.eta}</strong></td>
                      <td><strong>{d.cod}</strong></td>
                      <td><Badge label={d.status} /></td>
                      <td>
                        <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-location-dot" /></button>
                        <button className="c-btn" style={{ height: 22, fontSize: 9.5, marginLeft: 3 }}><i className="fa-solid fa-phone" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <CPagination
            current={page} total={Math.ceil(total / PER_PAGE)}
            totalItems={total} start={start} end={end}
            onChange={setPage}
          />
        </div>
      )}

      {/* ── DELAYED ── */}
      {innerTab === 'delayed' && (
        <>
          <div className="alert-strip danger">
            <i className="fa-solid fa-clock" />
            The following deliveries are past their expected time. Contact riders immediately.
          </div>
          <div className="card">
            <div className="card-body">
              <EmptyState icon="fa-person-biking" title="3 Delayed Deliveries" desc="Contact riders or reassign orders." />
            </div>
          </div>
        </>
      )}

      {/* ── MAP ── */}
      {innerTab === 'map' && (
        <div className="map-placeholder">
          {[
            { color: '#FF6A00', top: '35%', left: '42%' },
            { color: '#16A34A', top: '55%', left: '60%' },
            { color: '#2563EB', top: '25%', left: '70%' },
            { color: '#FF6A00', top: '65%', left: '30%' },
            { color: '#16A34A', top: '45%', left: '50%' },
            { color: '#7C3AED', top: '70%', left: '55%' },
          ].map((dot, i) => (
            <div key={i} className="map-rider-dot" style={{ background: dot.color, top: dot.top, left: dot.left }} />
          ))}
          <div className="map-badge">
            <i className="fa-solid fa-circle" style={{ color: 'var(--accent)', fontSize: 8 }} /> 6 riders live
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            Live GPS tracking requires app integration. See <strong>App Integrations</strong> tab.
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveDeliveriesPanel;