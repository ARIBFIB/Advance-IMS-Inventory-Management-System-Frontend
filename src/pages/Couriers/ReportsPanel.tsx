// ReportsPanel.tsx
import React, { useState } from 'react';
import { COURIERS, RECENT_REPORTS, InnerTabs, EmptyState } from './shared';

const ReportsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('gen');

  return (
    <>
      <div className="panel-heading">Courier Reports</div>
      <div className="panel-desc">
        Generate and download detailed courier reports — performance, COD reconciliation, RTO
        analysis, and financial charges.
      </div>

      <InnerTabs
        tabs={[
          { id: 'gen',   label: 'Generate Report'    },
          { id: 'sched', label: 'Scheduled Reports'  },
          { id: 'hist',  label: 'Report History'     },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {innerTab === 'gen' && (
        <div className="detail-grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-file-chart-column" /> New Report</div>
            </div>
            <div className="card-body">
              <div className="c-form-row single">
                <div className="c-form-group">
                  <div className="c-form-label">Report Type</div>
                  <select className="c-form-select">
                    <option>Delivery Performance Summary</option>
                    <option>Shipment Status Report</option>
                    <option>COD Reconciliation Report</option>
                    <option>RTO Analysis Report</option>
                    <option>Courier Comparison Report</option>
                    <option>Financial — Courier Charges</option>
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
                  <div className="c-form-label">Courier</div>
                  <select className="c-form-select">
                    <option>All Couriers</option>
                    {COURIERS.map(c => <option key={c.id}>{c.name}</option>)}
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
              <hr />
              <button className="c-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="fa-solid fa-file-export" /> Generate &amp; Download
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Reports</div>
            </div>
            <div className="card-body" style={{ padding: '0 14px' }}>
              {RECENT_REPORTS.map(r => (
                <div className="list-item" key={r.name}>
                  <div className="list-icon" style={{ background: 'var(--green-bg)' }}>
                    <i className="fa-solid fa-file-chart-column ic-green" style={{ fontSize: 11 }} />
                  </div>
                  <div className="list-content">
                    <div className="list-title">{r.name}</div>
                    <div className="list-meta">{r.generated} · {r.format} · {r.size}</div>
                  </div>
                  <div className="list-right">
                    <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
                      <i className="fa-solid fa-download" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {innerTab === 'sched' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-calendar" title="No Scheduled Reports" desc="Set up automatic weekly or monthly courier reports." />
          </div>
        </div>
      )}

      {innerTab === 'hist' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-folder-open" title="Report History" desc="Previously generated reports appear here." />
          </div>
        </div>
      )}
    </>
  );
};

export default ReportsPanel;