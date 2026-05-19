// ReportsPanel.tsx
import React from 'react';
import { RIDERS, RECENT_REPORTS } from './shared';

const ReportsPanel: React.FC = () => (
  <>
    <div className="panel-heading">Rider Reports</div>
    <div className="panel-desc">
      Generate downloadable reports on rider performance, delivery statistics, earnings,
      and operational summaries.
    </div>

    <div className="detail-grid-2">
      {/* Generate Report */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-file-chart-column" /> Generate Report</div>
        </div>
        <div className="card-body">
          <div className="c-form-row single">
            <div className="c-form-group">
              <div className="c-form-label">Report Type</div>
              <select className="c-form-select">
                <option>Rider Performance Summary</option>
                <option>Daily Delivery Log</option>
                <option>Earnings &amp; Payroll Report</option>
                <option>COD Collection Report</option>
                <option>Failed Deliveries Report</option>
                <option>Route Efficiency Report</option>
              </select>
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Date From</div>
              <input className="c-form-input" type="date" />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Date To</div>
              <input className="c-form-input" type="date" />
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Rider</div>
              <select className="c-form-select">
                <option>All Riders</option>
                {RIDERS.filter(r => r.status === 'Active').map(r => (
                  <option key={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Format</div>
              <select className="c-form-select">
                <option>Excel (.xlsx)</option>
                <option>CSV (.csv)</option>
                <option>PDF</option>
              </select>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
          <button className="c-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
            <i className="fa-solid fa-file-export" /> Generate &amp; Download
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Reports</div>
        </div>
        <div className="card-body" style={{ padding: '0 14px' }}>
          {RECENT_REPORTS.map(r => (
            <div className="list-item" key={r.name}>
              <div className="list-icon" style={{ background: 'var(--green-bg)' }}>
                <i className="fa-solid fa-file-chart-column" style={{ color: 'var(--green)', fontSize: 11 }} />
              </div>
              <div className="list-content">
                <div className="list-title">{r.name}</div>
                <div className="list-meta">{r.date} · {r.format} · {r.size}</div>
              </div>
              <div className="list-right">
                <button className="c-btn" style={{ height: 22, fontSize: 9.5 }}>
                  <i className="fa-solid fa-download" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default ReportsPanel;