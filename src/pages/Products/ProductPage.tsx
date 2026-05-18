import React, { useState, useEffect, useCallback } from 'react';
import './ProductPage.css';
import TopLoadingBar from '../../components/ui/TopLoadingBar';
import { usePageLoading } from '../../hooks/usePageLoading';
import { useTabLoading } from '../../hooks/useTabLoading';
// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type ProductTab = 'all' | 'variants' | 'cats' | 'suppliers' | 'import' | 'settings';

interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  costRaw: number;
  priceRaw: number;
  supplier: string;
  status: ProductStatus;
  sold: number;
  rating: number;
  desc: string;
}

interface Variant {
  vsku: string;
  parent: string;
  type: string;
  value: string;
  stock: number;
  reserved: number;
  price: number;
}

interface Category {
  name: string;
  icon: string;
  products: number;
  stock: number;
  revenue: string;
  color: string;
}

interface Supplier {
  name: string;
  contact: string;
  phone: string;
  city: string;
  products: number;
  outstanding: number;
  lead: number;
  last: string;
  rating: number;
  status: string;
}

type PanelMode = 'view' | 'edit' | 'new';

// ═══════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════

const ALL_PRODUCTS: Product[] = [
  { sku: 'SKU-0041', name: 'Classic Lawn Suit',      category: 'Suits',    stock: 3,  threshold: 10, costRaw: 800,  priceRaw: 1800, supplier: 'Al-Karam Textile',  status: 'Low Stock',    sold: 142, rating: 4.5, desc: 'Premium lawn fabric suit with embroidered neckline. Machine washable.' },
  { sku: 'SKU-0028', name: 'Chiffon Dupatta White',  category: 'Dupattas', stock: 7,  threshold: 10, costRaw: 250,  priceRaw: 600,  supplier: 'Gul Ahmed',         status: 'Low Stock',    sold: 98,  rating: 4.2, desc: 'Lightweight chiffon dupatta with lace border. Available in multiple colors.' },
  { sku: 'SKU-0017', name: 'Embroidered Kurta',      category: 'Kurtas',   stock: 42, threshold: 10, costRaw: 1200, priceRaw: 2800, supplier: 'Nishat Textiles',   status: 'In Stock',     sold: 74,  rating: 4.7, desc: 'Hand-embroidered kurta with mirror work. Exclusive festive design.' },
  { sku: 'SKU-0055', name: 'Printed Lawn 3PC',       category: 'Suits',    stock: 28, threshold: 10, costRaw: 1500, priceRaw: 3200, supplier: 'Al-Karam Textile',  status: 'In Stock',     sold: 61,  rating: 4.3, desc: '3-piece printed lawn suit with digital print dupatta.' },
  { sku: 'SKU-0063', name: 'Silk Kameez Navy',       category: 'Kurtas',   stock: 15, threshold: 10, costRaw: 2000, priceRaw: 4500, supplier: 'Bonanza Satrangi',  status: 'In Stock',     sold: 39,  rating: 4.6, desc: 'Silk blend kameez in navy. Party-wear appropriate.' },
  { sku: 'SKU-0092', name: 'Embroidered Shawl',      category: 'Shawls',   stock: 8,  threshold: 10, costRaw: 600,  priceRaw: 1400, supplier: 'Orient Textiles',   status: 'Low Stock',    sold: 55,  rating: 4.4, desc: 'Kashmiri-inspired embroidered shawl with pashmina blend.' },
  { sku: 'SKU-0078', name: 'Linen Trouser',          category: 'Bottoms',  stock: 35, threshold: 15, costRaw: 400,  priceRaw: 900,  supplier: 'Gul Ahmed',         status: 'In Stock',     sold: 88,  rating: 4.1, desc: 'Relaxed-fit linen trouser. Breathable for summer wear.' },
  { sku: 'SKU-0101', name: 'Khaddar Suit',           category: 'Suits',    stock: 20, threshold: 10, costRaw: 900,  priceRaw: 2100, supplier: 'Orient Textiles',   status: 'In Stock',     sold: 43,  rating: 4.0, desc: 'Classic khaddar suit for winter. Soft and warm.' },
  { sku: 'SKU-0112', name: 'Block Print Dupatta',    category: 'Dupattas', stock: 50, threshold: 10, costRaw: 200,  priceRaw: 500,  supplier: 'Al-Karam Textile',  status: 'In Stock',     sold: 120, rating: 4.3, desc: 'Hand block-printed cotton dupatta. Artisan-made.' },
  { sku: 'SKU-0124', name: 'Organza Fancy Suit',     category: 'Suits',    stock: 12, threshold: 10, costRaw: 2500, priceRaw: 5800, supplier: 'Nishat Textiles',   status: 'In Stock',     sold: 22,  rating: 4.8, desc: 'Luxury organza suit for formal occasions. Limited stock.' },
  { sku: 'SKU-0135', name: 'Cotton Kurti',           category: 'Kurtas',   stock: 66, threshold: 20, costRaw: 350,  priceRaw: 750,  supplier: 'Gul Ahmed',         status: 'In Stock',     sold: 207, rating: 4.2, desc: 'Everyday cotton kurti. Available in 8 colors.' },
  { sku: 'SKU-0148', name: 'Party Wear Shirt',       category: 'Shirts',   stock: 18, threshold: 10, costRaw: 1800, priceRaw: 4200, supplier: 'Bonanza Satrangi',  status: 'In Stock',     sold: 34,  rating: 4.5, desc: 'Sequin-embellished party shirt. Festive-season bestseller.' },
  { sku: 'SKU-0159', name: 'Denim Jeans Ladies',     category: 'Bottoms',  stock: 23, threshold: 10, costRaw: 1100, priceRaw: 2600, supplier: 'Orient Textiles',   status: 'In Stock',     sold: 67,  rating: 3.9, desc: 'Slim-fit ladies denim jeans. Stretchable comfort waistband.' },
  { sku: 'SKU-0167', name: 'Shalwar Kameez Set',     category: 'Suits',    stock: 9,  threshold: 10, costRaw: 700,  priceRaw: 1600, supplier: 'Al-Karam Textile',  status: 'Low Stock',    sold: 51,  rating: 4.1, desc: 'Classic shalwar kameez in cotton. Daily wear staple.' },
  { sku: 'SKU-0172', name: 'Winter Shawl Brown',     category: 'Shawls',   stock: 31, threshold: 10, costRaw: 900,  priceRaw: 2000, supplier: 'Nishat Textiles',   status: 'In Stock',     sold: 46,  rating: 4.3, desc: 'Wool-blend winter shawl in chocolate brown. Thick and cozy.' },
  { sku: 'SKU-0183', name: 'Chiffon Saree Pink',     category: 'Sarees',   stock: 0,  threshold: 5,  costRaw: 3000, priceRaw: 7500, supplier: 'Nishat Textiles',   status: 'Out of Stock', sold: 18,  rating: 4.9, desc: 'Bridal-ready pink chiffon saree with gold border.' },
  { sku: 'SKU-0191', name: 'Lawn Kurti Printed',     category: 'Kurtas',   stock: 44, threshold: 15, costRaw: 300,  priceRaw: 650,  supplier: 'Gul Ahmed',         status: 'In Stock',     sold: 189, rating: 4.0, desc: 'Budget-friendly printed lawn kurti. Bright summer prints.' },
  { sku: 'SKU-0205', name: 'Velvet Jacket Ladies',   category: 'Jackets',  stock: 6,  threshold: 8,  costRaw: 2200, priceRaw: 5200, supplier: 'Bonanza Satrangi',  status: 'Low Stock',    sold: 15,  rating: 4.6, desc: 'Velvet evening jacket with embroidered cuffs.' },
  { sku: 'SKU-0218', name: 'Net Dupatta Gold',       category: 'Dupattas', stock: 25, threshold: 10, costRaw: 450,  priceRaw: 1100, supplier: 'Al-Karam Textile',  status: 'In Stock',     sold: 72,  rating: 4.4, desc: 'Net dupatta with gold zari work. Party and wedding wear.' },
  { sku: 'SKU-0229', name: 'Khaddar Shawl Grey',     category: 'Shawls',   stock: 14, threshold: 10, costRaw: 800,  priceRaw: 1800, supplier: 'Orient Textiles',   status: 'In Stock',     sold: 29,  rating: 4.1, desc: 'Heavyweight khaddar shawl for harsh winters.' },
];

