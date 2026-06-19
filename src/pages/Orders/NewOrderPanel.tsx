import React, { useState, useEffect } from 'react';
import { ordersAPI, customersAPI, productsAPI } from '../../services/api';
import type { CreateOrderPayload } from '../../services/api';

// ── Types ──────────────────────────────────────────────────
interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
  productId: string;   // real backend ID for the API call
  variantId?: string;
}

interface NewOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────
const fmt = (n: number) => '₨' + n.toLocaleString();

// Fallback product catalog used while API products load
const FALLBACK_CATALOG = [
  { sku: 'SKU-0041', name: 'Classic Lawn Suit',   price: 1800 },
  { sku: 'SKU-0017', name: 'Embroidered Kurta',   price: 2800 },
  { sku: 'SKU-0055', name: 'Printed Lawn 3PC',    price: 3200 },
  { sku: 'SKU-0063', name: 'Silk Kameez Navy',    price: 4500 },
  { sku: 'SKU-0078', name: 'Linen Trouser',       price: 900  },
  { sku: 'SKU-0135', name: 'Cotton Kurti',        price: 750  },
];

// ── Step Indicator ─────────────────────────────────────────
const StepIndicator: React.FC<{ step: number }> = ({ step }) => {
  const steps = ['Customer', 'Items', 'Shipping', 'Review'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '10px 16px', borderBottom: '1px solid var(--border)',
      gap: 0, background: 'var(--bg)', flexShrink: 0,
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
                fontSize: 10, fontWeight: 700, flexShrink: 0, transition: 'background 0.2s',
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
                margin: '0 6px', minWidth: 12, transition: 'background 0.2s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Step 1: Customer Info ──────────────────────────────────
interface StepCustomerProps {
  customerName: string; setCustomerName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  channel: string; setChannel: (v: string) => void;
  payment: string; setPayment: (v: string) => void;
  existingCustomerId: string | null; setExistingCustomerId: (id: string | null) => void;
}

const StepCustomer: React.FC<StepCustomerProps> = ({
  customerName, setCustomerName, phone, setPhone,
  address, setAddress, city, setCity,
  channel, setChannel, payment, setPayment,
  existingCustomerId, setExistingCustomerId,
}) => {
  const [showSuggestions,  setShowSuggestions]  = useState(false);
  const [apiSuggestions,   setApiSuggestions]   = useState<Array<{ _id: string; name: string; phone: string }>>([]);
  const [searchTimeout,    setSearchTimeout]    = useState<ReturnType<typeof setTimeout> | null>(null);

  // Search customers from real API
  useEffect(() => {
    if (customerName.length < 2) { setApiSuggestions([]); return; }
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(async () => {
      try {
        const res  = await customersAPI.getAll({ search: customerName, limit: 6 });
        const data = (res.data as any).data;
        const customers = (data?.customers ?? []) as Array<{ _id: string; firstName: string; lastName: string; phone?: string }>;
        setApiSuggestions(customers.map(c => ({
          _id:   c._id,
          name:  `${c.firstName} ${c.lastName}`.trim(),
          phone: c.phone ?? '',
        })));
        setShowSuggestions(true);
      } catch {
        setApiSuggestions([]);
      }
    }, 350);
    setSearchTimeout(t);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerName]);

  const pickCustomer = (c: { _id: string; name: string; phone: string }) => {
    setCustomerName(c.name);
    setPhone(c.phone);
    setExistingCustomerId(c._id);
    setShowSuggestions(false);
  };

  return (
    <div>
      <div className="section-divider" style={{ marginTop: 0 }}><span>Customer Info</span></div>

      {/* Customer search with live API suggestions */}
      <div className="form-group" style={{ marginBottom: 10, position: 'relative' }}>
        <div className="form-label">Customer Name *</div>
        <input
          className="form-input"
          style={{ width: '100%' }}
          value={customerName}
          onChange={e => {
            setCustomerName(e.target.value);
            setExistingCustomerId(null); // clear selection when typing
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Type to search existing customers..."
        />
        {existingCustomerId && (
          <div style={{ fontSize: 10, color: 'var(--green)', marginTop: 3 }}>
            <i className="fa-solid fa-circle-check" /> Existing customer selected
          </div>
        )}
        {showSuggestions && (
  <div style={{
    position: 'absolute', top: '100%', left: 0, right: 0,
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-input)', zIndex: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginTop: 2, overflow: 'hidden',
  }}>
    {/* + New Customer row — hamesha sabse upar */}
    <div
      onMouseDown={() => {
        setShowSuggestions(false);
        window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'customers' }));
      }}
      style={{
        padding: '9px 10px', cursor: 'pointer', fontSize: 12,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg)',
        color: 'var(--accent)', fontWeight: 700,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#EFF6FF')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
    >
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'var(--accent)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, flexShrink: 0,
      }}>+</span>
      New Customer
    </div>

    {/* Existing customers list */}
    {apiSuggestions.map(c => (
      <div
        key={c._id}
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

    {/* Agar koi customer nahi mila search mein */}
    {apiSuggestions.length === 0 && customerName.length >= 2 && (
      <div style={{
        padding: '8px 10px', fontSize: 12,
        color: 'var(--text-muted)', textAlign: 'center',
      }}>
        No customers found
      </div>
    )}
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
            <option value="Manual">Walk-in (Manual)</option>
            <option>Instagram</option>
            <option>Website</option>
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
            <option>Lahore</option><option>Karachi</option><option>Islamabad</option>
            <option>Rawalpindi</option><option>Faisalabad</option><option>Multan</option>
            <option>Peshawar</option><option>Quetta</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Payment Type</div>
          <select className="form-select" value={payment} onChange={e => setPayment(e.target.value)}>
            <option value="COD">COD</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Card">Card</option>
            <option value="BankTransfer">Bank Transfer</option>
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

// ── Step 2: Order Items (live product search from API) ─────
interface StepItemsProps {
  items: OrderItem[];
  setItems: (items: OrderItem[]) => void;
}

const StepItems: React.FC<StepItemsProps> = ({ items, setItems }) => {
  const [prodSearch,   setProdSearch]   = useState('');
  const [showProdList, setShowProdList] = useState(false);
  const [apiProducts,  setApiProducts]  = useState<Array<{ _id: string; name: string; sku: string; basePrice: number; totalStock: number; variants?: Array<{ variantId: string; price: number; stock: number }> }>>([]);
  const [searching,    setSearching]    = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Search products from API
  useEffect(() => {
    if (prodSearch.length === 0) { setApiProducts([]); return; }
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res  = await productsAPI.getAll({ search: prodSearch, limit: 10, inStock: true });
        const data = (res.data as any).data;
        setApiProducts(data?.products ?? []);
      } catch {
        // fallback to static catalog on error
        const lower = prodSearch.toLowerCase();
        setApiProducts(
          FALLBACK_CATALOG
            .filter(p => p.name.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower))
            .map(p => ({ _id: p.sku, name: p.name, sku: p.sku, basePrice: p.price, totalStock: 99 }))
        );
      } finally {
        setSearching(false);
      }
    }, 350);
    setSearchTimeout(t);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodSearch]);

  const addItem = (p: typeof apiProducts[0]) => {
    const existing = items.find(i => i.id === p._id);
    if (existing) {
      setItems(items.map(i => i.id === p._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      const firstVariant = p.variants?.[0];
      setItems([...items, {
        id:        p._id,
        sku:       p.sku,
        name:      p.name,
        qty:       1,
        price:     firstVariant?.price ?? p.basePrice,
        productId: p._id,
        variantId: firstVariant?.variantId,
      }]);
    }
    setProdSearch('');
    setShowProdList(false);
  };

  const removeItem   = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateQty    = (id: string, qty: number) => { if (qty < 1) return; setItems(items.map(i => i.id === id ? { ...i, qty } : i)); };
  const updatePrice  = (id: string, price: number) => setItems(items.map(i => i.id === id ? { ...i, price } : i));

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div>
      <div className="section-divider" style={{ marginTop: 0 }}><span>Add Products</span></div>

      {/* Product search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div className="table-search" style={{ width: '100%' }}>
          <i className={`fa-solid ${searching ? 'fa-spinner fa-spin' : 'fa-magnifying-glass'}`} />
          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={prodSearch}
            onChange={e => { setProdSearch(e.target.value); setShowProdList(true); }}
            onFocus={() => prodSearch && setShowProdList(true)}
            onBlur={() => setTimeout(() => setShowProdList(false), 150)}
            style={{ width: '100%' }}
          />
        </div>
        {showProdList && apiProducts.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-input)', zIndex: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginTop: 2, maxHeight: 200, overflowY: 'auto',
          }}>
            {apiProducts.map(p => (
              <div
                key={p._id}
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
                  <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{p.sku} · Stock: {p.totalStock}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{fmt(p.basePrice)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items list */}
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
            <div key={item.id} style={{
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
                  onClick={() => removeItem(item.id)}
                ><i className="fa-solid fa-xmark" /></button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button style={{ width: 22, height: 22, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <input
                    type="number" value={item.qty}
                    onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                    style={{ width: 36, textAlign: 'center', fontSize: 12, fontWeight: 700, border: '1px solid var(--border)', borderRadius: 4, padding: '2px 4px', background: 'var(--card)' }}
                  />
                  <button style={{ width: 22, height: 22, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="number" value={item.price}
                    onChange={e => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', fontSize: 12, border: '1px solid var(--border)', borderRadius: 4, padding: '3px 6px', background: 'var(--card)' }}
                  />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', minWidth: 64, textAlign: 'right' }}>
                  {fmt(item.qty * item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>{items.reduce((s, i) => s + i.qty, 0)} item(s)</span>
            <span>Subtotal: <strong style={{ color: 'var(--text-primary)' }}>{fmt(subtotal)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Step 3: Shipping ───────────────────────────────────────
interface StepShippingProps {
  courier: string; setCourier: (v: string) => void;
  deliveryDate: string; setDeliveryDate: (v: string) => void;
  shippingFee: number; setShippingFee: (v: number) => void;
  discount: number; setDiscount: (v: number) => void;
}

const StepShipping: React.FC<StepShippingProps> = ({
  courier, setCourier, deliveryDate, setDeliveryDate, shippingFee, setShippingFee, discount, setDiscount,
}) => (
  <div>
    <div className="section-divider" style={{ marginTop: 0 }}><span>Courier & Delivery</span></div>
    <div className="form-row">
      <div className="form-group">
        <div className="form-label">Courier Service</div>
        <select className="form-select" value={courier} onChange={e => setCourier(e.target.value)}>
          <option>TCS</option><option>Leopards</option><option>M&P</option>
          <option>Trax</option><option>PostEx</option><option>BlueEx</option><option>Self Deliver</option>
        </select>
      </div>
      <div className="form-group">
        <div className="form-label">Expected Delivery</div>
        <input className="form-input" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
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
        <input className="form-input" type="number" value={shippingFee} onChange={e => setShippingFee(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="form-group">
        <div className="form-label">Discount (₨)</div>
        <input className="form-input" type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
      </div>
    </div>

    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', padding: '10px 12px', fontSize: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-muted)' }}>
        <span>Shipping</span><span>{fmt(shippingFee)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-muted)' }}>
        <span>Discount</span><span style={{ color: 'var(--red)' }}>− {fmt(discount)}</span>
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

      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>{customerName || '—'}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{phone}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{address}, {city}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <span className="tag">{channel}</span>
          <span className="tag" style={{ color: payment === 'Prepaid' ? 'var(--green)' : 'inherit' }}>
            <i className={`fa-solid ${payment === 'COD' ? 'fa-money-bill' : 'fa-credit-card'}`} style={{ fontSize: 9 }} /> {payment}
          </span>
        </div>
      </div>

      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items ({items.length})</div>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>×{item.qty}</span></span>
            <strong>{fmt(item.qty * item.price)}</strong>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pricing</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span>{fmt(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: 'var(--text-muted)' }}>Shipping ({courier})</span><span>+{fmt(shippingFee)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Discount</span><span style={{ color: 'var(--red)' }}>− {fmt(discount)}</span>
          </div>
        )}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800 }}>
          <span>Grand Total</span>
          <span style={{ color: 'var(--accent)' }}>{fmt(grandTotal)}</span>
        </div>
      </div>

      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', padding: '10px 12px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery</div>
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
  const [customerName,        setCustomerName]        = useState('');
  const [phone,               setPhone]               = useState('');
  const [address,             setAddress]             = useState('');
  const [city,                setCity]                = useState('Lahore');
  const [channel,             setChannel]             = useState('WhatsApp');
  const [payment,             setPayment]             = useState('COD');
  const [existingCustomerId,  setExistingCustomerId]  = useState<string | null>(null);

  // Step 2 state
  const [items, setItems] = useState<OrderItem[]>([]);

  // Step 3 state
  const [courier,      setCourier]      = useState('TCS');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [shippingFee,  setShippingFee]  = useState(200);
  const [discount,     setDiscount]     = useState(0);

  // Submission state
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCustomerName(''); setPhone(''); setAddress(''); setCity('Lahore');
      setChannel('WhatsApp'); setPayment('COD'); setExistingCustomerId(null);
      setItems([]);
      setCourier('TCS'); setDeliveryDate(''); setShippingFee(200); setDiscount(0);
      setSubmitError(null);
    }
  }, [isOpen]);

  const canNext = () => {
    if (step === 1) return customerName.trim() && phone.trim() && address.trim();
    if (step === 2) return items.length > 0;
    return true;
  };

  const handleNext = () => { if (canNext()) setStep(s => Math.min(4, s + 1)); };
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Resolve customer ID
      // If user picked an existing customer — use their _id.
      // If they typed a new name — create the customer first.
      let customerId = existingCustomerId;

      if (!customerId) {
        // Parse name into firstName / lastName
        const nameParts = customerName.trim().split(/\s+/);
        const firstName = nameParts[0] ?? customerName;
        const lastName  = nameParts.slice(1).join(' ') || '';

        const custRes = await customersAPI.create({
          firstName,
          lastName,
          phone,
          source: channel,
          address: { street: address, city },
        });
        const custBody = (custRes.data as any);
        customerId = custBody?.data?._id ?? custBody?._id ?? null;
      }

      if (!customerId) throw new Error('Could not resolve customer');

      // Step 2: Build order payload
      const payload: CreateOrderPayload = {
        customer: customerId,
        source:   channel as CreateOrderPayload['source'],
        items: items.map(item => ({
          productId: item.productId,
          ...(item.variantId ? { variantId: item.variantId } : {}),
          quantity:  item.qty,
          unitPrice: item.price,
        })),
        shippingAddress: {
          name:    customerName,
          phone,
          street:  address,
          city,
          country: 'Pakistan',
        },
        paymentMethod: payment as CreateOrderPayload['paymentMethod'],
        shippingCost:  shippingFee,
        discount:      discount,
      };

      await ordersAPI.create(payload);
      onClose(); // triggers refresh in parent (AllOrdersTab)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errors?.[0]?.message ??
        err?.message ??
        'Failed to place order. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={`prod-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <div className={`prod-detail-panel ${isOpen ? 'open' : ''}`} style={{ width: 440 }}>
        <div className="detail-header">
          <div className="detail-title">
            <i className="fa-solid fa-plus" style={{ fontSize: 12, marginRight: 6 }} />
            New Order
          </div>
          <button className="detail-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <StepIndicator step={step} />

        <div className="detail-body" style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
          {/* Error banner */}
          {submitError && (
            <div style={{
              background: '#FEF2F2', border: '1px solid var(--red)', borderRadius: 'var(--radius-card)',
              padding: '10px 12px', marginBottom: 12, fontSize: 12, color: 'var(--red)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: 1 }} />
              <span>{submitError}</span>
            </div>
          )}

          {step === 1 && (
            <StepCustomer
              customerName={customerName} setCustomerName={setCustomerName}
              phone={phone}               setPhone={setPhone}
              address={address}           setAddress={setAddress}
              city={city}                 setCity={setCity}
              channel={channel}           setChannel={setChannel}
              payment={payment}           setPayment={setPayment}
              existingCustomerId={existingCustomerId} setExistingCustomerId={setExistingCustomerId}
            />
          )}
          {step === 2 && <StepItems items={items} setItems={setItems} />}
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
              shippingFee={shippingFee}   discount={discount}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--border)', padding: '10px 16px',
          display: 'flex', gap: 8, flexShrink: 0, background: 'var(--card)',
        }}>
          {step > 1 && (
            <button className="header-btn" onClick={handleBack} disabled={submitting}>
              <i className="fa-solid fa-chevron-left" style={{ fontSize: 10 }} /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="header-btn" onClick={onClose} disabled={submitting}>Cancel</button>
          {step < 4 ? (
            <button
              className="header-btn primary"
              onClick={handleNext}
              style={{ opacity: canNext() ? 1 : 0.5, cursor: canNext() ? 'pointer' : 'not-allowed' }}
            >
              Next <i className="fa-solid fa-chevron-right" style={{ fontSize: 10 }} />
            </button>
          ) : (
            <button
              className="header-btn primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting
                ? <><i className="fa-solid fa-spinner fa-spin" /> Placing...</>
                : <><i className="fa-solid fa-check" /> Place Order</>}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default NewOrderPanel;