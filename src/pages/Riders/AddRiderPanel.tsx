// AddRiderPanel.tsx
import React from 'react';
import { NavPanel, ZONES_DATA } from './shared';

interface Props {
  onNav: (p: NavPanel) => void;
}

const AddRiderPanel: React.FC<Props> = ({ onNav }) => (
  <>
    <div className="panel-heading">Add New Rider</div>
    <div className="panel-desc">
      Register a new internal delivery rider. Fill in personal details, vehicle information,
      assigned zone, and pay structure.
    </div>

    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="fa-solid fa-user-plus" /> Rider Registration</div>
      </div>
      <div className="card-body">

        {/* Personal Info */}
        <div className="section-label">Personal Information</div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Full Name *</div>
            <input className="c-form-input" placeholder="e.g. Usman Ahmed" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Phone Number *</div>
            <input className="c-form-input" placeholder="03XX-XXXXXXX" />
          </div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">CNIC Number</div>
            <input className="c-form-input" placeholder="XXXXX-XXXXXXX-X" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Date of Birth</div>
            <input className="c-form-input" type="date" />
          </div>
        </div>
        <div className="c-form-row single">
          <div className="c-form-group">
            <div className="c-form-label">Home Address</div>
            <input className="c-form-input" placeholder="Full residential address" />
          </div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Emergency Contact Name</div>
            <input className="c-form-input" placeholder="Name" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Emergency Contact Phone</div>
            <input className="c-form-input" placeholder="03XX-XXXXXXX" />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

        {/* Vehicle & Assignment */}
        <div className="section-label">Vehicle &amp; Assignment</div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Vehicle Type</div>
            <select className="c-form-select">
              <option>Motorcycle</option>
              <option>Bicycle</option>
              <option>Van</option>
              <option>Car</option>
            </select>
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Vehicle Registration No.</div>
            <input className="c-form-input" placeholder="LHR-1234" />
          </div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Primary Delivery Zone</div>
            <select className="c-form-select">
              {ZONES_DATA.map(z => <option key={z.name}>{z.name}</option>)}
              <option>All Zones</option>
            </select>
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Shift</div>
            <select className="c-form-select">
              <option>Morning (9AM–5PM)</option>
              <option>Evening (5PM–11PM)</option>
              <option>Full Day</option>
              <option>Flexible</option>
            </select>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

        {/* Pay Structure */}
        <div className="section-label">Pay Structure</div>
        <div className="c-form-row triple">
          <div className="c-form-group">
            <div className="c-form-label">Pay Type</div>
            <select className="c-form-select">
              <option>Per Delivery</option>
              <option>Monthly Fixed</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Per Delivery Rate (₨)</div>
            <input className="c-form-input" type="number" placeholder="80" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Monthly Base (₨)</div>
            <input className="c-form-input" type="number" placeholder="0" />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />

        {/* System Access */}
        <div className="section-label">System Access</div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">System Login Email</div>
            <input className="c-form-input" type="email" placeholder="rider@yourstore.com" />
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Temporary Password</div>
            <input className="c-form-input" type="password" placeholder="Auto-generate or set" />
          </div>
        </div>
        <div className="c-form-row">
          <div className="c-form-group">
            <div className="c-form-label">Status</div>
            <select className="c-form-select">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="c-form-group">
            <div className="c-form-label">Join Date</div>
            <input className="c-form-input" type="date" />
          </div>
        </div>
        <div className="c-form-row single">
          <div className="c-form-group">
            <div className="c-form-label">Notes</div>
            <textarea className="c-form-textarea" placeholder="Any additional notes about this rider..." />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="c-btn primary"><i className="fa-solid fa-check" /> Register Rider</button>
          <button className="c-btn" onClick={() => onNav('all')}>Cancel</button>
        </div>
      </div>
    </div>
  </>
);

export default AddRiderPanel;