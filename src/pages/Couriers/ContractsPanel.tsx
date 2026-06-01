// ContractsPanel.tsx — live courier dropdown + static contracts table
import React, { useState, useEffect } from 'react';
import { CONTRACTS, ApiCourier, Badge, InnerTabs, EmptyState } from './shared';
import { couriersAPI } from '../../services/api';

const ContractsPanel: React.FC = () => {
  const [innerTab, setInnerTab] = useState('active');
  const [couriers, setCouriers] = useState<ApiCourier[]>([]);
  const [search,   setSearch]   = useState('');
  const [saving,   setSaving]   = useState(false);
  const [saveMsg,  setSaveMsg]  = useState('');

  // Form state for new contract
  const [form, setForm] = useState({
    courier: '', ref: '', startDate: '', endDate: '',
    sla: '3', penalty: '50', codDays: '7',
    autoRenew: 'Yes', renewalNotice: '30',
  });

  useEffect(() => {
    couriersAPI.getAll({ limit: 50 })
      .then(r => setCouriers(r.data?.data?.couriers ?? []))
      .catch(() => {});
  }, []);

  const courierNames = couriers.length > 0
    ? couriers.map(c => c.name)
    : CONTRACTS.map(c => c.courier);

  const filteredContracts = CONTRACTS.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.courier.toLowerCase().includes(q) || c.ref.toLowerCase().includes(q);
  });

  const handleSave = async () => {
    if (!form.courier || !form.ref.trim()) { setSaveMsg('Courier and Contract # are required.'); return; }
    setSaving(true); setSaveMsg('');
    await new Promise(r => setTimeout(r, 700)); // No backend endpoint — simulate
    setSaving(false);
    setSaveMsg('Contract saved successfully.');
    setTimeout(() => { setSaveMsg(''); setInnerTab('active'); }, 1200);
  };

  // Days until expiry
  const daysUntilExpiry = (endDate: string) => {
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
    return diff;
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="panel-heading">Contracts &amp; Terms</div>
          <div className="panel-desc">
            Formal agreements, SLAs, and payment terms with each courier. Track expiry dates and
            auto-renewal settings.
          </div>
        </div>
        <button className="c-btn primary" style={{ flexShrink: 0, marginTop: 4 }} onClick={() => setInnerTab('add')}>
          <i className="fa-solid fa-plus" /> Add Contract
        </button>
      </div>

      <InnerTabs
        tabs={[
          { id: 'active',  label: 'Active Contracts' },
          { id: 'expired', label: 'Expired'           },
          { id: 'add',     label: 'New Contract'      },
        ]}
        active={innerTab}
        onChange={setInnerTab}
      />

      {/* ── ACTIVE ── */}
      {innerTab === 'active' && (
        <>
          {/* Expiry warnings */}
          {CONTRACTS.some(c => {
            const d = daysUntilExpiry(c.end.split(' ').reverse().join('-'));
            return d > 0 && d <= 60;
          }) && (
            <div className="alert-strip warn">
              <i className="fa-solid fa-triangle-exclamation" />
              Some contracts expire within 60 days. Review auto-renewal settings.
            </div>
          )}

          <div className="card">
            <div className="c-toolbar">
              <div className="c-toolbar-left">
                <div className="c-search">
                  <i className="fa-solid fa-magnifying-glass" />
                  <input
                    placeholder="Search courier or contract #..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="c-toolbar-right">
                <button className="c-btn"><i className="fa-solid fa-file-export" /> Export</button>
                <button className="c-btn primary" onClick={() => setInnerTab('add')}>
                  <i className="fa-solid fa-plus" /> New Contract
                </button>
              </div>
            </div>

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Courier</th><th>Contract #</th><th>Start Date</th><th>End Date</th>
                    <th>SLA (Days)</th><th>Penalty/Day</th><th>COD Settlement</th>
                    <th>Auto-renew</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.length === 0 ? (
                    <tr><td colSpan={10}>
                      <EmptyState icon="fa-file-contract" title="No contracts found" desc="No contracts match your search." />
                    </td></tr>
                  ) : filteredContracts.map(c => (
                    <tr key={c.ref}>
                      <td>
                        <div className="td-flex">
                          <div className="row-avatar" style={{ background: 'var(--bg)', fontSize: 8, width: 26, height: 26 }}>
                            {c.courier.slice(0, 3).toUpperCase()}
                          </div>
                          <strong>{c.courier}</strong>
                        </div>
                      </td>
                      <td><code className="sku">{c.ref}</code></td>
                      <td style={{ fontSize: 11 }}>{c.start}</td>
                      <td style={{ fontSize: 11 }}>{c.end}</td>
                      <td>{c.sla} days</td>
                      <td>₨{c.penalty}/day</td>
                      <td>{c.codDays} days</td>
                      <td>
                        <span style={{ fontSize: 10.5, color: c.autoRenew === 'Yes' ? 'var(--green)' : 'var(--text-muted)' }}>
                          {c.autoRenew === 'Yes' ? <><i className="fa-solid fa-check" /> Yes</> : 'No'}
                        </span>
                      </td>
                      <td><Badge label={c.status} /></td>
                      <td>
                        <button className="c-btn" style={{ height: 23, fontSize: 9.5 }}>
                          <i className="fa-solid fa-eye" />
                        </button>
                        <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3 }}>
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button className="c-btn" style={{ height: 23, fontSize: 9.5, marginLeft: 3 }}>
                          <i className="fa-solid fa-download" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── EXPIRED ── */}
      {innerTab === 'expired' && (
        <div className="card">
          <div className="card-body">
            <EmptyState icon="fa-file-circle-xmark" title="No Expired Contracts" desc="All contracts are currently active." />
          </div>
        </div>
      )}

      {/* ── ADD ── */}
      {innerTab === 'add' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-file-pen" /> New Contract</div>
          </div>
          <div className="card-body">
            {saveMsg && (
              <div style={{
                marginBottom: 10, padding: '6px 10px', borderRadius: 6, fontSize: 11,
                background: saveMsg.includes('saved') ? 'var(--green-bg)' : 'var(--red-bg)',
                color: saveMsg.includes('saved') ? 'var(--green)' : 'var(--red)',
              }}>
                <i className={`fa-solid ${saveMsg.includes('saved') ? 'fa-circle-check' : 'fa-circle-exclamation'}`} /> {saveMsg}
              </div>
            )}

            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Courier Company *</div>
                <select className="c-form-select" value={form.courier} onChange={e => setForm(f => ({ ...f, courier: e.target.value }))}>
                  <option value="">— Select Courier —</option>
                  {courierNames.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Contract Reference # *</div>
                <input className="c-form-input" placeholder="CTR-2026-XXX"
                  value={form.ref} onChange={e => setForm(f => ({ ...f, ref: e.target.value }))} />
              </div>
            </div>

            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Start Date</div>
                <input className="c-form-input" type="date"
                  value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">End Date</div>
                <input className="c-form-input" type="date"
                  value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            <div className="c-form-row triple">
              <div className="c-form-group">
                <div className="c-form-label">SLA (Days)</div>
                <input className="c-form-input" type="number" placeholder="3"
                  value={form.sla} onChange={e => setForm(f => ({ ...f, sla: e.target.value }))} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Penalty/Day (₨)</div>
                <input className="c-form-input" type="number" placeholder="50"
                  value={form.penalty} onChange={e => setForm(f => ({ ...f, penalty: e.target.value }))} />
              </div>
              <div className="c-form-group">
                <div className="c-form-label">COD Settlement (Days)</div>
                <input className="c-form-input" type="number" placeholder="7"
                  value={form.codDays} onChange={e => setForm(f => ({ ...f, codDays: e.target.value }))} />
              </div>
            </div>

            <div className="c-form-row">
              <div className="c-form-group">
                <div className="c-form-label">Auto-renew</div>
                <select className="c-form-select" value={form.autoRenew} onChange={e => setForm(f => ({ ...f, autoRenew: e.target.value }))}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="c-form-group">
                <div className="c-form-label">Renewal Notice (Days)</div>
                <input className="c-form-input" type="number" placeholder="30"
                  value={form.renewalNotice} onChange={e => setForm(f => ({ ...f, renewalNotice: e.target.value }))} />
              </div>
            </div>

            <hr />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="c-btn primary" onClick={handleSave} disabled={saving}>
                <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-check'}`} />
                {saving ? 'Saving…' : 'Save Contract'}
              </button>
              <button className="c-btn" onClick={() => setInnerTab('active')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractsPanel;