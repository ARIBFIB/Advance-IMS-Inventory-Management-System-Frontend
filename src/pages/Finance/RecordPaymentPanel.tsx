import React from 'react';
import type { NavPanel } from './types';
import { fmt } from './helpers';
import { SUPPLIERS } from './data';

interface Props {
  onNav: (p: NavPanel) => void;
}

const RecordPaymentPanel: React.FC<Props> = ({ onNav }) => (
  <>
    <div className="panel-heading">Record Supplier Payment</div>
    <div className="panel-desc">
      Log a payment made to a supplier. This will automatically update the outstanding balance for that supplier.
    </div>

    <div className="detail-grid-2" style={{ alignItems: 'start' }}>
      {/* Form */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-money-bill-transfer" style={{ color: 'var(--green)' }} /> Payment Details
          </div>
        </div>
        <div className="card-body">
          <div className="f-form-row single">
            <div className="f-form-group">
              <div className="f-form-label">Supplier *</div>
              <select className="f-form-select">
                {SUPPLIERS.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Amount (₨) *</div>
              <input className="f-form-input" type="number" placeholder="0" />
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Payment Date *</div>
              <input className="f-form-input" type="date" />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Payment Method</div>
              <select className="f-form-select">
                <option>Bank Transfer</option><option>Cash</option>
                <option>Cheque</option><option>JazzCash</option><option>EasyPaisa</option>
              </select>
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Bank / Account</div>
              <input className="f-form-input" placeholder="e.g. HBL, UBL" />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Transaction Reference</div>
              <input className="f-form-input" placeholder="Transfer ref. or cheque no." />
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Paid By</div>
              <select className="f-form-select">
                <option>Accounts</option><option>Admin</option><option>Owner</option>
              </select>
            </div>
          </div>
          <div className="f-form-row single">
            <div className="f-form-group">
              <div className="f-form-label">Linked Invoice / Purchase</div>
              <input className="f-form-input" placeholder="Invoice number or PO reference" />
            </div>
          </div>
          <div className="f-form-row single">
            <div className="f-form-group">
              <div className="f-form-label">Notes</div>
              <textarea className="f-form-textarea" placeholder="Optional payment notes..." />
            </div>
          </div>
          <hr />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="f-btn primary"><i className="fa-solid fa-check" /> Record Payment</button>
            <button className="f-btn" onClick={() => onNav('suppliers')}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Outstanding balances sidebar */}
      <div>
        <div className="summary-box">
          <div className="summary-box-title">Outstanding Supplier Balances</div>
          {SUPPLIERS.map(s => (
            <div className="summary-row" key={s.name}>
              <span>{s.name}</span>
              <span style={{ fontWeight: 600, color: s.balance > 0 ? 'var(--red)' : 'var(--green)' }}>
                {s.balance > 0 ? fmt(s.balance) : 'Cleared'}
                {s.status === 'Overdue' && (
                  <span className="badge red" style={{ marginLeft: 5 }}>Overdue</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default RecordPaymentPanel;