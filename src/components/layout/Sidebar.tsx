import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPath }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: 'fa-gauge-high',    label: 'Dashboard' },
    { path: '/orders',    icon: 'fa-bag-shopping',  label: 'Orders' },
    { path: '/products',  icon: 'fa-box-open',      label: 'Products' },
    { path: '/inventory', icon: 'fa-warehouse',     label: 'Inventory' },
    { path: '/customers', icon: 'fa-users',         label: 'Customers' },
    { path: '/couriers',  icon: 'fa-truck',         label: 'Couriers' },
    { path: '/riders',    icon: 'fa-person-biking', label: 'Riders' },
    { path: '/finance',   icon: 'fa-sack-dollar',   label: 'Financials' },
    { path: '/tasks',     icon: 'fa-calendar-check',label: 'Tasks' },
    { path: '/staff',     icon: 'fa-id-badge',      label: 'Staff & Roles' },
    { path: '/reports',   icon: 'fa-chart-pie',     label: 'Reports' },
    { path: '/settings',  icon: 'fa-gear',          label: 'Settings' },
    { path: '/security',  icon: 'fa-shield-halved', label: 'Security' },
    { path: '/audit',     icon: 'fa-file-alt',      label: 'Audit Logs' },
  ];

  return (
    <aside style={{
      width: '220px', minWidth: '220px', background: '#111827',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: isOpen ? 0 : 0, bottom: 0,
      zIndex: 100, overflowY: 'auto',
    }}>
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid #1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '28px', height: '28px', background: '#FF6A00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>ZI</div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Zone<span style={{ color: '#FF6A00' }}>In</span></div>
          <div style={{ fontSize: '9px', color: '#6B7280' }}>Operations Management</div>
        </div>
      </div>

      <nav style={{ padding: '10px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 10px', borderRadius: '6px', marginBottom: '1px',
                cursor: 'pointer', fontSize: '11.5px',
                color: isActive ? '#fff' : '#9CA3AF',
                background: isActive ? '#1F2937' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                position: 'relative',
              }}
            >
              {isActive && <span style={{ position: 'absolute', left: 0, top: '6px', bottom: '6px', width: '3px', background: '#FF6A00', borderRadius: '0 3px 3px 0' }} />}
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '13px', width: '16px', textAlign: 'center' }} />
              {item.label}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '10px', borderTop: '1px solid #1F2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#FF6A00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>AK</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#E5E7EB' }}>Admin Khan</div>
            <div style={{ fontSize: '9.5px', color: '#6B7280' }}>Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;