import React, { useState } from 'react';
import { StgToggleRow } from './SettingsShared';

// ── Types ──────────────────────────────────────────────────

interface BackupRecord {
  date: string;
  size: string;
  duration: string;
  status: 'Success' | 'Failed';
}

// ── Static Data ────────────────────────────────────────────

const INITIAL_BACKUP_HISTORY: BackupRecord[] = [
  { date: '11 May 2026, 08:00', size: '4.2 MB', duration: '12s', status: 'Success' },
  { date: '10 May 2026, 08:00', size: '4.1 MB', duration: '11s', status: 'Success' },
  { date: '09 May 2026, 08:00', size: '4.0 MB', duration: '13s', status: 'Success' },
  { date: '08 May 2026, 08:00', size: '3.9 MB', duration: '10s', status: 'Success' },
  { date: '07 May 2026, 08:00', size: '3.8 MB', duration: '14s', status: 'Failed'  },
  { date: '06 May 2026, 08:00', size: '3.8 MB', duration: '11s', status: 'Success' },
];

// ── BackupTab ──────────────────────────────────────────────

const BackupTab: React.FC = () => {
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>(INITIAL_BACKUP_HISTORY);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupDone, setBackupDone] = useState(false);

  const runBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      setBackupDone(true);
      const now = new Date();
      const label = `${now.getDate()} May ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setBackupHistory(prev => [
        { date: label, size: '4.3 MB', duration: '11s', status: 'Success' },
        ...prev,
      ]);
      setTimeout(() => setBackupDone(false), 3000);
    }, 2000);
  };

  return (
    <>
      {/* Stats Row */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Last Backup</div>
            <div className="stat-icon" style={{ background: 'var(--green-bg)' }}>
              <i className="fa-solid fa-circle-check ic-green" />
            </div>
          </div>
          <div className="stat-value stat-value-sm">11 May</div>
          <div className="stat-trend up"><i className="fa-solid fa-circle-check" /> 08:00 AM · Success</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Backup Size</div>
            <div className="stat-icon" style={{ background: '#EFF6FF' }}>
              <i className="fa-solid fa-database" style={{ color: 'var(--blue)' }} />
            </div>
          </div>
          <div className="stat-value">4.2 MB</div>
          <div className="stat-trend neutral">Compressed archive</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Backups Stored</div>
            <div className="stat-icon" style={{ background: '#FFFBEB' }}>
              <i className="fa-solid fa-boxes-stacked ic-yellow" />
            </div>
          </div>
          <div className="stat-value">30</div>
          <div className="stat-trend neutral">Last 30 days retained</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Next Scheduled</div>
            <div className="stat-icon" style={{ background: '#FFF5EE' }}>
              <i className="fa-solid fa-clock ic-orange" />
            </div>
          </div>
          <div className="stat-value stat-value-sm">12 May</div>
          <div className="stat-trend neutral">08:00 AM · Auto</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        {/* Backup Config */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-database" /> Backup Configuration</div>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Auto-backup Frequency</div>
                <select className="form-select">
                  <option>Daily</option><option>Weekly</option><option>Twice Daily</option><option>Manual Only</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Backup Time</div>
                <input className="form-input" type="time" defaultValue="08:00" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Retention Period (days)</div>
                <input className="form-input" type="number" defaultValue={30} />
              </div>
              <div className="form-group">
                <div className="form-label">Backup Format</div>
                <select className="form-select">
                  <option>Compressed ZIP</option><option>SQL Dump</option><option>JSON Export</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Storage Destination</div>
                <select className="form-select">
                  <option>Local Server</option><option>Google Drive</option><option>AWS S3</option><option>Dropbox</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Notify Admin on Failure</div>
                <select className="form-select">
                  <option>Yes — Dashboard</option><option>Yes — Email</option><option>No</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
              <StgToggleRow label="Include Product Images in Backup" />
              <StgToggleRow label="Encrypt Backup File" desc="AES-256 encryption applied to all backups" defaultChecked />
            </div>
            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Backup Settings</button>
              <button className="header-btn" onClick={runBackup} disabled={backupLoading}>
                {backupLoading
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Running...</>
                  : backupDone
                    ? <><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }} /> Done!</>
                    : <><i className="fa-solid fa-play" /> Run Backup Now</>}
              </button>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Backup History</div>
          </div>
          <div className="backup-list-wrap">
            {backupHistory.map((b, i) => (
              <div key={i} className="list-item">
                <div className="list-icon" style={{ background: b.status === 'Success' ? 'var(--green-bg)' : 'var(--red-bg)' }}>
                  <i
                    className={`fa-solid fa-${b.status === 'Success' ? 'circle-check ic-green' : 'circle-xmark ic-red'}`}
                    style={{ fontSize: 11 }}
                  />
                </div>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 11 }}>{b.date}</div>
                  <div className="list-meta">{b.size} · {b.duration} · {b.status}</div>
                </div>
                <div className="list-right">
                  {b.status === 'Success'
                    ? <button className="header-btn" style={{ height: 23, fontSize: 9.5 }}><i className="fa-solid fa-download" /></button>
                    : <button className="header-btn" style={{ height: 23, fontSize: 9.5, color: 'var(--red)' }}><i className="fa-solid fa-rotate" /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Data Export */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-export" /> Data Export</div>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Export all your data in a portable format. Use for migration, compliance, or archiving purposes.
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="form-label">Export Type</div>
                <select className="form-select">
                  <option>Full System Export</option>
                  <option>Products Only</option>
                  <option>Orders Only</option>
                  <option>Customers Only</option>
                  <option>Financial Records</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">File Format</div>
                <select className="form-select">
                  <option>Excel (.xlsx)</option><option>CSV (.csv)</option><option>JSON</option>
                </select>
              </div>
            </div>
            <button className="header-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fa-solid fa-file-export" /> Export Data
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-triangle-exclamation ic-red" /> Danger Zone</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="danger-item">
                <div>
                  <div className="danger-item-title">Clear All Order History</div>
                  <div className="danger-item-desc">Permanently delete all orders. Cannot be undone.</div>
                </div>
                <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)', flexShrink: 0 }}>
                  <i className="fa-solid fa-trash" /> Clear
                </button>
              </div>
              <div className="danger-item">
                <div>
                  <div className="danger-item-title">Reset Inventory Counts</div>
                  <div className="danger-item-desc">Set all stock quantities to zero. Use before a full recount.</div>
                </div>
                <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)', flexShrink: 0 }}>
                  <i className="fa-solid fa-rotate-left" /> Reset
                </button>
              </div>
              <div className="danger-item">
                <div>
                  <div className="danger-item-title">Factory Reset</div>
                  <div className="danger-item-desc">Wipe all data and return system to default state.</div>
                </div>
                <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)', flexShrink: 0 }}>
                  <i className="fa-solid fa-bomb" /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackupTab;