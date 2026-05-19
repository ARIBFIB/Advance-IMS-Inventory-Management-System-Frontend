// OverviewPanel.tsx
import React from 'react';
import {
  NavPanel, CourierCompany,
  COURIERS, SHIPMENTS, COD_PENDING, TRANSIT_ITEMS, PERF_DATA,
  fmt, rColor,
  Badge, PerfBar,
} from './shared';

interface Props {
  onNav: (p: NavPanel) => void;
  onOpenOverlay: (c: CourierCompany) => void;
}

const OverviewPanel: React.FC<Props> = ({ onNav, onOpenOverlay }) => (
  <div className="cpanel active">
    <div className="panel-heading">Overview</div>
    <div className="panel-desc">
      A real-time snapshot of today's courier activity — shipment volumes, active couriers, COD status,
      and alerts that need immediate attention.
    </div>

    <div className="alert-strip warn">
      <i className="fa-solid fa-triangle-exclamation" />
      <div>
        <strong>4 shipments</strong> pending courier assignment ·{' '}
        <strong>6 RTO returns</strong> awaiting processing from TCS.
      </div>
      <button className="c-btn" style={{ marginLeft: 'auto' }} onClick={() => onNav('pending')}>
        <i className="fa-solid fa-eye" /> View
      </button>
    </div>

    <div className="mini-stats">
      {[
        { label: 'Total Shipments (MTD)', value: '142', trend: '+18% vs last month', up: true  },
        { label: 'Delivered',             value: '68',  trend: '47.9% success',      up: true  },
        { label: 'In Transit',            value: '54',  trend: '4 couriers',         up: false },
        { label: 'Avg. Delivery Time',    value: '2.4d',trend: '-0.3d vs last month',up: true  },
      ].map(s => (
        <div className="mini-stat" key={s.label}>
          <div className="ms-label">{s.label}</div>
          <div className="ms-value">{s.value}</div>
          <div className={`ms-trend ${s.up ? 'up' : ''}`}>{s.trend}</div>
        </div>
      ))}
    </div>

    <div className="detail-grid-3">
      {/* Active Couriers */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-building" /> Active Couriers</div>
          <button className="c-btn" onClick={() => onNav('companies')}>Manage</button>
        </div>
        <div className="card-body" style={{ padding: '8px 14px' }}>
          {COURIERS.slice(0, 4).map(c => (
            <div className="list-item" key={c.id} onClick={() => onOpenOverlay(c)} style={{ cursor: 'pointer' }}>
              <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8 }}>{c.code}</div>
              <div className="list-content">
                <div className="list-title">{c.name}</div>
                <div className="list-meta">{c.successRate}% success · {c.avgDays}d avg.</div>
              </div>
              <div className="list-right"><Badge label={c.status} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Dispatches */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-truck" /> Today's Dispatches</div>
        </div>
        <div className="card-body" style={{ padding: '8px 14px' }}>
          {SHIPMENTS.slice(0, 4).map(s => (
            <div className="list-item" key={s.track}>
              <div className="list-content">
                <div className="list-title" style={{ fontSize: 10.5 }}>{s.track}</div>
                <div className="list-meta">{s.customer} · {s.courier} · {s.city}</div>
              </div>
              <div className="list-right"><Badge label={s.status} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* COD Pending */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-coins" /> COD Pending</div>
        </div>
        <div className="card-body" style={{ padding: '8px 14px' }}>
          {COD_PENDING.slice(0, 4).map(c => (
            <div className="list-item" key={c.order}>
              <div className="list-content">
                <div className="list-title" style={{ fontSize: 10.5 }}>{c.order} — {c.courier}</div>
                <div className="list-meta">{c.customer} · Due {c.due}</div>
              </div>
              <div className="list-right">
                <div style={{ fontSize: 11, fontWeight: 700 }}>{fmt(c.amount)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Breakdown Table */}
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <i className="fa-solid fa-chart-bar" /> Courier-wise Breakdown — This Month
        </div>
        <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Courier</th><th>Assigned</th><th>Delivered</th><th>In Transit</th>
              <th>RTO</th><th>Failed</th><th>Delivery Rate</th><th>Avg. Time</th>
              <th>COD Pending</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COURIERS.map(c => {
              const p = PERF_DATA.find(x => x.name === c.name) || {
                assigned: 0, delivered: 0, rto: 0, failed: 0, rate: 0, avgDays: 0,
              };
              return (
                <tr key={c.id} onClick={() => onOpenOverlay(c)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8 }}>{c.code}</div>
                      {c.name}
                    </div>
                  </td>
                  <td>{p.assigned}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>{p.delivered}</td>
                  <td style={{ color: 'var(--accent)' }}>
                    {TRANSIT_ITEMS.filter(t => t.courier === c.code).length}
                  </td>
                  <td style={{ color: 'var(--yellow)' }}>{p.rto || 0}</td>
                  <td style={{ color: 'var(--red)' }}>{p.failed || 0}</td>
                  <td><PerfBar pct={p.rate} color={rColor(p.rate)} /></td>
                  <td>{p.avgDays}d</td>
                  <td style={{ color: c.outstanding > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                    {fmt(c.outstanding)}
                  </td>
                  <td><Badge label={c.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default OverviewPanel;