'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  // Pour l'instant panier vide — à connecter avec le vrai state plus tard
  const [isLoggedIn] = useState(false);
  const cartItems: any[] = [];

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '80vh' }}>

      {/* Header section */}
      <section style={{ background: '#080808', color: '#fff', padding: '60px 6vw 50px', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>
          JASS
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, margin: 0, letterSpacing: '-0.01em' }}>
          Mon Panier
        </h1>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 6vw', textAlign: 'center' }}>

        {!isLoggedIn ? (
          /* ── PAS CONNECTÉ ─────────────────────────── */
          <div>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
            <h2 style={{ fontSize: 22, fontWeight: 300, margin: '0 0 16px' }}>
              Connectez-vous pour voir votre panier
            </h2>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, margin: '0 0 48px' }}>
              Vous devez être connecté pour accéder à votre panier et finaliser votre commande.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{
                display: 'inline-block', padding: '14px 44px',
                background: '#111', color: '#fff', textDecoration: 'none',
                fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}>
                Se connecter
              </Link>
              <Link href="/products" style={{
                display: 'inline-block', padding: '14px 44px',
                background: 'transparent', color: '#111',
                border: '1px solid #111', textDecoration: 'none',
                fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}>
                Continuer mes achats
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* ── PANIER VIDE ──────────────────────────── */
          <div>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛍️</div>
            <h2 style={{ fontSize: 22, fontWeight: 300, margin: '0 0 16px' }}>
              Votre panier est vide
            </h2>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, margin: '0 0 48px' }}>
              Vous n'avez pas encore ajouté de produits à votre panier.
            </p>
            <Link href="/products" style={{
              display: 'inline-block', padding: '14px 44px',
              background: '#111', color: '#fff', textDecoration: 'none',
              fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: 'inherit',
            }}>
              Découvrir la collection
            </Link>
          </div>
        ) : null}

      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>
    </div>
  );
}