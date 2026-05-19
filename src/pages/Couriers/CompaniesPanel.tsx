// CompaniesPanel.tsx
import React, { useState } from 'react';
import {
  CourierCompany,
  COURIERS, RATES, API_CREDS,
  fmt, rColor,
  Badge, PerfBar, StarRating, CPagination, InnerTabs,
} from './shared';

interface Props {
  onOpenOverlay: (c: CourierCompany) => void;
}

const CompaniesPanel: React.FC<Props> = ({ onOpenOverlay }) => {
  const [innerTab, setInnerTab] = useState('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = COURIERS.filter(c => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    }
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">Courier Companies</div>
      <div className="panel-desc">
        View and manage all courier partners — their rates, API credentials, COD outstanding, and
        performance metrics.
      </div>

      <InnerTabs
        tabs={[
          { id: 'list', label: 'All Companies' },
          { id: 'add',  label: 'Add Company'   },
          { id: 'rates',label: 'Rate Cards'     },
          { id: 'api',  label: 'API Credentials'},
        ]}
        active={innerTab}
        onChange={t => { setInnerTab(t); setPage(1); }}
      />

      {/* ── LIST ── */}
      {innerTab === 'list' && (
        <>
          <div className="mini-stats">
            <div className="mini-stat">
              <div className="ms-label">Total Partners</div>
              <div className="ms-value">6</div>
              <div className="ms-trend">5 active · 1 paused</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">Avg. Success Rate</div>
              <div className="ms-value">89%</div>
              <div className="ms-trend up">+3% this month</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">COD Outstanding</div>
              <div className="ms-value">₨84K</div>
              <div className="ms-trend down">Needs settlement</div>
            </div>
            <div className="mini-stat">
              <div className="ms-label">API Connected</div>
              <div className="ms-value">3</div>
              <div className="ms-trend">3 manual · 0 error</div>
            </div>
          </div>

          <div className="card">
            <div className="c-toolbar">
              <div className="c-toolbar-left">
                <div className="c-search">
                  <i className="fa-solid fa-magnifying-glass" />
                  <input
                    placeholder="Search courier..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
                {(['', 'Active', 'Paused'] as const).map(f => (
                  <button
                    key={f}
                    className={`c-btn ${statusFilter === f ? 'active' : ''}`}
                    onClick={() => { setStatusFilter(f); setPage(1); }}
                  >
                    {f || 'All'}
                  </button>
                ))}
              </div>
              <div className="c-toolbar-right">
                <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
                <button className="c-btn primary" onClick={() => setInnerTab('add')}>
                  <i className="fa-solid fa-plus" /> Add Courier
                </button>
              </div>
            </div>

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Company</th><th>Coverage</th><th>Base Rate</th><th>COD Charge</th>
                    <th>COD Outstanding</th><th>Avg. Days</th><th>Success Rate</th>
                    <th>API</th><th>Rating</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(c => (
                    <tr key={c.id} onClick={() => onOpenOverlay(c)} style={{ cursor: 'pointer' }}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td>
                        <div className="td-flex">
                          <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8 }}>{c.code}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{c.name}</div>
                            <div className="td-sub">{c.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="tag">{c.coverage}</span></td>
                      <td>₨{c.baseRate}/kg</td>
                      <td>{c.codPct}%</td>
                      <td>
                        <strong style={{ color: c.outstanding > 0 ? 'var(--red)' : 'var(--green)' }}>
                          {fmt(c.outstanding)}
                        </strong>
                      </td>
                      <td>{c.avgDays}d</td>
                      <td><PerfBar pct={c.successRate} color={rColor(c.successRate)} /></td>
                      <td>{c.api ? <Badge label="API" /> : <Badge label="Manual" />}</td>
                      <td><StarRating rating={c.rating} /></td>
                      <td><Badge label={c.status} /></td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="c-btn" style={{ height: 24, fontSize: 9.5 }} onClick={() => onOpenOverlay(c)}>
                          <i className="fa-solid fa-eye" />
                        </button>
                        <button className="c-btn" style={{ height: 24, fontSize: 9.5, marginLeft: 3 }}>
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
        </>
      )}

      {/* ── ADD ── */}
      {innerTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-plus-circle" /> Add New Courier Company</div>
          </div>
          <div className="card-body">
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Company Name *</div>
                <input className="c-form-input" placeholder="e.g. TCS Express" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Short Code</div>
                <input className="c-form-input" placeholder="e.g. TCS" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Contact Person</div>
                <input className="c-form-input" placeholder="Account manager name" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Contact Phone</div>
                <input className="c-form-input" placeholder="03XX-XXXXXXX" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Email</div>
                <input className="c-form-input" type="email" placeholder="ops@courier.com" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">City / HQ</div>
                <input className="c-form-input" placeholder="Lahore" />
              </div>
            </div>
            <div className="c-form-row triple">
              <div className="c-form-group">
                <div className="c-form-label">Base Rate (₨/kg)</div>
                <input className="c-form-input" type="number" placeholder="200" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">COD Charge (%)</div>
                <input className="c-form-input" type="number" placeholder="1.5" />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">COD Settlement Days</div>
                <input className="c-form-input" type="number" placeholder="7" />
              </div>
            </div>
            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Coverage Type</div>
                <select className="c-form-select">
                  <option>Nationwide</option><option>Regional</option><option>City Only</option>
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Default Status</div>
                <select className="c-form-select">
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary"><i className="fa-solid fa-check" /> Save Courier</button>
              <button className="c-btn" onClick={() => setInnerTab('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RATES ── */}
      {innerTab === 'rates' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-tags" /> Rate Cards by Courier</div>
            <button className="c-btn primary"><i className="fa-solid fa-plus" /> Add Rate</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Courier</th><th>Zone</th><th>Weight</th><th>Base Rate</th>
                  <th>Per Extra Kg</th><th>COD Fee %</th><th>Fuel Surcharge</th>
                  <th>Est. Delivery</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {RATES.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.courier}</strong></td>
                    <td>{r.zone}</td><td>{r.weight}</td><td>{r.base}</td>
                    <td>{r.extra}</td><td>{r.codPct}</td><td>{r.fuel}</td>
                    <td>{r.days} days</td>
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

      {/* ── API CREDENTIALS ── */}
      {innerTab === 'api' && (
        <>
          <div className="alert-strip info">
            <i className="fa-solid fa-circle-info" />
            API credentials are encrypted at rest. Keys are never displayed in full after saving.
          </div>
          {API_CREDS.map(a => (
            <div className="card" style={{ marginBottom: 10 }} key={a.courier}>
              <div className="card-header">
                <div className="card-title"><i className="fa-solid fa-building" /> {a.courier}</div>
                <Badge label={a.connected ? 'Connected' : 'Not Connected'} />
              </div>
              <div className="card-body">
                <div className="detail-row">
                  <div className="detail-key">Endpoint</div>
                  <div className="detail-val"><code className="sku">{a.endpoint}</code></div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">API Key</div>
                  <div className="detail-val"><code className="sku">{a.key}</code></div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Last Ping</div>
                  <div className="detail-val">{a.lastPing}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button className="c-btn primary" style={{ fontSize: 10 }}>
                    <i className="fa-solid fa-rotate" /> Test
                  </button>
                  <button className="c-btn" style={{ fontSize: 10 }}>
                    <i className="fa-solid fa-key" /> Update Key
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CompaniesPanel;