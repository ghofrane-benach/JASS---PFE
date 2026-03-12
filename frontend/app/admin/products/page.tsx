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
  sizes?: string[];
  sku?: string;
  brand?: string;
  subcategory?: string;
  description?: string;
  category?: { id: string; name: string };
}

interface Category { id: string; name: string; slug: string; }

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  published:    { label: '● En stock',  color: '#166534', bg: '#f0fdf4' },
  out_of_stock: { label: '○ Rupture',   color: '#e55',    bg: '#fff5f5' },
  draft:        { label: '◌ Brouillon', color: '#888',    bg: '#f9f9f9' },
  archived:     { label: '✕ Archivé',   color: '#bbb',    bg: '#f5f5f5' },
};

const SIZES_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const EMPTY_FORM = {
  name: '', price: '', stock: '', description: '',
  categoryId: '', subcategory: '', sku: '', brand: '',
  images: [''],
  sizes: [] as string[],
};

export default function AdminProductsPage() {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [updating,  setUpdating]  = useState<string | null>(null);
  const [filter,    setFilter]    = useState<'all' | 'published' | 'out_of_stock' | 'draft'>('all');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ ...EMPTY_FORM });
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/products?limit=100`, { headers: authHeaders() });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data?.data ?? []);
    } catch {}
    finally { setLoading(false); }
  }

  async function fetchCategories() {
    try {
      const res  = await fetch(`${API_URL}/categories`, { headers: authHeaders() });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data?.data ?? []);
    } catch {}
  }

  async function setInStock(product: Product) {
    setUpdating(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}/publish`, { method: 'PATCH', headers: authHeaders() });
      if (res.ok) { const u = await res.json(); setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...u } : p)); }
    } catch {}
    finally { setUpdating(null); }
  }

  async function setOutOfStock(product: Product) {
    setUpdating(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}/out-of-stock`, { method: 'PATCH', headers: authHeaders() });
      if (res.ok) { const u = await res.json(); setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...u } : p)); }
    } catch {}
    finally { setUpdating(null); }
  }

  async function updateStockQty(product: Product, stock: number) {
    setUpdating(product.id);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}/stock`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ stock }),
      });
      if (res.ok) { const u = await res.json(); setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...u } : p)); }
    } catch {}
    finally { setUpdating(null); }
  }

  async function handleAddProduct() {
    setFormError('');
    if (!form.name.trim())    return setFormError('Le nom est requis.');
    if (!form.price)          return setFormError('Le prix est requis.');
    if (!form.categoryId)     return setFormError('La catégorie est requise.');

    setSaving(true);
    try {
      const body = {
        name:        form.name.trim(),
        price:       parseFloat(form.price),
        stock:       parseInt(form.stock || '0'),
        description: form.description.trim() || undefined,
        categoryId:  form.categoryId,
        subcategory: form.subcategory.trim() || undefined,
        sku:         form.sku.trim() || undefined,
        brand:       form.brand.trim() || undefined,
        images:      form.images.filter(i => i.trim()),
        sizes:       form.sizes.length > 0 ? form.sizes : undefined,
      };

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err?.message ?? 'Erreur lors de la création.');
        return;
      }

      const created = await res.json();
      setProducts(prev => [created, ...prev]);
      setShowModal(false);
      setForm({ ...EMPTY_FORM });
    } catch {
      setFormError('Erreur réseau.');
    } finally {
      setSaving(false);
    }
  }

  function toggleSize(size: string) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size],
    }));
  }

  function setImageUrl(idx: number, val: string) {
    setForm(f => {
      const imgs = [...f.images];
      imgs[idx] = val;
      return { ...f, images: imgs };
    });
  }

  const filtered = products
    .filter(p => p.status !== 'archived')
    .filter(p => filter === 'all' ? true : p.status === filter)
    .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const totalInStock = products.filter(p => p.status === 'published').length;
  const totalRupture = products.filter(p => p.status === 'out_of_stock').length;
  const totalDraft   = products.filter(p => p.status === 'draft').length;

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
            { count: totalInStock, label: 'EN STOCK',  color: '#4a9e6f' },
            { count: totalRupture, label: 'RUPTURE',   color: '#e55'    },
            { count: totalDraft,   label: 'BROUILLON', color: '#aaa'    },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {i > 0 && <div style={{ width: 1, height: 32, background: '#eee' }} />}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 300, margin: 0, color: s.color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{s.count}</p>
                <p style={{ fontSize: 10, color: '#aaa', margin: 0, letterSpacing: '0.1em' }}>{s.label}</p>
              </div>
            </div>
          ))}
          <div style={{ width: 1, height: 32, background: '#eee' }} />
          {/* Bouton Ajouter */}
          <button onClick={() => { setShowModal(true); setFormError(''); setForm({ ...EMPTY_FORM }); }}
            style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Ajouter
          </button>
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
          { key: 'all',          label: 'Tous'      },
          { key: 'published',    label: 'En stock'  },
          { key: 'out_of_stock', label: 'Rupture'   },
          { key: 'draft',        label: 'Brouillon' },
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
              const cfg      = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.draft;
              const isIn     = p.status === 'published';
              const busy     = updating === p.id;
              return (
                <tr key={p.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>

                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 50, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={p.images?.[0] || '/images/placeholder.jpg'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, margin: 0, lineHeight: 1.3 }}>{p.name}</p>
                        <p style={{ fontSize: 10, color: '#bbb', margin: '2px 0 0', letterSpacing: '0.05em' }}>{p.id.slice(0,8)}</p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#888' }}>{p.category?.name ?? '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13 }}>{Number(p.price).toFixed(2)} TND</td>

                  <td style={{ padding: '14px 20px' }}>
                    <input type="number" min={0} key={p.id + '-' + p.stock} defaultValue={p.stock}
                      onBlur={e => { const v = Number(e.target.value); if (v !== p.stock) updateStockQty(p, v); }}
                      style={{ width: 64, padding: '5px 8px', border: `1px solid ${p.stock === 0 ? '#fca5a5' : '#e8e8e8'}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', textAlign: 'center', color: p.stock === 0 ? '#e55' : '#111' }}
                      onFocus={e => e.target.style.borderColor = '#111'}
                    />
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 10, letterSpacing: '0.1em', padding: '4px 10px', background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {isIn ? (
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

      {/* ═══ MODAL AJOUT PRODUIT ═══ */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>

          <div style={{ background: '#fff', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>

            {/* Modal header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', margin: '0 0 4px' }}>Administration</p>
                <h2 style={{ fontSize: 20, fontWeight: 300, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Nouveau produit</h2>
              </div>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#aaa', lineHeight: 1, padding: 4 }}>✕</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Nom */}
              <Field label="Nom du produit *">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Écharpe Rose en Cachemire"
                  style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>

              {/* Prix + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Prix (TND) *">
                  <input type="number" min={0} step={0.01} value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Ex: 40.00"
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </Field>
                <Field label="Stock initial">
                  <input type="number" min={0} value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="Ex: 20"
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </Field>
              </div>

              {/* Catégorie + Sous-catégorie */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Catégorie *">
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    style={{ ...inputStyle, background: '#fff' }}>
                    <option value="">— Choisir —</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Sous-catégorie">
                  <input value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                    placeholder="Ex: coats, bracelets..."
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </Field>
              </div>

              {/* SKU */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="SKU">
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    placeholder="Ex: SCARF-ROSE-001"
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </Field>
              
              </div>

              {/* Description */}
              <Field label="Description">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description du produit..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>

              {/* Images */}
              <Field label="Images (URLs)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8 }}>
                      <input value={img} onChange={e => setImageUrl(idx, e.target.value)}
                        placeholder={`URL image ${idx + 1} — ex: /images/scarfs/rose.jpeg`}
                        style={{ ...inputStyle, flex: 1 }} onFocus={focusStyle} onBlur={blurStyle} />
                      {form.images.length > 1 && (
                        <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                          style={{ padding: '0 12px', border: '1px solid #f0f0f0', background: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))}
                    style={{ alignSelf: 'flex-start', padding: '7px 14px', border: '1px solid #e8e8e8', background: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit', color: '#666' }}>
                    + Ajouter une image
                  </button>
                </div>
              </Field>

              {/* Tailles */}
              <Field label="Tailles disponibles">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SIZES_OPTIONS.map(size => (
                    <button key={size} onClick={() => toggleSize(size)}
                      style={{
                        width: 48, height: 48, border: form.sizes.includes(size) ? '2px solid #111' : '1px solid #ddd',
                        background: form.sizes.includes(size) ? '#111' : '#fff',
                        color: form.sizes.includes(size) ? '#fff' : '#555',
                        cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', transition: 'all 0.15s',
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#bbb', margin: '8px 0 0' }}>Laisser vide si pas de tailles (accessoires, écharpes)</p>
              </Field>

              {/* Erreur */}
              {formError && (
                <p style={{ fontSize: 12, color: '#e55', padding: '10px 14px', background: '#fff5f5', border: '1px solid #fca5a5', margin: 0 }}>
                  ⚠ {formError}
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 12, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#fff' }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '12px 24px', border: '1px solid #e8e8e8', background: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit', color: '#666' }}>
                Annuler
              </button>
              <button onClick={handleAddProduct} disabled={saving}
                style={{ padding: '12px 28px', border: 'none', background: '#111', color: '#fff', cursor: saving ? 'wait' : 'pointer', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Création...' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', margin: '0 0 8px', fontFamily: 'sans-serif' }}>{label}</p>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e8e8e8',
  fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};
const focusStyle = (e: React.FocusEvent<any>) => e.target.style.borderColor = '#111';
const blurStyle  = (e: React.FocusEvent<any>) => e.target.style.borderColor = '#e8e8e8';