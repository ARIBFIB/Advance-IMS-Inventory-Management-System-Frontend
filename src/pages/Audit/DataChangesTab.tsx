import React from 'react';
import ComingSoon from './ComingSoon';

// ── DATA CHANGES TAB ──────────────────────────────────────
const DataChangesTab: React.FC = () => (
  <ComingSoon
    feature="Data Changes"
    icon="fa-pen-to-square"
    note="A record of every create, update, delete, and stock adjustment made by staff will appear here once a data-change log endpoint is available on the backend."
  />
);

export default DataChangesTab;