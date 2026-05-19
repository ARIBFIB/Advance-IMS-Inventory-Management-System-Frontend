import React, { useState } from 'react';
import { Badge, fmt } from './helpers';
import { PREPAID_DATA } from './data';

const PrepaidPanel: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = PREPAID_DATA.filter(
    p =>
      !search ||
      p.order.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="panel-heading">Prepaid Orders</div>
      <div className="panel-desc">
        Track online and bank-transfer prepaid order payments. Verify payment received before dispatching orders.
      </div>

      <div className="mini-stats cols-3">
        <div className="mini-stat">
          <div className="ms-label">Prepaid Revenue (MTD)</div>
          <div className="ms-value" style={{ color: 'var(--blue)' }}>₨1,84,600</div>
          <div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +18% vs last month</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Payment Verified</div>
          <div className="ms-value" style={{ color: 'var(--green)' }}>₨1,72,400</div>
          <div className="ms-trend up"><i className="fa-solid fa-circle-check" /> 61 orders</div>
        </div>
        <div className="mini-stat">
          <div className="ms-label">Pending Verification</div>
          <div className="ms-value" style={{ color: 'var(--yellow)' }}>₨12,200</div>
          <div className="ms-trend">4 orders awaiting</div>
        </div>
      </div>

      <div className="card">
        <div className="f-toolbar">
          <div className="f-toolbar-left">
            <div className="f-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search order..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="f-btn active">All</button>
            <button className="f-btn">Pending Verification</button>
          </div>
          <div className="f-toolbar-right">
            <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Amount</th>
                <th>Channel</th><th>Payment Method</th><th>Transaction Ref</th>
                <th>Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.order}>
                  <td><code className="ref">{p.order}</code></td>
                  <td>{p.customer}</td>
                  <td><strong>{fmt(p.amount)}</strong></td>
                  <td><span className="f-tag">{p.channel}</span></td>
                  <td>{p.method}</td>
                  <td><code className="ref">{p.ref}</code></td>
                  <td style={{ fontSize: 10 }}>{p.date}</td>
                  <td><Badge label={p.status} /></td>
                  <td>
                    {p.status === 'Pending Verification'
                      ? <button className="f-btn primary" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-check" /> Verify</button>
                      : <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}><i className="fa-solid fa-eye" /></button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrepaidPanel;