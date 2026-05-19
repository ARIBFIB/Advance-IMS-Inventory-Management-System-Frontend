// AllRidersPanel.tsx
import React, { useState } from 'react';
import {
  NavPanel, Rider,
  RIDERS, DOCS_DATA,
  rColor,
  Badge, PerfBar, StarRating, RiderAvatar, DayBadge,
  InnerTabs, CPagination,
} from './shared';

interface Props {
  onNav: (p: NavPanel) => void;
  onOpenRider: (r: Rider) => void;
}

const SCHEDULE_DATA = [
  { rider:'Usman Ahmed', days:['M','T','W','T','F','-','M'] },
  { rider:'Bilal Raza',  days:['M','T','W','T','F','M','-'] },
  { rider:'Asad Khan',   days:['M','T','W','T','F','M','M'] },
  { rider:'Hamza Iqbal', days:['-','E','E','E','E','E','E']  },
];

const AllRidersPanel: React.FC<Props> = ({ onNav, onOpenRider }) => {
  const [innerTab, setInnerTab] = useState('grid');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = RIDERS.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.zone.toLowerCase().includes(search.toLowerCase())
  );
  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">All Riders</div>
      <div className="panel-desc">
        Full directory of internal delivery riders. View profiles, contact details, vehicle info,
        and current status.
      </div>

      <div className="mini-stats">
        <div className="mini-stat"><div className="ms-label">Total Riders</div><div className="ms-value">8</div><div className="ms-trend">6 active · 2 inactive</div></div>
        <div className="mini-stat"><div className="ms-label">Online Now</div><div className="ms-value">6</div><div className="ms-trend up"><i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 7 }} /> Tracking active</div></div>
        <div className="mini-stat"><div className="ms-label">Avg. Rating</div><div className="ms-value">4.3</div><div className="ms-trend up"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }} /> Customer rated</div></div>
        <div className="mini-stat"><div className="ms-label">Deliveries (MTD)</div><div className="ms-value">312</div><div className="ms-trend up">+42 vs last month</div></div>
      </div>

      <InnerTabs
        tabs={[
          { id: 'grid',     label: 'Grid View'   },
          { id: 'table',    label: 'Table View'  },
          { id: 'docs',     label: 'Documents'   },
          { id: 'schedule', label: 'Schedules'   },
        ]}
        active={innerTab}
        onChange={t => { setInnerTab(t); setPage(1); }}
      />

      {/* ── GRID VIEW ── */}
      {innerTab === 'grid' && (
        <>
          <div className="c-toolbar" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-card) var(--radius-card) 0 0', borderBottom: '1px solid var(--divider)' }}>
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search rider..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="c-btn active">All</button>
              <button className="c-btn" style={{ color: 'var(--green)' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: 7 }} /> Online
              </button>
              <button className="c-btn" style={{ color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: 7 }} /> Offline
              </button>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn primary" onClick={() => onNav('add')}>
                <i className="fa-solid fa-plus" /> Add Rider
              </button>
            </div>
          </div>
          <div className="rider-grid">
            {filtered.map(r => (
              <div className="rider-card" key={r.id} onClick={() => onOpenRider(r)}>
                <div className="rider-card-status"><Badge label={r.availability} /></div>
                <div className="rider-card-top">
                  <RiderAvatar rider={r} size={36} fontSize={12} />
                  <div>
                    <div className="rider-card-name">{r.name}</div>
                    <div className="rider-card-id">
                      <i className="fa-solid fa-person-biking" style={{ fontSize: 9, color: 'var(--text-muted)' }} /> {r.zone}
                    </div>
                  </div>
                </div>
                <div className="rider-card-stats">
                  <div className="rider-stat"><div className="rider-stat-val">{r.deliveries}</div><div className="rider-stat-lbl">Deliveries</div></div>
                  <div className="rider-stat"><div className="rider-stat-val">{r.completion}%</div><div className="rider-stat-lbl">Completion</div></div>
                  <div className="rider-stat"><div className="rider-stat-val">{r.avgTime > 0 ? `${r.avgTime}m` : '—'}</div><div className="rider-stat-lbl">Avg Time</div></div>
                  <div className="rider-stat"><div className="rider-stat-val">{r.rating > 0 ? r.rating : '—'}</div><div className="rider-stat-lbl">Rating ★</div></div>
                </div>
                <div className="rider-card-footer">
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-motorcycle" style={{ fontSize: 9 }} /> {r.vehicle} · {r.plate}
                  </div>
                  <span className="tag" style={{ fontSize: 9 }}>{r.shift.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TABLE VIEW ── */}
      {innerTab === 'table' && (
        <div className="card">
          <div className="c-toolbar">
            <div className="c-toolbar-left">
              <div className="c-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
              <button className="c-btn primary" onClick={() => onNav('add')}>
                <i className="fa-solid fa-plus" /> Add Rider
              </button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Rider</th><th>Phone</th><th>Vehicle</th><th>Zone</th>
                  <th>Deliveries (MTD)</th><th>Completion %</th><th>Rating</th>
                  <th>Status</th><th>Availability</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(r => (
                  <tr key={r.id} onClick={() => onOpenRider(r)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td>
                      <div className="td-flex">
                        <RiderAvatar rider={r} fontSize={9} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{r.name}</div>
                          <div className="td-sub">{r.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{r.phone}</td>
                    <td>
                      <span className="tag">
                        <i className="fa-solid fa-motorcycle" style={{ fontSize: 9, marginRight: 3 }} />
                        {r.vehicle}
                      </span>
                    </td>
                    <td><span className="tag">{r.zone}</span></td>
                    <td>{r.deliveries}</td>
                    <td><PerfBar pct={r.completion} color={rColor(r.completion)} /></td>
                    <td>{r.rating > 0 ? <StarRating rating={r.rating} /> : '—'}</td>
                    <td><Badge label={r.status} /></td>
                    <td><Badge label={r.availability} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5 }} onClick={() => onOpenRider(r)}>
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3 }}>
                        <i className="fa-solid fa-pen" />
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* ── DOCUMENTS ── */}
      {innerTab === 'docs' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-alt" /> Rider Documents</div>
            <button className="c-btn primary"><i className="fa-solid fa-upload" /> Upload Document</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rider</th><th>Document Type</th><th>File Name</th>
                  <th>Expiry Date</th><th>Status</th><th>Uploaded</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {DOCS_DATA.map((d, i) => (
                  <tr key={i}>
                    <td><strong>{d.rider}</strong></td>
                    <td>{d.type}</td>
                    <td><code className="sku">{d.file}</code></td>
                    <td>{d.expiry}</td>
                    <td><Badge label={d.status} /></td>
                    <td>{d.uploaded}</td>
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5, marginLeft: 3, color: 'var(--red)' }}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {innerTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-calendar-alt" /> Shift Schedule Configuration</div>
            <button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Shift</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rider</th><th>Mon</th><th>Tue</th><th>Wed</th>
                  <th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_DATA.map(s => (
                  <tr key={s.rider}>
                    <td><strong>{s.rider.split(' ')[0]}</strong></td>
                    {s.days.map((d, i) => (
                      <td key={i} style={{ textAlign: 'center' }}><DayBadge d={d} /></td>
                    ))}
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-pen" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AllRidersPanel;