const VARIANTS_DATA: Variant[] = [
  { vsku: 'SKU-0041-XS',  parent: 'Classic Lawn Suit',  type: 'Size',  value: 'XS',    stock: 12, reserved: 2, price: 1800 },
  { vsku: 'SKU-0041-S',   parent: 'Classic Lawn Suit',  type: 'Size',  value: 'S',     stock: 8,  reserved: 1, price: 1800 },
  { vsku: 'SKU-0041-M',   parent: 'Classic Lawn Suit',  type: 'Size',  value: 'M',     stock: 15, reserved: 3, price: 1800 },
  { vsku: 'SKU-0041-L',   parent: 'Classic Lawn Suit',  type: 'Size',  value: 'L',     stock: 4,  reserved: 1, price: 1800 },
  { vsku: 'SKU-0041-XL',  parent: 'Classic Lawn Suit',  type: 'Size',  value: 'XL',    stock: 3,  reserved: 1, price: 1800 },
  { vsku: 'SKU-0017-BLK', parent: 'Embroidered Kurta',  type: 'Color', value: 'Black', stock: 18, reserved: 2, price: 2800 },
  { vsku: 'SKU-0017-RED', parent: 'Embroidered Kurta',  type: 'Color', value: 'Red',   stock: 14, reserved: 3, price: 2800 },
  { vsku: 'SKU-0017-BLU', parent: 'Embroidered Kurta',  type: 'Color', value: 'Blue',  stock: 10, reserved: 1, price: 2800 },
  { vsku: 'SKU-0135-S',   parent: 'Cotton Kurti',       type: 'Size',  value: 'S',     stock: 22, reserved: 4, price: 750  },
  { vsku: 'SKU-0135-M',   parent: 'Cotton Kurti',       type: 'Size',  value: 'M',     stock: 30, reserved: 6, price: 750  },
  { vsku: 'SKU-0135-L',   parent: 'Cotton Kurti',       type: 'Size',  value: 'L',     stock: 14, reserved: 2, price: 750  },
  { vsku: 'SKU-0063-NAV', parent: 'Silk Kameez Navy',   type: 'Color', value: 'Navy',  stock: 7,  reserved: 1, price: 4500 },
];

const CATEGORIES_DATA: Category[] = [
  { name: 'Suits',    icon: 'fa-shirt',           products: 58, stock: 412, revenue: '₨3,84,000', color: 'orange' },
  { name: 'Kurtas',   icon: 'fa-vest',            products: 43, stock: 288, revenue: '₨2,12,000', color: 'blue'   },
  { name: 'Dupattas', icon: 'fa-scarf',           products: 35, stock: 320, revenue: '₨96,000',   color: 'green'  },
  { name: 'Shawls',   icon: 'fa-blanket',         products: 28, stock: 178, revenue: '₨1,40,000', color: 'yellow' },
  { name: 'Bottoms',  icon: 'fa-socks',           products: 22, stock: 210, revenue: '₨1,62,000', color: 'gray'   },
  { name: 'Shirts',   icon: 'fa-shirt',           products: 18, stock: 124, revenue: '₨1,08,000', color: 'orange' },
  { name: 'Jackets',  icon: 'fa-person-walking',  products: 12, stock: 56,  revenue: '₨84,000',   color: 'blue'   },
  { name: 'Sarees',   icon: 'fa-star',            products: 9,  stock: 42,  revenue: '₨2,24,000', color: 'yellow' },
  { name: 'Others',   icon: 'fa-ellipsis',        products: 23, stock: 180, revenue: '₨74,000',   color: 'gray'   },
];

const SUPPLIERS_DATA: Supplier[] = [
  { name: 'Al-Karam Textile',  contact: 'Naseer Ahmed',  phone: '0321-1112233', city: 'Lahore',    products: 62, outstanding: 45000, lead: 3, last: '02 May 2026', rating: 4.5, status: 'Active'   },
  { name: 'Gul Ahmed',         contact: 'Tariq Mehmood', phone: '0300-4445566', city: 'Karachi',   products: 48, outstanding: 0,     lead: 4, last: '29 Apr 2026', rating: 4.7, status: 'Active'   },
  { name: 'Nishat Textiles',   contact: 'Farrukh Mirza', phone: '0333-7778899', city: 'Faisalabad',products: 39, outstanding: 80000, lead: 5, last: '05 May 2026', rating: 4.3, status: 'Active'   },
  { name: 'Bonanza Satrangi',  contact: 'Sadia Naz',     phone: '0311-0001112', city: 'Islamabad', products: 28, outstanding: 22000, lead: 3, last: '01 May 2026', rating: 4.4, status: 'Active'   },
  { name: 'Orient Textiles',   contact: 'Imran Saeed',   phone: '0345-3334445', city: 'Multan',    products: 21, outstanding: 0,     lead: 6, last: '27 Apr 2026', rating: 3.8, status: 'On Hold'  },
  { name: 'Khas Stores',       contact: 'Maira Usman',   phone: '0312-5556667', city: 'Lahore',    products: 14, outstanding: 12000, lead: 4, last: '03 May 2026', rating: 4.0, status: 'Active'   },
  { name: 'Sapphire',          contact: 'Adeel Rana',    phone: '0300-8889990', city: 'Lahore',    products: 11, outstanding: 0,     lead: 3, last: '25 Apr 2026', rating: 4.6, status: 'Active'   },
  { name: 'Sana Safinaz',      contact: 'Sana Hussain',  phone: '0321-2223334', city: 'Karachi',   products: 18, outstanding: 35000, lead: 5, last: '06 May 2026', rating: 4.2, status: 'Active'   },
  { name: 'Zara Shahjahan',    contact: 'Ali Zaman',     phone: '0333-6667778', city: 'Lahore',    products: 9,  outstanding: 0,     lead: 7, last: '20 Apr 2026', rating: 3.6, status: 'Inactive' },
  { name: 'Agha Noor',         contact: 'Noor Bukhari',  phone: '0311-9990001', city: 'Karachi',   products: 7,  outstanding: 8000,  lead: 4, last: '28 Apr 2026', rating: 4.1, status: 'Active'   },
];

const CATEGORIES_ALL = ['Suits', 'Kurtas', 'Dupattas', 'Shawls', 'Bottoms', 'Shirts', 'Jackets', 'Sarees'];
const SUPPLIERS_ALL   = ['Al-Karam Textile', 'Gul Ahmed', 'Nishat Textiles', 'Bonanza Satrangi', 'Orient Textiles'];
const PROD_PER_PAGE   = 15;

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const fmt = (n: number) => '₨' + n.toLocaleString();
const margin = (cost: number, price: number) => Math.round(((price - cost) / price) * 100);
const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

function statusBadgeClass(s: string): string {
  const m: Record<string, string> = {
    'Pending':      'yellow', 'Confirmed': 'blue',   'Packed':     'blue',
    'Shipped':      'orange', 'Delivered': 'green',  'Cancelled':  'red',
    'In Stock':     'green',  'Low Stock': 'yellow', 'Out of Stock':'red',
    'Good':         'green',  'Low':       'yellow', 'High':        'red',
    'In Progress':  'blue',   'Done':      'green',  'Active':      'green',
    'Inactive':     'gray',   'On Hold':   'yellow', 'Collected':   'green',
  };
  return m[s] || 'gray';
}

