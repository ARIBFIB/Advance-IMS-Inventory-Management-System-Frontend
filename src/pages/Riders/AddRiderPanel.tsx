// AddRiderPanel.tsx — connected to API
import React, { useState } from "react";
import { NavPanel, ZONES_DATA } from "./shared";
import { ridersAPI, authAPI } from "../../services/api";

interface Props {
  onNav: (p: NavPanel) => void;
}

const AddRiderPanel: React.FC<Props> = ({ onNav }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    cnic: "",
    email: "",
    licenseNumber: "",
    licenseExpiry: "",
    homeAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    vehicleType: "Motorcycle",
    vehicleRegistration: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    assignedZone: ZONES_DATA[0]?.name ?? "",
    shift: "Morning (9AM–5PM)",
    serviceCities: "Lahore",
    paymentMethod: "JazzCash",
    bankAccountTitle: "",
    bankAccountNumber: "",
    bankName: "",
    status: "Active",
    joinDate: "",
    notes: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.phone.trim()) {
      setError("Full name and phone number are required.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required to create rider account.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: User account banao with Rider role
      const username =
        form.fullName.trim().toLowerCase().replace(/\s+/g, "_") +
        "_" +
        Date.now().toString().slice(-4);
      const password = "Rider@" + form.phone.trim().slice(-4) + "2024!";

      const userRes = await authAPI.register({
        username,
        email: form.email.trim(),
        password,
        firstName: form.fullName.trim().split(" ")[0],
        lastName: form.fullName.trim().split(" ").slice(1).join(" ") || ".",
        phone: form.phone.trim(),
        role: "Rider",
      });

      const userId = userRes.data?.data?.user?._id;
      if (!userId) throw new Error("User creation failed");

      // Step 2: Rider profile banao
      const payload: Record<string, any> = {
        userId,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        cnic: form.cnic.trim() || undefined,
        licenseNumber: form.licenseNumber.trim() || undefined,
        licenseExpiry: form.licenseExpiry || undefined,
        vehicle: {
          type: form.vehicleType,
          make: form.vehicleMake.trim() || undefined,
          model: form.vehicleModel.trim() || undefined,
          year: form.vehicleYear ? parseInt(form.vehicleYear) : undefined,
          registrationNumber: form.vehicleRegistration.trim() || undefined,
          color: form.vehicleColor.trim() || undefined,
        },
        assignedZone: form.assignedZone,
        serviceCities: form.serviceCities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        paymentMethod: form.paymentMethod,
        bankDetails:
          form.bankAccountNumber || form.bankAccountTitle
            ? {
                accountTitle: form.bankAccountTitle.trim() || undefined,
                accountNumber: form.bankAccountNumber.trim() || undefined,
                bankName: form.bankName.trim() || undefined,
              }
            : undefined,
      };

      await ridersAPI.create(payload);
      setSuccess(
        `Rider registered! Login: ${form.email.trim()} | Pass: ${password}`,
      );
      setTimeout(() => onNav("all"), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to register rider.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="panel-heading">Add New Rider</div>
      <div className="panel-desc">
        Register a new internal delivery rider. Fill in personal details,
        vehicle information, assigned zone, and payment structure.
      </div>

      {error && (
        <div className="alert-strip danger" style={{ marginBottom: 12 }}>
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </div>
      )}
      {success && (
        <div className="alert-strip success" style={{ marginBottom: 12 }}>
          <i className="fa-solid fa-circle-check" /> {success}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <i className="fa-solid fa-user-plus" /> Rider Registration
          </div>
        </div>
        <div className="card-body">
          {/* Personal Info */}
          <div className="section-label">Personal Information</div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Full Name *</div>
              <input
                className="c-form-input"
                placeholder="e.g. Usman Ahmed"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Phone Number *</div>
              <input
                className="c-form-input"
                placeholder="+923XX-XXXXXXX"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Email</div>
              <input
                className="c-form-input"
                type="email"
                placeholder="rider@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">CNIC Number</div>
              <input
                className="c-form-input"
                placeholder="XXXXX-XXXXXXX-X"
                value={form.cnic}
                onChange={(e) => set("cnic", e.target.value)}
              />
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">License Number</div>
              <input
                className="c-form-input"
                placeholder="e.g. LHR-D-2024-001"
                value={form.licenseNumber}
                onChange={(e) => set("licenseNumber", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">License Expiry</div>
              <input
                className="c-form-input"
                type="date"
                value={form.licenseExpiry}
                onChange={(e) => set("licenseExpiry", e.target.value)}
              />
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Emergency Contact Name</div>
              <input
                className="c-form-input"
                placeholder="Name"
                value={form.emergencyContactName}
                onChange={(e) => set("emergencyContactName", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Emergency Contact Phone</div>
              <input
                className="c-form-input"
                placeholder="+923XX-XXXXXXX"
                value={form.emergencyContactPhone}
                onChange={(e) => set("emergencyContactPhone", e.target.value)}
              />
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--divider)",
              margin: "12px 0",
            }}
          />

          {/* Vehicle Info */}
          <div className="section-label">Vehicle &amp; Assignment</div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Vehicle Type</div>
              <select
                className="c-form-select"
                value={form.vehicleType}
                onChange={(e) => set("vehicleType", e.target.value)}
              >
                <option>Motorcycle</option>
                <option>Bicycle</option>
                <option>Van</option>
                <option>Car</option>
              </select>
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Registration Number</div>
              <input
                className="c-form-input"
                placeholder="LHR-1234"
                value={form.vehicleRegistration}
                onChange={(e) => set("vehicleRegistration", e.target.value)}
              />
            </div>
          </div>
          <div className="c-form-row triple">
            <div className="c-form-group">
              <div className="c-form-label">Make</div>
              <input
                className="c-form-input"
                placeholder="Honda"
                value={form.vehicleMake}
                onChange={(e) => set("vehicleMake", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Model</div>
              <input
                className="c-form-input"
                placeholder="CD 70"
                value={form.vehicleModel}
                onChange={(e) => set("vehicleModel", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Year</div>
              <input
                className="c-form-input"
                type="number"
                placeholder="2022"
                value={form.vehicleYear}
                onChange={(e) => set("vehicleYear", e.target.value)}
              />
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Vehicle Color</div>
              <input
                className="c-form-input"
                placeholder="Red"
                value={form.vehicleColor}
                onChange={(e) => set("vehicleColor", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Primary Delivery Zone</div>
              <select
                className="c-form-select"
                value={form.assignedZone}
                onChange={(e) => set("assignedZone", e.target.value)}
              >
                {ZONES_DATA.map((z) => (
                  <option key={z.name}>{z.name}</option>
                ))}
                <option>All Zones</option>
              </select>
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">
                Service Cities (comma-separated)
              </div>
              <input
                className="c-form-input"
                placeholder="Lahore, Islamabad"
                value={form.serviceCities}
                onChange={(e) => set("serviceCities", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Shift</div>
              <select
                className="c-form-select"
                value={form.shift}
                onChange={(e) => set("shift", e.target.value)}
              >
                <option>Morning (9AM–5PM)</option>
                <option>Evening (5PM–11PM)</option>
                <option>Full Day</option>
                <option>Flexible</option>
              </select>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--divider)",
              margin: "12px 0",
            }}
          />

          {/* Payment Info */}
          <div className="section-label">Payment Details</div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Payment Method</div>
              <select
                className="c-form-select"
                value={form.paymentMethod}
                onChange={(e) => set("paymentMethod", e.target.value)}
              >
                <option>JazzCash</option>
                <option>EasyPaisa</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Account Title</div>
              <input
                className="c-form-input"
                placeholder="Account holder name"
                value={form.bankAccountTitle}
                onChange={(e) => set("bankAccountTitle", e.target.value)}
              />
            </div>
          </div>
          <div className="c-form-row">
            <div className="c-form-group">
              <div className="c-form-label">Account Number / Mobile</div>
              <input
                className="c-form-input"
                placeholder="03001234567"
                value={form.bankAccountNumber}
                onChange={(e) => set("bankAccountNumber", e.target.value)}
              />
            </div>
            <div className="c-form-group">
              <div className="c-form-label">Bank Name</div>
              <input
                className="c-form-input"
                placeholder="JazzCash / HBL / etc."
                value={form.bankName}
                onChange={(e) => set("bankName", e.target.value)}
              />
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--divider)",
              margin: "12px 0",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="c-btn primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Saving…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check" /> Register Rider
                </>
              )}
            </button>
            <button
              className="c-btn"
              onClick={() => onNav("all")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRiderPanel;
