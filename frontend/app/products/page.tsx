'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  stock?: number;
  category?: { name: string; slug?: string };
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };

  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mainImg,  setMainImg]  = useState(0);
  const [added,    setAdded]    = useState(false);
  const [wished,   setWished]   = useState(false);
  const [qty,      setQty]      = useState(1);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/products/${id}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => { if (data) setProduct(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function addToCart() {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id:    product.id,
        name:  product.name,
        price: product.price,
        image: product.images?.[0] ?? '',
        qty,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-serif">
      <div className="text-center">
        <div className="w-10 h-10 border border-[#111] border-t-transparent rounded-full mx-auto mb-5"
          style={{ animation: 'spin 0.8s linear infinite' }} />
        <p className="text-[#888] text-[13px] tracking-[0.2em] uppercase">Chargement</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── 404 ───────────────────────────────────────────────────────────────
  if (notFound || !product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 font-serif">
      <p className="text-lg text-[#333]">Produit introuvable</p>
      <Link href="/products" className="text-[12px] tracking-[0.2em] uppercase text-[#111] no-underline border-b border-[#111] pb-0.5">
        ← Voir tous les produits
      </Link>
    </div>
  );

  const images  = product.images?.length ? product.images : ['/images/placeholder.jpg'];
  const price   = Number(product.price).toFixed(2);
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="font-serif bg-white min-h-screen">

      {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
      <div className="px-[6vw] py-4 border-b border-[#f0f0f0]">
        <div className="max-w-[1300px] mx-auto flex gap-2 items-center text-[11px] text-[#aaa]">
          <Link href="/"         className="no-underline text-[#aaa] hover:text-[#111] transition-colors">Accueil</Link>
          <span className="text-[#ddd]">›</span>
          <Link href="/products" className="no-underline text-[#aaa] hover:text-[#111] transition-colors">Produits</Link>
          <span className="text-[#ddd]">›</span>
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.slug}`}
                className="no-underline text-[#aaa] hover:text-[#111] transition-colors">
                {product.category.name}
              </Link>
              <span className="text-[#ddd]">›</span>
            </>
          )}
          <span className="text-[#333]">{product.name}</span>
        </div>
      </div>

      {/* ── MAIN ───────────────────────────────────────────────────── */}
      <div className="max-w-[1300px] mx-auto px-[6vw] py-16 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

        {/* ── IMAGES ─────────────────────────────────────────────── */}
        <div>
          <div className="bg-[#f8f8f8] overflow-hidden mb-3" style={{ aspectRatio: '3/4' }}>
            <img src={images[mainImg]} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button key={i} onClick={() => setMainImg(i)}
                  className="w-[70px] h-[70px] p-0 bg-[#f8f8f8] cursor-pointer overflow-hidden transition-all"
                  style={{ border: i === mainImg ? '1px solid #111' : '1px solid transparent' }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── DETAILS ────────────────────────────────────────────── */}
        <div className="pt-2">

          {product.category && (
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#aaa] mb-4">
              {product.category.name}
            </p>
          )}

          <h1 className="font-light leading-[1.1] mb-5 tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)' }}>
            {product.name}
          </h1>

          <p className="font-light mb-8" style={{ fontSize: '2rem' }}>
            {price} <span className="text-base text-[#888]">TND</span>
          </p>

          {product.description && (
            <p className="text-[14px] leading-[1.8] text-[#555] mb-10 max-w-[420px]">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <p className="text-[11px] tracking-[0.2em] uppercase mb-8"
            style={{ color: inStock ? '#4a9e6f' : '#e55' }}>
            {inStock ? `✓ En stock (${product.stock} disponibles)` : '✗ Rupture de stock'}
          </p>

          {/* Quantité */}
          {inStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#888]">Quantité</span>
              <div className="flex items-center border border-[#e8e8e8]">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#111] bg-transparent border-none cursor-pointer text-lg hover:bg-[#f5f5f5] transition-colors">
                  −
                </button>
                <span className="w-10 text-center text-[14px]">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock ?? 99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#111] bg-transparent border-none cursor-pointer text-lg hover:bg-[#f5f5f5] transition-colors">
                  +
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3 max-w-[400px]">
            <button onClick={addToCart} disabled={!inStock}
              className="py-4 px-8 text-white text-[11px] tracking-[0.25em] uppercase font-serif border-none cursor-pointer transition-all duration-300"
              style={{ background: added ? '#4a9e6f' : inStock ? '#111' : '#ccc' }}>
              {added ? '✓ Ajouté au panier' : inStock ? 'Ajouter au panier' : 'Indisponible'}
            </button>

            <button onClick={() => setWished(w => !w)}
              className="py-4 px-8 bg-transparent text-[11px] tracking-[0.25em] uppercase font-serif cursor-pointer transition-all duration-300"
              style={{ color: wished ? '#c0392b' : '#111', border: `1px solid ${wished ? '#c0392b' : '#111'}` }}>
              {wished ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris'}
            </button>
          </div>

          {/* Toast */}
          {added && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-[#f0faf5] border border-[#4a9e6f]/30">
              <span className="text-[#4a9e6f]">✓</span>
              <span className="text-[13px] text-[#4a9e6f]">Produit ajouté au panier</span>
              <Link href="/cart"
                className="ml-auto text-[11px] tracking-[0.15em] uppercase text-[#111] no-underline border-b border-[#111] pb-0.5">
                Voir le panier →
              </Link>
            </div>
          )}

          {/* Détails */}
          <div className="mt-12 pt-8 border-t border-[#f0f0f0]">
            <h3 className="text-[12px] tracking-[0.25em] uppercase mb-4 text-[#333]">Détails du produit</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['Composition', '100% cachemire'],
                ['Entretien',   'Lavage à 30°C' ],
                ['Origine',     'Tunisie'        ],
                ['Livraison',   'Toute la Tunisie'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#aaa] mb-1">{label}</p>
                  <p className="text-[13px] text-[#333]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}