function getProductStatus(p: Product): ProductStatus {
  if (p.stock === 0) return 'Out of Stock';
  if (p.stock < p.threshold) return 'Low Stock';
  return 'In Stock';
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

/* ── Status Badge ── */
const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={`badge ${statusBadgeClass(label)}`}>{label}</span>
);

/* ── Three-Dot Menu ── */
interface ThreeDotProps {
  id: string;
  items: { label: string; icon: string; danger?: boolean; onClick: () => void }[];
}
const ThreeDot: React.FC<ThreeDotProps> = ({ id, items }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.getElementById(id);
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [id]);
  return (
    <div id={id} className="three-dot" style={{ position: 'relative', display: 'inline-block' }}>
      <button className="three-dot-btn" onClick={e => { e.stopPropagation(); setOpen(v => !v); }}>
        <i className="fa-solid fa-ellipsis" />
      </button>
      {open && (
        <div className="three-dot-menu" style={{ display: 'block' }}>
          {items.map((item, idx) =>
            item.label === '---'
              ? <div key={idx} className="three-dot-menu-divider" />
              : (
                <div
                  key={item.label}
                  className={`three-dot-menu-item ${item.danger ? 'danger' : ''}`}
                  onClick={() => { item.onClick(); setOpen(false); }}
                >
                  <i className={`fa-solid ${item.icon}`} /> {item.label}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

/* ── Pagination ── */
interface PaginationProps {
  current: number;
  total: number;
  totalItems: number;
  perPage: number;
  start: number;
  end: number;
  onChange: (p: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ current, total, totalItems, perPage, start, end, onChange }) => {
  const pages: (number | '…')[] = [];
  if (total <= 7) {
    for (let p = 1; p <= total; p++) pages.push(p);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }
  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{totalItems ? start : 0}–{end}</strong> of <strong>{totalItems}</strong> products
      </div>
      <div className="pagination-controls">
        <button className="page-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>
          <i className="fa-solid fa-chevron-left" style={{ fontSize: '9px' }} />
        </button>
        {pages.map((p, i) =>
          p === '…'
            ? <button key={`dots-${i}`} className="page-btn dots">…</button>
            : <button key={p} className={`page-btn ${p === current ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        )}
        <button className="page-btn" disabled={current === total || total === 0} onClick={() => onChange(current + 1)}>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: '9px' }} />
        </button>
      </div>
    </div>
  );
};

/* ── Star Rating ── */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="stars">
    {[0, 1, 2, 3, 4].map(i => (
      <i
        key={i}
        className={`${i < Math.floor(rating) ? 'fa-solid fa-star star' : i < rating ? 'fa-solid fa-star-half-stroke star' : 'fa-regular fa-star star empty'}`}
      />
    ))}
    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>{rating}/5</span>
  </div>
);

// ═══════════════════════════════════════════════════════════
// PANEL: Product Detail / Edit / New
// ═══════════════════════════════════════════════════════════

interface ProductPanelProps {
  product: Product | null;
  mode: PanelMode;
  onClose: () => void;
  onModeChange: (m: PanelMode) => void;
}
const ProductPanel: React.FC<ProductPanelProps> = ({ product, mode, onClose, onModeChange }) => {
  const [panelTab, setPanelTab] = useState<'overview' | 'stock' | 'orders' | 'variants'>('overview');

  useEffect(() => { setPanelTab('overview'); }, [product, mode]);

  const isNew  = mode === 'new';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  const title = isNew ? 'Add New Product' : isEdit ? 'Edit Product' : (product?.name ?? 'Product Details');

  /* ── Form (new / edit) ── */
  const renderForm = () => {
    const p = product;
    return (
      <>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <div className="form-label">Product Name *</div>
          <input className="form-input" defaultValue={p?.name ?? ''} placeholder="Enter product name" style={{ width: '100%' }} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">SKU</div>
            <input className="form-input" defaultValue={p?.sku ?? ''} placeholder="Auto-generated" />
          </div>
          <div className="form-group">
            <div className="form-label">Category *</div>
            <select className="form-select">
              {CATEGORIES_ALL.map(c => <option key={c} selected={p?.category === c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">Cost Price (₨) *</div>
            <input className="form-input" type="number" defaultValue={p?.costRaw ?? ''} placeholder="0" />
          </div>
          <div className="form-group">
            <div className="form-label">Sale Price (₨) *</div>
            <input className="form-input" type="number" defaultValue={p?.priceRaw ?? ''} placeholder="0" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">{isNew ? 'Initial Stock' : 'Update Stock'}</div>
            <input className="form-input" type="number" defaultValue={p?.stock ?? 0} />
          </div>
          <div className="form-group">
            <div className="form-label">Low Stock Threshold</div>
            <input className="form-input" type="number" defaultValue={p?.threshold ?? 10} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <div className="form-label">Supplier</div>
          <select className="form-select" style={{ width: '100%' }}>
            {SUPPLIERS_ALL.map(s => <option key={s} selected={p?.supplier === s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <div className="form-label">Description</div>
          <textarea
            className="form-input"
            style={{ height: 64, width: '100%', resize: 'vertical', paddingTop: 6 }}
            placeholder="Product description..."
            defaultValue={p?.desc ?? ''}
          />
        </div>
        <hr />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="header-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
            <i className={`fa-solid ${isNew ? 'fa-plus' : 'fa-check'}`} /> {isNew ? 'Add Product' : 'Save Changes'}
          </button>
          <button className="header-btn" onClick={onClose}>Cancel</button>
        </div>
      </>
    );
  };

  /* ── View: Overview ── */
  const renderOverview = () => {
    if (!product) return null;
    const st   = getProductStatus(product);
    const mg   = margin(product.costRaw, product.priceRaw);
    const mgColor = mg >= 50 ? 'var(--green)' : mg >= 30 ? 'var(--yellow)' : 'var(--red)';
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div className="prod-panel-avatar">{initials(product.name)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>{product.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{product.sku} · {product.category}</div>
            <StarRating rating={product.rating} />
          </div>
          <Badge label={st} />
        </div>
        <div className="prod-panel-desc-box">{product.desc}</div>
        <div className="detail-row"><div className="detail-key">Cost Price</div><div className="detail-val">{fmt(product.costRaw)}</div></div>
        <div className="detail-row"><div className="detail-key">Sale Price</div><div className="detail-val"><strong>{fmt(product.priceRaw)}</strong></div></div>
        <div className="detail-row"><div className="detail-key">Gross Margin</div><div className="detail-val" style={{ color: mgColor }}>{mg}%</div></div>
        <div className="detail-row"><div className="detail-key">Current Stock</div><div className="detail-val"><strong>{product.stock} units</strong></div></div>
        <div className="detail-row"><div className="detail-key">Low Stock Threshold</div><div className="detail-val">{product.threshold} units</div></div>
        <div className="detail-row"><div className="detail-key">Total Sold</div><div className="detail-val">{product.sold} units</div></div>
        <div className="detail-row"><div className="detail-key">Supplier</div><div className="detail-val">{product.supplier}</div></div>
        <div className="detail-row"><div className="detail-key">Last Restocked</div><div className="detail-val">02 May 2026</div></div>
        <div className="detail-row"><div className="detail-key">Added On</div><div className="detail-val">15 Apr 2026</div></div>
        <hr />
        <div className="prod-panel-actions">
          <button className="header-btn primary" onClick={() => onModeChange('edit')}><i className="fa-solid fa-pen" /> Edit</button>
          <button className="header-btn"><i className="fa-solid fa-plus" /> Add Stock</button>
          <button className="header-btn"><i className="fa-solid fa-copy" /> Duplicate</button>
          <button className="header-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}><i className="fa-solid fa-trash" /> Delete</button>
        </div>
      </>
    );
  };

  /* ── View: Stock Log ── */
  const renderStockLog = () => {
    if (!product) return null;
    const logs = [
      { type: 'Out',    qty: -2,  after: product.stock + 2,          reason: `Order ORD-1046`,     date: '07 May 2026', by: 'System'     },
      { type: 'In',     qty: +20, after: product.stock + 22,         reason: 'Supplier Restock',   date: '02 May 2026', by: 'Sara Khan'  },
      { type: 'Out',    qty: -3,  after: product.stock + 2 + 3,      reason: 'Order ORD-1040',     date: '30 Apr 2026', by: 'System'     },
      { type: 'Adjust', qty: -1,  after: product.stock + 2 + 3 + 1,  reason: 'Damage Write-off',   date: '28 Apr 2026', by: 'Admin Khan' },
      { type: 'In',     qty: +15, after: product.stock + 2 + 3 + 16, reason: 'Initial Stock',      date: '15 Apr 2026', by: 'Admin Khan' },
    ];
    return (
      <>
        <div className="stock-log-section-label">Recent Stock Movements</div>
        {logs.map((m, i) => {
          const bg    = m.type === 'In' ? 'var(--green-bg)' : m.type === 'Out' ? 'var(--red-bg)' : 'var(--yellow-bg)';
          const ic    = m.type === 'In' ? 'fa-arrow-down ic-green' : m.type === 'Out' ? 'fa-arrow-up ic-red' : 'fa-arrow-up ic-yellow';
          const color = m.type === 'In' ? 'var(--green)' : m.type === 'Out' ? 'var(--red)' : 'var(--yellow)';
          return (
            <div key={i} className="list-item" style={{ padding: '6px 0' }}>
              <div className="list-icon" style={{ background: bg }}><i className={`fa-solid ${ic}`} style={{ fontSize: 10 }} /></div>
              <div className="list-content">
                <div className="list-title">{m.reason}</div>
                <div className="list-meta">{m.date} · by {m.by}</div>
              </div>
              <div className="list-right">
                <div style={{ fontWeight: 600, color }}>{m.qty > 0 ? '+' : ''}{m.qty}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>After: {m.after}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  /* ── View: Orders ── */
  const renderOrders = () => {
    const orders = [
      { id: 'ORD-1048', customer: 'Amna Bibi',       qty: 2, date: '07 May 2026', status: 'Pending'   },
      { id: 'ORD-1046', customer: 'Sara Khan',         qty: 1, date: '07 May 2026', status: 'Packed'    },
      { id: 'ORD-1042', customer: 'Zainab Qureshi',   qty: 3, date: '05 May 2026', status: 'Pending'   },
      { id: 'ORD-1039', customer: 'Bushra Nawaz',      qty: 1, date: '04 May 2026', status: 'Delivered' },
      { id: 'ORD-1035', customer: 'Lubna Tanvir',      qty: 2, date: '02 May 2026', status: 'Confirmed' },
    ];
    return (
      <>
        <div className="stock-log-section-label">Recent Orders Containing This Product</div>
        {orders.map(o => (
          <div key={o.id} className="list-item" style={{ padding: '6px 0' }}>
            <div className="list-icon"><i className="fa-solid fa-bag-shopping ic-orange" style={{ fontSize: 11 }} /></div>
            <div className="list-content">
              <div className="list-title">{o.id} · {o.customer}</div>
              <div className="list-meta">{o.date} · Qty: {o.qty}</div>
            </div>
            <div className="list-right"><Badge label={o.status} /></div>
          </div>
        ))}
      </>
    );
  };

  /* ── View: Variants ── */
  const renderVariants = () => {
    const sizes    = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const stocks   = [12, 8, 15, 4, 3, 6];
    return (
      <>
        <div className="stock-log-section-label">Product Variants</div>
        {sizes.map((size, i) => (
          <div key={size} className="list-item" style={{ padding: '5px 0' }}>
            <div className="variant-size-icon">{size}</div>
            <div className="list-content">
              <div className="list-title">{product?.sku}-{size}</div>
              <div className="list-meta">Size variant</div>
            </div>
            <div className="list-right">
              <div style={{ fontSize: 12, fontWeight: 600 }}>{stocks[i]} in stock</div>
              <Badge label={stocks[i] < 5 ? 'Low Stock' : 'In Stock'} />
            </div>
          </div>
        ))}
        <hr />
        <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add Variant</button>
      </>
    );
  };

  return (
    <>
      <div className={`prod-backdrop ${product || mode === 'new' ? 'open' : ''}`} onClick={onClose} />
      <div className={`prod-detail-panel ${product || mode === 'new' ? 'open' : ''}`}>
        <div className="detail-header">
          <div className="detail-title">{title}</div>
          <button className="detail-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="detail-body" style={{ overflowY: 'auto', padding: 0 }}>
          {(isNew || isEdit) ? (
            <div style={{ padding: '12px 16px' }}>{renderForm()}</div>
          ) : (
            <>
              <div className="prod-tabs">
                {(['overview', 'stock', 'orders', 'variants'] as const).map(t => (
                  <div key={t} className={`prod-tab ${panelTab === t ? 'active' : ''}`} onClick={() => setPanelTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </div>
                ))}
              </div>
              <div className="prod-tab-panel active">
                {panelTab === 'overview' && renderOverview()}
                {panelTab === 'stock'    && renderStockLog()}
                {panelTab === 'orders'   && renderOrders()}
                {panelTab === 'variants' && renderVariants()}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: ALL PRODUCTS
// ═══════════════════════════════════════════════════════════

type ProdFilter = 'all' | 'instock' | 'lowstock' | 'oos';
type SortCol    = 'sku' | 'name' | 'stock' | 'cost' | 'price';
type SortDir    = 'asc' | 'desc';

const AllProductsTab: React.FC = () => {
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<ProdFilter>('all');
  const [sortCol,  setSortCol]  = useState<SortCol>('sku');
  const [sortDir,  setSortDir]  = useState<SortDir>('asc');
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const [panelMode,setPanelMode]= useState<PanelMode>('view');
  const { isLoading, loadingProgress, startLoading } = usePageLoading();


  // filter + search
  const filtered = ALL_PRODUCTS.filter(p => {
    const st = getProductStatus(p);
    if (filter === 'instock'  && st !== 'In Stock')     return false;
    if (filter === 'lowstock' && st !== 'Low Stock')    return false;
    if (filter === 'oos'      && st !== 'Out of Stock') return false;
    if (search) {
      const q = search.toLowerCase();
      return p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // sort
  const sorted = [...filtered].sort((a, b) => {
    let va: string | number, vb: string | number;
    if (sortCol === 'sku')   { va = a.sku;      vb = b.sku;      }
    else if (sortCol === 'name')  { va = a.name;     vb = b.name;     }
    else if (sortCol === 'stock') { va = a.stock;    vb = b.stock;    }
    else if (sortCol === 'cost')  { va = a.costRaw;  vb = b.costRaw;  }
    else                          { va = a.priceRaw; vb = b.priceRaw; }
    if (typeof va === 'number') return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    return sortDir === 'asc' ? (va as string).localeCompare(vb as string) : (vb as string).localeCompare(va as string);
  });

  const total     = sorted.length;
  const start     = (page - 1) * PROD_PER_PAGE + 1;
  const end       = Math.min(page * PROD_PER_PAGE, total);
  const totalPages= Math.ceil(total / PROD_PER_PAGE);
  const pageItems = sorted.slice((page - 1) * PROD_PER_PAGE, page * PROD_PER_PAGE);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  };

  const handleFilter = (f: ProdFilter) => { setFilter(f); setPage(1); };

const openPanel = (p: Product, mode: PanelMode = 'view') => {
  startLoading(() => {
    setSelected(p);
    setPanelMode(mode);
  }, 300);
};

const openNew = () => {
  startLoading(() => {
    setSelected(null);
    setPanelMode('new');
  }, 300);
};  
  const closePanel= () => { setSelected(null); };

  const SortIcon: React.FC<{ col: SortCol }> = ({ col }) => (
    <i className={`fa-solid ${sortCol === col ? (sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} sort-icon`} />
  );

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Total Products</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-box-open ic-orange" /></div></div>
          <div className="stat-value">248</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +14 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">In Stock</div><div className="stat-icon" style={{ background: 'var(--green-bg)' }}><i className="fa-solid fa-circle-check ic-green" /></div></div>
          <div className="stat-value">211</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 85.1% healthy</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Low Stock</div><div className="stat-icon" style={{ background: 'var(--yellow-bg)' }}><i className="fa-solid fa-triangle-exclamation ic-yellow" /></div></div>
          <div className="stat-value">33</div>
          <div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs restocking</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top"><div className="stat-label">Avg. Sale Price</div><div className="stat-icon" style={{ background: 'var(--blue-bg)' }}><i className="fa-solid fa-tags" style={{ color: 'var(--blue)' }} /></div></div>
          <div className="stat-value">₨2,340</div>
          <div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +₨180 vs last month</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="table-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder="Search SKU, name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            {(['all', 'instock', 'lowstock', 'oos'] as ProdFilter[]).map(f => {
              const labels: Record<ProdFilter, string> = { all: 'All', instock: 'In Stock', lowstock: 'Low Stock', oos: 'Out of Stock' };
              const icons:  Record<ProdFilter, string> = { all: '', instock: 'fa-circle-check', lowstock: 'fa-triangle-exclamation', oos: 'fa-circle-xmark' };
              return (
                <button key={f} className={`t-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => handleFilter(f)}>
                  {icons[f] && <i className={`fa-solid ${icons[f]}`} />} {labels[f]}
                </button>
              );
            })}
          </div>
          <div className="table-toolbar-right">
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button className="header-btn primary" onClick={openNew}><i className="fa-solid fa-plus" /> Add Product</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table id="products-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}><input type="checkbox" /></th>
                <th className={`sortable ${sortCol === 'sku' ? 'sorted' : ''}`} onClick={() => handleSort('sku')}>SKU <SortIcon col="sku" /></th>
                <th className={`sortable ${sortCol === 'name' ? 'sorted' : ''}`} onClick={() => handleSort('name')}>Product Name <SortIcon col="name" /></th>
                <th>Category</th>
                <th className={`sortable ${sortCol === 'stock' ? 'sorted' : ''}`} onClick={() => handleSort('stock')}>Stock <SortIcon col="stock" /></th>
                <th>Threshold</th>
                <th className={`sortable ${sortCol === 'cost' ? 'sorted' : ''}`} onClick={() => handleSort('cost')}>Cost Price <SortIcon col="cost" /></th>
                <th className={`sortable ${sortCol === 'price' ? 'sorted' : ''}`} onClick={() => handleSort('price')}>Sale Price <SortIcon col="price" /></th>
                <th>Margin</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p, i) => {
                const st      = getProductStatus(p);
                const mg      = margin(p.costRaw, p.priceRaw);
                const mgColor = mg >= 50 ? 'var(--green)' : mg >= 30 ? 'var(--yellow)' : 'var(--red)';
                const fillPct = Math.min(100, (p.stock / Math.max(p.threshold * 3, 1)) * 100);
                const fillCls = p.stock === 0 ? 'red' : p.stock < p.threshold ? 'yellow' : 'green';
                return (
                  <tr key={p.sku} onClick={() => openPanel(p, 'view')}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td><code className="code-chip">{p.sku}</code></td>
                    <td>
                      <div className="td-flex">
                        <div className="row-avatar" style={{ fontSize: 9 }}>{initials(p.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div className="td-sub">{p.desc.substring(0, 40)}…</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="tag">{p.category}</span></td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.stock}</div>
                      <div style={{ marginTop: 4 }}>
                        <div className="prog-bar" style={{ width: 72 }}>
                          <div className={`prog-fill ${fillCls}`} style={{ width: `${fillPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-muted)' }}>{p.threshold}</span></td>
                    <td>{fmt(p.costRaw)}</td>
                    <td><strong>{fmt(p.priceRaw)}</strong></td>
                    <td><strong style={{ color: mgColor }}>{mg}%</strong></td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.supplier}</span></td>
                    <td><Badge label={st} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <ThreeDot
                        id={`pd-${i}`}
                        items={[
                          { label: 'View Details',  icon: 'fa-eye',           onClick: () => openPanel(p, 'view') },
                          { label: 'Edit Product',  icon: 'fa-pen',           onClick: () => openPanel(p, 'edit') },
                          { label: 'Add Stock',     icon: 'fa-plus',          onClick: () => {} },
                          { label: 'Stock History', icon: 'fa-clock-rotate-left', onClick: () => openPanel(p, 'view') },
                          { label: 'Duplicate',     icon: 'fa-copy',          onClick: () => {} },
                          { label: '---',           icon: '',                 onClick: () => {} },
                          { label: 'Delete',        icon: 'fa-trash',         danger: true, onClick: () => {} },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination current={page} total={totalPages} totalItems={total} perPage={PROD_PER_PAGE} start={start} end={end} onChange={setPage} />
      </div>

      {/* Detail Panel */}
      <ProductPanel
        product={selected}
        mode={panelMode}
        onClose={closePanel}
        onModeChange={m => setPanelMode(m)}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: VARIANTS
// ═══════════════════════════════════════════════════════════

const VariantsTab: React.FC = () => {
  const SIZE_LABELS  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const SIZE_COUNTS  = [45, 89, 134, 112, 67, 34];
  const COLOR_LABELS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink'];
  const COLOR_HEX    = ['#1F2937', '#E5E7EB', '#DC2626', '#2563EB', '#16A34A', '#EC4899'];
  const COLOR_COUNTS = [98, 72, 61, 54, 43, 38];

  return (
    <>
      {/* Info Banner */}
      <div className="info-banner">
        <i className="fa-solid fa-circle-info" />
        <div className="info-banner-text">Variants let you manage <strong>size, color, and weight</strong> combinations per parent product. Each variant tracks its own stock independently.</div>
      </div>

      {/* Stat Cards */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Total Variants</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-layer-group ic-orange" /></div></div><div className="stat-value">612</div><div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +38 this month</div></div>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Products with Variants</div><div className="stat-icon" style={{ background: 'var(--blue-bg)' }}><i className="fa-solid fa-boxes-stacked" style={{ color: 'var(--blue)' }} /></div></div><div className="stat-value">84</div><div className="stat-trend neutral"><i className="fa-solid fa-minus" /> 33.9% of catalog</div></div>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Avg. Variants/Product</div><div className="stat-icon" style={{ background: 'var(--green-bg)' }}><i className="fa-solid fa-divide ic-green" /></div></div><div className="stat-value">7.3</div><div className="stat-trend neutral"><i className="fa-solid fa-minus" /> Stable</div></div>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Low Stock Variants</div><div className="stat-icon" style={{ background: 'var(--red-bg)' }}><i className="fa-solid fa-triangle-exclamation ic-red" /></div></div><div className="stat-value">47</div><div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Needs attention</div></div>
      </div>

      {/* Variants Table */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="table-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search variant SKU or name..." /></div>
            <select className="form-select" style={{ height: 28, fontSize: 11 }}><option>All Products</option><option>Classic Lawn Suit</option><option>Embroidered Kurta</option><option>Cotton Kurti</option></select>
            <select className="form-select" style={{ height: 28, fontSize: 11 }}><option>All Types</option><option>Size</option><option>Color</option><option>Weight</option></select>
          </div>
          <div className="table-toolbar-right">
            <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add Variant</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Variant SKU</th><th>Parent Product</th><th>Type</th><th>Value</th>
                <th>Stock</th><th>Reserved</th><th>Available</th><th>Sale Price</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {VARIANTS_DATA.map((v, i) => {
                const avail = v.stock - v.reserved;
                const st    = avail === 0 ? 'Out of Stock' : v.stock < 5 ? 'Low Stock' : 'In Stock';
                return (
                  <tr key={v.vsku}>
                    <td><input type="checkbox" /></td>
                    <td><code className="code-chip">{v.vsku}</code></td>
                    <td><strong>{v.parent}</strong></td>
                    <td><span className="tag">{v.type}</span></td>
                    <td><span className={`badge ${v.type === 'Color' ? 'blue' : 'gray'}`}>{v.value}</span></td>
                    <td>{v.stock}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.reserved}</td>
                    <td><strong style={{ color: 'var(--green)' }}>{avail}</strong></td>
                    <td>{fmt(v.price)}</td>
                    <td><Badge label={st} /></td>
                    <td>
                      <ThreeDot id={`var-${i}`} items={[
                        { label: 'Edit Variant', icon: 'fa-pen',   onClick: () => {} },
                        { label: 'Add Stock',    icon: 'fa-plus',  onClick: () => {} },
                        { label: '---',          icon: '',         onClick: () => {} },
                        { label: 'Delete',       icon: 'fa-trash', danger: true, onClick: () => {} },
                      ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing <strong>1–12</strong> of <strong>612</strong> variants</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} /></button>
            {[1,2,3].map(p => <button key={p} className={`page-btn ${p===1?'active':''}`}>{p}</button>)}
            <button className="page-btn dots">…</button>
            <button className="page-btn">51</button>
            <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} /></button>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-ruler-combined" /> Size Distribution</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {SIZE_LABELS.map((s, i) => (
              <div key={s} className="dist-row">
                <div className="dist-label dist-label-narrow">{s}</div>
                <div className="prog-bar" style={{ flex: 1, height: 8 }}>
                  <div className="prog-fill" style={{ width: `${(SIZE_COUNTS[i] / 134) * 100}%`, background: 'var(--accent)' }} />
                </div>
                <div className="dist-count">{SIZE_COUNTS[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-palette" /> Color Distribution</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {COLOR_LABELS.map((c, i) => (
              <div key={c} className="dist-row">
                <div className="color-dot" style={{ background: COLOR_HEX[i] }} />
                <div className="dist-label dist-label-wide">{c}</div>
                <div className="prog-bar" style={{ flex: 1, height: 8 }}>
                  <div className="prog-fill" style={{ width: `${(COLOR_COUNTS[i] / 98) * 100}%`, background: COLOR_HEX[i] }} />
                </div>
                <div className="dist-count">{COLOR_COUNTS[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: CATEGORIES
// ═══════════════════════════════════════════════════════════

const CategoriesTab: React.FC = () => {
  const [catFormLabel, setCatFormLabel] = useState('New Category');
  const [catName, setCatName] = useState('');
  const totalProducts = CATEGORIES_DATA.reduce((a, c) => a + c.products, 0);

  const iconColorMap: Record<string, string> = {
    orange: 'var(--accent)', blue: 'var(--blue)', green: 'var(--green)',
    yellow: 'var(--yellow)', gray: 'var(--text-muted)',
  };

  return (
    <div className="grid-2">
      {/* Left: Category Table */}
      <div>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-tags" /> All Categories</div>
            <div className="card-actions">
              <button className="header-btn primary" onClick={() => { setCatFormLabel('New Category'); setCatName(''); }}>
                <i className="fa-solid fa-plus" /> Add Category
              </button>
            </div>
          </div>
          <div className="table-toolbar" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="table-toolbar-left">
              <div className="table-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search categories..." /></div>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th><th>Products</th><th>Total Stock</th><th>Revenue (MTD)</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES_DATA.map((c, i) => (
                  <tr key={c.name}>
                    <td>
                      <div className="td-flex">
                        <div className="list-icon" style={{ background: '#FFF5EE', width: 28, height: 28, borderRadius: 6 }}>
                          <i className={`fa-solid ${c.icon}`} style={{ fontSize: 11, color: iconColorMap[c.color] ?? 'var(--text-muted)' }} />
                        </div>
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td>{c.products}</td>
                    <td>{c.stock} units</td>
                    <td><strong>{c.revenue}</strong></td>
                    <td><Badge label="Active" /></td>
                    <td>
                      <ThreeDot id={`cat-${i}`} items={[
                        { label: 'Edit',          icon: 'fa-pen',  onClick: () => { setCatFormLabel(`Edit: ${c.name}`); setCatName(c.name); } },
                        { label: 'View Products', icon: 'fa-list', onClick: () => {} },
                        { label: '---',           icon: '',        onClick: () => {} },
                        { label: 'Delete',        icon: 'fa-trash',danger: true, onClick: () => {} },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: Form + Breakdown */}
      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-plus-circle" /> {catFormLabel}</div>
          </div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: 10 }}>
              <div className="form-label">Category Name</div>
              <input className="form-input" value={catName} onChange={e => setCatName(e.target.value)} placeholder="e.g. Suits" style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 10 }}>
              <div className="form-label">Parent Category (optional)</div>
              <select className="form-select" style={{ width: '100%' }}><option value="">— None (top-level) —</option><option>Apparel</option><option>Accessories</option></select>
            </div>
            <div className="form-group" style={{ marginBottom: 10 }}>
              <div className="form-label">Description</div>
              <input className="form-input" placeholder="Short description..." style={{ width: '100%' }} />
            </div>
            <div className="form-row">
              <div className="form-group"><div className="form-label">Status</div><select className="form-select"><option>Active</option><option>Inactive</option></select></div>
              <div className="form-group"><div className="form-label">Icon (FA class)</div><input className="form-input" placeholder="fa-shirt" /></div>
            </div>
            <hr />
            <button className="header-btn primary"><i className="fa-solid fa-check" /> Save Category</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-chart-pie" /> Category Breakdown</div></div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {CATEGORIES_DATA.map(c => (
              <div key={c.name} className="cat-breakdown-row">
                <div className="cat-breakdown-name">{c.name}</div>
                <div className="prog-bar" style={{ flex: 1, height: 8 }}>
                  <div className="prog-fill" style={{ width: `${(c.products / totalProducts) * 100}%`, background: 'var(--accent)' }} />
                </div>
                <div className="cat-breakdown-count">{c.products}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: SUPPLIERS
// ═══════════════════════════════════════════════════════════

const SuppliersTab: React.FC = () => {
  const outColor = (amt: number) => amt > 50000 ? 'var(--red)' : amt > 0 ? 'var(--yellow)' : 'var(--green)';

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Total Suppliers</div><div className="stat-icon" style={{ background: '#FFF5EE' }}><i className="fa-solid fa-truck-ramp-box ic-orange" /></div></div><div className="stat-value">12</div><div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> 10 active</div></div>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Total Outstanding</div><div className="stat-icon" style={{ background: 'var(--red-bg)' }}><i className="fa-solid fa-file-invoice-dollar ic-red" /></div></div><div className="stat-value">₨1.47L</div><div className="stat-trend down"><i className="fa-solid fa-arrow-trend-down" /> Due this week</div></div>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Orders This Month</div><div className="stat-icon" style={{ background: 'var(--blue-bg)' }}><i className="fa-solid fa-clipboard-list" style={{ color: 'var(--blue)' }} /></div></div><div className="stat-value">23</div><div className="stat-trend up"><i className="fa-solid fa-arrow-trend-up" /> +4 vs last month</div></div>
        <div className="stat-card"><div className="stat-card-top"><div className="stat-label">Avg. Lead Time</div><div className="stat-icon" style={{ background: 'var(--yellow-bg)' }}><i className="fa-solid fa-clock ic-yellow" /></div></div><div className="stat-value">4.2 days</div><div className="stat-trend neutral"><i className="fa-solid fa-minus" /> Stable</div></div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="table-search"><i className="fa-solid fa-magnifying-glass" /><input type="text" placeholder="Search supplier name..." /></div>
            <button className="t-filter-btn active">All</button>
            <button className="t-filter-btn"><i className="fa-solid fa-circle-check" /> Active</button>
            <button className="t-filter-btn"><i className="fa-solid fa-pause" /> On Hold</button>
            <button className="t-filter-btn"><i className="fa-solid fa-ban" /> Inactive</button>
          </div>
          <div className="table-toolbar-right">
            <button className="t-filter-btn"><i className="fa-solid fa-file-export" /> Export</button>
            <button className="header-btn primary"><i className="fa-solid fa-plus" /> Add Supplier</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th className="sortable sorted">Supplier <i className="fa-solid fa-sort-down sort-icon" /></th>
                <th>Contact Person</th><th>Phone</th><th>City</th><th>Products</th>
                <th>Outstanding</th><th>Lead Time</th><th>Last Order</th>
                <th>Rating</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS_DATA.map((s, i) => (
                <tr key={s.name}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="td-flex">
                      <div className="row-avatar">{initials(s.name)}</div>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.contact}</td>
                  <td>{s.phone}</td>
                  <td><span className="tag"><i className="fa-solid fa-location-dot" style={{ fontSize: 9 }} /> {s.city}</span></td>
                  <td>{s.products}</td>
                  <td><strong style={{ color: outColor(s.outstanding) }}>{s.outstanding ? fmt(s.outstanding) : '₨0'}</strong></td>
                  <td>{s.lead} days</td>
                  <td>{s.last}</td>
                  <td>
                    <span style={{ fontSize: 12, color: '#F59E0B' }}>{'★'.repeat(Math.floor(s.rating))}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}> {s.rating}</span>
                  </td>
                  <td><Badge label={s.status} /></td>
                  <td>
                    <ThreeDot id={`sup-${i}`} items={[
                      { label: 'View Profile',    icon: 'fa-eye',          onClick: () => {} },
                      { label: 'Edit',            icon: 'fa-pen',          onClick: () => {} },
                      { label: 'Record Payment',  icon: 'fa-money-bill',   onClick: () => {} },
                      { label: 'Create PO',       icon: 'fa-box',          onClick: () => {} },
                      { label: '---',             icon: '',                onClick: () => {} },
                      { label: 'Deactivate',      icon: 'fa-ban',          danger: true, onClick: () => {} },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing <strong>1–10</strong> of <strong>12</strong> suppliers</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled><i className="fa-solid fa-chevron-left" style={{ fontSize: 9 }} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn"><i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} /></button>
          </div>
        </div>
      </div>

      {/* Supplier Quick Cards */}
      <div className="sup-quick-cards">
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-star ic-yellow" /> Top Supplier</div></div>
          <div className="card-body">
            <div style={{ fontSize: 15, fontWeight: 800 }}>Al-Karam Textile</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0' }}>62 products · ₨8.4L total purchases</div>
            <div className="sup-stars-row">
              {[1,2,3,4].map(i => <i key={i} className="fa-solid fa-star star-yellow" />)}
              <i className="fa-solid fa-star-half-stroke star-yellow" />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>4.5/5</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-triangle-exclamation ic-red" /> Highest Outstanding</div></div>
          <div className="card-body">
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--red)' }}>₨80,000</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0' }}>Nishat Textiles · Due 12 May 2026</div>
            <button className="header-btn" style={{ marginTop: 6 }}><i className="fa-solid fa-money-bill" /> Record Payment</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock ic-yellow" /> Pending Restock Orders</div></div>
          <div className="card-body">
            <div className="list-item" style={{ padding: '5px 0' }}>
              <div className="list-content"><div className="list-title">Gul Ahmed — Lawn 3PC</div><div className="list-meta">Expected: 09 May 2026</div></div>
              <span className="badge yellow">In Transit</span>
            </div>
            <div className="list-item" style={{ padding: '5px 0' }}>
              <div className="list-content"><div className="list-title">Bonanza Satrangi — Party Shirts</div><div className="list-meta">Expected: 11 May 2026</div></div>
              <span className="badge blue">Processing</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: BULK IMPORT
// ═══════════════════════════════════════════════════════════

const BulkImportTab: React.FC = () => {
  const [hovering, setHovering] = useState(false);

  const importHistory = [
    { file: 'import_products_may6.csv',  date: '06 May 2026, 14:22', rows: 48,  imported: 47, skipped: 1,  errors: 0, status: 'Success' },
    { file: 'spring_collection.csv',      date: '01 May 2026, 09:05', rows: 120, imported: 115,skipped: 0,  errors: 5, status: 'Partial' },
    { file: 'initial_catalog.csv',        date: '15 Apr 2026, 11:30', rows: 200, imported: 200,skipped: 0,  errors: 0, status: 'Success' },
    { file: 'bad_format.csv',             date: '10 Apr 2026, 16:00', rows: 0,   imported: 0,  skipped: 0,  errors: 0, status: 'Failed'  },
  ];

  const lastErrors = [
    { row: 14,  sku: 'SKU-0200', error: 'Duplicate SKU — already exists' },
    { row: 27,  sku: 'SKU-0214', error: 'Missing required field: cost_price' },
    { row: 41,  sku: 'SKU-0228', error: 'Category "Accessories" not found' },
    { row: 89,  sku: 'SKU-0276', error: 'Sale price less than cost price' },
    { row: 112, sku: '—',        error: 'Empty row detected' },
  ];

  const csvCols = [
    { col: 'sku',         req: true,  example: 'SKU-0041',         note: 'Unique identifier' },
    { col: 'name',        req: true,  example: 'Classic Lawn Suit', note: 'Full product name' },
    { col: 'category',    req: false, example: 'Suits',             note: 'Must match existing category' },
    { col: 'cost_price',  req: true,  example: '800',               note: 'Numeric, PKR' },
    { col: 'sale_price',  req: true,  example: '1800',              note: 'Numeric, PKR' },
    { col: 'stock',       req: false, example: '50',                note: 'Initial quantity (default 0)' },
    { col: 'threshold',   req: false, example: '10',                note: 'Low-stock alert level' },
    { col: 'supplier',    req: false, example: 'Al-Karam Textile',  note: 'Must match existing supplier' },
  ];

  const historyIcon  = (s: string) => s === 'Success' ? 'fa-circle-check ic-green' : s === 'Partial' ? 'fa-triangle-exclamation ic-yellow' : 'fa-circle-xmark ic-red';
  const historyBg    = (s: string) => s === 'Success' ? 'var(--green-bg)' : s === 'Partial' ? 'var(--yellow-bg)' : 'var(--red-bg)';

  return (
    <div className="grid-2">
      {/* Left */}
      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-file-import" /> Bulk Product Import</div></div>
          <div className="card-body">
            <div className="info-banner" style={{ marginBottom: 14 }}>
              <i className="fa-solid fa-circle-info" />
              <div className="info-banner-text">Download the <strong>CSV template</strong> first, fill in product data, then upload. Max <strong>500 rows</strong> per import.</div>
              <button className="header-btn"><i className="fa-solid fa-download" /> Template</button>
            </div>

            <div
              className="prod-drop-zone"
              style={hovering ? { borderColor: 'var(--accent)', background: '#FFF5EE' } : {}}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <i className="fa-solid fa-cloud-arrow-up" />
              <div className="prod-drop-zone-title">
                Drop CSV file here or <span>browse files</span>
              </div>
              <div className="prod-drop-zone-sub">Accepts .csv only · Max 5MB · Up to 500 products</div>
            </div>

            <div className="import-options-section">
              <div className="section-divider"><span>Import Options</span></div>
              <div className="form-row">
                <div className="form-group"><div className="form-label">On Duplicate SKU</div><select className="form-select"><option>Skip (keep existing)</option><option>Update existing</option><option>Error and stop</option></select></div>
                <div className="form-group"><div className="form-label">Auto-generate missing SKUs</div><select className="form-select"><option>Yes</option><option>No</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><div className="form-label">Default Category</div><select className="form-select"><option>— Assign from CSV —</option><option>Suits</option><option>Kurtas</option><option>Dupattas</option></select></div>
                <div className="form-group"><div className="form-label">Notify on Completion</div><select className="form-select"><option>Yes — via dashboard</option><option>No</option></select></div>
              </div>
            </div>
            <hr />
            <button className="header-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fa-solid fa-upload" /> Start Import
            </button>
          </div>
        </div>

        {/* CSV Column Reference */}
        <div className="card csv-ref-table">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-table" /> CSV Column Reference</div></div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Column</th><th>Required</th><th>Example</th><th>Notes</th></tr></thead>
                <tbody>
                  {csvCols.map(c => (
                    <tr key={c.col}>
                      <td><code>{c.col}</code></td>
                      <td><span className={`badge ${c.req ? 'red' : 'yellow'}`}>{c.req ? 'Required' : 'Optional'}</span></td>
                      <td>{c.example}</td>
                      <td>{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div>
        {/* Import History */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-clock-rotate-left" /> Import History</div></div>
          <div className="card-body import-history-list" style={{ padding: '0 16px' }}>
            {importHistory.map((h, i) => (
              <div key={i} className="list-item">
                <div className="list-icon" style={{ background: historyBg(h.status) }}>
                  <i className={`fa-solid ${historyIcon(h.status)}`} style={{ fontSize: 12 }} />
                </div>
                <div className="list-content">
                  <div className="list-title">{h.file}</div>
                  <div className="list-meta">
                    {h.date} · {h.rows} rows · {h.imported} imported{h.skipped ? `, ${h.skipped} skipped` : ''}{h.errors ? `, ${h.errors} errors` : ''}
                    {h.status === 'Failed' ? ' · Invalid format' : ''}
                  </div>
                </div>
                <div className="list-right"><Badge label={h.status} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Import Errors */}
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="fa-solid fa-circle-exclamation ic-yellow" /> Last Import Errors</div></div>
          <div className="card-body" style={{ padding: '0 16px' }}>
            <div className="info-banner" style={{ marginBottom: 10 }}>
              <i className="fa-solid fa-file-csv" />
              <div className="info-banner-text">From <strong>spring_collection.csv</strong> — 5 rows failed</div>
              <button className="header-btn" style={{ whiteSpace: 'nowrap' }}><i className="fa-solid fa-download" /> Error Log</button>
            </div>
            <div className="table-wrap">
              <table className="import-error-row">
                <thead><tr><th>Row</th><th>SKU</th><th>Error</th></tr></thead>
                <tbody>
                  {lastErrors.map((e, i) => (
                    <tr key={i}>
                      <td>{e.row}</td>
                      <td>{e.sku}</td>
                      <td style={{ color: 'var(--red)' }}>{e.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TAB: SETTINGS
// ═══════════════════════════════════════════════════════════

const SettingsTab: React.FC = () => (
  <div className="grid-2">
    <div className="settings-section">
      {/* SKU Config */}
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-barcode" /> SKU Configuration</div></div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group"><div className="form-label">SKU Prefix</div><input className="form-input" defaultValue="SKU-" /></div>
            <div className="form-group"><div className="form-label">Starting Number</div><input className="form-input" type="number" defaultValue={1} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><div className="form-label">Auto-generate SKU on Add</div><select className="form-select"><option>Yes</option><option>No</option></select></div>
            <div className="form-group"><div className="form-label">SKU Format</div><select className="form-select"><option>PREFIX-NNNN (e.g. SKU-0041)</option><option>PREFIX-NAME</option><option>Custom</option></select></div>
          </div>
          <hr /><button className="header-btn primary">Save SKU Settings</button>
        </div>
      </div>

      {/* Stock Settings */}
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-cubes" /> Stock Settings</div></div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group"><div className="form-label">Default Low Stock Threshold</div><input className="form-input" type="number" defaultValue={10} /></div>
            <div className="form-group"><div className="form-label">Allow Negative Stock</div><select className="form-select"><option>No — Block orders</option><option>Yes — Allow oversell</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><div className="form-label">Auto-deduct on Order Confirm</div><select className="form-select"><option>Yes</option><option>No — Manual only</option></select></div>
            <div className="form-group"><div className="form-label">Reserve Stock on Pending</div><select className="form-select"><option>Yes</option><option>No</option></select></div>
          </div>
          <hr /><button className="header-btn primary">Save Stock Settings</button>
        </div>
      </div>
    </div>

    <div className="settings-section">
      {/* Alert Settings */}
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-bell" /> Alert Settings</div></div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group"><div className="form-label">Alert Notification To</div><select className="form-select"><option>Inventory Manager</option><option>Admin</option><option>Both</option></select></div>
            <div className="form-group"><div className="form-label">Alert Frequency</div><select className="form-select"><option>Real-time</option><option>Daily digest</option><option>Weekly digest</option></select></div>
          </div>
          <div className="alert-checkbox-group">
            <label className="alert-checkbox-label"><input type="checkbox" defaultChecked /> Email alert on low stock</label>
            <label className="alert-checkbox-label"><input type="checkbox" defaultChecked /> Dashboard notification on low stock</label>
            <label className="alert-checkbox-label"><input type="checkbox" /> Alert when product reaches 0 stock</label>
            <label className="alert-checkbox-label"><input type="checkbox" defaultChecked /> Weekly stock health summary</label>
          </div>
          <hr /><button className="header-btn primary">Save Alert Settings</button>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="fa-solid fa-sliders" /> Display Settings</div></div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group"><div className="form-label">Rows per Page</div><select className="form-select"><option>10</option><option>15</option><option>25</option><option>50</option></select></div>
            <div className="form-group"><div className="form-label">Default Sort</div><select className="form-select"><option>SKU (ascending)</option><option>Name (A–Z)</option><option>Stock (low first)</option><option>Recently added</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><div className="form-label">Show Cost Price</div><select className="form-select"><option>Yes — All roles</option><option>Admin & Manager only</option><option>Hidden</option></select></div>
            <div className="form-group"><div className="form-label">Currency Symbol</div><input className="form-input" defaultValue="₨" /></div>
          </div>
          <hr /><button className="header-btn primary">Save Display Settings</button>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

const ProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductTab>('all');
  const { isLoading, loadingProgress, switchTab } = useTabLoading(setActiveTab, activeTab);

  const tabs: { id: ProductTab; icon: string; label: string }[] = [
    { id: 'all',       icon: 'fa-list',           label: 'All Products' },
    { id: 'variants',  icon: 'fa-layer-group',    label: 'Variants'     },
    { id: 'cats',      icon: 'fa-tags',           label: 'Categories'   },
    { id: 'suppliers', icon: 'fa-truck-ramp-box', label: 'Suppliers'    },
    { id: 'import',    icon: 'fa-file-import',    label: 'Bulk Import'  },
    { id: 'settings',  icon: 'fa-gear',           label: 'Settings'     },
  ];

  return (
    <div id="page-products">
      <TopLoadingBar progress={loadingProgress} isLoading={isLoading} />
      
      <div className="section-heading">Product Management</div>
      <div className="section-subheading">
        Manage your product catalog, variants, categories, suppliers, and bulk imports.
      </div>

      {/* Horizontal Tabs */}
      <div className="h-tabs">
        {tabs.map(t => (
          <div
            key={t.id}
            className={`h-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => switchTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'all'       && <AllProductsTab />}
      {activeTab === 'variants'  && <VariantsTab />}
      {activeTab === 'cats'      && <CategoriesTab />}
      {activeTab === 'suppliers' && <SuppliersTab />}
      {activeTab === 'import'    && <BulkImportTab />}
      {activeTab === 'settings'  && <SettingsTab />}
    </div>
  );
};

export default ProductPage;