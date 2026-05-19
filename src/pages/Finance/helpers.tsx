import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

export const fmt = (n: number) => '₨' + Number(n).toLocaleString();

export function badgeClass(s: string): string {
  const m: Record<string, string> = {
    'Collected': 'green', 'In Transit': 'yellow', 'Pending': 'yellow',
    'Pending Submission': 'orange', 'Submitted': 'blue',
    'Pending Verification': 'yellow', 'Verified': 'green',
    'Overdue': 'red', 'Paid': 'green', 'Active': 'green', 'Inactive': 'gray',
    'Available': 'green', 'Not Connected': 'yellow', 'Optional': 'orange',
  };
  return m[s] || 'gray';
}

// ═══════════════════════════════════════════════════════════
// REUSABLE MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════

export const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${badgeClass(label)}`}>{label}</span>
);

export const EmptyState: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="empty-state">
    <i className={`fa-solid ${icon}`} />
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

export const ToggleSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
      <span className="toggle-track" />
    </label>
  );
};

// ── FPagination ──
interface FPagProps {
  current: number; total: number; totalItems: number;
  start: number; end: number; onChange: (p: number) => void;
}
export const FPagination: React.FC<FPagProps> = ({ current, total, totalItems, start, end, onChange }) => {
  const pages: (number | '…')[] = [];
  if (total <= 7) {
    for (let p = 1; p <= total; p++) pages.push(p);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }
  return (
    <div className="f-pagination">
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
        Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems}</strong>
      </div>
      <div className="f-pag-controls">
        <button className="f-pag-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>‹</button>
        {pages.map((p, i) =>
          p === '…'
            ? <button key={`d${i}`} className="f-pag-btn" style={{ pointerEvents: 'none' }}>…</button>
            : <button key={p} className={`f-pag-btn ${p === current ? 'active' : ''}`} onClick={() => onChange(p as number)}>{p}</button>
        )}
        <button className="f-pag-btn" disabled={current === total || total === 0} onClick={() => onChange(current + 1)}>›</button>
      </div>
    </div>
  );
};

// ── InnerTabs ──
interface InnerTabsProps {
  tabs: { id: string; label: React.ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}
export const InnerTabs: React.FC<InnerTabsProps> = ({ tabs, active, onChange }) => (
  <div className="inner-tabs">
    {tabs.map(t => (
      <div key={t.id} className={`itab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
        {t.label}
      </div>
    ))}
  </div>
);