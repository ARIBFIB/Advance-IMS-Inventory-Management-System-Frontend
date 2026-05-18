import React, { useState, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────
interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
}

interface NewOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Mock product catalog for item search ───────────────────
const PRODUCT_CATALOG = [
  { sku: 'SKU-0041', name: 'Classic Lawn Suit',     price: 1800, stock: 3  },
  { sku: 'SKU-0017', name: 'Embroidered Kurta',     price: 2800, stock: 42 },
  { sku: 'SKU-0055', name: 'Printed Lawn 3PC',      price: 3200, stock: 28 },
  { sku: 'SKU-0063', name: 'Silk Kameez Navy',      price: 4500, stock: 15 },
  { sku: 'SKU-0078', name: 'Linen Trouser',         price: 900,  stock: 35 },
  { sku: 'SKU-0092', name: 'Embroidered Shawl',     price: 1400, stock: 8  },
  { sku: 'SKU-0112', name: 'Block Print Dupatta',   price: 500,  stock: 50 },
  { sku: 'SKU-0124', name: 'Organza Fancy Suit',    price: 5800, stock: 12 },
  { sku: 'SKU-0135', name: 'Cotton Kurti',          price: 750,  stock: 66 },
  { sku: 'SKU-0148', name: 'Party Wear Shirt',      price: 4200, stock: 18 },
  { sku: 'SKU-0191', name: 'Lawn Kurti Printed',    price: 650,  stock: 44 },
  { sku: 'SKU-0218', name: 'Net Dupatta Gold',      price: 1100, stock: 25 },
];

const MOCK_CUSTOMERS = [
  { name: 'Amna Bibi',       phone: '0300-1234567' },
  { name: 'Fatima Zara',     phone: '0321-9876543' },
  { name: 'Sara Khan',       phone: '0333-5552211' },
  { name: 'Nadia Malik',     phone: '0311-4443322' },
  { name: 'Rabia Ahmed',     phone: '0345-6677889' },
  { name: 'Hira Baig',       phone: '0312-1122334' },
  { name: 'Zainab Qureshi',  phone: '0300-9988776' },
];

// ── Helpers ────────────────────────────────────────────────
const fmt = (n: number) => '₨' + n.toLocaleString();

