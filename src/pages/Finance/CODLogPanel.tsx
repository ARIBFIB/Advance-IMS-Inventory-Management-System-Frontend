import React, { useState } from 'react';
import { Badge, fmt } from './helpers';
import { COD_LOG } from './data';

const CODLogPanel: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = COD_LOG.filter(
    l => !search || l.rider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="panel-heading">COD Collection Log</div>
      <div className="panel-desc">
        Daily log of all COD cash submissions from riders to accounts. Verify amounts and mark as reconciled.
      </div>

      <div className="card">
        <div className="f-toolbar">
          <div className="f-toolbar-left">
            <div className="f-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="f-btn"><i className="fa-solid fa-calendar" /> Date Range</button>
          </div>
          <div className="f-toolbar-right">
            <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Rider</th>
                <th>Orders</th>
                <th>Amount (₨)</th>
                <th>Submitted At</th>
                <th>Received By</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i}>
                  <td>{l.date}</td>
                  <td><strong>{l.rider}</strong></td>
                  <td>{l.orders}</td>
                  <td><strong style={{ color: 'var(--green)' }}>{fmt(l.amount)}</strong></td>
                  <td>{l.time}</td>
                  <td>{l.received}</td>
                  <td><Badge label={l.status} /></td>
                  <td style={{ fontSize: 10, color: 'var(--text-muted)' }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CODLogPanel;