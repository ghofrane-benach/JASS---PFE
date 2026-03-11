'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

type ProductStatus = 'draft' | 'published' | 'out_of_stock' | 'archived';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  images: string[];
  category?: { name: string };
}

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  published:    { label: '● En stock',      color: '#166534', bg: '#f0fdf4' },
  out_of_stock: { label: '○ Rupture',       color: '#e55',    bg: '#fff5f5' },
  draft:        { label: '◌ Brouillon',     color: '#888',    bg: '#f9f9f9' },
  archived:     { label: '✕ Archivé',       color: '#bbb',    bg: '#f5f5f5' },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter,   setFilter]   = useState<'all' | 'published' | 'out_of_stock' | 'draft'>('all');

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/products?limit=100`, { headers: authHeaders() });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data?.data ?? []);
    } catch {}
    finally { setLoading(false); }
  }

  async function setInStock(product: Product) {
    setUpdating(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}/publish`, {
        method: 'PATCH', headers: authHeaders(),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...updated } : p));
      }
    } catch {}
    finally { setUpdating(null); }
  }

  async function setOutOfStock(product: Product) {
    setUpdating(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}/out-of-stock`, {
        method: 'PATCH', headers: authHeaders(),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...updated } : p));
      }
    } catch {}
    finally { setUpdating(null); }
  }

  async function updateStockQty(product: Product, stock: number) {
    setUpdating(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}/stock`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ stock }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...updated } : p));
      }
    } catch {}
    finally { setUpdating(null); }
  }

  const filtered = products
    .filter(p => p.status !== 'archived')
    .filter(p => filter === 'all' ? true : p.status === filter)
    .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const totalInStock  = products.filter(p => p.status === 'published').length;
  const totalRupture  = products.filter(p => p.status === 'out_of_stock').length;
  const totalDraft    = products.filter(p => p.status === 'draft').length;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>Administration</p>
          <h1 style={{ fontSize: 28, fontWeight: 300, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Gestion des produits</h1>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {[
            { count: totalInStock, label: 'EN STOCK',   color: '#4a9e6f' },
            { count: totalRupture, label: 'RUPTURE',    color: '#e55'    },
            { count: totalDraft,   label: 'BROUILLON',  color: '#aaa'    },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: i > 0 ? 20 : 0 }}>
              {i > 0 && <div style={{ width: 1, height: 32, background: '#eee' }} />}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 300, margin: 0, color: s.color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{s.count}</p>
                <p style={{ fontSize: 10, color: '#aaa', margin: 0, letterSpacing: '0.1em' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <input
          type="text" placeholder="Rechercher un produit..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 320, padding: '10px 16px', border: '1px solid #e8e8e8', background: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = '#111'}
          onBlur={e  => e.target.style.borderColor = '#e8e8e8'}
        />
        {([
          { key: 'all',          label: 'Tous'       },
          { key: 'published',    label: 'En stock'   },
          { key: 'out_of_stock', label: 'Rupture'    },
          { key: 'draft',        label: 'Brouillon'  },
        ] as const).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{
              padding: '10px 16px', border: `1px solid ${filter === f.key ? '#111' : '#e8e8e8'}`,
              background: filter === f.key ? '#111' : '#fff', color: filter === f.key ? '#fff' : '#666',
              cursor: 'pointer', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
            {f.label}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>
          {filtered.length} produit{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Produit', 'Catégorie', 'Prix', 'Quantité', 'Disponibilité', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 20px', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', textAlign: 'left', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '60px 0', textAlign: 'center', color: '#ccc', fontSize: 13 }}>Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '60px 0', textAlign: 'center', color: '#ccc', fontSize: 13 }}>Aucun produit trouvé</td></tr>
            ) : filtered.map((p, i) => {
              const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.draft;
              const isInStock = p.status === 'published';
              const busy = updating === p.id;
              return (
                <tr key={p.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>

                  {/* Produit */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 50, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={p.images?.[0] || '/images/placeholder.jpg'} alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, margin: 0, lineHeight: 1.3 }}>{p.name}</p>
                        <p style={{ fontSize: 10, color: '#bbb', margin: '2px 0 0', letterSpacing: '0.05em' }}>{p.id.slice(0,8)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Catégorie */}
                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#888' }}>
                    {p.category?.name ?? '—'}
                  </td>

                  {/* Prix */}
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>
                    {Number(p.price).toFixed(2)} TND
                  </td>

                  {/* Quantité éditable */}
                  <td style={{ padding: '14px 20px' }}>
                    <input
                      type="number" min={0}
                      key={p.id + '-' + p.stock}
                      defaultValue={p.stock}
                      onBlur={e => {
                        const val = Number(e.target.value);
                        if (val !== p.stock) updateStockQty(p, val);
                      }}
                      style={{
                        width: 64, padding: '5px 8px',
                        border: `1px solid ${p.stock === 0 ? '#fca5a5' : '#e8e8e8'}`,
                        fontSize: 13, fontFamily: 'inherit', outline: 'none', textAlign: 'center',
                        color: p.stock === 0 ? '#e55' : '#111',
                      }}
                      onFocus={e => e.target.style.borderColor = '#111'}
                    />
                  </td>

                  {/* Disponibilité */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 10, letterSpacing: '0.1em', padding: '4px 10px', background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 20px' }}>
                    {isInStock ? (
                      <button onClick={() => setOutOfStock(p)} disabled={busy}
                        style={{ padding: '7px 14px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit', cursor: busy ? 'wait' : 'pointer', background: 'transparent', color: '#e55', border: '1px solid #fca5a5', transition: 'all 0.2s', opacity: busy ? 0.5 : 1 }}>
                        {busy ? '...' : 'Rupture'}
                      </button>
                    ) : (
                      <button onClick={() => setInStock(p)} disabled={busy}
                        style={{ padding: '7px 14px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit', cursor: busy ? 'wait' : 'pointer', background: '#111', color: '#fff', border: '1px solid #111', transition: 'all 0.2s', opacity: busy ? 0.5 : 1 }}>
                        {busy ? '...' : 'Remettre'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
}