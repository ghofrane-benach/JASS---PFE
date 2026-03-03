'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  stock: number;
  status?: string;
  category?: { name: string; slug: string };
  brand?: string;
  weight?: number;
}

export default function ProductDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const { addItem } = useCart();

  const productId = params.id as string;

  const [product, setProduct]     = useState<Product | null>(null);
  const [loading, setLoading]     = useState(true);
  const [quantity, setQuantity]   = useState(1);
  const [mainImg, setMainImg]     = useState(0);
  const [cartStatus, setCartStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [related, setRelated]     = useState<Product[]>([]);

  // ── Fetch produit depuis l'API ────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`${API_URL}/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Produit introuvable');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        // Fetch produits similaires
        if (data.category?.slug) {
          fetch(`${API_URL}/products?category=${data.category.slug}&limit=4`)
            .then(r => r.json())
            .then(d => {
              const list = Array.isArray(d) ? d : (d.data ?? []);
              setRelated(list.filter((p: Product) => p.id !== productId).slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  // ── Ajouter au panier ────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!product) return;
    setCartStatus('loading');
    try {
      await addItem(product.id, quantity);
      setCartStatus('success');
      setTimeout(() => setCartStatus('idle'), 2500);
    } catch {
      setCartStatus('error');
      setTimeout(() => setCartStatus('idle'), 2500);
    }
  };

  // ── LOADING ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Chargement…</p>
        <style>{anim}</style>
      </div>
    );
  }

  // ── NOT FOUND ────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div style={styles.center}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>😕</p>
        <h2 style={{ fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Produit introuvable</h2>
        <Link href="/products" style={styles.ctaBtn}>← Retour à la collection</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['/images/placeholder.jpg'];

  // ── BUTTON LABEL ─────────────────────────────────────────────────────
  const btnLabel = {
    idle:    'Ajouter au panier',
    loading: 'Ajout en cours…',
    success: '✓ Ajouté au panier !',
    error:   'Erreur — Réessayer',
  }[cartStatus];

  const btnColor = {
    idle:    '#111',
    loading: '#555',
    success: '#1e8449',
    error:   '#c0392b',
  }[cartStatus];

  return (
    <div style={styles.page}>
      <style>{anim}</style>

      {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
      <div style={styles.breadcrumb}>
        <Link href="/" style={styles.breadLink}>Accueil</Link>
        <span style={styles.breadSep}>/</span>
        <Link href="/products" style={styles.breadLink}>Collection</Link>
        {product.category && <>
          <span style={styles.breadSep}>/</span>
          <Link href={`/products?category=${product.category.slug}`} style={styles.breadLink}>
            {product.category.name}
          </Link>
        </>}
        <span style={styles.breadSep}>/</span>
        <span style={{ color: '#111' }}>{product.name}</span>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <div style={styles.main}>

        {/* ── LEFT : IMAGES ────────────────────────────────────────── */}
        <div style={styles.imagesCol}>
          {/* Main image */}
          <div style={styles.mainImgBox}>
            <img
              src={images[mainImg]}
              alt={product.name}
              style={styles.mainImg}
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={styles.thumbRow}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImg(i)}
                  style={{
                    ...styles.thumb,
                    border: i === mainImg ? '2px solid #111' : '2px solid transparent',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT : INFO ─────────────────────────────────────────── */}
        <div style={styles.infoCol}>

          {/* Category */}
          {product.category && (
            <p style={styles.catLabel}>{product.category.name}</p>
          )}

          {/* Name */}
          <h1 style={styles.productName}>{product.name}</h1>

          {/* Price */}
          <p style={styles.price}>
            {Number(product.price).toFixed(2)}
            <span style={styles.currency}> TND</span>
          </p>

          {/* Description */}
          {product.description && (
            <p style={styles.description}>{product.description}</p>
          )}

          <div style={styles.divider} />

          {/* Stock */}
          <p style={{
            fontSize: 12, letterSpacing: '0.1em', marginBottom: 20,
            color: product.stock > 5 ? '#2e7d32' : product.stock > 0 ? '#e65100' : '#c0392b',
          }}>
            {product.stock > 5 ? '● En stock' : product.stock > 0 ? `● Plus que ${product.stock} en stock` : '● Rupture de stock'}
          </p>

          {/* Quantity */}
          <div style={styles.qtyRow}>
            <span style={styles.qtyLabel}>Quantité</span>
            <div style={styles.qtyControls}>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >−</button>
              <span style={styles.qtyNum}>{quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >+</button>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={cartStatus === 'loading' || product.stock === 0}
            style={{
              ...styles.addBtn,
              background: btnColor,
              cursor: cartStatus === 'loading' ? 'wait' : 'pointer',
            }}
          >
            {cartStatus === 'loading' && <span style={styles.btnSpinner} />}
            {btnLabel}
          </button>

          {/* View cart link after success */}
          {cartStatus === 'success' && (
            <Link href="/cart" style={styles.viewCartLink}>
              Voir mon panier →
            </Link>
          )}

          <div style={styles.divider} />

          {/* Details */}
          <div style={styles.details}>
            {product.brand && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Marque</span>
                <span style={styles.detailVal}>{product.brand}</span>
              </div>
            )}
            {product.weight && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Poids</span>
                <span style={styles.detailVal}>{product.weight} kg</span>
              </div>
            )}
            {product.category && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Catégorie</span>
                <span style={styles.detailVal}>{product.category.name}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── RELATED PRODUCTS ───────────────────────────────────────── */}
      {related.length > 0 && (
        <section style={styles.related}>
          <h2 style={styles.relatedTitle}>Vous aimerez aussi</h2>
          <div style={styles.relatedGrid}>
            {related.map(p => (
              <Link key={p.id} href={`/product/${p.id}`} style={styles.relatedCard}>
                <div style={styles.relatedImgBox}>
                  <img
                    src={p.images?.[0] ?? '/images/placeholder.jpg'}
                    alt={p.name}
                    style={styles.relatedImg}
                  />
                </div>
                <p style={styles.relatedName}>{p.name}</p>
                <p style={styles.relatedPrice}>{Number(p.price).toFixed(2)} TND</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page:         { fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' },
  center:       { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'Cormorant Garamond', Georgia, serif", textAlign: 'center', padding: '60px 6vw' },
  spinner:      { width: 36, height: 36, border: '1px solid #ddd', borderTop: '1px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 },
  btnSpinner:   { width: 14, height: 14, border: '1px solid rgba(255,255,255,0.4)', borderTop: '1px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: 8, verticalAlign: 'middle' },
  loadingText:  { fontSize: 11, letterSpacing: '0.3em', color: '#aaa', textTransform: 'uppercase' },
  ctaBtn:       { display: 'inline-block', padding: '12px 40px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'inherit' },
  breadcrumb:   { padding: '16px 6vw', fontSize: 11, letterSpacing: '0.08em', color: '#999', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #f5f5f5' },
  breadLink:    { color: '#999', textDecoration: 'none' },
  breadSep:     { color: '#ddd' },
  main:         { maxWidth: 1200, margin: '0 auto', padding: '48px 6vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
  imagesCol:    { display: 'flex', flexDirection: 'column', gap: 12 },
  mainImgBox:   { aspectRatio: '3/4', background: '#f8f8f8', overflow: 'hidden' },
  mainImg:      { width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' },
  thumbRow:     { display: 'flex', gap: 8 },
  thumb:        { width: 72, height: 88, cursor: 'pointer', overflow: 'hidden', flexShrink: 0 },
  infoCol:      { position: 'sticky', top: 88 },
  catLabel:     { fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 },
  productName:  { fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' as any, fontWeight: 300, margin: '0 0 16px', lineHeight: 1.2 },
  price:        { fontSize: 28, fontWeight: 300, margin: '0 0 20px', color: '#111' },
  currency:     { fontSize: 14, color: '#aaa' },
  description:  { fontSize: 14, color: '#555', lineHeight: 1.8, margin: '0 0 20px' },
  divider:      { height: 1, background: '#f0f0f0', margin: '24px 0' },
  qtyRow:       { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 },
  qtyLabel:     { fontSize: 12, letterSpacing: '0.1em', color: '#555' },
  qtyControls:  { display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8' },
  qtyBtn:       { width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum:       { width: 44, textAlign: 'center', fontSize: 14, borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', lineHeight: '36px' },
  addBtn:       { width: '100%', padding: '16px 0', color: '#fff', border: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  viewCartLink: { display: 'block', textAlign: 'center', fontSize: 12, letterSpacing: '0.1em', color: '#1e8449', textDecoration: 'none', marginBottom: 12, padding: '8px 0', border: '1px solid #1e8449' },
  details:      { display: 'flex', flexDirection: 'column', gap: 10 },
  detailRow:    { display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid #f8f8f8' },
  detailKey:    { color: '#999', letterSpacing: '0.05em' },
  detailVal:    { color: '#333', fontWeight: 400 },
  related:      { background: '#fafafa', padding: '64px 6vw', borderTop: '1px solid #f0f0f0' },
  relatedTitle: { textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2rem)' as any, fontWeight: 300, marginBottom: 40, letterSpacing: '0.05em' },
  relatedGrid:  { maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  relatedCard:  { textDecoration: 'none', color: 'inherit', display: 'block' },
  relatedImgBox:{ aspectRatio: '3/4', background: '#f0f0f0', overflow: 'hidden', marginBottom: 12 },
  relatedImg:   { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', },
  relatedName:  { fontSize: 14, fontWeight: 400, marginBottom: 4 },
  relatedPrice: { fontSize: 13, color: '#666' },
};

const anim = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
`;