import React from 'react';
import ComingSoon from './ComingSoon';

// ── ANALYTICS TAB ─────────────────────────────────────────
const AnalyticsTab: React.FC = () => (
  <ComingSoon
    feature="Audit Analytics"
    icon="fa-chart-line"
    note="Charts for events by module, severity breakdown, most active staff, and hourly activity will appear here once an audit analytics endpoint is available on the backend."
  />
);

export default AnalyticsTab;