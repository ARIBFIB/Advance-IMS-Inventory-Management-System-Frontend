import React from 'react';
import type { NavPanel } from './types';
import { fmt } from './helpers';
import { EXPENSES } from './data';

interface Props {
  onNav: (p: NavPanel) => void;
}

const LogExpensePanel: React.FC<Props> = ({ onNav }) => (
  <>
    <div className="panel-heading">Log Expense</div>
    <div className="panel-desc">
      Record a new business expense. Provide category, amount, and payment method for accurate financial tracking.
    </div>

    <div className="detail-grid-2" style={{ alignItems: 'start' }}>
      {/* Form */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-circle-plus" style={{ color: 'var(--accent)' }} /> New Expense Entry
          </div>
        </div>
        <div className="card-body">
          <div className="f-form-row single">
            <div className="f-form-group">
              <div className="f-form-label">Description *</div>
              <input className="f-form-input" placeholder="e.g. Petrol for delivery riders — May Week 2" />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Category *</div>
              <select className="f-form-select">
                <option>Logistics</option><option>Operations</option><option>Marketing</option>
                <option>Salaries</option><option>Utilities</option><option>Packaging</option>
                <option>Repairs &amp; Maintenance</option><option>Other</option>
              </select>
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Amount (₨) *</div>
              <input className="f-form-input" type="number" placeholder="0" />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Date *</div>
              <input className="f-form-input" type="date" />
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Payment Method</div>
              <select className="f-form-select">
                <option>Cash</option><option>Bank Transfer</option>
                <option>JazzCash</option><option>EasyPaisa</option><option>Cheque</option>
              </select>
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <div className="f-form-label">Reference / Invoice No.</div>
              <input className="f-form-input" placeholder="Optional ref. number" />
            </div>
            <div className="f-form-group">
              <div className="f-form-label">Logged By</div>
              <select className="f-form-select">
                <option>Accounts (Self)</option><option>Admin</option><option>Operations Manager</option>
              </select>
            </div>
          </div>
          <div className="f-form-row single">
            <div className="f-form-group">
              <div className="f-form-label">Notes</div>
              <textarea className="f-form-textarea" placeholder="Any additional notes about this expense..." />
            </div>
          </div>
          <hr />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="f-btn primary"><i className="fa-solid fa-check" /> Save Expense</button>
            <button className="f-btn" onClick={() => onNav('expenses')}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <div className="summary-box">
          <div className="summary-box-title">This Month's Expense Summary</div>
          {([
            ['Logistics',   38400],
            ['Operations',  44800],
            ['Marketing',   22000],
            ['Salaries',    12000],
            ['Utilities',    6200],
            ['Other',        4800],
          ] as [string, number][]).map(([k, v]) => (
            <div className="summary-row" key={k}>
              <span>{k}</span>
              <span style={{ fontWeight: 600 }}>{fmt(v)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span className="summary-val" style={{ color: 'var(--red)' }}>₨1,28,200</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Recent Entries</div>
          </div>
          <div className="card-body" style={{ padding: '6px 14px' }}>
            {EXPENSES.slice(0, 4).map((e, i) => (
              <div className="list-item" key={i}>
                <div className="list-content">
                  <div className="list-title" style={{ fontSize: 10.5 }}>{e.desc}</div>
                  <div className="list-meta">{e.category} · {e.date}</div>
                </div>
                <div className="list-right">
                  <strong style={{ color: 'var(--red)', fontSize: 11 }}>{fmt(e.amount)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LogExpensePanel;