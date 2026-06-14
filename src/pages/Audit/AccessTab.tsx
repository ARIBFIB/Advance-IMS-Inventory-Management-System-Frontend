import React from 'react';
import ComingSoon from './ComingSoon';

// ── ACCESS TAB ────────────────────────────────────────────
const AccessTab: React.FC = () => (
  <ComingSoon
    feature="Access & Logins"
    icon="fa-right-to-bracket"
    note="Login activity, active sessions, and access history will appear here once an access/session log endpoint is available on the backend."
  />
);

export default AccessTab;