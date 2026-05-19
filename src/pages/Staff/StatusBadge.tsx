// ═══════════════════════════════════════════════════════════
// StatusBadge.tsx — Active / Offline / Suspended badge
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { StaffStatus } from './staff.types';
import { statusBadgeClass, statusDotClass } from './staffData';

interface Props {
  status: StaffStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => (
  <span className={`badge ${statusBadgeClass[status]}`}>
    <span className={`online-dot ${statusDotClass[status]}`} />
    {status}
  </span>
);

export default StatusBadge;