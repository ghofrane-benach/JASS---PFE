'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default function CartPage() {
  const { items, totalQty, updateQty, removeItem, clearCart } = useCart();

  const subtotal = items.reduce((s: number, i: { price: any; qty: number; }) => s + Number(i.price) * i.qty, 0);
  const shipping = subtotal > 0 ? 8 : 0;
  const total     = subtotal + shipping;

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#080808', color: '#fff', textAlign: 'center', padding: '72px 6vw 60px' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>JASS</p>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, margin: 0 }}>Mon Panier</h1>
        {totalQty > 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 12, letterSpacing: '0.1em' }}>
            {totalQty} article{totalQty > 1 ? 's' : ''}
          </p>
        )}
      </section>

      {items.length === 0 ? (
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '100px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛍️</div>
          <h2 style={{ fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Votre panier est vide</h2>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 40, lineHeight: 1.7 }}>
            Vous n'avez pas encore ajouté de produits.
          </p>
          <Link href="/products" style={{
            display: 'inline-block', padding: '14px 44px',
            background: '#111', color: '#fff', textDecoration: 'none',
            fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
          }}>
            Découvrir la collection
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '60px 6vw', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60 }}>

          {/* LISTE */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto', gap: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa' }}>
              <span /><span>Produit</span><span style={{ textAlign: 'center' }}>Qté</span><span style={{ textAlign: 'right' }}>Prix</span><span />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map((item: { id: Key | null | undefined; image: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: any; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto', gap: 16, alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <Link href={`/products/${String(item.id)}`}>
                    <div style={{ width: 80, height: 96, background: '#f8f8f8', overflow: 'hidden' }}>
                      <img src={item.image || '/images/placeholder.jpg'} alt={String(item.name)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </Link>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 300, margin: '0 0 4px' }}>{item.name}</p>
                    <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>{Number(item.price).toFixed(2)} TND / unité</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8' }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ width: 32, textAlign: 'center', fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, +1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 300, textAlign: 'right', margin: 0, whiteSpace: 'nowrap' }}>
                    {(Math.round(Number(item.price) * Number(item.qty) * 100) / 100).toFixed(2)} <span style={{ fontSize: 11, color: '#aaa' }}>TND</span>
                  </p>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 20, padding: 0 }}>×</button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 20 }}>
              <Link href="/products" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', borderBottom: '1px solid #ddd', paddingBottom: 2 }}>
                ← Continuer les achats
              </Link>
              <button onClick={clearCart} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}>
                Vider le panier
              </button>
            </div>
          </div>

          {/* RÉSUMÉ */}
          <div>
            <div style={{ background: '#f9f9f9', padding: 32, position: 'sticky', top: 88 }}>
              <h2 style={{ fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #ebebeb', fontWeight: 400 }}>
                Résumé
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Sous-total ({totalQty} articles)</span>
                  <span>{subtotal.toFixed(2)} TND</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Livraison</span>
                  <span style={{ color: '#4a9e6f' }}>{shipping.toFixed(2)} TND</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #ebebeb', marginBottom: 24 }}>
                <span style={{ fontSize: 15 }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 300 }}>{total.toFixed(2)} <span style={{ fontSize: 13, color: '#888' }}>TND</span></span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <input type="text" placeholder="Code promo"
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #e8e8e8', background: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                <button style={{ padding: '10px 16px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'inherit' }}>OK</button>
              </div>
              <Link href="/checkout" style={{ display: 'block', padding: '14px', background: '#111', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>
                Commander
              </Link>
              <Link href="/login" style={{ display: 'block', padding: '14px', background: 'transparent', color: '#111', textAlign: 'center', textDecoration: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', border: '1px solid #111' }}>
                Se connecter pour commander
              </Link>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['🚚','Livraison partout en Tunisie'],['🔒','Paiement 100% sécurisé'],['🔄','Échange facile sous 7 jours']].map(([icon, text]) => (
                  <p key={String(text)} style={{ fontSize: 12, color: '#888', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{icon}</span>{text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');`}</style>
    </div>
  );
}