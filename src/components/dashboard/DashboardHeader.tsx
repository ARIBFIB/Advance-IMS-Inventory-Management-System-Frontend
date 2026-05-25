// ─── components/dashboard/DashboardHeader.tsx ────────────────

import React, { useEffect, useState } from 'react';
import { KpiStat } from '../../types/dashboard';
 
interface DashboardHeaderProps {
  kpis: KpiStat[];
  onNewOrder: () => void;
  onExport: () => void;
}

function formatLiveDate(): string {
  const now = new Date();
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let h = now.getHours();
  const m    = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · ${h}:${m} ${ampm} PKT`;
}

const trendIcon: Record<string, string> = {
  up:      'fa-arrow-trend-up',
  down:    'fa-arrow-trend-down',
  neutral: 'fa-minus',
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ kpis, onNewOrder, onExport }) => {
  const [dateStr, setDateStr] = useState(formatLiveDate);

  useEffect(() => {
    const id = setInterval(() => setDateStr(formatLiveDate()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="d-page-header">
      <div className="d-header-top">
        <div>
          <div className="d-header-date">{dateStr}</div>
          <h1 className="d-header-title">Good morning, Admin Khan 👋</h1>
          <p className="d-header-sub">
            Here's your operations snapshot — 84 orders processed today, revenue up 8.4% vs yesterday.
          </p>
        </div>

        <div className="d-header-actions">
          <button className="d-btn-dark" onClick={onNewOrder}>
            <i className="fa-solid fa-bag-shopping" /> New Order
          </button>
          <button className="d-btn-dark accent" onClick={onExport}>
            <i className="fa-solid fa-arrow-up-right-from-square" /> Export Report
          </button>
        </div>
      </div>

      <div className="d-header-kpis">
        {kpis.map((kpi, idx) => (
          <div className="d-header-kpi" key={kpi.label}>
            <div className="d-kpi-label">{kpi.label}</div>
            <div className="d-kpi-value">{kpi.value}</div>
            <div className={`d-kpi-trend ${kpi.trendDir}`}>
              <i className={`fa-solid ${trendIcon[kpi.trendDir]}`} />
              {kpi.trend}
            </div>
            {idx < kpis.length - 1 && <div className="d-kpi-divider" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;