import React from 'react';
import ComingSoon from './ComingSoon';

// ── EXPORTS TAB ───────────────────────────────────────────
const ExportsTab: React.FC = () => (
  <ComingSoon
    feature="Exports Log"
    icon="fa-file-export"
    note="A history of all data exports — who requested them, what was included, and when — will appear here once an exports log endpoint is available on the backend."
  />
);

export default ExportsTab;