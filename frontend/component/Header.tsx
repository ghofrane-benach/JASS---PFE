'use client';

import Link from 'next/link';
import { useAuth } from '@/component/AuthProvider';
import { useCart, CartItem } from '../context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category?: { name: string; slug: string };
}

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const { items, totalQty, isOpen, setIsOpen, removeItem, updateQty } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen,  setCatOpen]  = useState(false);
  const catTimer = useRef<NodeJS.Timeout | null>(null);

  function openCat()  { if (catTimer.current) clearTimeout(catTimer.current); setCatOpen(true); }
  function closeCat() { catTimer.current = setTimeout(() => setCatOpen(false), 120); }

  // ── SEARCH ──────────────────────────────────────────────────────────
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setSearchResults([]); setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res  = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setSearchResults(list.slice(0, 5));
      } catch { setSearchResults([]); }
      finally  { setSearchLoading(false); }
    }, 350);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false); setSearchResults([]);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const handleResultClick = (id: string) => {
    setSearchOpen(false); setSearchResults([]); setSearchQuery('');
    router.push(`/products/${id}`);
  };
  // ────────────────────────────────────────────────────────────────────

  // ── ACCOUNT DROPDOWN ────────────────────────────────────────────────
  const [accountOpen, setAccountOpen] = useState(false);
  const accountTimer = useRef<NodeJS.Timeout | null>(null);

  function openAccount()  { if (accountTimer.current) clearTimeout(accountTimer.current); setAccountOpen(true); }
  function closeAccount() { accountTimer.current = setTimeout(() => setAccountOpen(false), 150); }

  const handleLogout = () => {
    logout?.();
    setAccountOpen(false);
    router.push('/');
  };
  // ────────────────────────────────────────────────────────────────────

  const [scrolled,   setScrolled]   = useState(false);
  const [categories, setCategories] = useState<Category[]>([
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
    { name: 'Accueil',         href: '/'        },
    { name: 'JASS Collection', href: '/products' },
    { name: 'Notre Histoire',  href: '/about'   },
    { name: 'Contact',         href: '/contact' },
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

            {/* LOGO */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 24, fontWeight: 300, letterSpacing: '0.12em', color: '#111', textTransform: 'uppercase' }}>JASS</span>
            </Link>

            {/* DESKTOP NAV */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 40 }} className="desktop-nav">
              {nav.map(item => (
                <Link key={item.name} href={item.href} style={{
                  textDecoration: 'none', fontSize: 13, letterSpacing: '0.08em',
                  color: isActive(item.href) ? '#111' : '#666',
                  fontWeight: isActive(item.href) ? 500 : 400,
                  borderBottom: isActive(item.href) ? '1px solid #111' : '1px solid transparent',
                  paddingBottom: 2, transition: 'all 0.2s',
                }}>
                  {item.name}
                </Link>
              ))}

              {/* Categories dropdown */}
              <div style={{ position: 'relative' }} onMouseEnter={openCat} onMouseLeave={closeCat}>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, letterSpacing: '0.08em', color: '#666',
                  fontFamily: 'inherit', padding: '2px 0',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Catégories
                  <span style={{ fontSize: 9, transform: catOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', display: 'inline-block' }}>▼</span>
                </button>

                {catOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%',
                    transform: 'translateX(-50%)', marginTop: 12,
                    background: '#fff', border: '1px solid #f0f0f0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    minWidth: 180, zIndex: 200, animation: 'dropIn 0.2s ease',
                  }} onMouseEnter={openCat} onMouseLeave={closeCat}>
                    <Link href="/products" style={{ display: 'block', padding: '12px 20px', fontSize: 12, letterSpacing: '0.06em', color: '#999', textDecoration: 'none', borderBottom: '1px solid #f5f5f5', textTransform: 'uppercase' }}>
                      Tous les produits
                    </Link>
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{
                        display: 'block', padding: '12px 20px', fontSize: 13,
                        letterSpacing: '0.04em', color: '#333', textDecoration: 'none',
                        borderBottom: '1px solid #f9f9f9', transition: 'background 0.15s',
                      }}
                        onMouseOver={e => (e.currentTarget.style.background = '#f9f9f9')}
                        onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT ACTIONS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

              {/* ── SEARCH ICON ── */}
              <div ref={searchRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setSearchOpen(o => !o)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#111')}
                  onMouseOut={e  => (e.currentTarget.style.color = '#555')}
                  aria-label="Rechercher"
                >
                  <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>

                {searchOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 20px)', right: 0,
                    width: 340, background: '#fff',
                    border: '1px solid #ececec',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    zIndex: 300, animation: 'dropIn 0.2s ease',
                  }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', gap: 8 }}>
                      <svg width="15" height="15" fill="none" stroke="#bbb" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="What you are looking for ?"
                        style={{
                          flex: 1, border: 'none', outline: 'none', fontSize: 13,
                          fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#111', background: 'transparent',
                        }}
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
                      )}
                    </form>

                    {searchLoading && (
                      <div style={{ padding: '18px', textAlign: 'center', fontSize: 12, color: '#aaa', letterSpacing: '0.1em' }}>Recherche…</div>
                    )}

                    {!searchLoading && searchResults.length > 0 && (
                      <>
                        {searchResults.map(p => (
                          <div key={p.id} onClick={() => handleResultClick(p.id)}
                            style={{ display: 'flex', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', transition: 'background 0.15s' }}
                            onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                            onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div style={{ width: 38, height: 48, background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
                              <img src={p.images?.[0] ?? '/images/placeholder.jpg'} alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                              {p.category && <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', margin: '0 0 3px' }}>{p.category.name}</p>}
                              <p style={{ fontSize: 13, color: '#111', margin: 0 }}>{Number(p.price).toFixed(2)} TND</p>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => handleSearchSubmit()}
                          style={{ width: '100%', padding: '12px', background: 'none', border: 'none', borderTop: '1px solid #f0f0f0', cursor: 'pointer', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', fontFamily: 'inherit' }}>
                          Voir tous les résultats →
                        </button>
                      </>
                    )}

                    {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                      <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: 13, color: '#aaa' }}>
                        Aucun résultat pour « {searchQuery} »
                      </div>
                    )}

                    {!searchQuery && (
                      <div style={{ padding: '16px', fontSize: 12, color: '#ccc', textAlign: 'center', letterSpacing: '0.05em' }}>
                        Tapez pour rechercher…
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── ACCOUNT ICON + DROPDOWN ── */}
              <div style={{ position: 'relative' }} onMouseEnter={openAccount} onMouseLeave={closeAccount}>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#111')}
                  onMouseOut={e  => (e.currentTarget.style.color = '#555')}
                  aria-label="Mon compte"
                >
                  <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </svg>
                  {isLoggedIn && (
                    <span style={{ fontSize: 12, letterSpacing: '0.06em', color: '#111' }} className="desktop-nav">
                      {user?.name?.split(' ')[0] ?? ''}
                    </span>
                  )}
                </button>

                {accountOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 20px)', right: 0,
                    width: 200, background: '#fff',
                    border: '1px solid #ececec',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    zIndex: 300, animation: 'dropIn 0.2s ease',
                  }} onMouseEnter={openAccount} onMouseLeave={closeAccount}>

                    {isLoggedIn ? (
                      <>
                        {/* Info utilisateur */}
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f5f5f5' }}>
                          <p style={{ fontSize: 13, margin: 0, fontWeight: 500, color: '#111' }}>{user?.name}</p>
                          <p style={{ fontSize: 11, margin: '2px 0 0', color: '#aaa', letterSpacing: '0.03em' }}>{user?.email}</p>
                        </div>
                        {[
                          { label: 'Mon Compte',    href: '/account'        },
                          { label: 'Mes Commandes', href: '/account/orders' },
                        ].map(link => (
                          <Link key={link.href} href={link.href} onClick={() => setAccountOpen(false)}
                            style={{ display: 'block', padding: '11px 18px', fontSize: 13, letterSpacing: '0.04em', color: '#444', textDecoration: 'none', borderBottom: '1px solid #f9f9f9', transition: 'background 0.15s' }}
                            onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                            onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
                          >
                            {link.label}
                          </Link>
                        ))}
                        <button onClick={handleLogout}
                          style={{ width: '100%', padding: '11px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, letterSpacing: '0.04em', color: '#c0392b', fontFamily: 'inherit', transition: 'background 0.15s' }}
                          onMouseOver={e => (e.currentTarget.style.background = '#fff8f8')}
                          onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setAccountOpen(false)}
                          style={{ display: 'block', padding: '13px 18px', fontSize: 13, letterSpacing: '0.06em', color: '#111', textDecoration: 'none', borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s' }}
                          onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                          onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
                        >
                          Connexion
                        </Link>
                        <Link href="/register" onClick={() => setAccountOpen(false)}
                          style={{ display: 'block', padding: '13px 18px', fontSize: 13, letterSpacing: '0.06em', color: '#666', textDecoration: 'none', transition: 'background 0.15s' }}
                          onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                          onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
                        >
                          Créer un compte
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart icon */}
              <button onClick={() => setIsOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', position: 'relative', padding: 0, display: 'flex', transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = '#111')}
                onMouseOut={e  => (e.currentTarget.style.color = '#555')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalQty > 0 && (
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    background: '#111', color: '#fff', borderRadius: '50%',
                    width: 16, height: 16, fontSize: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'sans-serif',
                  }}>
                    {totalQty}
                  </span>
                )}
              </button>

              {/* Burger */}
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#111', display: 'none' }}
                className="burger-btn" aria-label="Menu">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid #f0f0f0', background: '#fff', padding: '24px 6vw 32px', animation: 'dropIn 0.2s ease' }}>

            {/* Search mobile */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8', padding: '10px 14px', marginBottom: 20, gap: 8 }}>
              <svg width="14" height="14" fill="none" stroke="#bbb" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher…"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', background: 'transparent' }}
              />
            </form>

            {nav.map(item => (
              <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: 16, letterSpacing: '0.06em', color: isActive(item.href) ? '#111' : '#555', borderBottom: '1px solid #f5f5f5' }}>
                {item.name}
              </Link>
            ))}

            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>Catégories</p>
              {categories.map(cat => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', padding: '10px 0', textDecoration: 'none', fontSize: 15, letterSpacing: '0.04em', color: '#555', borderBottom: '1px solid #f9f9f9' }}>
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Compte mobile */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              {isLoggedIn ? (
                <>
                  <p style={{ fontSize: 12, color: '#aaa', margin: '0 0 10px', letterSpacing: '0.05em' }}>Bonjour, {user?.name?.split(' ')[0]}</p>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '10px 0', textDecoration: 'none', fontSize: 14, color: '#444', borderBottom: '1px solid #f9f9f9' }}>
                    Mon Compte
                  </Link>
                  <Link href="/account/orders" onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '10px 0', textDecoration: 'none', fontSize: 14, color: '#444', borderBottom: '1px solid #f9f9f9' }}>
                    Mes Commandes
                  </Link>
                  <button onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', fontSize: 14, color: '#c0392b', fontFamily: 'inherit', textAlign: 'left' }}>
                    Déconnexion
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    style={{ flex: 1, padding: '11px', border: '1px solid #111', textAlign: 'center', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111' }}>
                    Connexion
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}
                    style={{ flex: 1, padding: '11px', background: '#111', textAlign: 'center', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MINI PANIER SIDEBAR */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
          <div onClick={() => setIsOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 380,
            background: '#fff', display: 'flex', flexDirection: 'column',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            animation: 'slideIn 0.3s ease',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 400, margin: 0 }}>
                Panier {totalQty > 0 && <span style={{ color: '#aaa', fontSize: 12 }}>({totalQty})</span>}
              </h2>
              <button onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontSize: 40, marginBottom: 16 }}>🛍️</p>
                  <p style={{ fontSize: 14, color: '#aaa' }}>Votre panier est vide</p>
                </div>
              ) : (
                items.map((item: CartItem, index: number) => (
                  <div key={item.id ?? index}
                    style={{ display: 'flex', gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ width: 64, height: 80, background: '#f8f8f8', flexShrink: 0, overflow: 'hidden' }}>
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, margin: '0 0 4px', lineHeight: 1.3 }}>{item.name}</p>
                      <p style={{ fontSize: 13, color: '#888', margin: '0 0 8px' }}>{Number(item.price).toFixed(2)} TND</p>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8', width: 'fit-content' }}>
                        <button onClick={() => updateQty(item.id, -1)}
                          style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                        <span style={{ width: 28, textAlign: 'center', fontSize: 13 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, +1)}
                          style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: 13, margin: 0 }}>{(Number(item.price) * item.qty).toFixed(2)} TND</p>
                      <button onClick={() => removeItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 18 }}>×</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (() => {
              const subtotal = items.reduce((s: number, i: { price: any; qty: number }) => s + Number(i.price) * i.qty, 0);
              return (
                <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: '#666' }}>Sous-total</span>
                    <span style={{ fontSize: 15 }}>{subtotal.toFixed(2)} TND</span>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes dropIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn  { display: flex !important; }
        }
      `}</style>
    </>
  );
}