import React, { useState } from 'react';
import { SectionDivider } from './SettingsShared';

// ── Types ──────────────────────────────────────────────────

interface CourierApi {
  courier: string;
  endpoint: string;
  key: string;
  status: 'Connected' | 'Error';
  lastSync: string;
}

// ── Static Data ────────────────────────────────────────────

const COURIER_API_DATA: CourierApi[] = [
  { courier: 'TCS Express',      endpoint: 'https://api.tcs.com.pk/track',   key: 'TCS-••••7f2a', status: 'Connected', lastSync: '11 May 08:00' },
  { courier: 'Leopards Courier', endpoint: 'https://api.leopards.com.pk/',   key: 'LCS-••••3b19', status: 'Connected', lastSync: '11 May 08:00' },
  { courier: 'M&P Express',      endpoint: 'https://mpm.com.pk/api/v2/',     key: 'MNP-••••9c44', status: 'Connected', lastSync: '11 May 08:00' },
  { courier: 'Trax',             endpoint: 'https://api.traxlogistics.com/', key: 'Not configured', status: 'Error',   lastSync: 'N/A' },
];

// ── IntegrationCard ────────────────────────────────────────

interface IntegrationCardProps {
  id: string;
  logoChar?: string;
  logoIcon?: string;
  logoColor: string;
  title: string;
  subtitle: string;
  desc: string;
  connected?: boolean;
  children?: React.ReactNode;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  logoChar, logoIcon, logoColor, title, subtitle, desc, connected = false, children
}) => {
  const [isConnected, setIsConnected] = useState(connected);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setIsConnected(true); }, 1500);
  };

  return (
    <div className="card">
      <div className="card-body" style={{ padding: 16 }}>
        <div className="int-card-header">
          <div className="int-logo" style={{ background: `${logoColor}20`, color: logoColor }}>
            {logoIcon
              ? <i className={`${logoIcon} int-logo-icon`} style={{ color: logoColor }} />
              : logoChar}
          </div>
          <div>
            <div className="int-card-title">{title}</div>
            <div className="int-card-sub">{subtitle}</div>
          </div>
          <span className={`badge ${isConnected ? 'green' : 'gray'}`} style={{ marginLeft: 'auto' }}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        <div className="int-card-desc">{desc}</div>
        {isConnected ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="header-btn" style={{ flex: 1, justifyContent: 'center' }}>
              <i className="fa-solid fa-gear" /> Configure
            </button>
            <button
              className="header-btn"
              style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={() => setIsConnected(false)}
            >
              <i className="fa-solid fa-unlink" />
            </button>
          </div>
        ) : (
          <>
            {children}
            <button
              className="header-btn primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={handleConnect}
              disabled={loading}
            >
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin" /> Connecting...</>
                : <><i className="fa-solid fa-plug" /> Connect {title}</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── IntegrationsTab ────────────────────────────────────────

const IntegrationsTab: React.FC = () => (
  <>
    <div className="info-banner">
      <i className="fa-solid fa-circle-info" />
      <div className="info-banner-text">
        Connect third-party platforms to automate order import, courier tracking, payment verification, and financial reconciliation.
        All credentials are encrypted at rest.
      </div>
    </div>

    <SectionDivider label="E-Commerce Platforms" />
    <div className="grid-3" style={{ marginBottom: 14 }}>
      <IntegrationCard
        id="shopify" logoChar="S" logoColor="#96BF48"
        title="Shopify" subtitle="Order & inventory sync"
        desc="Automatically pull confirmed Shopify orders, sync stock levels, and mark products as sold-out when inventory hits zero."
      >
        <div className="form-group" style={{ marginBottom: 8 }}>
          <div className="form-label">Store URL</div>
          <input className="form-input" placeholder="mystore.myshopify.com" style={{ width: '100%' }} />
        </div>
        <div className="form-group" style={{ marginBottom: 4 }}>
          <div className="form-label">API Key</div>
          <input className="form-input" type="password" placeholder="shpat_••••••••••••" style={{ width: '100%' }} />
        </div>
      </IntegrationCard>

      <IntegrationCard
        id="woocommerce" logoChar="W" logoColor="#7F54B3"
        title="WooCommerce" subtitle="WordPress order sync"
        desc="Import WooCommerce orders into the system. Stock is deducted automatically when orders are placed and confirmed."
      >
        <div className="form-group" style={{ marginBottom: 8 }}>
          <div className="form-label">Site URL</div>
          <input className="form-input" placeholder="https://mystore.com" style={{ width: '100%' }} />
        </div>
        <div className="form-group" style={{ marginBottom: 4 }}>
          <div className="form-label">Consumer Key</div>
          <input className="form-input" type="password" placeholder="ck_••••••••••••" style={{ width: '100%' }} />
        </div>
      </IntegrationCard>

      <IntegrationCard
        id="whatsapp" logoIcon="fa-brands fa-whatsapp" logoColor="#25D366"
        title="WhatsApp Business" subtitle="Order alerts & notifications"
        desc="Send order confirmations, dispatch updates, and staff task notifications via WhatsApp Business API."
        connected
      />
    </div>

    <SectionDivider label="Courier APIs" />
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-truck" /> Courier API Credentials</div>
        <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add Courier API</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Courier</th><th>Endpoint</th><th>API Key</th><th>Status</th><th>Last Sync</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {COURIER_API_DATA.map((c, i) => (
              <tr key={i}>
                <td><strong>{c.courier}</strong></td>
                <td><code className="courier-endpoint-code">{c.endpoint}</code></td>
                <td><code className="courier-endpoint-code">{c.key}</code></td>
                <td>
                  <span className={`badge ${c.status === 'Connected' ? 'green' : 'red'}`}>{c.status}</span>
                </td>
                <td><span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{c.lastSync}</span></td>
                <td>
                  <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px', marginRight: 4 }}>
                    <i className="fa-solid fa-rotate" /> Test
                  </button>
                  <button className="header-btn" style={{ height: 24, fontSize: 10, padding: '0 7px' }}>
                    <i className="fa-solid fa-key" /> Update Key
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <SectionDivider label="Payment Gateways" />
    <div className="grid-3">
      <IntegrationCard
        id="paymob" logoChar="Pm" logoColor="#2CA01C"
        title="Paymob" subtitle="Card payment gateway"
        desc="Accept card payments online and auto-mark Paymob transactions as prepaid orders when payment is confirmed."
      />
      <IntegrationCard
        id="jazzcash" logoChar="JC" logoColor="#AA1F27"
        title="JazzCash" subtitle="Mobile wallet payments"
        desc="Receive JazzCash payments for prepaid orders and log rider payouts digitally through the earnings module."
      />
      <IntegrationCard
        id="easypaisa" logoChar="EP" logoColor="#02a550"
        title="EasyPaisa" subtitle="Mobile wallet payments"
        desc="Verify EasyPaisa transactions for prepaid orders and log rider payout history automatically in finance."
      />
    </div>
  </>
);

export default IntegrationsTab;