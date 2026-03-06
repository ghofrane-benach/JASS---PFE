'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  images?: string[];
  sizes?: string[];
  subcategory?: string;
  category?: { name: string; slug?: string };
}

export default function ProductDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const { addItem } = useCart();

  const [product,      setProduct]      = useState<Product | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [activeImg,    setActiveImg]    = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');  // ✅ NOUVEAU
  const [sizeError,    setSizeError]    = useState(false);        // ✅ NOUVEAU
  const [added,        setAdded]        = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // ✅ Vérifie si ce produit est un clothing (a des tailles)
  const isClothing = (product?.sizes?.length ?? 0) > 0;

  async function handleAddToCart() {
    if (!product) return;

    // ✅ Bloque si clothing sans taille sélectionnée
    if (isClothing && !selectedSize) {
      setSizeError(true);
      // Scroll vers le sélecteur de taille
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSizeError(false);
    // TODO : passer la taille au backend quand tu gères le stock par taille
    // Pour l'instant on ajoute normalement + on affiche la taille choisie
    await addItem(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', fontFamily: 'Georgia, serif' }}>
      <div style={{ width: 36, height: 36, border: '1px solid #ddd', borderTop: '1px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: 'Georgia, serif' }}>
      <p style={{ fontSize: 48 }}>🔍</p>
      <h2>Produit introuvable</h2>
      <Link href="/products" style={{ color: '#111' }}>← Retour à la collection</Link>
    </div>
  );

  const imgs  = product.images?.length ? product.images : ['/images/placeholder.jpg'];
  const price = Number(product.price).toFixed(2);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ padding: '16px 6vw', fontSize: 11, color: '#aaa', letterSpacing: '0.1em' }}>
        <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Accueil</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link href="/products" style={{ color: '#aaa', textDecoration: 'none' }}>Collection</Link>
        {product.category && (
          <>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link href={`/products?category=${product.category.slug}`} style={{ color: '#aaa', textDecoration: 'none' }}>
              {product.category.name}
            </Link>
          </>
        )}
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#333' }}>{product.name}</span>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 6vw 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5vw' }}>

        {/* ── LEFT : Galerie images ─────────────────────── */}
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {imgs.map((img, i) => (
                <div key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 72, height: 90, cursor: 'pointer',
                    border: activeImg === i ? '1px solid #111' : '1px solid transparent',
                    overflow: 'hidden', flexShrink: 0,
                    opacity: activeImg === i ? 1 : 0.6,
                    transition: 'all 0.2s',
                  }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Main image */}
          <div style={{ flex: 1, aspectRatio: '3/4', overflow: 'hidden', background: '#f8f8f8' }}>
            <img
              src={imgs[activeImg]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
            />
          </div>
        </div>

        {/* ── RIGHT : Infos produit ─────────────────────── */}
        <div style={{ paddingTop: 8 }}>

          {/* Catégorie */}
          {product.category && (
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12 }}>
              {product.category.name}
              {product.subcategory && <span style={{ color: '#ddd' }}> · {product.subcategory}</span>}
            </p>
          )}

          {/* Nom */}
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, margin: '0 0 24px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {product.name}
          </h1>

          {/* Prix */}
          <p style={{ fontSize: 26, fontWeight: 300, margin: '0 0 28px', color: '#111' }}>
            {price} <span style={{ fontSize: 14, color: '#999' }}>TND</span>
          </p>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, margin: '0 0 32px' }}>
              {product.description}
            </p>
          )}

          <div style={{ height: 1, background: '#f0f0f0', margin: '0 0 28px' }} />

          {/* Stock */}
          <p style={{ fontSize: 12, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: product.stock > 0 ? '#4a9e6f' : '#e74c3c',
              display: 'inline-block',
            }} />
            <span style={{ color: product.stock > 0 ? '#4a9e6f' : '#e74c3c', letterSpacing: '0.05em' }}>
              {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
            </span>
          </p>

          {/* ✅ SÉLECTEUR DE TAILLE — visible uniquement pour Clothing */}
          {isClothing && (
            <div id="size-selector" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
                  Taille
                  {selectedSize && (
                    <span style={{ fontWeight: 300, color: '#666', marginLeft: 12, textTransform: 'none', letterSpacing: 0 }}>
                      — {selectedSize}
                    </span>
                  )}
                </p>
                {/* Guide des tailles */}
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: '#888', textDecoration: 'underline',
                  fontFamily: 'inherit', letterSpacing: '0.05em',
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
                          ? '1px solid #e74c3c'   // rouge si erreur
                          : '1px solid #ddd',
                      background: selectedSize === size ? '#111' : '#fff',
                      color: selectedSize === size ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: 12, fontFamily: 'inherit',
                      letterSpacing: '0.05em',
                      transition: 'all 0.2s',
                      fontWeight: selectedSize === size ? 500 : 400,
                    }}>
                    {size}
                  </button>
                ))}
              </div>

              {/* Message erreur si aucune taille sélectionnée */}
              {sizeError && (
                <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 10, letterSpacing: '0.03em' }}>
                  ⚠️ Veuillez sélectionner une taille avant d'ajouter au panier.
                </p>
              )}
            </div>
          )}

          {/* Bouton Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%', padding: '18px 0',
              background: added ? '#4a9e6f' : product.stock === 0 ? '#ccc' : '#111',
              color: '#fff', border: 'none',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
              fontFamily: 'inherit', transition: 'background 0.3s',
              marginBottom: 16,
            }}>
            {added
              ? `✓ Ajouté${selectedSize ? ` — Taille ${selectedSize}` : ''}`
              : product.stock === 0
                ? 'RUPTURE DE STOCK'
                : 'AJOUTER AU PANIER'}
          </button>

          {/* Infos supplémentaires */}
          <div style={{ height: 1, background: '#f0f0f0', margin: '24px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {product.category && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#999', letterSpacing: '0.05em' }}>Catégorie</span>
                <span style={{ color: '#333' }}>{product.category.name}</span>
              </div>
            )}
            {isClothing && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#999', letterSpacing: '0.05em' }}>Tailles disponibles</span>
                <span style={{ color: '#333' }}>{product.sizes!.join(' · ')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#999', letterSpacing: '0.05em' }}>Stock</span>
              <span style={{ color: '#333' }}>{product.stock} unité{product.stock !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}