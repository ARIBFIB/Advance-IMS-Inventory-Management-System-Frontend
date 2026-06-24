// ShippedTab.tsx — dynamic
import React, { useState, useEffect, useCallback } from "react";
import { ordersAPI } from "../../services/api";

/* ─── Types ─────────────────────────────────────────────── */
interface ApiOrder {
  _id: string;
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  customer?: { fullName?: string; phone?: string; email?: string };
  shippingAddress?: { city?: string; country?: string };
  trackingNumber?: string;
  courier?: { name?: string };
}

interface ApiPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (v: number) =>
  "₨" + v.toLocaleString("en-PK", { maximumFractionDigits: 0 });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Badge: React.FC<{ label: string; color: string }> = ({
  label,
  color,
}) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.4,
      background: color + "18",
      color,
      border: `1px solid ${color}33`,
    }}
  >
    {label}
  </span>
);

const payBadge = (s: string) => {
  const map: Record<string, string> = {
    Paid: "#16a34a",
    Pending: "#d97706",
    Refunded: "#6366f1",
    "Partially Paid": "#0891b2",
    Failed: "#dc2626",
  };
  return <Badge label={s} color={map[s] ?? "#64748b"} />;
};

/* ─── Skeleton ───────────────────────────────────────────── */
const TableSkeleton = () => (
  <div style={{ padding: "12px 0" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        style={{
          height: 44,
          background: "var(--bg-2)",
          borderRadius: 6,
          marginBottom: 6,
          opacity: 1 - i * 0.15,
          animation: "pulse 1.4s ease-in-out infinite",
        }}
      />
    ))}
  </div>
);

const EmptyState: React.FC<{ msg: string }> = ({ msg }) => (
  <div
    style={{
      textAlign: "center",
      padding: "48px 0",
      color: "var(--text-muted)",
    }}
  >
    <i
      className="fa-solid fa-truck"
      style={{
        fontSize: 28,
        marginBottom: 10,
        display: "block",
        opacity: 0.35,
      }}
    />
    <div style={{ fontSize: 13 }}>{msg}</div>
  </div>
);

/* ─── Styles ─────────────────────────────────────────────── */
const styles = `
  @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.3} }
  @keyframes slideIn { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .st-table { width:100%; border-collapse:collapse; font-size:12px; }
  .st-table th { background:var(--bg-2); color:var(--text-muted); font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:.6px; padding:8px 10px; text-align:left; white-space:nowrap; }
  .st-table td { padding:10px 10px; border-bottom:1px solid var(--border); color:var(--text); vertical-align:middle; }
  .st-table tr:hover td { background:var(--bg-2); }
  .st-search { background:var(--bg-2); border:1px solid var(--border); border-radius:7px;
    padding:7px 12px; font-size:12px; color:var(--text); outline:none; width:220px; }
  .st-search:focus { border-color:var(--primary); }
  .st-btn { padding:5px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;
    border:1px solid var(--border); background:var(--bg-2); color:var(--text); transition:all .15s; }
  .st-btn:hover { border-color:var(--primary); color:var(--primary); }
  .st-btn-primary { background:var(--primary); color:#fff; border-color:var(--primary); }
  .st-btn-primary:hover { opacity:.88; color:#fff; }
  .st-btn:disabled { opacity:.4; cursor:not-allowed; }
  .st-toast { position:fixed; bottom:24px; right:24px; z-index:9999; padding:10px 16px;
    border-radius:8px; font-size:12px; font-weight:600; display:flex; align-items:center;
    gap:8px; box-shadow:0 4px 16px rgba(0,0,0,.18); animation:slideIn .3s ease; }
  .st-toast.success { background:#dcfce7; color:#16a34a; border:1px solid #86efac; }
  .st-toast.error   { background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; }
  .st-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:1000;
    display:flex; align-items:center; justify-content:center; }
  .st-modal { background:var(--bg); border-radius:12px; padding:24px; min-width:360px;
    max-width:480px; width:90%; box-shadow:0 8px 40px rgba(0,0,0,.22); animation:slideIn .25s ease; }
  .st-detail-row { display:flex; justify-content:space-between; padding:7px 0;
    border-bottom:1px solid var(--border); font-size:12px; }
  .st-detail-row:last-child { border-bottom:none; }
  .st-detail-label { color:var(--text-muted); font-weight:500; }
  .st-detail-val { color:var(--text); font-weight:600; text-align:right; }
`;

