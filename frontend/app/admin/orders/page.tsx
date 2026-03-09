'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface OrderItem { id: string; name: string; price: number; qty: number; image: string; }
interface Order {
  zip: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  payMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#fff8e1', color: '#f59e0b', label: 'En attente'  },
  confirmed: { bg: '#e8f5e9', color: '#4a9e6f', label: 'Confirmée'   },
  shipped:   { bg: '#e3f2fd', color: '#1976d2', label: 'Expédiée'    },
  delivered: { bg: '#f3e5f5', color: '#7b1fa2', label: 'Livrée'      },
  cancelled: { bg: '#ffebee', color: '#e55',    label: 'Annulée'     },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter,   setFilter]   = useState('all');

  // ✅ GUARD FRONTEND — redirige vers /admin/login si pas admin
  useEffect(() => {
    const token   = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.replace('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user?.role !== 'admin') {
        router.replace('/admin/login');
        return;
      }
    } catch {
      router.replace('/admin/login');
      return;
    }

    // ✅ Token JWT inclus dans le header Authorization
    const token2 = localStorage.getItem('token');
    fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token2}` },   // ✅ AJOUTÉ
    })
      .then(r => {
        if (r.status === 401 || r.status === 403) {
          router.replace('/admin/login');
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  // ✅ Token JWT dans updateStatus aussi
  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,               // ✅ AJOUTÉ
      },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  }

  const filtered     = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
  const font         = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

  return (
    <div style={{ ...font, background: '#f8f8f8', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#080808', color: '#fff', padding: '24px 6vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>JASS — Admin</p>
          <h1 style={{ fontSize: 22, fontWeight: 300, margin: 0 }}>Gestion des commandes</h1>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ← Retour au site
          </a>
          {/* ✅ Bouton déconnexion admin */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.replace('/admin/login');
            }}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 14px', fontFamily: 'inherit' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ padding: '24px 6vw', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Total commandes', value: orders.length },
          { label: 'En attente',  value: orders.filter(o => o.status === 'pending').length,   color: '#f59e0b' },
          { label: 'Confirmées',  value: orders.filter(o => o.status === 'confirmed').length,  color: '#4a9e6f' },
          { label: 'Livrées',     value: orders.filter(o => o.status === 'delivered').length,  color: '#7b1fa2' },
          { label: 'Revenu total', value: `${totalRevenue.toFixed(2)} TND`,                    color: '#111'    },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '20px 16px', textAlign: 'center', borderRadius: 2 }}>
            <p style={{ fontSize: 22, fontWeight: 300, color: s.color ?? '#111', margin: '0 0 6px' }}>{s.value}</p>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 6vw 48px', display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 16 }}>

        {/* LISTE */}
        <div style={{ background: '#fff' }}>

          {/* Filtres */}
          <div style={{ padding: '0 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 0 }}>
            {[['all', 'Toutes'], ...Object.entries(STATUS_COLORS).map(([k, v]) => [k, v.label])].map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.05em', color: filter === key ? '#111' : '#aaa', borderBottom: filter === key ? '2px solid #111' : '2px solid transparent' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
              <p style={{ color: '#aaa', fontSize: 14 }}>Aucune commande</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', borderBottom: '1px solid #f0f0f0' }}>
                  {['#', 'Client', 'Articles', 'Total', 'Paiement', 'Statut', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
                  return (
                    <tr key={order.id}
                      onClick={() => setSelected(selected?.id === order.id ? null : order)}
                      style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: selected?.id === order.id ? '#f9f9f9' : 'transparent', transition: 'background 0.15s' }}
                      onMouseOver={e => { if (selected?.id !== order.id) (e.currentTarget as HTMLElement).style.background = '#fafafa'; }}
                      onMouseOut={e => { if (selected?.id !== order.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 11, color: '#aaa' }}>{order.id.slice(0, 8)}...</td>
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ fontSize: 14, margin: '0 0 2px' }}>{order.firstName} {order.lastName}</p>
                        <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>{order.email}</p>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>{order.items.length} article{order.items.length > 1 ? 's' : ''}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 400 }}>{Number(order.total).toFixed(2)} TND</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#555' }}>{order.payMethod === 'cash' ? '💵 Livraison' : '💳 Carte'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', background: st.bg, color: st.color, fontSize: 11, letterSpacing: '0.1em' }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#aaa' }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#888' }}>→</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* DÉTAIL COMMANDE */}
        {selected && (
          <div style={{ background: '#fff', height: 'fit-content', position: 'sticky', top: 16 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 14, fontWeight: 400, letterSpacing: '0.1em', margin: 0 }}>Détails #{selected.id.slice(0, 8)}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#aaa' }}>×</button>
            </div>

            <div style={{ padding: '20px 24px' }}>

              {/* Statut */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>Statut</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(STATUS_COLORS).map(([key, val]) => (
                    <button key={key} onClick={() => updateStatus(selected.id, key)}
                      style={{ padding: '6px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', border: `1px solid ${selected.status === key ? val.color : '#e8e8e8'}`, background: selected.status === key ? val.bg : '#fff', color: selected.status === key ? val.color : '#888' }}>
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f5f5f5' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12 }}>Client</p>
                {[
                  ['Nom',       `${selected.firstName} ${selected.lastName}`],
                  ['Email',     selected.email],
                  ['Téléphone', selected.phone],
                  ['Adresse',   `${selected.address}, ${selected.city} ${selected.zip ?? ''}`],
                  ['Paiement',  selected.payMethod === 'cash' ? 'À la livraison' : 'Carte bancaire'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#aaa' }}>{label}</span>
                    <span style={{ fontSize: 13, color: '#333', textAlign: 'right', maxWidth: 220 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Articles */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f5f5f5' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12 }}>Articles</p>
                {selected.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 40, height: 48, background: '#f8f8f8', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, margin: '0 0 2px' }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>× {item.qty} — {Number(item.price).toFixed(2)} TND</p>
                    </div>
                    <p style={{ fontSize: 13, margin: 0 }}>{(Number(item.price) * item.qty).toFixed(2)} TND</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              {[
                ['Sous-total', `${Number(selected.subtotal).toFixed(2)} TND`],
                ['Livraison',  `${Number(selected.shipping).toFixed(2)} TND`],
                ['Total',      `${Number(selected.total).toFixed(2)} TND`],
              ].map(([label, value], i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: i === 2 ? 400 : 300, fontSize: i === 2 ? 16 : 13, paddingTop: i === 2 ? 12 : 0, borderTop: i === 2 ? '1px solid #f0f0f0' : 'none' }}>
                  <span style={{ color: i === 2 ? '#111' : '#888' }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');`}</style>
    </div>
  );
}