// ── Panel Step indicator ───────────────────────────────────
const StepIndicator: React.FC<{ step: number }> = ({ step }) => {
  const steps = ['Customer', 'Items', 'Shipping', 'Review'];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      gap: 0,
      background: 'var(--bg)',
      flexShrink: 0,
    }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = num === step;
        const isDone   = num < step;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isDone ? 'var(--green)' : isActive ? 'var(--accent)' : 'var(--border)',
                color: isDone || isActive ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                transition: 'background 0.2s',
              }}>
                {isDone ? <i className="fa-solid fa-check" style={{ fontSize: 9 }} /> : num}
              </div>
              <span style={{
                fontSize: 11, fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent)' : isDone ? 'var(--green)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1,
                background: isDone ? 'var(--green)' : 'var(--border)',
                margin: '0 6px', minWidth: 12,
                transition: 'background 0.2s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Step 1: Customer Info ──────────────────────────────────
const StepCustomer: React.FC<{
  customerName: string; setCustomerName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  channel: string; setChannel: (v: string) => void;
  payment: string; setPayment: (v: string) => void;
}> = ({ customerName, setCustomerName, phone, setPhone, address, setAddress, city, setCity, channel, setChannel, payment, setPayment }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = MOCK_CUSTOMERS.filter(c =>
    customerName.length > 1 &&
    c.name.toLowerCase().includes(customerName.toLowerCase())
  );

  const pickCustomer = (c: { name: string; phone: string }) => {
    setCustomerName(c.name);
    setPhone(c.phone);
    setShowSuggestions(false);
  };

  return (
    <div>
      {/* Customer Search */}
      <div className="section-divider" style={{ marginTop: 0 }}><span>Customer Info</span></div>
      <div className="form-group" style={{ marginBottom: 10, position: 'relative' }}>
        <div className="form-label">Customer Name *</div>
        <input
          className="form-input"
          style={{ width: '100%' }}
          value={customerName}
          onChange={e => { setCustomerName(e.target.value); setShowSuggestions(true); }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Type to search existing customers..."
        />
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-input)', zIndex: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            marginTop: 2, overflow: 'hidden',
          }}>
            {suggestions.map(c => (
              <div
                key={c.name}
                onMouseDown={() => pickCustomer(c)}
                style={{
                  padding: '7px 10px', cursor: 'pointer', fontSize: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{c.phone}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Phone Number *</div>
          <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0300-0000000" />
        </div>
        <div className="form-group">
          <div className="form-label">Channel</div>
          <select className="form-select" value={channel} onChange={e => setChannel(e.target.value)}>
            <option>WhatsApp</option>
            <option>Shopify</option>
            <option>Walk-in</option>
            <option>Instagram</option>
            <option>Facebook</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 10 }}>
        <div className="form-label">Delivery Address *</div>
        <textarea
          className="form-input"
          style={{ height: 60, width: '100%', resize: 'vertical', paddingTop: 6 }}
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="House/Flat No, Street, Area..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="form-label">City *</div>
          <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
            <option>Lahore</option>
            <option>Karachi</option>
            <option>Islamabad</option>
            <option>Rawalpindi</option>
            <option>Faisalabad</option>
            <option>Multan</option>
            <option>Peshawar</option>
            <option>Quetta</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Payment Type</div>
          <select className="form-select" value={payment} onChange={e => setPayment(e.target.value)}>
            <option>COD</option>
            <option>Prepaid</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <div className="form-label">Order Notes (optional)</div>
        <input className="form-input" style={{ width: '100%' }} placeholder="Special instructions for this order..." />
      </div>
    </div>
  );
};

// ── Step 2: Order Items ────────────────────────────────────
const StepItems: React.FC<{
  items: OrderItem[];
  setItems: (items: OrderItem[]) => void;
}> = ({ items, setItems }) => {
  const [prodSearch, setProdSearch] = useState('');
  const [showProdList, setShowProdList] = useState(false);

  const results = PRODUCT_CATALOG.filter(p =>
    prodSearch.length > 0 && (
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(prodSearch.toLowerCase())
    )
  );

  const addItem = (p: typeof PRODUCT_CATALOG[0]) => {
    const existing = items.find(i => i.sku === p.sku);
    if (existing) {
      setItems(items.map(i => i.sku === p.sku ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setItems([...items, { id: p.sku, sku: p.sku, name: p.name, qty: 1, price: p.price }]);
    }
    setProdSearch('');
    setShowProdList(false);
  };

  const removeItem = (sku: string) => setItems(items.filter(i => i.sku !== sku));
  const updateQty = (sku: string, qty: number) => {
    if (qty < 1) return;
    setItems(items.map(i => i.sku === sku ? { ...i, qty } : i));
  };
  const updatePrice = (sku: string, price: number) => {
    setItems(items.map(i => i.sku === sku ? { ...i, price } : i));
  };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div>
      <div className="section-divider" style={{ marginTop: 0 }}><span>Add Products</span></div>

      {/* Product Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div className="table-search" style={{ width: '100%' }}>
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={prodSearch}
            onChange={e => { setProdSearch(e.target.value); setShowProdList(true); }}
            onFocus={() => setShowProdList(true)}
            onBlur={() => setTimeout(() => setShowProdList(false), 150)}
            style={{ width: '100%' }}
          />
        </div>
        {showProdList && results.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-input)', zIndex: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginTop: 2, maxHeight: 200, overflowY: 'auto',
          }}>
            {results.map(p => (
              <div
                key={p.sku}
                onMouseDown={() => addItem(p)}
                style={{
                  padding: '8px 10px', cursor: 'pointer', fontSize: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{p.sku} · Stock: {p.stock}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{fmt(p.price)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          color: 'var(--text-muted)', fontSize: 12,
          border: '2px dashed var(--border)', borderRadius: 'var(--radius-card)',
        }}>
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: 24, display: 'block', marginBottom: 8, opacity: 0.4 }} />
          No items added yet. Search above to add products.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(item => (
            <div key={item.sku} style={{
              background: 'var(--bg)', borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border)', padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.sku}</div>
                </div>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: 12, padding: 2 }}
                  onClick={() => removeItem(item.sku)}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    style={{
                      width: 22, height: 22, border: '1px solid var(--border)',
                      borderRadius: 4, background: 'var(--card)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                    }}
                    onClick={() => updateQty(item.sku, item.qty - 1)}
                  >−</button>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={e => updateQty(item.sku, parseInt(e.target.value) || 1)}
                    style={{
                      width: 36, textAlign: 'center', fontSize: 12, fontWeight: 700,
                      border: '1px solid var(--border)', borderRadius: 4,
                      padding: '2px 4px', background: 'var(--card)',
                    }}
                  />
                  <button
                    style={{
                      width: 22, height: 22, border: '1px solid var(--border)',
                      borderRadius: 4, background: 'var(--card)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                    }}
                    onClick={() => updateQty(item.sku, item.qty + 1)}
                  >+</button>
                </div>
                {/* Unit price */}
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={item.price}
                    onChange={e => updatePrice(item.sku, parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%', fontSize: 12, border: '1px solid var(--border)',
                      borderRadius: 4, padding: '3px 6px', background: 'var(--card)',
                    }}
                  />
                </div>
                {/* Line total */}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', minWidth: 64, textAlign: 'right' }}>
                  {fmt(item.qty * item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtotal */}
      {items.length > 0 && (
        <div style={{
          marginTop: 12, padding: '10px 12px',
          background: 'var(--bg)', borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>{items.reduce((s, i) => s + i.qty, 0)} item(s)</span>
            <span>Subtotal: <strong style={{ color: 'var(--text-primary)' }}>{fmt(subtotal)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Step 3: Shipping ───────────────────────────────────────
const StepShipping: React.FC<{
  courier: string; setCourier: (v: string) => void;
  deliveryDate: string; setDeliveryDate: (v: string) => void;
  shippingFee: number; setShippingFee: (v: number) => void;
  discount: number; setDiscount: (v: number) => void;
}> = ({ courier, setCourier, deliveryDate, setDeliveryDate, shippingFee, setShippingFee, discount, setDiscount }) => (
  <div>
    <div className="section-divider" style={{ marginTop: 0 }}><span>Courier & Delivery</span></div>
    <div className="form-row">
      <div className="form-group">
        <div className="form-label">Courier Service</div>
        <select className="form-select" value={courier} onChange={e => setCourier(e.target.value)}>
          <option>TCS</option>
          <option>Leopards</option>
          <option>M&P</option>
          <option>Trax</option>
          <option>PostEx</option>
          <option>BlueEx</option>
          <option>Self Deliver</option>
        </select>
      </div>
      <div className="form-group">
        <div className="form-label">Expected Delivery</div>
        <input
          className="form-input"
          type="date"
          value={deliveryDate}
          onChange={e => setDeliveryDate(e.target.value)}
        />
      </div>
    </div>

    <div className="form-group" style={{ marginBottom: 10 }}>
      <div className="form-label">Tracking Number (optional)</div>
      <input className="form-input" style={{ width: '100%' }} placeholder="Enter tracking number if already assigned" />
    </div>

    <div className="section-divider"><span>Pricing Adjustments</span></div>

    <div className="form-row">
      <div className="form-group">
        <div className="form-label">Shipping Fee (₨)</div>
        <input
          className="form-input"
          type="number"
          value={shippingFee}
          onChange={e => setShippingFee(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="form-group">
        <div className="form-label">Discount (₨)</div>
        <input
          className="form-input"
          type="number"
          value={discount}
          onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>

    <div style={{
      background: 'var(--bg)', borderRadius: 'var(--radius-card)',
      border: '1px solid var(--border)', padding: '10px 12px',
      fontSize: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-muted)' }}>
        <span>Shipping</span>
        <span>{fmt(shippingFee)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-muted)' }}>
        <span>Discount</span>
        <span style={{ color: 'var(--red)' }}>− {fmt(discount)}</span>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700 }}>Shipping Charges</span>
        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>+{fmt(Math.max(0, shippingFee - discount))}</span>
      </div>
    </div>
  </div>
);

// ── Step 4: Review ─────────────────────────────────────────
const StepReview: React.FC<{
  customerName: string; phone: string; address: string; city: string;
  channel: string; payment: string; courier: string; deliveryDate: string;
  items: OrderItem[]; shippingFee: number; discount: number;
}> = ({ customerName, phone, address, city, channel, payment, courier, deliveryDate, items, shippingFee, discount }) => {
  const subtotal   = items.reduce((s, i) => s + i.qty * i.price, 0);
  const grandTotal = subtotal + shippingFee - discount;

  return (
    <div>
      <div className="section-divider" style={{ marginTop: 0 }}><span>Order Summary</span></div>

      {/* Customer */}
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Customer
        </div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>{customerName || '—'}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{phone}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{address}, {city}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <span className="tag">{channel}</span>
          <span className={`tag ${payment === 'COD' ? '' : ''}`} style={{ color: payment === 'Prepaid' ? 'var(--green)' : 'inherit' }}>
            <i className={`fa-solid ${payment === 'COD' ? 'fa-money-bill' : 'fa-credit-card'}`} style={{ fontSize: 9 }} /> {payment}
          </span>
        </div>
      </div>

      {/* Items */}
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Items ({items.length})
        </div>
        {items.map(item => (
          <div key={item.sku} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>×{item.qty}</span></span>
            <strong>{fmt(item.qty * item.price)}</strong>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Pricing
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: 'var(--text-muted)' }}>Shipping ({courier})</span>
          <span>+{fmt(shippingFee)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Discount</span>
            <span style={{ color: 'var(--red)' }}>− {fmt(discount)}</span>
          </div>
        )}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4,
          display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800,
        }}>
          <span>Grand Total</span>
          <span style={{ color: 'var(--accent)' }}>{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Delivery */}
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)', padding: '10px 12px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Delivery
        </div>
        <div style={{ fontSize: 12 }}>
          <span className="tag"><i className="fa-solid fa-truck" style={{ fontSize: 9 }} /> {courier}</span>
          {deliveryDate && (
            <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>
              Expected: {new Date(deliveryDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Panel Component ───────────────────────────────────
const NewOrderPanel: React.FC<NewOrderPanelProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [customerName, setCustomerName] = useState('');
  const [phone,        setPhone]        = useState('');
  const [address,      setAddress]      = useState('');
  const [city,         setCity]         = useState('Lahore');
  const [channel,      setChannel]      = useState('WhatsApp');
  const [payment,      setPayment]      = useState('COD');

  // Step 2 state
  const [items, setItems] = useState<OrderItem[]>([]);

  // Step 3 state
  const [courier,      setCourier]      = useState('TCS');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [shippingFee,  setShippingFee]  = useState(200);
  const [discount,     setDiscount]     = useState(0);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCustomerName(''); setPhone(''); setAddress(''); setCity('Lahore');
      setChannel('WhatsApp'); setPayment('COD');
      setItems([]);
      setCourier('TCS'); setDeliveryDate(''); setShippingFee(200); setDiscount(0);
    }
  }, [isOpen]);

  const canNext = () => {
    if (step === 1) return customerName.trim() && phone.trim() && address.trim();
    if (step === 2) return items.length > 0;
    return true;
  };

  const handleNext = () => { if (canNext()) setStep(s => Math.min(4, s + 1)); };
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = () => {
    // In a real app, POST to API here
    console.log('New Order Submitted', { customerName, phone, address, city, channel, payment, items, courier, deliveryDate, shippingFee, discount });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`prod-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`prod-detail-panel ${isOpen ? 'open' : ''}`} style={{ width: 440 }}>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-title">
            <i className="fa-solid fa-plus" style={{ fontSize: 12, marginRight: 6 }} />
            New Order
          </div>
          <button className="detail-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator step={step} />

        {/* Body */}
        <div className="detail-body" style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
          {step === 1 && (
            <StepCustomer
              customerName={customerName} setCustomerName={setCustomerName}
              phone={phone}       setPhone={setPhone}
              address={address}   setAddress={setAddress}
              city={city}         setCity={setCity}
              channel={channel}   setChannel={setChannel}
              payment={payment}   setPayment={setPayment}
            />
          )}
          {step === 2 && (
            <StepItems items={items} setItems={setItems} />
          )}
          {step === 3 && (
            <StepShipping
              courier={courier}           setCourier={setCourier}
              deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate}
              shippingFee={shippingFee}   setShippingFee={setShippingFee}
              discount={discount}         setDiscount={setDiscount}
            />
          )}
          {step === 4 && (
            <StepReview
              customerName={customerName} phone={phone} address={address} city={city}
              channel={channel} payment={payment} courier={courier}
              deliveryDate={deliveryDate} items={items}
              shippingFee={shippingFee} discount={discount}
            />
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{
          borderTop: '1px solid var(--border)', padding: '10px 16px',
          display: 'flex', gap: 8, flexShrink: 0, background: 'var(--card)',
        }}>
          {step > 1 && (
            <button className="header-btn" onClick={handleBack}>
              <i className="fa-solid fa-chevron-left" style={{ fontSize: 10 }} /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="header-btn" onClick={onClose}>Cancel</button>
          {step < 4 ? (
            <button
              className="header-btn primary"
              onClick={handleNext}
              style={{ opacity: canNext() ? 1 : 0.5, cursor: canNext() ? 'pointer' : 'not-allowed' }}
            >
              Next <i className="fa-solid fa-chevron-right" style={{ fontSize: 10 }} />
            </button>
          ) : (
            <button className="header-btn primary" onClick={handleSubmit}>
              <i className="fa-solid fa-check" /> Place Order
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default NewOrderPanel;