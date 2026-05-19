// ═══════════════════════════════════════════════════════════
// ExportDataTab.tsx
// ═══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { EXPORT_HISTORY, EXPORT_CARDS, statusBadgeClass } from './ReportsShared';

// ── Export Card ──────────────────────────────────────────────
interface ExportCardProps {
  type: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  subtitle: string;
  description: string;
  filterLabel: string;
  filterOptions: string[];
}

const ExportCard: React.FC<ExportCardProps> = ({
  type, icon, bgColor, iconColor, subtitle, description, filterLabel, filterOptions,
}) => {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleExport = () => {
    setState('loading');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 3000);
    }, 1800);
  };

  return (
    <div className="card">
      <div className="card-body" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div className="export-icon-box" style={{ background: bgColor }}>
            <i className={`fa-solid ${icon}`} style={{ color: iconColor, fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{type}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 12 }}>{description}</div>
        <div className="form-group" style={{ marginBottom: 8 }}>
          <div className="form-label">{filterLabel}</div>
          <select className="form-select" style={{ width: '100%' }}>
            {filterOptions.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <div className="form-label">Format</div>
          <select className="form-select" style={{ width: '100%' }}>
            <option>CSV</option>
            <option>Excel (.xlsx)</option>
          </select>
        </div>
        <button
          className="header-btn primary"
          style={{
            width: '100%', justifyContent: 'center',
            ...(state === 'done' ? { background: 'var(--green)', borderColor: 'var(--green)' } : {}),
          }}
          onClick={handleExport}
          disabled={state === 'loading'}
        >
          {state === 'loading' && <><i className="fa-solid fa-spinner fa-spin" /> Preparing...</>}
          {state === 'done'    && <><i className="fa-solid fa-circle-check" /> Ready — Download</>}
          {state === 'idle'    && <><i className="fa-solid fa-download" /> Export {type}</>}
        </button>
      </div>
    </div>
  );
};

// ── Main Tab ─────────────────────────────────────────────────
const ExportDataTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        Export any data set as <strong>CSV or Excel</strong>. Large exports are queued and a download link is sent to your dashboard. All exports are logged in the audit trail.
      </div>
    </div>

    <div className="grid-3" style={{ marginBottom: 14 }}>
      {EXPORT_CARDS.map(card => (
        <ExportCard key={card.type} {...card} />
      ))}
    </div>

    {/* Export History */}
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Export History</div>
        <div className="card-actions"><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last 10 exports</span></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Timestamp</th><th>Export Type</th><th>Date Range</th><th>Records</th><th>Format</th><th>Exported By</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {EXPORT_HISTORY.map((e, i) => (
              <tr key={i}>
                <td style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{e.time}</td>
                <td><strong style={{ fontSize: 11.5 }}>{e.type}</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>{e.range}</td>
                <td style={{ textAlign: 'center' }}>{e.records.toLocaleString()}</td>
                <td><span className="tag">{e.fmt}</span></td>
                <td>{e.by}</td>
                <td><span className={`badge ${statusBadgeClass(e.status)}`}>{e.status}</span></td>
                <td>
                  <button className="t-filter-btn" style={{ height: 24, fontSize: 10 }}>
                    <i className="fa-solid fa-download" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default ExportDataTab;