'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
// ✅ En local : localhost:3000 | En Docker : backend:3000
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  status?: string;
  category?: { name: string; slug?: string };
}

const CATEGORIES = [
  { id: '',            label: 'JASS Collection' },
  { id: 'clothing',    label: 'Clothing' },
  { id: 'scarfs',      label: 'Scarfs' },
  { id: 'accessories', label: 'Accessories' },
];

// ── Wrap in Suspense to allow useSearchParams ─────────────────────────────
export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<LoadingView />}>
      <ProductsPage />
    </Suspense>
  );
}

function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') ?? '';

  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeFilter, setActive]   = useState(categoryParam);
  const [sortBy, setSortBy]         = useState('newest');
  const [hoveredId, setHoveredId]   = useState<string | null>(null);

  // Sync URL param → local filter
  useEffect(() => { setActive(categoryParam); }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    setError('');

    const url = new URL(`${API_URL}/products`);
    if (activeFilter) url.searchParams.set('category', activeFilter);
    // Don't filter by status in case backend doesn't have published products yet
    if (sortBy === 'newest')     url.searchParams.set('sortBy', 'createdAt');
    if (sortBy === 'price-asc')  { url.searchParams.set('sortBy', 'price'); url.searchParams.set('order', 'ASC'); }
    if (sortBy === 'price-desc') { url.searchParams.set('sortBy', 'price'); url.searchParams.set('order', 'DESC'); }
    url.searchParams.set('limit', '50');

    fetch(url.toString())
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Handle both { data: [] } and [] response shapes
        const list = Array.isArray(data) ? data : (data.data ?? data.products ?? []);
        setProducts(list);
      })
      .catch(err => {
        console.error('Products fetch error:', err);
        setError('Impossible de charger les produits. Vérifiez que le backend est démarré.');
      })
      .finally(() => setLoading(false));
  }, [activeFilter, sortBy]);

  // ── Category name for heading ─────────────────────────────────────────
  const catLabel = CATEGORIES.find(c => c.id === activeFilter)?.label ?? 'Tous les produits';

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      {/* ── PAGE HEADER ──────────────────────────────────── */}
      <section style={{ background: '#080808', color: '#fff', padding: '72px 6vw 60px', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
          JASS — Collection
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, margin: 0, letterSpacing: '-0.01em' }}>
          {catLabel}
        </h1>
        {!loading && !error && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 14, letterSpacing: '0.1em' }}>
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </section>

      {/* ── FILTERS BAR ──────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid #f0f0f0', background: '#fff',
        padding: '0 6vw', position: 'sticky', top: 68, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: 0 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              onClick={() => {
                setActive(cat.id);
                // Update URL without navigation
                const url = new URL(window.location.href);
                if (cat.id) url.searchParams.set('category', cat.id);
                else url.searchParams.delete('category');
                window.history.pushState({}, '', url.toString());
              }}
              style={{
                padding: '18px 24px', border: 'none', background: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, letterSpacing: '0.1em',
                color: activeFilter === cat.id ? '#111' : '#aaa',
                borderBottom: activeFilter === cat.id ? '2px solid #111' : '2px solid transparent',
                transition: 'all 0.2s',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          padding: '8px 16px', border: '1px solid #e8e8e8',
          background: '#fff', fontFamily: 'inherit',
          fontSize: 11, letterSpacing: '0.1em', color: '#666',
          cursor: 'pointer', outline: 'none',
        }}>
          <option value="newest">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '60px 6vw' }}>

        {/* Loading */}
        {loading && <LoadingView />}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
            <p style={{ fontSize: 15, color: '#c0392b', marginBottom: 12 }}>{error}</p>
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 32, letterSpacing: '0.05em' }}>
              Vérifiez que le backend NestJS tourne sur le port 3000
            </p>
            <button onClick={() => setLoading(true)} style={{
              padding: '12px 32px', background: '#111', color: '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              Réessayer
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 20 }}>🧣</p>
            <h2 style={{ fontSize: 22, fontWeight: 300, margin: '0 0 12px' }}>
              Aucun produit trouvé
            </h2>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32 }}>
              {activeFilter ? `Aucun produit dans la catégorie "${catLabel}"` : 'Aucun produit disponible pour le moment'}
            </p>
            <button onClick={() => setActive('')} style={{
              padding: '12px 32px', background: 'transparent', color: '#111',
              border: '1px solid #111', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              Voir tous les produits
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 4,
          }}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                hovered={hoveredId === product.id}
                onHover={setHoveredId}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────
function ProductCard({ product, hovered, onHover }: {
  product: Product;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const img   = product.images?.[0] ?? '/images/placeholder.jpg';
  const price = Number(product.price).toFixed(2);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, image: img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div style={{ position: 'relative' }}
      onMouseOver={() => onHover(product.id)}
      onMouseOut={() => onHover(null)}>

      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>

        {/* Image */}
        <div style={{ aspectRatio: '3/4', background: '#f8f8f8', overflow: 'hidden', position: 'relative' }}>
          <img src={img} alt={product.name} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }} />

          {/* Overlay hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.18)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            padding: '0 16px 16px', gap: 8,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}>
            {/* Bouton Voir produit */}
            <span style={{
              background: '#fff', color: '#111', padding: '10px 0',
              fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
              fontFamily: "'Cormorant Garamond', serif",
              width: '100%', textAlign: 'center', display: 'block',
            }}>
              Voir le produit
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 4px 8px' }}>
          {product.category && (
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#bbb', marginBottom: 6 }}>
              {product.category.name}
            </p>
          )}
          <h3 style={{ fontSize: 15, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <p style={{ fontSize: 14, fontWeight: 300, margin: 0, color: '#333' }}>
            {price} <span style={{ fontSize: 11, color: '#aaa' }}>TND</span>
          </p>
        </div>
      </Link>

      {/* Bouton Add to Cart — en dehors du Link */}
      <button onClick={addToCart} style={{
        width: '100%', padding: '10px 0',
        background: added ? '#4a9e6f' : '#111',
        color: '#fff', border: 'none', cursor: 'pointer',
        fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
        fontFamily: "'Cormorant Garamond', serif",
        transition: 'background 0.3s',
        marginBottom: 16,
      }}>
        {added ? '✓ Ajouté' : '+ Panier'}
      </button>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────
function LoadingView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
      <div style={{ width: 36, height: 36, border: '1px solid #ddd', borderTop: '1px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 }} />
      <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa' }}>Chargement</p>
    </div>
  );
}