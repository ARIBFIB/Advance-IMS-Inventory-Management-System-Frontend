import React from 'react';
import type { Integration } from './types';
import { Badge } from './helpers';
import { INTEGRATIONS } from './data';

const IntegCard: React.FC<{ int: Integration }> = ({ int }) => (
  <div className="integration-card">
    <div
      className="integration-logo"
      style={int.logoBg ? { background: int.logoBg, borderColor: int.logoBg } : undefined}
    >
      <span style={{
        fontSize: 9, fontWeight: 800,
        color: int.logoBg ? '#fff' : 'var(--text-secondary)',
        textAlign: 'center', lineHeight: 1.2,
      }}>
        {int.logoText}
      </span>
    </div>
    <div>
      <div className="integration-name">{int.name}</div>
      <div className="integration-desc">{int.desc}</div>
    </div>
    <div className="integration-right">
      <Badge label={int.status} />
      <button
        className={`f-btn ${int.status === 'Available' ? 'primary' : int.status === 'Optional' ? '' : 'primary'}`}
        style={{ fontSize: 10 }}
      >
        <i className={`fa-solid fa-${int.status === 'Available' ? 'file-export' : int.status === 'Optional' ? 'circle-info' : 'plug'}`} />
        {int.status === 'Available' ? 'Export Now' : int.status === 'Optional' ? 'Learn More' : 'Connect'}
      </button>
    </div>
  </div>
);

const SectionLabel: React.FC<{ label: string; first?: boolean }> = ({ label, first }) => (
  <div style={{
    fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 0.5,
    margin: first ? '0 0 10px' : '14px 0 10px',
  }}>
    {label}
  </div>
);

const IntegrationsPanel: React.FC = () => {
  const paymentGateways = INTEGRATIONS.slice(0, 3);
  const ecommerce       = INTEGRATIONS.slice(3, 4);
  const accounting      = INTEGRATIONS.slice(4, 6);
  const banking         = INTEGRATIONS.slice(6);

  return (
    <>
      <div className="panel-heading">Financial Integrations</div>
      <div className="panel-desc">
        Connect payment gateways, e-commerce platforms, and accounting tools to automate financial data flow.
      </div>

      <div className="alert-strip info">
        <i className="fa-solid fa-circle-info" />
        Connecting payment gateways enables automatic reconciliation of prepaid orders and COD updates in real time.
      </div>

      <SectionLabel label="Payment Gateways" first />
      {paymentGateways.map(i => <IntegCard key={i.name} int={i} />)}

      <SectionLabel label="E-Commerce &amp; Order Sources" />
      {ecommerce.map(i => <IntegCard key={i.name} int={i} />)}

      <SectionLabel label="Accounting Software" />
      {accounting.map(i => <IntegCard key={i.name} int={i} />)}

      <SectionLabel label="Bank &amp; Courier Finance" />
      {banking.map(i => <IntegCard key={i.name} int={i} />)}
    </>
  );
};

export default IntegrationsPanel;