'use client';

// ✅ RÈGLE : "use client" → pas de async/await au niveau du composant
// On utilise useEffect pour fetcher les données côté client

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  stock?: number;
  category?: { name: string };
}

export default function ProductPage() {
  const params   = useParams();
  const id       = params?.id as string;

  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound404, setNotFound] = useState(false);
  const [mainImg,  setMainImg]  = useState(0);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/products/${id}`, { cache: 'no-store' } as RequestInit)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => { if (data) setProduct(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading ───────────────────────────────────────────────
  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '1px solid #111', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
        <p style={{ color: '#888', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Chargement</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── 404 ───────────────────────────────────────────────────
  if (notFound404 || !product) return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <p style={{ fontSize: 18, color: '#333' }}>Produit introuvable</p>
      <Link href="/products" style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: 2 }}>
        ← Voir tous les produits
      </Link>
    </div>
  );

  const images = product.images?.length ? product.images : ['/images/placeholder.jpg'];
  const price  = Number(product.price).toFixed(2);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      {/* ── BREADCRUMB ────────────────────────────────────── */}
      <div style={{ padding: '16px 6vw', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 11, color: '#aaa', textDecoration: 'none', letterSpacing: '0.1em' }}>Accueil</Link>
          <span style={{ color: '#ccc', fontSize: 11 }}>›</span>
          <Link href="/products" style={{ fontSize: 11, color: '#aaa', textDecoration: 'none', letterSpacing: '0.1em' }}>Produits</Link>
          <span style={{ color: '#ccc', fontSize: 11 }}>›</span>
          <span style={{ fontSize: 11, color: '#333', letterSpacing: '0.1em' }}>{product.name}</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '60px 6vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>

        {/* ── LEFT: IMAGES ───────────────────────────────── */}
        <div>
          {/* Main image */}
          <div style={{ aspectRatio: '3/4', background: '#f8f8f8', marginBottom: 12, overflow: 'hidden' }}>
            <img
              src={images[mainImg]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setMainImg(i)} style={{
                  width: 70, height: 70, padding: 0, border: i === mainImg ? '1px solid #111' : '1px solid transparent',
                  background: '#f8f8f8', cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                }}>
                  <img src={img} alt={`vue ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: DETAILS ─────────────────────────────── */}
        <div style={{ paddingTop: 8 }}>
          {product.category && (
            <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>
              {product.category.name}
            </p>
          )}

          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            {product.name}
          </h1>

          <p style={{ fontSize: '2rem', fontWeight: 300, margin: '0 0 32px', letterSpacing: '0.02em' }}>
            {price} <span style={{ fontSize: '1rem', color: '#888' }}>TND</span>
          </p>

          {product.description && (
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555', margin: '0 0 40px', maxWidth: 420 }}>
              {product.description}
            </p>
          )}

          {/* Stock */}
          {product.stock !== undefined && (
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32,
              color: product.stock > 0 ? '#4a9e6f' : '#e55' }}>
              {product.stock > 0 ? `✓ En stock (${product.stock})` : '✗ Rupture de stock'}
            </p>
          )}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            <button
              onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
              style={{
                padding: '16px 32px', background: added ? '#4a9e6f' : '#111',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                fontFamily: 'inherit', transition: 'background 0.3s',
              }}>
              {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
            </button>
            <button style={{
              padding: '16px 32px', background: 'transparent',
              color: '#111', border: '1px solid #111', cursor: 'pointer',
              fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              fontFamily: 'inherit',
            }}>
              ♡ Ajouter aux favoris
            </button>
          </div>

          {/* Details accordion */}
          <div style={{ marginTop: 48, borderTop: '1px solid #f0f0f0', paddingTop: 32 }}>
            <h3 style={{ fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16, color: '#333' }}>
              Détails du produit
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
              {[
                ['Composition', '100% cachemire'],
                ['Entretien', 'Lavage à 30°C'],
                ['Origine', 'Tunisie'],
                ['Livraison', 'Toute la Tunisie'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#333' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}