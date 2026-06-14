import React, { useState } from 'react';
import './AuditPage.css';

import { AuditTab } from './types';
import { ComingSoonBanner } from './ComingSoon';
import AllLogsTab    from './AllLogsTab';
import SecurityTab   from './SecurityTab';
import DataChangesTab from './DataChangesTab';
import AccessTab     from './AccessTab';
import ExportsTab    from './ExportsTab';
import AnalyticsTab  from './AnalyticsTab';
import SettingsTab   from './SettingsTab';

// ── TAB CONFIG ────────────────────────────────────────────
const TABS: { id: AuditTab; label: string }[] = [
  { id: 'all',       label: 'All Logs' },
  { id: 'security',  label: 'Security' },
  { id: 'data',      label: 'Data Changes' },
  { id: 'access',    label: 'Access & Logins' },
  { id: 'exports',   label: 'Exports' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings',  label: 'Settings' },
];

// ── PAGE ──────────────────────────────────────────────────
const AuditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuditTab>('all');

  return (
    <div id="page-audit">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-title">Audit Logs</div>
        <div className="page-hero-sub">
          Complete record of all system actions performed by staff — logins, data changes, exports, and critical events.
        </div>
      </div>

      {/* Coming Soon Notice — no /api/audit/* backend yet */}
      <ComingSoonBanner
        feature="Audit Logs module"
        note="This module is not yet connected to the backend (no audit log API endpoints exist yet)."
      />

      {/* Inner Tabs */}
      <div className="inner-tabs">
        {TABS.map(t => (
          <div
            key={t.id}
            className={`itab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'all'       && <AllLogsTab />}
      {activeTab === 'security'  && <SecurityTab />}
      {activeTab === 'data'      && <DataChangesTab />}
      {activeTab === 'access'    && <AccessTab />}
      {activeTab === 'exports'   && <ExportsTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'settings'  && <SettingsTab />}
    </div>
  );
};

export default AuditPage;