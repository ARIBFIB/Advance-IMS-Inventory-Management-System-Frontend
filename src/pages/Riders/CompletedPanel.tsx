// CompletedPanel.tsx
import React, { useState } from 'react';
import { COMPLETED_DELIVERIES, fmt, Badge, InnerTabs, EmptyState, CPagination } from './shared';

const CompletedPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('all');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const PER_PAGE = 5;

  const filtered = COMPLETED_DELIVERIES.filter(d =>
    !search ||
    d.order.toLowerCase().includes(search.toLowerCase()) ||
    d.rider.toLowerCase().includes(search.toLowerCase())
  );
  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">Completed Deliveries</div>
      <div className="panel-desc">
        All deliveries successfully completed by internal riders. Verify COD collection, customer
        confirmation, and close out delivery records.
      </div>

      <InnerTabs
        tabs={[
          { id: 'all',      label: 'All Completed'       },
          { id: 'cod-pend', label: 'COD Not Collected'   },
          { id: 'today',    label: 'Today'               },
        ]}
        active={innerTab}
        onChange={t => { setInnerTab(t); setPage(1); }}
      />

      {/* ── ALL COMPLETED ── */}
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
              <button className="c-btn"><i className="fa-solid fa-calendar" /> Date</button>
            </div>
            <div className="c-toolbar-right">
              <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>Rider</th><th>Customer</th><th>Delivered At</th>
                  <th>Time Taken</th><th>COD Amount</th><th>COD Status</th><th>Rating</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(d => (
                  <tr key={d.order}>
                    <td><strong>{d.order}</strong></td>
                    <td>{d.rider.split(' ')[0]}</td>
                    <td>{d.customer}</td>
                    <td>{d.time}</td>
                    <td>{d.taken}</td>
                    <td><strong>{fmt(d.cod)}</strong></td>
                    <td><Badge label={d.codStatus} /></td>
                    <td><span className="rating-stars" style={{ fontSize: 11 }}>{d.rating}</span></td>
                    <td>
                      <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-check" /> Submit COD
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

      {/* ── COD NOT COLLECTED ── */}
      {innerTab === 'cod-pend' && (
        <>
          <div className="alert-strip warn">
            <i className="fa-solid fa-coins" />
            ₨14,800 COD collected but not yet submitted by riders.
          </div>
          <div className="card">
            <div className="card-body">
              <EmptyState icon="fa-money-bill-wave" title="COD Not Submitted" desc="8 deliveries with collected COD pending submission to accounts." />
            </div>
          </div>
        </>
      )}

      {/* ── TODAY ── */}
      {innerTab === 'today' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-circle-check" title="Today: 34 Deliveries Completed" desc="All riders have performed well today." />
          </div>
        </div>
      )}
    </>
  );
};

export default CompletedPanel;