import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface ExportEntry {
  time: string;
  type: string;
  format: string;
  records: string;
  by: string;
  status: 'Ready' | 'Processing' | 'Failed';
}

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const EXPORT_HISTORY: ExportEntry[] = [
  { time: '11 May 2026, 14:00', type: 'Orders (All)',       format: 'CSV',   records: '1,284', by: 'Admin Khan',  status: 'Ready' },
  { time: '11 May 2026, 10:30', type: 'Customer Data',      format: 'Excel', records: '3,142', by: 'Sara Khan',   status: 'Ready' },
  { time: '10 May 2026, 17:00', type: 'Full System Export', format: 'JSON',  records: '—',     by: 'Admin Khan',  status: 'Ready' },
  { time: '09 May 2026, 09:00', type: 'Financial Records',  format: 'Excel', records: '892',   by: 'Fatima Noor', status: 'Ready' },
  { time: '01 May 2026, 08:30', type: 'Audit Logs',         format: 'CSV',   records: '4,820', by: 'Admin Khan',  status: 'Ready' },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function badgeClass(s: string): string {
  const m: Record<string, string> = { Ready: 'green', Processing: 'yellow', Failed: 'red' };
  return m[s] || 'gray';
}

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${badgeClass(label)}`}>{label}</span>
);

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

const ExportPanel: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const triggerExport = () => {
    setExporting(true);
    setExportDone(false);
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 4000);
    }, 2000);
  };

  return (
    <>
      {/* Info Banner */}
      <div className="alert-strip info">
        <i className="fa-solid fa-circle-info" />
        All data exports are logged in the Audit Trail. Large exports are queued and a download notification is sent
        when ready. Only Admins and Managers can initiate exports.
      </div>

      <div className="detail-grid-2">
        {/* Generate Export */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-export ic-orange" /> Generate Export</div>
          </div>
          <div className="card-body">
            <div className="form-row single">
              <div className="form-group">
                <div className="form-label">Export Type</div>
                <select className="form-select">
                  <option>Full System Export</option>
                  <option>Products &amp; Inventory</option>
                  <option>Orders (All)</option>
                  <option>Customer Data</option>
                  <option>Financial Records</option>
                  <option>Staff &amp; Activity Logs</option>
                  <option>Audit Logs</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Date From</div>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group">
                <div className="form-label">Date To</div>
                <input className="form-input" type="date" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">File Format</div>
                <select className="form-select">
                  <option>Excel (.xlsx)</option>
                  <option>CSV (.csv)</option>
                  <option>JSON</option>
                  <option>PDF</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Include Sensitive Data</div>
                <select className="form-select">
                  <option>No (Redacted)</option>
                  <option>Yes (Admin only)</option>
                </select>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
            <button
              className="t-btn primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                background:    exportDone ? 'var(--green)' : undefined,
                borderColor:   exportDone ? 'var(--green)' : undefined,
              }}
              onClick={triggerExport}
              disabled={exporting}
            >
              {exporting
                ? <><i className="fa-solid fa-spinner fa-spin" /> Preparing export...</>
                : exportDone
                ? <><i className="fa-solid fa-circle-check" /> Ready — Click to Download</>
                : <><i className="fa-solid fa-file-export" /> Export Data</>
              }
            </button>
          </div>
        </div>

        {/* Export History */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Export History</div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Records</th>
                  <th>By</th>
                  <th>Status</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {EXPORT_HISTORY.map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{e.time}</td>
                    <td style={{ fontWeight: 500 }}>{e.type}</td>
                    <td><span className="tag">{e.format}</span></td>
                    <td style={{ textAlign: 'center' }}>{e.records}</td>
                    <td>{e.by}</td>
                    <td><Badge label={e.status} /></td>
                    <td>
                      <button className="t-btn" style={{ height: 22, fontSize: 9.5 }}>
                        <i className="fa-solid fa-download" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportPanel;