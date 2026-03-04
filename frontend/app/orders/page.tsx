'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/component/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip?: string;
  payMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  pending:   { bg: '#fffbeb', color: '#b45309', label: 'En attente',  dot: '#f59e0b' },
  confirmed: { bg: '#f0fdf4', color: '#166534', label: 'Confirmée',   dot: '#4a9e6f' },
  shipped:   { bg: '#eff6ff', color: '#1e40af', label: 'Expédiée',    dot: '#1976d2' },
  delivered: { bg: '#faf5ff', color: '#6b21a8', label: 'Livrée',      dot: '#7b1fa2' },
  cancelled: { bg: '#fff1f2', color: '#9f1239', label: 'Annulée',     dot: '#e55'    },
};

const TIMELINE = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrdersPage() {
  const { user, isLoggedIn, mounted } = useAuth();
  const router = useRouter();

  const [orders,    setOrders]    = useState<Order[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<Order | null>(null);
  const [filter,    setFilter]    = useState<string>('all');

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) { router.push('/login'); return; }
    fetchOrders();
  }, [mounted, isLoggedIn]);

  async function fetchOrders() {
    if (!user?.email) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/orders/user/${encodeURIComponent(user.email)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (res.ok) setOrders(await res.json());
    } catch {}
    finally { setLoading(false); }
  }

  // Spinner
  if (!mounted || !isLoggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ width: 36, height: 36, border: '1px solid #111', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusStep = (status: string) => TIMELINE.indexOf(status);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fafafa', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: '#080808', color: '#fff',
        padding: '64px 6vw 52px', position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle background texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }} />
        <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>
            JASS — Mon compte
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, margin: '0 0 10px', letterSpacing: '0.02em' }}>
            Mes Commandes
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: '0.04em' }}>
            {user?.email}
          </p>

          {/* Stats rapides */}
          <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
            {[
              { label: 'Total commandes', value: orders.length },
              { label: 'En cours',        value: orders.filter(o => ['pending','confirmed','shipped'].includes(o.status)).length },
              { label: 'Livrées',         value: orders.filter(o => o.status === 'delivered').length },
              { label: 'Montant total',   value: `${orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0).toFixed(2)} TND` },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 22, fontWeight: 300, margin: '0 0 4px', color: '#fff' }}>{s.value}</p>
                <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BREADCRUMB ──────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #ebebeb', background: '#fff' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 6vw', display: 'flex', alignItems: 'center', gap: 8, height: 44 }}>
          <Link href="/" style={{ fontSize: 11, color: '#aaa', textDecoration: 'none', letterSpacing: '0.05em' }}>Accueil</Link>
          <span style={{ color: '#ddd', fontSize: 11 }}>›</span>
          <Link href="/account" style={{ fontSize: 11, color: '#aaa', textDecoration: 'none', letterSpacing: '0.05em' }}>Mon compte</Link>
          <span style={{ color: '#ddd', fontSize: 11 }}>›</span>
          <span style={{ fontSize: 11, color: '#111', letterSpacing: '0.05em' }}>Mes commandes</span>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 6vw 80px', display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 24, alignItems: 'start' }}>

        {/* ── LISTE DES COMMANDES ─────────────────────────── */}
        <div>

          {/* Filtres */}
          <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 0, marginBottom: 24, overflowX: 'auto' }}>
            {[
              ['all',       'Toutes'],
              ['pending',   'En attente'],
              ['confirmed', 'Confirmées'],
              ['shipped',   'Expédiées'],
              ['delivered', 'Livrées'],
              ['cancelled', 'Annulées'],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{
                  padding: '14px 18px', border: 'none', background: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 11,
                  letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  color: filter === key ? '#111' : '#aaa',
                  borderBottom: filter === key ? '2px solid #111' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                {label}
                {key !== 'all' && orders.filter(o => o.status === key).length > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: 9, background: filter === key ? '#111' : '#eee',
                    color: filter === key ? '#fff' : '#888', padding: '1px 5px', borderRadius: 10,
                  }}>
                    {orders.filter(o => o.status === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* États */}
          {loading ? (
            <div style={{ background: '#fff', padding: '80px 0', textAlign: 'center', color: '#bbb' }}>
              <div style={{ width: 32, height: 32, border: '1px solid #ddd', borderTop: '1px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 13, letterSpacing: '0.1em' }}>Chargement de vos commandes...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#fff', padding: '100px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 52, marginBottom: 20 }}>🛍️</p>
              <h3 style={{ fontSize: 20, fontWeight: 300, color: '#333', marginBottom: 8 }}>
                {filter === 'all' ? 'Aucune commande pour l\'instant' : `Aucune commande "${STATUS_CONFIG[filter]?.label ?? filter}"`}
              </h3>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 36 }}>
                {filter === 'all' ? 'Vos commandes apparaîtront ici après votre premier achat' : 'Essayez un autre filtre'}
              </p>
              {filter === 'all' && (
                <Link href="/products" style={{
                  display: 'inline-block', padding: '13px 44px',
                  background: '#111', color: '#fff', textDecoration: 'none',
                  fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                }}>
                  Découvrir la collection
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((order, idx) => {
                const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const isSelected = selected?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelected(isSelected ? null : order)}
                    style={{
                      background: '#fff',
                      border: `1px solid ${isSelected ? '#111' : '#f0f0f0'}`,
                      cursor: 'pointer', transition: 'all 0.2s',
                      animation: `fadeUp 0.3s ease ${idx * 0.05}s both`,
                    }}
                    onMouseOver={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#ccc'; }}
                    onMouseOut={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0'; }}
                  >
                    {/* Header commande */}
                    <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f8f8f8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* Status dot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                          <span style={{ padding: '3px 10px', background: st.bg, color: st.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            {st.label}
                          </span>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: '#aaa', margin: '0 0 2px', letterSpacing: '0.08em' }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 16, fontWeight: 300, margin: '0 0 2px' }}>{Number(order.total).toFixed(2)} TND</p>
                          <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                        </div>
                        <span style={{ color: '#ccc', fontSize: 18, transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
                      </div>
                    </div>

                    {/* Aperçu articles */}
                    <div style={{ padding: '14px 24px', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {order.items.slice(0, 4).map(item => (
                          <div key={item.id} style={{ width: 44, height: 54, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                            <img src={item.image || '/images/placeholder.jpg'} alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {item.qty > 1 && (
                              <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 8, padding: '1px 3px' }}>×{item.qty}</div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div style={{ width: 44, height: 54, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#888' }}>
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div style={{ marginLeft: 8, flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, color: '#666', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.items.map(i => i.name).join(', ')}
                        </p>
                        <p style={{ fontSize: 11, color: '#aaa', margin: '3px 0 0' }}>
                          {order.payMethod === 'cash' ? '💵 Paiement à la livraison' : '💳 Carte bancaire'}
                          {' · '}{order.city}
                        </p>
                      </div>
                    </div>

                    {/* Barre de progression — seulement si pas annulé */}
                    {order.status !== 'cancelled' && (
                      <div style={{ padding: '0 24px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          {TIMELINE.map((step, i) => {
                            const done = statusStep(order.status) >= i;
                            const current = statusStep(order.status) === i;
                            return (
                              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < TIMELINE.length - 1 ? 1 : 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  <div style={{
                                    width: current ? 10 : 7, height: current ? 10 : 7,
                                    borderRadius: '50%',
                                    background: done ? '#111' : '#e8e8e8',
                                    border: current ? '2px solid #111' : 'none',
                                    transition: 'all 0.2s',
                                    flexShrink: 0,
                                  }} />
                                  <span style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: done ? '#555' : '#ccc', whiteSpace: 'nowrap' }}>
                                    {STATUS_CONFIG[step]?.label}
                                  </span>
                                </div>
                                {i < TIMELINE.length - 1 && (
                                  <div style={{ flex: 1, height: 1, background: statusStep(order.status) > i ? '#111' : '#e8e8e8', margin: '0 4px 14px', transition: 'background 0.3s' }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── DÉTAIL COMMANDE (sidebar) ──────────────────── */}
        {selected && (() => {
          const st = STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.pending;
          return (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', position: 'sticky', top: 24, animation: 'slideInRight 0.25s ease' }}>

              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', margin: '0 0 4px' }}>Commande</p>
                  <h3 style={{ fontSize: 14, fontWeight: 400, margin: 0, letterSpacing: '0.08em' }}>
                    #{selected.id.slice(0, 8).toUpperCase()}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#bbb', lineHeight: 1, padding: 4 }}>
                  ×
                </button>
              </div>

              <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                {/* Statut + date */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8f8f8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot }} />
                    <span style={{ padding: '4px 12px', background: st.bg, color: st.color, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      {st.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
                    Passée le {new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Articles */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8f8f8' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>Articles</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selected.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 44, height: 54, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={item.image || '/images/placeholder.jpg'} alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, margin: '0 0 3px', lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>× {item.qty} — {Number(item.price).toFixed(2)} TND</p>
                        </div>
                        <p style={{ fontSize: 13, margin: 0, flexShrink: 0 }}>
                          {(Number(item.price) * item.qty).toFixed(2)} TND
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Livraison */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8f8f8' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>Livraison</p>
                  {[
                    ['Destinataire', `${selected.firstName} ${selected.lastName}`],
                    ['Adresse',      `${selected.address}`],
                    ['Ville',        `${selected.city}${selected.zip ? ' ' + selected.zip : ''}`],
                    ['Téléphone',    selected.phone],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: '#aaa' }}>{label}</span>
                      <span style={{ fontSize: 12, color: '#333', textAlign: 'right', maxWidth: 200 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Récapitulatif */}
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>Récapitulatif</p>
                  {[
                    { label: 'Sous-total', value: `${Number(selected.subtotal).toFixed(2)} TND`, bold: false },
                    { label: 'Livraison',  value: `${Number(selected.shipping).toFixed(2)} TND`,  bold: false },
                    { label: 'Total',      value: `${Number(selected.total).toFixed(2)} TND`,     bold: true  },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', marginBottom: 10,
                      paddingTop: row.bold ? 12 : 0, borderTop: row.bold ? '1px solid #f0f0f0' : 'none',
                    }}>
                      <span style={{ fontSize: row.bold ? 14 : 12, color: row.bold ? '#111' : '#888' }}>{row.label}</span>
                      <span style={{ fontSize: row.bold ? 16 : 13, fontWeight: row.bold ? 400 : 300 }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 6, padding: '10px 14px', background: '#f9f9f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{selected.payMethod === 'cash' ? '💵' : '💳'}</span>
                    <span style={{ fontSize: 12, color: '#666' }}>
                      {selected.payMethod === 'cash' ? 'Paiement à la livraison' : 'Carte bancaire'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Back button */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 6vw 48px' }}>
        <Link href="/account" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#888', textDecoration: 'none', transition: 'color 0.2s',
        }}
          onMouseOver={e => (e.currentTarget.style.color = '#111')}
          onMouseOut={e  => (e.currentTarget.style.color = '#888')}>
          ← Retour au compte
        </Link>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 400px'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}