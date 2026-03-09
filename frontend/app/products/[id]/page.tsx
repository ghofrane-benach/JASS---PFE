'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  sizes?: string[];          // ✅ NOUVEAU
  subcategory?: string;      // ✅ NOUVEAU
  category?: { name: string; slug: string };
  brand?: string;
  weight?: number;
}

export default function ProductDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const { addItem } = useCart();

  const productId = params.id as string;

  const [product, setProduct]       = useState<Product | null>(null);
  const [loading, setLoading]       = useState(true);
  const [quantity, setQuantity]     = useState(1);
  const [current, setCurrent]       = useState(0);
  const [cartStatus, setCartStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [related, setRelated]       = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');   // ✅ NOUVEAU
  const [sizeError, setSizeError]       = useState(false);         // ✅ NOUVEAU
  const touchStart                  = useRef<number>(0);

  // ── Fetch produit ────────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setCurrent(0);
    setSelectedSize('');   // ✅ Reset taille au changement de produit
    setSizeError(false);
    fetch(`${API_URL}/products/${productId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        setProduct(data);
        if (data.category?.slug) {
          fetch(`${API_URL}/products?category=${data.category.slug}&limit=8`)
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

  // ── Carousel ─────────────────────────────────────────────────────────
  const images = product?.images?.length ? product.images : ['/images/placeholder.jpg'];
  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1));

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  // ── Add to cart ──────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!product) return;

    // ✅ Bloque si clothing sans taille sélectionnée
    const isClothing = (product.sizes?.length ?? 0) > 0;
    if (isClothing && !selectedSize) {
      setSizeError(true);
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSizeError(false);
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
  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Chargement…</p>
      <style>{anim}</style>
    </div>
  );

  if (!product) return (
    <div style={styles.center}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>😕</p>
      <h2 style={{ fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Produit introuvable</h2>
      <Link href="/products" style={styles.ctaBtn}>← Retour à la collection</Link>
    </div>
  );

  const isClothing = (product.sizes?.length ?? 0) > 0;  // ✅ NOUVEAU

  const btnLabel = {
    idle:    isClothing && selectedSize ? `AJOUTER AU PANIER — ${selectedSize}` : 'AJOUTER AU PANIER',
    loading: 'Ajout en cours…',
    success: `✓ Ajouté au panier !${selectedSize ? ` (${selectedSize})` : ''}`,
    error:   'Erreur — Réessayer',
  }[cartStatus];
  const btnColor = { idle: '#111', loading: '#555', success: '#1e8449', error: '#c0392b' }[cartStatus];

  return (
    <div style={styles.page}>
      <style>{anim}</style>

      {/* ── BREADCRUMB ─────────────────────────────────────────── */}
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

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <div style={styles.main}>

        {/* ── LEFT : CAROUSEL ──────────────────────────────────── */}
        <div style={styles.carouselSection}>

          {/* Thumbnails verticaux à gauche */}
          {images.length > 1 && (
            <div style={styles.thumbCol}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    ...styles.thumb,
                    border: i === current ? '2px solid #111' : '2px solid transparent',
                    opacity: i === current ? 1 : 0.5,
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Image principale avec flèches */}
          <div style={styles.mainImgWrap}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {images.map((img, i) => (
              <div key={i} style={{
                ...styles.slide,
                opacity:    i === current ? 1 : 0,
                transition: 'opacity 0.4s ease',
                zIndex:     i === current ? 1 : 0,
              }}>
                <img src={img} alt={`${product.name} ${i + 1}`} style={styles.mainImg} />
              </div>
            ))}

            {/* Flèches navigation */}
            {images.length > 1 && (<>
              <button onClick={prev} style={{ ...styles.arrow, left: 12 }}>‹</button>
              <button onClick={next} style={{ ...styles.arrow, right: 12 }}>›</button>
              {/* Dots en bas */}
              <div style={styles.dots}>
                {images.map((_, i) => (
                  <div key={i} onClick={() => setCurrent(i)} style={{
                    ...styles.dot,
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
                    width:      i === current ? 20 : 6,
                  }} />
                ))}
              </div>
            </>)}
          </div>
        </div>

        {/* ── RIGHT : INFO ─────────────────────────────────────── */}
        <div style={styles.infoCol}>

          {product.category && <p style={styles.catLabel}>{product.category.name}</p>}
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.price}>
            {Number(product.price).toFixed(2)}
            <span style={styles.currency}> TND</span>
          </p>

          {product.description && <p style={styles.description}>{product.description}</p>}

          <div style={styles.divider} />

          {/* Stock */}
          <p style={{
            fontSize: 12, letterSpacing: '0.1em', marginBottom: 20,
            color: product.stock > 5 ? '#2e7d32' : product.stock > 0 ? '#e65100' : '#c0392b',
          }}>
            {product.stock > 5 ? '● En stock' : product.stock > 0 ? `● Plus que ${product.stock} en stock` : '● Rupture de stock'}
          </p>

          {/* ✅ SÉLECTEUR DE TAILLE — uniquement pour Clothing */}
          {isClothing && (
            <div id="size-selector" style={{ marginBottom: 28 }}>

              {/* En-tête avec taille sélectionnée + guide */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Taille
                  {selectedSize && (
                    <span style={{ fontWeight: 300, color: '#666', marginLeft: 10, textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>
                      — {selectedSize}
                    </span>
                  )}
                </p>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: '#888', textDecoration: 'underline',
                  fontFamily: 'inherit', letterSpacing: '0.04em', padding: 0,
                }}>
                  Guide des tailles
                </button>
              </div>

              {/* Boutons tailles */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes!.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    style={{
                      width: 54, height: 54,
                      border: selectedSize === size
                        ? '2px solid #111'
                        : sizeError
                          ? '1px solid #e74c3c'
                          : '1px solid #ddd',
                      background: selectedSize === size ? '#111' : '#fff',
                      color:      selectedSize === size ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: 12, fontFamily: 'inherit',
                      letterSpacing: '0.04em',
                      fontWeight: selectedSize === size ? 500 : 400,
                      transition: 'all 0.2s',
                    }}>
                    {size}
                  </button>
                ))}
              </div>

              {/* Message erreur */}
              {sizeError && (
                <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 10, letterSpacing: '0.02em' }}>
                  ⚠️ Veuillez sélectionner une taille avant d'ajouter au panier.
                </p>
              )}
            </div>
          )}
          {/* ── FIN SÉLECTEUR DE TAILLE ── */}

          {/* Quantity */}
          <div style={styles.qtyRow}>
            <span style={styles.qtyLabel}>Quantité</span>
            <div style={styles.qtyControls}>
              <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
              <span style={styles.qtyNum}>{quantity}</span>
              <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={cartStatus === 'loading' || product.stock === 0}
            style={{ ...styles.addBtn, background: btnColor, cursor: cartStatus === 'loading' ? 'wait' : 'pointer' }}
          >
            {cartStatus === 'loading' && <span style={styles.btnSpinner} />}
            {btnLabel}
          </button>

          {cartStatus === 'success' && (
            <Link href="/cart" style={styles.viewCartLink}>Voir mon panier →</Link>
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
            {/* ✅ Ligne tailles disponibles */}
            {isClothing && (
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>Tailles disponibles</span>
                <span style={styles.detailVal}>{product.sizes!.join(' · ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────────────────── */}
      {related.length > 0 && (
        <section style={styles.related}>
          <h2 style={styles.relatedTitle}>Vous aimerez aussi</h2>
          <div style={styles.relatedGrid}>
            {related.map(p => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/products/${product.id}`} style={styles.relatedCard}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      <div style={styles.relatedImgBox}>
        <img
          src={product.images?.[0] ?? '/images/placeholder.jpg'}
          alt={product.name}
          style={{ ...styles.relatedImg, transform: hov ? 'scale(1.05)' : 'scale(1)' }}
        />
        {hov && (
          <div style={styles.relOverlay}>
            <span style={styles.relOverlayTxt}>Voir le produit</span>
          </div>
        )}
      </div>
      {product.category && <p style={styles.relCat}>{product.category.name}</p>}
      <p style={styles.relatedName}>{product.name}</p>
      <p style={styles.relatedPrice}>{Number(product.price).toFixed(2)} <span style={{ fontSize: 11, color: '#aaa' }}>TND</span></p>
    </Link>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page:          { fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' },
  center:        { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'Cormorant Garamond', Georgia, serif", textAlign: 'center', padding: '60px 6vw' },
  spinner:       { width: 36, height: 36, border: '1px solid #ddd', borderTop: '1px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 },
  btnSpinner:    { width: 14, height: 14, border: '1px solid rgba(255,255,255,0.4)', borderTop: '1px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: 8, verticalAlign: 'middle' },
  loadingText:   { fontSize: 11, letterSpacing: '0.3em', color: '#aaa', textTransform: 'uppercase' },
  ctaBtn:        { display: 'inline-block', padding: '12px 40px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'inherit' },
  breadcrumb:    { padding: '16px 6vw', fontSize: 11, letterSpacing: '0.08em', color: '#999', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #f5f5f5' },
  breadLink:     { color: '#999', textDecoration: 'none' },
  breadSep:      { color: '#ddd' },
  main:          { maxWidth: 1200, margin: '0 auto', padding: '48px 6vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
  carouselSection: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  thumbCol:      { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
  thumb:         { width: 72, height: 90, cursor: 'pointer', overflow: 'hidden', flexShrink: 0, transition: 'opacity 0.2s, border-color 0.2s' },
  mainImgWrap:   { flex: 1, position: 'relative', aspectRatio: '3/4', background: '#f8f8f8', overflow: 'hidden' },
  slide:         { position: 'absolute', inset: 0 },
  mainImg:       { width: '100%', height: '100%', objectFit: 'cover' },
  arrow:         { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.88)', border: 'none', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', fontSize: 22, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  dots:          { position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 2 },
  dot:           { height: 6, borderRadius: 3, cursor: 'pointer', transition: 'all 0.3s' },
  infoCol:       { position: 'sticky', top: 88 },
  catLabel:      { fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 },
  productName:   { fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' as any, fontWeight: 300, margin: '0 0 16px', lineHeight: 1.2 },
  price:         { fontSize: 28, fontWeight: 300, margin: '0 0 20px', color: '#111' },
  currency:      { fontSize: 14, color: '#aaa' },
  description:   { fontSize: 14, color: '#555', lineHeight: 1.8, margin: '0 0 20px' },
  divider:       { height: 1, background: '#f0f0f0', margin: '24px 0' },
  qtyRow:        { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 },
  qtyLabel:      { fontSize: 12, letterSpacing: '0.1em', color: '#555' },
  qtyControls:   { display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8' },
  qtyBtn:        { width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum:        { width: 44, textAlign: 'center', fontSize: 14, borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', lineHeight: '36px' },
  addBtn:        { width: '100%', padding: '16px 0', color: '#fff', border: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  viewCartLink:  { display: 'block', textAlign: 'center', fontSize: 12, letterSpacing: '0.1em', color: '#1e8449', textDecoration: 'none', marginBottom: 12, padding: '8px 0', border: '1px solid #1e8449' },
  details:       { display: 'flex', flexDirection: 'column', gap: 10 },
  detailRow:     { display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid #f8f8f8' },
  detailKey:     { color: '#999', letterSpacing: '0.05em' },
  detailVal:     { color: '#333', fontWeight: 400 },
  related:       { background: '#fafafa', padding: '64px 6vw', borderTop: '1px solid #f0f0f0' },
  relatedTitle:  { textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2rem)' as any, fontWeight: 300, marginBottom: 40, letterSpacing: '0.05em' },
  relatedGrid:   { maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  relatedCard:   { textDecoration: 'none', color: 'inherit', display: 'block' },
  relatedImgBox: { aspectRatio: '3/4', background: '#f0f0f0', overflow: 'hidden', marginBottom: 12, position: 'relative' },
  relatedImg:    { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' },
  relOverlay:    { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 16px' },
  relOverlayTxt: { background: '#fff', color: '#111', padding: '8px 20px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' },
  relCat:        { fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#bbb', marginBottom: 4 },
  relatedName:   { fontSize: 14, fontWeight: 400, marginBottom: 4 },
  relatedPrice:  { fontSize: 13, color: '#444', fontWeight: 300 },
};

const anim = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
`;