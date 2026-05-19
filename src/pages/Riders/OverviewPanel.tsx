// OverviewPanel.tsx
import React from 'react';
import {
  NavPanel, Rider,
  RIDERS, ACTIVE_DELIVERIES, UNASSIGNED_ORDERS,
  rColor,
  Badge, PerfBar, RiderAvatar,
} from './shared';

interface Props {
  onNav: (p: NavPanel) => void;
  onOpenRider: (r: Rider) => void;
}

const OverviewPanel: React.FC<Props> = ({ onNav, onOpenRider }) => {
  const activeRiders = RIDERS.filter(r => r.status === 'Active');

  return (
    <div className="rpanel active">
      <div className="panel-heading">Overview</div>
      <div className="panel-desc">
        Real-time snapshot of rider activity — active deliveries, task queue, daily completions,
        and alerts requiring immediate attention.
      </div>

      <div className="alert-strip warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div>
          <strong>5 orders</strong> in queue awaiting rider assignment ·{' '}
          <strong>3 deliveries</strong> delayed beyond scheduled time.
        </div>
        <button className="c-btn" style={{ marginLeft: 'auto' }} onClick={() => onNav('assign')}>
          <i className="fa-solid fa-eye" /> Assign Now
        </button>
      </div>

      <div className="mini-stats">
        {[
          { label: 'Active Riders (Today)', value: '6',   trend: '6 online · 2 offline', up: true  },
          { label: 'Active Deliveries',     value: '8',   trend: 'In transit now',        up: false },
          { label: 'Completed Today',       value: '34',  trend: '+6 vs yesterday',       up: true  },
          { label: 'Avg. Delivery Time',    value: '42m', trend: '-8m vs last week',      up: true  },
        ].map(s => (
          <div className="mini-stat" key={s.label}>
            <div className="ms-label">{s.label}</div>
            <div className="ms-value">{s.value}</div>
            <div className={`ms-trend ${s.up ? 'up' : ''}`}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="detail-grid-3">
        {/* Rider Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-person-biking" /> Rider Status</div>
            <button className="c-btn" onClick={() => onNav('all')}>View All</button>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {RIDERS.slice(0, 5).map(r => (
              <div className="list-item" key={r.id} style={{ cursor: 'pointer' }} onClick={() => onOpenRider(r)}>
                <RiderAvatar rider={r} size={26} fontSize={9} />
                <div className="list-content">
                  <div className="list-title">{r.name}</div>
                  <div className="list-meta">{r.zone}</div>
                </div>
                <div className="list-right"><Badge label={r.availability} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Now */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-map-location-dot" /> Active Now</div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {ACTIVE_DELIVERIES.slice(0, 4).map(d => (
              <div className="list-item" key={d.order}>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{d.order} · {d.rider.split(' ')[0]}</div>
                  <div className="list-meta">{d.customer} · ETA {d.eta}</div>
                </div>
                <div className="list-right"><Badge label={d.status} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignment */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-clipboard-list" /> Pending Assignment</div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {UNASSIGNED_ORDERS.slice(0, 4).map(o => (
              <div className="list-item" key={o.order}>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{o.order} · {o.customer}</div>
                  <div className="list-meta">{o.area} · {o.cod}</div>
                </div>
                <div className="list-right"><Badge label={o.priority} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-trophy" /> Today's Rider Performance
          </div>
          <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Rider</th><th>Assigned</th><th>Completed</th><th>Failed</th>
                <th>Completion %</th><th>Avg. Time</th><th>On-Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeRiders.map(r => {
                const daily = Math.round(r.deliveries / 30);
                const done  = Math.round(daily * r.completion / 100);
                const fail  = daily - done;
                return (
                  <tr key={r.id} onClick={() => onOpenRider(r)}>
                    <td>
                      <div className="td-flex">
                        <RiderAvatar rider={r} size={26} fontSize={9} />
                        {r.name.split(' ')[0]}
                      </div>
                    </td>
                    <td>{daily}</td>
                    <td style={{ color: 'var(--green)', fontWeight: 600 }}>{done}</td>
                    <td style={{ color: 'var(--red)' }}>{fail}</td>
                    <td><PerfBar pct={r.completion} color={rColor(r.completion)} /></td>
                    <td>{r.avgTime > 0 ? `${r.avgTime} min` : '—'}</td>
                    <td><PerfBar pct={r.onTime} color={rColor(r.onTime)} /></td>
                    <td><Badge label={r.availability} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;