/* ─── Detail Modal ───────────────────────────────────────── */
const OrderDetailModal: React.FC<{
  order: ApiOrder;
  onClose: () => void;
  onMarkDelivered: (id: string) => Promise<void>;
  onMarkReturned: (id: string) => Promise<void>;
}> = ({ order, onClose, onMarkDelivered, onMarkReturned }) => {
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  const handleDeliver = async () => {
    setLoadingDeliver(true);
    await onMarkDelivered(order._id);
    setLoadingDeliver(false);
    onClose();
  };

  const handleReturn = async () => {
    if (!window.confirm(`Mark ${order.orderId} as Returned?`)) return;
    setLoadingReturn(true);
    await onMarkReturned(order._id);
    setLoadingReturn(false);
    onClose();
  };

  return (
    <div className="st-modal-overlay" onClick={onClose}>
      <div className="st-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{order.orderId}</div>
            <div
              style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}
            >
              Shipment Detail
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: 16,
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div>
          {[
            ["Customer", order.customer?.fullName ?? "—"],
            ["Phone", order.customer?.phone ?? "—"],
            ["City", order.shippingAddress?.city ?? "—"],
            ["Courier", order.courier?.name ?? "—"],
            ["Tracking #", order.trackingNumber ?? "—"],
            ["Payment", order.paymentMethod],
            ["Pay Status", order.paymentStatus],
            ["Amount", fmt(order.totalAmount)],
            ["Shipped On", fmtDate(order.createdAt)],
          ].map(([label, val]) => (
            <div className="st-detail-row" key={label as string}>
              <span className="st-detail-label">{label}</span>
              <span className="st-detail-val">{val}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button className="st-btn" onClick={onClose}>
            Close
          </button>
          <button
            className="st-btn"
            style={{
              borderColor: "#dc2626",
              color: "#dc2626",
              background: "#fee2e2",
            }}
            onClick={handleReturn}
            disabled={loadingReturn || loadingDeliver}
          >
            {loadingReturn ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Processing…
              </>
            ) : (
              <>
                <i className="fa-solid fa-rotate-left" /> Mark Returned
              </>
            )}
          </button>
          <button
            className="st-btn st-btn-primary"
            onClick={handleDeliver}
            disabled={loadingDeliver || loadingReturn}
          >
            {loadingDeliver ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Marking…
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check" /> Mark Delivered
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Pagination ─────────────────────────────────────────── */
const CPagination: React.FC<{
  p: ApiPagination;
  onPage: (n: number) => void;
}> = ({ p, onPage }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0 0",
      fontSize: 11,
      color: "var(--text-muted)",
    }}
  >
    <span>
      Showing {(p.currentPage - 1) * p.itemsPerPage + 1}–
      {Math.min(p.currentPage * p.itemsPerPage, p.totalItems)} of {p.totalItems}
    </span>
    <div style={{ display: "flex", gap: 4 }}>
      <button
        className="st-btn"
        disabled={!p.hasPrev}
        onClick={() => onPage(p.currentPage - 1)}
      >
        ‹ Prev
      </button>
      <button
        className="st-btn"
        disabled={!p.hasNext}
        onClick={() => onPage(p.currentPage + 1)}
      >
        Next ›
      </button>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const ShippedTab: React.FC = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [detail, setDetail] = useState<ApiOrder | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({
        status: "Shipped",
        page,
        limit: 15,
        search,
      });
      setOrders(res.data?.data?.orders ?? []);
      setPagination(res.data?.data?.pagination ?? null);
    } catch {
      showToast("Failed to load shipped orders.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await ordersAPI.updateStatus(
        orderId,
        "Delivered",
        "Marked delivered from Shipped tab",
      );
      showToast("Order marked as Delivered!", "success");
      fetchOrders();
    } catch (e: any) {
      showToast(
        e?.response?.data?.message ?? "Failed to update status.",
        "error",
      );
      throw e;
    }
  };

  const handleMarkReturned = async (orderId: string) => {
    try {
      await ordersAPI.updateStatus(
        orderId,
        "Returned",
        "Marked returned from Shipped tab",
      );
      showToast("Order marked as Returned!", "success");
      fetchOrders();
    } catch (e: any) {
      showToast(
        e?.response?.data?.message ?? "Failed to mark as returned.",
        "error",
      );
      throw e;
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
            <i
              className="fa-solid fa-truck-fast"
              style={{ color: "#6366f1", marginRight: 7 }}
            />
            Shipped Orders
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            Orders in transit — track and mark delivered.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="st-search"
            placeholder="Search order or customer…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="st-btn" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <button
            className="st-btn"
            onClick={() => {
              setPage(1);
              fetchOrders();
            }}
          >
            <i className="fa-solid fa-rotate-right" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState msg="No shipped orders found." />
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="st-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Courier</th>
                  <th>Tracking #</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Shipped On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <span
                        onClick={() => setDetail(o)}
                        style={{
                          color: "var(--primary)",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: 11,
                        }}
                      >
                        {o.orderId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>
                        {o.customer?.fullName ?? "—"}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 10 }}>
                        {o.customer?.phone ?? ""}
                      </div>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 11 }}>
                      {o.shippingAddress?.city ?? "—"}
                    </td>
                    <td style={{ fontSize: 11, fontWeight: 600 }}>
                      {o.courier?.name ?? "—"}
                    </td>
                    <td>
                      {o.trackingNumber ? (
                        <code
                          style={{
                            fontSize: 10,
                            background: "var(--bg-2)",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {o.trackingNumber}
                        </code>
                      ) : (
                        <span
                          style={{ color: "var(--text-muted)", fontSize: 10 }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700 }}>{fmt(o.totalAmount)}</td>
                    <td>{payBadge(o.paymentStatus)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 11 }}>
                      {fmtDate(o.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          className="st-btn"
                          style={{
                            fontSize: 10,
                            padding: "4px 10px",
                            borderColor: "#dc2626",
                            color: "#dc2626",
                            background: "#fee2e2",
                          }}
                          onClick={async () => {
                            if (
                              !window.confirm(`Mark ${o.orderId} as Returned?`)
                            )
                              return;
                            await handleMarkReturned(o._id);
                          }}
                        >
                          <i className="fa-solid fa-rotate-left" /> Return
                        </button>
                        <button
                          className="st-btn st-btn-primary"
                          style={{ fontSize: 10, padding: "4px 10px" }}
                          onClick={() => setDetail(o)}
                        >
                          <i className="fa-solid fa-circle-check" /> Deliver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && <CPagination p={pagination} onPage={setPage} />}
        </>
      )}

      {/* Detail Modal */}
      {detail && (
        <OrderDetailModal
          order={detail}
          onClose={() => setDetail(null)}
          onMarkDelivered={handleMarkDelivered}
          onMarkReturned={handleMarkReturned}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`st-toast ${toast.type}`}>
          <i
            className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`}
          />
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default ShippedTab;
