'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (itemId: string) => {
    setRemoving(itemId);
    await removeItem(itemId);
    setRemoving(null);
  };

  const handleQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    await updateItem(itemId, qty);
  };

  // ── EMPTY / LOADING ──────────────────────────────────────────────────
  if (loading && !cart) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Chargement du panier…</p>
        <style>{spinAnim}</style>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={styles.center}>
        <p style={{ fontSize: 56, marginBottom: 20 }}>🛒</p>
        <h2 style={styles.emptyTitle}>Votre panier est vide</h2>
        <p style={styles.emptySub}>Découvrez nos collections et ajoutez vos favoris</p>
        <Link href="/products" style={styles.ctaBtn}>Voir les produits</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{spinAnim}</style>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <section style={styles.header}>
        <p style={styles.headerSub}>JASS — Panier</p>
        <h1 style={styles.headerTitle}>Mon Panier</h1>
        <p style={styles.headerCount}>{cart.itemCount} article{cart.itemCount > 1 ? 's' : ''}</p>
      </section>

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      <div style={styles.content}>

        {/* ── ITEMS LIST ─────────────────────────────────────────── */}
        <div style={styles.itemsList}>

          {/* Clear button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={clearCart} style={styles.clearBtn}>
              Vider le panier
            </button>
          </div>

          {cart.items.map(item => (
            <div key={item.id} style={{
              ...styles.itemRow,
              opacity: removing === item.id ? 0.4 : 1,
              transition: 'opacity 0.3s',
            }}>
              {/* Image */}
              <div style={styles.imgBox}>
                <img
                  src={item.product.images?.[0] ?? '/images/placeholder.jpg'}
                  alt={item.product.name}
                  style={styles.img}
                />
              </div>

              {/* Info */}
              <div style={styles.itemInfo}>
                {item.product.category && (
                  <p style={styles.itemCat}>{item.product.category.name}</p>
                )}
                <h3 style={styles.itemName}>{item.product.name}</h3>
                <p style={styles.itemPrice}>
                  {Number(item.unitPrice).toFixed(2)} <span style={{ fontSize: 11, color: '#aaa' }}>TND</span>
                </p>
              </div>

              {/* Quantity controls */}
              <div style={styles.qtyBox}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => handleQty(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || loading}
                >−</button>
                <span style={styles.qtyNum}>{item.quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => handleQty(item.id, item.quantity + 1)}
                  disabled={loading}
                >+</button>
              </div>

              {/* Subtotal */}
              <div style={styles.subtotal}>
                <p style={styles.subtotalPrice}>
                  {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  <span style={{ fontSize: 11, color: '#aaa', marginLeft: 4 }}>TND</span>
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.id)}
                style={styles.removeBtn}
                disabled={loading}
                title="Supprimer"
              >✕</button>
            </div>
          ))}
        </div>

        {/* ── ORDER SUMMARY ────────────────────────────────────────── */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Récapitulatif</h2>

          <div style={styles.summaryRow}>
            <span>Sous-total ({cart.itemCount} articles)</span>
            <span>{cart.total.toFixed(2)} TND</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Livraison</span>
            <span style={{ color: '#2e7d32' }}>Livraison à 8DT</span>
          </div>
          <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: 16, marginTop: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
            <span style={{ fontWeight: 600, fontSize: 18 }}>{cart.total.toFixed(2)} TND</span>
          </div>

          <Link href="/checkout" style={styles.checkoutBtn}>
            Passer la commande →
          </Link>

          <Link href="/products" style={styles.continueBtn}>
            ← Continuer les achats
          </Link>
        </div>

      </div>
    </div>
  );
}

// ── STYLES ──────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    background: '#fff',
    minHeight: '100vh',
  },
  header: {
    background: '#080808',
    color: '#fff',
    padding: '72px 6vw 60px',
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 10,
    letterSpacing: '0.5em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)' as any,
    fontWeight: 300,
    margin: 0,
  },
  headerCount: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 14,
    letterSpacing: '0.1em',
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '60px 6vw',
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 48,
    alignItems: 'start',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 0,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '20px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  imgBox: {
    width: 90,
    height: 110,
    flexShrink: 0,
    background: '#f8f8f8',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemCat: {
    fontSize: 9,
    letterSpacing: '0.3em',
    textTransform: 'uppercase' as const,
    color: '#bbb',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 400,
    margin: '0 0 8px',
    lineHeight: 1.3,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 300,
    color: '#555',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    border: '1px solid #e8e8e8',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    color: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    width: 36,
    textAlign: 'center' as const,
    fontSize: 14,
    borderLeft: '1px solid #e8e8e8',
    borderRight: '1px solid #e8e8e8',
    lineHeight: '32px',
  },
  subtotal: {
    minWidth: 90,
    textAlign: 'right' as const,
  },
  subtotalPrice: {
    fontSize: 15,
    fontWeight: 500,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#bbb',
    fontSize: 12,
    padding: 8,
    transition: 'color 0.2s',
  },
  clearBtn: {
    background: 'none',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    fontSize: 11,
    letterSpacing: '0.1em',
    color: '#999',
    padding: '6px 16px',
    fontFamily: 'inherit',
  },
  summary: {
    border: '1px solid #f0f0f0',
    padding: '32px',
    position: 'sticky' as const,
    top: 88,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 24,
    letterSpacing: '0.05em',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#555',
    marginBottom: 12,
  },
  checkoutBtn: {
    display: 'block',
    width: '100%',
    padding: '14px 0',
    background: '#111',
    color: '#fff',
    textAlign: 'center' as const,
    textDecoration: 'none',
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    fontFamily: 'inherit',
    marginTop: 24,
    marginBottom: 12,
  },
  continueBtn: {
    display: 'block',
    textAlign: 'center' as const,
    textDecoration: 'none',
    fontSize: 11,
    letterSpacing: '0.1em',
    color: '#888',
    fontFamily: 'inherit',
  },
  center: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '60px 6vw',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    textAlign: 'center' as const,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 300,
    margin: '0 0 12px',
  },
  emptySub: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 32,
  },
  ctaBtn: {
    display: 'inline-block',
    padding: '12px 40px',
    background: '#111',
    color: '#fff',
    textDecoration: 'none',
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    fontFamily: 'inherit',
  },
  spinner: {
    width: 36,
    height: 36,
    border: '1px solid #ddd',
    borderTop: '1px solid #111',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 11,
    letterSpacing: '0.3em',
    color: '#aaa',
    textTransform: 'uppercase' as const,
  },
};

const spinAnim = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
`;