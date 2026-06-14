import React from 'react';
import ComingSoon from './ComingSoon';

// ── SECURITY TAB ──────────────────────────────────────────
const SecurityTab: React.FC = () => (
  <ComingSoon
    feature="Security Events"
    icon="fa-shield-halved"
    note="Failed logins, blocked IPs, role changes, and other security events will appear here once a security event log endpoint is available on the backend."
  />
);

export default SecurityTab;