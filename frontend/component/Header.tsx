'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { items, totalQty, isOpen, setIsOpen, removeItem, updateQty } = useCart();
  const [localUser, setLocalUser] = useState<any>(null);
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setLocalUser(JSON.parse(stored));
  }, []);
  const user = session?.user ?? localUser;
  const [menuOpen, setMenuOpen]       = useState(false);
  const [catOpen, setCatOpen]         = useState(false);
  const catTimer = useRef<NodeJS.Timeout | null>(null);

  function openCat()  {
    if (catTimer.current) clearTimeout(catTimer.current);
    setCatOpen(true);
  }
  function closeCat() {
    catTimer.current = setTimeout(() => setCatOpen(false), 120);
  }
  const [scrolled, setScrolled]       = useState(false);
  const [categories, setCategories]   = useState<Category[]>([
    { id: 'clothing',    name: 'Clothing',    slug: 'clothing'    },
    { id: 'scarfs',      name: 'Scarfs',      slug: 'scarfs'      },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
  ]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setCategories(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { name: 'Accueil',       href: '/'        },
    { name: 'JASS Collection',    href: '/products' },
    { name: 'Notre Histoire',href: '/about'    },
    { name: 'Contact',       href: '/contact'  },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff',
        borderBottom: scrolled ? '1px solid #e8e8e8' : '1px solid #f0f0f0',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 6vw' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            height: 68,
          }}>

            {/* ── LOGO ─────────────────────────────────────────── */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontSize: 24, fontWeight: 300,
                letterSpacing: '0.12em', color: '#111',
                textTransform: 'uppercase',
              }}>JASS</span>
            </Link>

            {/* ── DESKTOP NAV ──────────────────────────────────── */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 40 }}
              className="desktop-nav">
              {nav.map(item => (
                <Link key={item.name} href={item.href} style={{
                  textDecoration: 'none',
                  fontSize: 13, letterSpacing: '0.08em',
                  color: isActive(item.href) ? '#111' : '#666',
                  fontWeight: isActive(item.href) ? 500 : 400,
                  borderBottom: isActive(item.href) ? '1px solid #111' : '1px solid transparent',
                  paddingBottom: 2,
                  transition: 'all 0.2s',
                }}>
                  {item.name}
                </Link>
              ))}

              {/* Categories dropdown */}
              <div style={{ position: 'relative' }}
                onMouseEnter={openCat}
                onMouseLeave={closeCat}>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, letterSpacing: '0.08em', color: '#666',
                  fontFamily: 'inherit', padding: '2px 0',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Catégories
                  <span style={{
                    fontSize: 9,
                    transform: catOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s',
                    display: 'inline-block',
                  }}>▼</span>
                </button>

                {/* Dropdown menu */}
                {catOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: 12, background: '#fff',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    minWidth: 180, zIndex: 200,
                    animation: 'dropIn 0.2s ease',
                  }}
                    onMouseEnter={openCat}
                    onMouseLeave={closeCat}
                  >
                    <Link href="/products" style={{
                      display: 'block', padding: '12px 20px',
                      fontSize: 12, letterSpacing: '0.06em', color: '#999',
                      textDecoration: 'none', borderBottom: '1px solid #f5f5f5',
                      textTransform: 'uppercase',
                    }}>
                      Tous les produits
                    </Link>
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/products?category=${cat.id}`} style={{
                        display: 'block', padding: '12px 20px',
                        fontSize: 13, letterSpacing: '0.04em', color: '#333',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f9f9f9',
                        transition: 'background 0.15s',
                      }}
                        onMouseOver={e => (e.currentTarget.style.background = '#f9f9f9')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* ── RIGHT ACTIONS ─────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {user ? (
                <Link href="/account" style={{
                  textDecoration: 'none', fontSize: 13,
                  letterSpacing: '0.06em', color: '#111',
                  fontWeight: 500,
                }}>
                  {user.name?.split(' ')[0] ?? 'Mon Compte'}
                </Link>
              ) : (
                <Link href="/login" style={{
                  textDecoration: 'none', fontSize: 13,
                  letterSpacing: '0.06em', color: '#666',
                  transition: 'color 0.2s',
                }}
                  onMouseOver={e => (e.currentTarget.style.color = '#111')}
                  onMouseOut={e => (e.currentTarget.style.color = '#666')}
                >
                  Mon Compte
                </Link>
              )}

              <button onClick={() => setIsOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', position: 'relative', padding: 0, display: 'flex' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalQty > 0 && (
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    background: '#111', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'sans-serif',
                  }}>
                    {totalQty}
                  </span>
                )}
              </button>

              {/* Burger — mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 4, color: '#111',
                  display: 'none',
                }}
                className="burger-btn"
                aria-label="Menu"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* ── MOBILE MENU ───────────────────────────────────────── */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid #f0f0f0',
            background: '#fff', padding: '24px 6vw 32px',
            animation: 'dropIn 0.2s ease',
          }}>
            {nav.map(item => (
              <Link key={item.name} href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '12px 0',
                  textDecoration: 'none', fontSize: 16,
                  letterSpacing: '0.06em', color: isActive(item.href) ? '#111' : '#555',
                  borderBottom: '1px solid #f5f5f5',
                }}>
                {item.name}
              </Link>
            ))}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>
                Catégories
              </p>
              {categories.map(cat => (
                <Link key={cat.id} href={`/products?category=${cat.id}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '10px 0',
                    textDecoration: 'none', fontSize: 15,
                    letterSpacing: '0.04em', color: '#555',
                    borderBottom: '1px solid #f9f9f9',
                  }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── MINI PANIER SIDEBAR ───────────────────────────────── */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
          {/* Overlay */}
          <div onClick={() => setIsOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

          {/* Drawer */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 380, background: '#fff',
            display: 'flex', flexDirection: 'column',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            animation: 'slideIn 0.3s ease',
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 400, margin: 0 }}>
                Panier {totalQty > 0 && <span style={{ color: '#aaa', fontSize: 12 }}>({totalQty})</span>}
              </h2>
              <button onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', lineHeight: 1 }}>×</button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontSize: 40, marginBottom: 16 }}>🛍️</p>
                  <p style={{ fontSize: 14, color: '#aaa' }}>Votre panier est vide</p>
                </div>
              ) : (
                items.map((item: { id: Key | null | undefined; image: any; name: any; price: number; qty: number }) => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #f5f5f5' }}>
                    {/* Image */}
                    <div style={{ width: 64, height: 80, background: '#f8f8f8', flexShrink: 0, overflow: 'hidden' }}>
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, margin: '0 0 4px', lineHeight: 1.3 }}>{item.name}</p>
                      <p style={{ fontSize: 13, color: '#888', margin: '0 0 8px' }}>{Number(item.price).toFixed(2)} TND</p>
                      {/* Qty */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #e8e8e8', width: 'fit-content' }}>
                        <button onClick={() => updateQty(item.id, -1)}
                          style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                        <span style={{ width: 28, textAlign: 'center', fontSize: 13 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, +1)}
                          style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                      </div>
                    </div>
                    {/* Total + delete */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: 13, margin: 0 }}>{(Number(item.price) * item.qty).toFixed(2)} TND</p>
                      <button onClick={() => removeItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 18 }}>×</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (() => {
              const subtotal = items.reduce((s: number, i: { price: any; qty: number; }) => s + Number(i.price) * i.qty, 0);
              return (
                <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: '#666' }}>Sous-total</span>
                    <span style={{ fontSize: 15, fontWeight: 400 }}>{subtotal.toFixed(2)} TND</span>
                  </div>
                  <Link href="/cart" onClick={() => setIsOpen(false)}
                    style={{ display: 'block', padding: '13px', background: '#fff', color: '#111', border: '1px solid #111', textAlign: 'center', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Voir le panier
                  </Link>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}
                    style={{ display: 'block', padding: '13px', background: '#111', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Commander
                  </Link>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── RESPONSIVE + ANIMATIONS ───────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn  { display: flex !important; }
        }
      `}</style>
    </>
  );
}