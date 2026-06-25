import React, { useState, useEffect } from "react";
import { fmt, fmtDate, SkeletonRows, ErrorBanner } from "./helpers";
import { financialAnalyticsAPI, analyticsAPI } from "../../services/api";

interface MonthlyRow {
  month: string;
  revenue: number;
  cod: number;
  prepaid: number;
  expenses: number;
  profit: number;
}

const ReportsPanel: React.FC = () => {
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("Daily Financial Summary");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [groupBy, setGroupBy] = useState("Monthly");
  const [format, setFormat] = useState("Excel (.xlsx)");
  const [generating, setGenerating] = useState(false);


  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Report type to API mapping
      const reportMap: Record<string, string> = {
        "Daily Financial Summary": "financial",
        "Weekly COD Report": "orders",
        "Monthly Expense Report": "financial",
        "Revenue vs Expenses": "financial",
        "Profit & Loss Statement": "financial",
        "COD Reconciliation Report": "orders",
        "Prepaid Orders Report": "orders",
        "Supplier Payment History": "financial",
      };

      const reportKey = reportMap[reportType] || "financial";
      const groupByMap: Record<string, string> = {
        Daily: "day",
        Weekly: "week",
        Monthly: "month",
      };

      const res = await financialAnalyticsAPI.getFinancial({
        from: dateFrom || undefined,
        to: dateTo || undefined,
        groupBy: groupByMap[groupBy] as "day" | "month",
      });

      const data = res.data?.data?.timeline || [];

      if (format === "CSV (.csv)") {
        downloadCSV(data, reportType);
      } else if (format === "Excel (.xlsx)") {
        downloadCSV(data, reportType, ".xlsx");
      } else {
        downloadCSV(data, reportType);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadCSV = (data: any[], name: string, ext = ".csv") => {
    if (!data.length) {
      setError("No data available for the selected period.");
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setLoading(true);
    financialAnalyticsAPI
      .getSales({ groupBy: "month" })
      .then((r) => {
        const raw: any[] = r.data.data?.timeline || r.data.data?.monthly || [];
        const rows: MonthlyRow[] = raw.map((item: any) => ({
          month: item.month || item.date || "—",
          revenue: Number(item.revenue ?? 0),
          cod: Number(item.codRevenue ?? item.cod ?? 0),
          prepaid: Number(item.prepaidRevenue ?? item.prepaid ?? 0),
          expenses: Number(item.expenses ?? 0),
          profit: Number(item.profit ?? 0),
        }));
        setMonthly(rows);
      })
      .catch((e) =>
        setError(e?.response?.data?.message || "Failed to load report data."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="panel-heading">Financial Reports</div>
      <div className="panel-desc">
        Generate and download detailed financial reports by date range, type, or
        category.
      </div>

      {error && (
        <ErrorBanner message={error} onRetry={() => window.location.reload()} />
      )}

      <div className="detail-grid-2">
        {/* Generate Report Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-file-chart-column" /> Generate Report
            </div>
          </div>
          <div className="card-body">
            <div className="f-form-row single">
              <div className="f-form-group">
                <div className="f-form-label">Report Type</div>
                <select
                  className="f-form-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option>Daily Financial Summary</option>
                  <option>Weekly COD Report</option>
                  <option>Monthly Expense Report</option>
                  <option>Supplier Payment History</option>
                  <option>Revenue vs Expenses</option>
                  <option>Profit &amp; Loss Statement</option>
                  <option>COD Reconciliation Report</option>
                  <option>Prepaid Orders Report</option>
                </select>
              </div>
            </div>
            <div className="f-form-row">
              <div className="f-form-group">
                <div className="f-form-label">Date From</div>
                <input
                  className="f-form-input"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="f-form-group">
                <div className="f-form-label">Date To</div>
                <input
                  className="f-form-input"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <div className="f-form-row">
              <div className="f-form-group">
                <div className="f-form-label">Group By</div>
                <select
                  className="f-form-select"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="f-form-group">
                <div className="f-form-label">Format</div>
                <select
                  className="f-form-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option>Excel (.xlsx)</option>
                  <option>CSV (.csv)</option>
                  <option>PDF</option>
                </select>
              </div>
            </div>
            <hr />
            <button
              className="f-btn primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <><i className="fa-solid fa-spinner fa-spin" /> Generating…</>
              ) : (
                <><i className="fa-solid fa-file-export" /> Generate &amp; Download</>
              )}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-circle-info" /> Quick Summary
            </div>
          </div>
          <div
            className="card-body"
            style={{
              padding: "12px 14px",
              fontSize: 11,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            <p>
              Select a report type and date range above, then click{" "}
              <strong>Generate &amp; Download</strong> to export your financial
              data.
            </p>
            <p style={{ marginTop: 10 }}>
              Available formats: <strong>Excel</strong> for editable sheets,{" "}
              <strong>CSV</strong> for raw data import, <strong>PDF</strong> for
              archival records.
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-table" /> Monthly Summary Table
          </div>
          <button className="f-btn">
            <i className="fa-solid fa-file-export" /> Export
          </button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>COD</th>
                <th>Prepaid</th>
                <th>Expenses</th>
                <th>Net Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={7} rows={5} />
              ) : monthly.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "var(--text-muted)",
                      fontSize: 11,
                    }}
                  >
                    No monthly data available.
                  </td>
                </tr>
              ) : (
                monthly.map((m) => {
                  const margin =
                    m.revenue > 0
                      ? ((m.profit / m.revenue) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <tr key={m.month}>
                      <td>
                        <strong>{m.month}</strong>
                      </td>
                      <td style={{ color: "var(--green)" }}>
                        {fmt(m.revenue)}
                      </td>
                      <td>{fmt(m.cod)}</td>
                      <td>{fmt(m.prepaid)}</td>
                      <td style={{ color: "var(--red)" }}>{fmt(m.expenses)}</td>
                      <td>
                        <strong style={{ color: "var(--green)" }}>
                          {fmt(m.profit)}
                        </strong>
                      </td>
                      <td>
                        <div className="perf-cell" style={{ minWidth: 70 }}>
                          <div className="perf-bar">
                            <div
                              className="perf-fill"
                              style={{
                                width: `${margin}%`,
                                background: "var(--green)",
                              }}
                            />
                          </div>
                          <div
                            className="perf-pct"
                            style={{ color: "var(--green)" }}
                          >
                            {margin}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReportsPanel;
