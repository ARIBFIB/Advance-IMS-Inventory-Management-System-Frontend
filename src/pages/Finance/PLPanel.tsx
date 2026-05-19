import React from 'react';
import { fmt } from './helpers';

const PLPanel: React.FC = () => (
  <>
    <div className="panel-heading">Profit &amp; Loss Summary</div>
    <div className="panel-desc">
      High-level P&L view for the current period. Breakdown of all revenue streams against expenses to show net profitability.
    </div>

    <div className="mini-stats">
      <div className="mini-stat"><div className="ms-label">Gross Revenue (MTD)</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨5,12,400</div><div className="ms-trend up"><i className="fa-solid fa-arrow-trend-up" /> +14% vs last month</div></div>
      <div className="mini-stat"><div className="ms-label">COGS (Stock Cost)</div><div className="ms-value">₨2,64,000</div><div className="ms-trend">51.5% of revenue</div></div>
      <div className="mini-stat"><div className="ms-label">Gross Profit</div><div className="ms-value" style={{ color: 'var(--blue)' }}>₨2,48,400</div><div className="ms-trend up">48.5% margin</div></div>
      <div className="mini-stat"><div className="ms-label">Net Profit</div><div className="ms-value" style={{ color: 'var(--green)' }}>₨1,20,200</div><div className="ms-trend up">23.5% net margin</div></div>
    </div>

    <div className="detail-grid-2">
      {/* Revenue Breakdown */}
      <div className="summary-box" style={{ marginBottom: 0 }}>
        <div className="summary-box-title">Revenue Breakdown</div>
        {([
          ['COD Orders',              312400],
          ['Prepaid / Online Orders', 184600],
          ['WhatsApp / Manual',        15400],
        ] as [string, number][]).map(([k, v]) => (
          <div className="summary-row" key={k}>
            <span>{k}</span>
            <span style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(v)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total Revenue</span>
          <span className="summary-val" style={{ color: 'var(--green)' }}>₨5,12,400</span>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="summary-box" style={{ marginBottom: 0 }}>
        <div className="summary-box-title">Expense Breakdown</div>
        {([
          ['Logistics & Delivery', 38400],
          ['Operations',           44800],
          ['Marketing',            22000],
          ['Salaries',             12000],
          ['Utilities & Other',    11000],
        ] as [string, number][]).map(([k, v]) => (
          <div className="summary-row" key={k}>
            <span>{k}</span>
            <span style={{ fontWeight: 600, color: 'var(--red)' }}>{fmt(v)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total Expenses</span>
          <span className="summary-val" style={{ color: 'var(--red)' }}>₨1,28,200</span>
        </div>
      </div>
    </div>
  </>
);

export default PLPanel;