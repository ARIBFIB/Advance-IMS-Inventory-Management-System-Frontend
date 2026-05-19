import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════
// MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════

const ToggleSwitch: React.FC<{ defaultChecked?: boolean; onChange?: (v: boolean) => void }> = ({ defaultChecked = false, onChange }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={on}
        onChange={e => { setOn(e.target.checked); onChange?.(e.target.checked); }}
      />
      <span className="toggle-track" />
    </label>
  );
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

const AuthPanel: React.FC = () => (
  <>
    <div className="settings-grid">
      {/* Two-Factor Authentication */}
      <div className="settings-section">
        <div className="settings-section-head">
          <i className="fa-solid fa-mobile-screen" /> Two-Factor Authentication (2FA)
        </div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div>
              <div className="stg-key">Require 2FA for Administrators</div>
              <div className="stg-desc">Enforce 2FA on all admin-level logins</div>
            </div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Require 2FA for Managers</div>
              <div className="stg-desc">Ops Manager, Inventory Manager, Accounts</div>
            </div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Require 2FA for All Staff</div>
              <div className="stg-desc">Applies to all system users</div>
            </div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">2FA Method</div>
              <div className="stg-desc">Preferred second-factor channel</div>
            </div>
            <select className="stg-select">
              <option>Authenticator App (TOTP)</option>
              <option>SMS OTP</option>
              <option>Email OTP</option>
            </select>
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Remember Device (days)</div>
              <div className="stg-desc">Skip 2FA on trusted devices</div>
            </div>
            <input type="number" defaultValue={30} className="stg-input" />
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="settings-section">
        <div className="settings-section-head">
          <i className="fa-solid fa-key" /> Password Policy
        </div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div><div className="stg-key">Minimum Password Length</div></div>
            <input type="number" defaultValue={8} className="stg-input" />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Require Uppercase Letter</div></div>
            <ToggleSwitch defaultChecked />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Require Number</div></div>
            <ToggleSwitch defaultChecked />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Require Special Character</div></div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Password Expiry (days)</div>
              <div className="stg-desc">Force change after N days (0 = never)</div>
            </div>
            <input type="number" defaultValue={0} className="stg-input" placeholder="0 = never" />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Prevent Last N Passwords</div>
              <div className="stg-desc">Disallow reuse of recent passwords</div>
            </div>
            <input type="number" defaultValue={5} className="stg-input" />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Force Change on First Login</div></div>
            <ToggleSwitch defaultChecked />
          </div>
        </div>
      </div>
    </div>

    <div className="settings-grid">
      {/* Login Lockout Policy */}
      <div className="settings-section">
        <div className="settings-section-head">
          <i className="fa-solid fa-ban" /> Login Lockout Policy
        </div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div>
              <div className="stg-key">Max Failed Attempts</div>
              <div className="stg-desc">Before temporary lockout</div>
            </div>
            <input type="number" defaultValue={5} className="stg-input" />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Lockout Duration (minutes)</div></div>
            <input type="number" defaultValue={30} className="stg-input" />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Alert Admin on Lockout</div></div>
            <ToggleSwitch defaultChecked />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Auto-block IP After Lockouts</div>
              <div className="stg-desc">Permanently block after 3 lockouts</div>
            </div>
            <ToggleSwitch defaultChecked />
          </div>
        </div>
      </div>

      {/* Session Policy */}
      <div className="settings-section">
        <div className="settings-section-head">
          <i className="fa-solid fa-clock" /> Session Policy
        </div>
        <div className="settings-section-body">
          <div className="stg-row">
            <div>
              <div className="stg-key">Session Timeout (minutes)</div>
              <div className="stg-desc">Auto-logout after inactivity</div>
            </div>
            <input type="number" defaultValue={60} className="stg-input" />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Single Device Login</div>
              <div className="stg-desc">Terminate previous session on new login</div>
            </div>
            <ToggleSwitch />
          </div>
          <div className="stg-row">
            <div>
              <div className="stg-key">Alert on New Device Login</div>
              <div className="stg-desc">Notify user when logging in from new device</div>
            </div>
            <ToggleSwitch defaultChecked />
          </div>
          <div className="stg-row">
            <div><div className="stg-key">Max Concurrent Sessions Per User</div></div>
            <select className="stg-select">
              <option>1 (Strict)</option>
              <option>2</option>
              <option>3</option>
              <option>Unlimited</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <button className="t-btn primary">
      <i className="fa-solid fa-check" /> Save Authentication Settings
    </button>
  </>
);

export default AuthPanel;