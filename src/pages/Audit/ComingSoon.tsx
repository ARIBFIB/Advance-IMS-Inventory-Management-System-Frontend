import React from 'react';

// ═══════════════════════════════════════════════════════
// COMING SOON
// Used across Audit tabs until /api/audit/* endpoints
// (or the relevant backend equivalent) are implemented.
// ═══════════════════════════════════════════════════════

// Small inline banner — used at the top of a tab alongside other content
export const ComingSoonBanner: React.FC<{ feature: string; note?: string }> = ({ feature, note }) => (
  <div className="alert-strip info" style={{ marginBottom: 14 }}>
    <i className="fa-solid fa-hourglass-half" />
    <div>
      <strong>{feature} — Coming Soon.</strong>{' '}
      {note ?? 'This section is not yet connected to a live backend endpoint.'}
    </div>
  </div>
);

// Full placeholder card — replaces an entire data-driven section
// (tables, charts, stats) when there is no backend endpoint to feed it.
const ComingSoon: React.FC<{ feature: string; note?: string; icon?: string }> = ({
  feature,
  note,
  icon = 'fa-hourglass-half',
}) => (
  <div className="card">
    <div className="card-body" style={{ padding: '48px 20px', textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'var(--blue-bg)', color: 'var(--blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', fontSize: 18,
      }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
        {feature} — Coming Soon
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
        {note ?? 'This section will be available once the backend API for this feature is ready.'}
      </div>
    </div>
  </div>
);

export default ComingSoon;