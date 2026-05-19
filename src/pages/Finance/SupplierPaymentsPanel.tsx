import React, { useState } from 'react';
import { FPagination, fmt } from './helpers';
import { SUPPLIER_PAYMENTS } from './data';

const SupplierPaymentsPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);
  const PER_PAGE = 5;

  const filtered  = SUPPLIER_PAYMENTS.filter(
    p => !search || p.supplier.toLowerCase().includes(search.toLowerCase())
  );
  const total     = filtered.length;
  const start     = (page - 1) * PER_PAGE + 1;
  const end       = Math.min(page * PER_PAGE, total);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="panel-heading">Supplier Payments Made</div>
      <div className="panel-desc">Complete history of all payments made to suppliers. Filter by supplier or date range.</div>

      <div className="card">
        <div className="f-toolbar">
          <div className="f-toolbar-left">
            <div className="f-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search supplier..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <div className="f-toolbar-right">
            <button className="f-btn"><i className="fa-solid fa-file-export" /> Export</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Supplier</th><th>Amount</th>
                <th>Method</th><th>Reference</th><th>Paid By</th><th>Notes</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p, i) => (
                <tr key={i}>
                  <td>{p.date}</td>
                  <td><strong>{p.supplier}</strong></td>
                  <td><strong style={{ color: 'var(--green)' }}>{fmt(p.amount)}</strong></td>
                  <td><span className="f-tag">{p.method}</span></td>
                  <td><code className="ref">{p.ref}</code></td>
                  <td>{p.by}</td>
                  <td style={{ color: 'var(--text-muted)' }}>—</td>
                  <td>
                    <button className="f-btn" style={{ height: 22, fontSize: 9.5 }}>
                      <i className="fa-solid fa-eye" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <FPagination current={page} total={Math.ceil(total / PER_PAGE)} totalItems={total} start={start} end={end} onChange={setPage} />
      </div>
    </>
  );
};

export default SupplierPaymentsPanel;