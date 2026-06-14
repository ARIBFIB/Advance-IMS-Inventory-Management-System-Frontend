import React from 'react';
import ComingSoon from './ComingSoon';

// ── ALL LOGS TAB ──────────────────────────────────────────
const AllLogsTab: React.FC = () => (
  <ComingSoon
    feature="All Logs"
    icon="fa-list-check"
    note="A complete, filterable feed of every staff action will appear here once GET /api/audit/logs is available on the backend."
  />
);

export default AllLogsTab;