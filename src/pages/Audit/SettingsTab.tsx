import React from 'react';
import ComingSoon from './ComingSoon';

// ── SETTINGS TAB ──────────────────────────────────────────
const SettingsTab: React.FC = () => (
  <ComingSoon
    feature="Audit Settings"
    icon="fa-sliders"
    note="Configuration for log retention, alerts, exports, and compliance will be available here once the audit settings endpoint is ready on the backend."
  />
);

export default SettingsTab;