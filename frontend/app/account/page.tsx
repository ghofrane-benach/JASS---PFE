'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/component/AuthProvider';
import { useCart } from '@/context/CartContext';
import { link } from 'fs';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface OrderItem { id: string; name: string; price: number; qty: number; image: string; }
interface Order {
  id: string; firstName: string; lastName: string; email: string;
  phone: string; address: string; city: string; zip?: string;
  payMethod: string; subtotal: number; shipping: number; total: number;
  status: string; items: OrderItem[]; createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#fff8e1', color: '#f59e0b', label: 'En attente'  },
  confirmed: { bg: '#e8f5e9', color: '#4a9e6f', label: 'Confirmée'   },
  shipped:   { bg: '#e3f2fd', color: '#1976d2', label: 'Expédiée'    },
  delivered: { bg: '#f3e5f5', color: '#7b1fa2', label: 'Livrée'      },
  cancelled: { bg: '#ffebee', color: '#e55',    label: 'Annulée'     },
};

export default function AccountPage() {
  const { user, isLoggedIn, mounted, logout } = useAuth();
  const { items, totalQty }                   = useCart();
  const router = useRouter();

  const [activeTab,  setActiveTab]  = useState<'profile' | 'orders' | 'settings'>('profile');
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [ordersLoad, setOrdersLoad] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) router.push('/login');
  }, [mounted, isLoggedIn]);

  // ── Charger les commandes quand on ouvre l'onglet ──────────────────
  useEffect(() => {
    if (activeTab === 'orders' && user?.email && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab, user]);

  // ── Charger le nombre de commandes au montage pour le compteur ─────
  useEffect(() => {
    if (mounted && isLoggedIn && user?.email) {
      fetchOrders();
    }
  }, [mounted, isLoggedIn]);

  async function fetchOrders() {
    if (!user?.email) return;
    setOrdersLoad(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/user/${encodeURIComponent(user.email)}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) setOrders(await res.json());
    } catch {}
    finally { setOrdersLoad(false); }
  }

  if (!mounted || !isLoggedIn || !user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ width: 36, height: 36, border: '1px solid #111', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const cartTotal = items.reduce((s: number, i: { price: any; qty: number }) => s + Number(i.price) * i.qty, 0);

  const TABS = [
    { key: 'profile',  label: 'Mon profil',    icon: '👤' },
    { key: 'orders',   label: 'Mes commandes',link : '/account/orders', icon: '📦' },
    { key: 'settings', label: 'Paramètres',     icon: '⚙️' },
  ] as const;

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      <section style={{ background: '#080808', color: '#fff', padding: '60px 6vw' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>JASS</p>
          <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300, margin: '0 0 8px' }}>
            Bonjour, {user.name?.split(' ')[0] ?? 'Client'} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{user.email}</p>
        </div>
      </section>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '48px 6vw', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>

        <aside>
          <nav>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  width: '100%', textAlign: 'left', padding: '13px 16px',
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                  background: activeTab === tab.key ? '#f5f5f5' : 'transparent',
                  color: activeTab === tab.key ? '#111' : '#888',
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                  borderLeft: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <button onClick={logout}
                style={{ width: '100%', textAlign: 'left', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#e55', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span>🚪</span> Se déconnecter
              </button>
            </div>
          </nav>
        </aside>

        <main>

          {/* ── PROFIL ─────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 300, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                Informations personnelles
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                {/* ✅ Compteur commandes réel */}
                <Link href="/orders" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f9f9f9', padding: '24px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: 26, fontWeight: 300, margin: '0 0 6px' }}>{orders.length}</p>
                    <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>Commandes</p>
                  </div>
                </Link>
               
                <Link href="/cart" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f9f9f9', padding: '24px 20px', textAlign: 'center', cursor: 'pointer' }}>
                    <p style={{ fontSize: 26, fontWeight: 300, margin: '0 0 6px' }}>{totalQty}</p>
                    <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>Articles panier →</p>
                  </div>
                </Link>
                <div style={{ background: '#f9f9f9', padding: '24px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 26, fontWeight: 300, margin: '0 0 6px' }}>{cartTotal.toFixed(2)} TND</p>
                  <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>Total panier</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px', maxWidth: 560 }}>
                {[
                  { label: 'Nom complet',   value: user.name  ?? '—' },
                  { label: 'Email',         value: user.email ?? '—' },
                  { label: 'Connexion',     value: user.provider === 'google' ? 'Google' : 'JASS' },
                  { label: 'Membre depuis', value: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) },
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

              {ordersLoad ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>Chargement...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ fontSize: 56, marginBottom: 20 }}>📦</p>
                  <h3 style={{ fontSize: 18, fontWeight: 300, color: '#555', marginBottom: 8 }}>Aucune commande pour l'instant</h3>
                  <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32 }}>Vos commandes apparaîtront ici après votre premier achat</p>
                  <Link href="/products" style={{ display: 'inline-block', padding: '14px 44px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                    Découvrir la collection
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {orders.map(order => {
                    const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
                    return (
                      <div key={order.id} style={{ border: '1px solid #f0f0f0', padding: '20px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                          <div>
                            <p style={{ fontSize: 11, color: '#aaa', margin: '0 0 4px', letterSpacing: '0.1em' }}>
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <span style={{ padding: '4px 12px', background: st.bg, color: st.color, fontSize: 11, letterSpacing: '0.1em' }}>
                            {st.label}
                          </span>
                        </div>

                        {/* Articles */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f9f9f9', padding: '8px 12px' }}>
                              <div style={{ width: 36, height: 44, overflow: 'hidden', flexShrink: 0 }}>
                                <img src={item.image || '/images/placeholder.jpg'} alt={item.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <p style={{ fontSize: 12, margin: '0 0 2px' }}>{item.name}</p>
                                <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>× {item.qty} — {Number(item.price).toFixed(2)} TND</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
                          <span style={{ fontSize: 12, color: '#888' }}>
                            {order.payMethod === 'cash' ? '💵 Paiement à la livraison' : '💳 Carte bancaire'}
                          </span>
                          <span style={{ fontSize: 16, fontWeight: 300 }}>
                            {Number(order.total).toFixed(2)} TND
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  { label: 'Prénom',               val: user.name?.split(' ')[0] ?? '', type: 'text'     },
                  { label: 'Nom',                  val: user.name?.split(' ')[1] ?? '', type: 'text'     },
                  { label: 'Email',                val: user.email ?? '',               type: 'email'    },
                  { label: 'Nouveau mot de passe', val: '',                             type: 'password' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} defaultValue={f.val}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #e8e8e8', background: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
                      onFocus={e => e.target.style.borderColor = '#111'}
                      onBlur={e  => e.target.style.borderColor = '#e8e8e8'}
                    />
                  </div>
                ))}
                <button style={{ padding: '14px 44px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'inherit', alignSelf: 'flex-start' }}>
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
          div[style*="gridTemplateColumns: '220px 1fr'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}