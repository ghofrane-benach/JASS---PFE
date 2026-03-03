'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem { id: string; name: string; price: number; image: string; qty: number; }

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [localUser, setLocalUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setLocalUser(JSON.parse(stored));
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    setCartItems(cart);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' && !localUser) router.push('/login');
  }, [status, localUser]);

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ width: 36, height: 36, border: '1px solid #111', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const user = session?.user ?? localUser;
  if (!user) return null;

  const cartTotal = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const totalQty  = cartItems.reduce((s, i) => s + i.qty, 0);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    signOut({ callbackUrl: '/' });
  }

  const TABS = [
    { key: 'profile',  label: 'Mon profil',   icon: '👤' },
    { key: 'orders',   label: 'Mes commandes', icon: '📦' },
    { key: 'settings', label: 'Paramètres',    icon: '⚙️' },
  ] as const;

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#080808', color: '#fff', padding: '60px 6vw' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              JASS
            </p>
            <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300, margin: '0 0 8px' }}>
              Bonjour, {user.name?.split(' ')[0] ?? 'Client'} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{user.email}</p>
          </div>
          {user.image && (
            <img src={user.image} alt={user.name}
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '48px 6vw', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>

        {/* SIDEBAR */}
        <aside>
          <nav>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  width: '100%', textAlign: 'left', padding: '13px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, letterSpacing: '0.04em',
                  background: activeTab === tab.key ? '#f5f5f5' : 'transparent',
                  color: activeTab === tab.key ? '#111' : '#888',
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                  borderLeft: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <button onClick={handleLogout}
                style={{
                  width: '100%', textAlign: 'left', padding: '13px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: '#e55',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <span>🚪</span> Se déconnecter
              </button>
            </div>
          </nav>
        </aside>

        {/* CONTENT */}
        <main>

          {/* ── MON PROFIL ─────────────────────────────── */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 300, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                Informations personnelles
              </h2>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                {[
                  { label: 'Commandes',    value: '0'                              },
                  { label: 'Articles panier', value: `${totalQty}` , link: '/cart' }, 
                  { label: 'Total panier', value: `${cartTotal.toFixed(2)} TND`   },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f9f9f9', padding: '24px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: 26, fontWeight: 300, margin: '0 0 6px' }}>{s.value}</p>
                    <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Infos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px', maxWidth: 560 }}>
                {[
                  { label: 'Nom complet', value: user.name  ?? '—' },
                  { label: 'Email',       value: user.email ?? '—' },
                  { label: 'Connexion',   value: (user as any).provider === 'google' ? 'Google' : 'JASS' },
                  { label: 'Membre depuis', value: 'Mars 2026' },
                ].map(f => (
                  <div key={f.label} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>{f.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 300, margin: 0 }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MES COMMANDES ──────────────────────────── */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 300, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                Mes commandes
              </h2>
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontSize: 56, marginBottom: 20 }}>📦</p>
                <h3 style={{ fontSize: 18, fontWeight: 300, color: '#555', marginBottom: 8 }}>
                  Aucune commande pour l'instant
                </h3>
                <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32 }}>
                  Vos commandes apparaîtront ici après votre premier achat
                </p>
                <Link href="/products" style={{
                  display: 'inline-block', padding: '14px 44px',
                  background: '#111', color: '#fff', textDecoration: 'none',
                  fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                }}>
                  Découvrir la collection
                </Link>
              </div>
            </div>
          )}

          {/* ── PARAMÈTRES ─────────────────────────────── */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 300, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                Paramètres du compte
              </h2>
              <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Prénom',           val: user.name?.split(' ')[0] ?? '', type: 'text'     },
                  { label: 'Nom',              val: user.name?.split(' ')[1] ?? '', type: 'text'     },
                  { label: 'Email',            val: user.email ?? '',               type: 'email'    },
                  { label: 'Nouveau mot de passe', val: '',                         type: 'password' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
                      {f.label}
                    </label>
                    <input type={f.type} defaultValue={f.val}
                      style={{
                        width: '100%', padding: '12px 16px',
                        border: '1px solid #e8e8e8', background: '#fff',
                        fontSize: 14, fontFamily: 'inherit', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#111'}
                      onBlur={e  => e.target.style.borderColor = '#e8e8e8'}
                    />
                  </div>
                ))}
                <button style={{
                  padding: '14px 44px', background: '#111', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 11,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  fontFamily: 'inherit', alignSelf: 'flex-start',
                }}>
                  Sauvegarder
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '220px 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}