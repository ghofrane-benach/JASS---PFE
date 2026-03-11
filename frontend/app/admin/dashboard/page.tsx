'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { link } from 'fs';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const STATUS_COLORS: Record<string, string> = {
  pending:   '#f59e0b', confirmed: '#4a9e6f',
  shipped:   '#1976d2', delivered: '#7b1fa2', cancelled: '#e55',
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmée',
  shipped: 'Expédiée',  delivered: 'Livrée', cancelled: 'Annulée',
};

export default function AdminDashboard() {
  const [orders,   setOrders]   = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users,    setUsers]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/orders`,   { headers: authHeaders() }).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/products`, { headers: authHeaders() }).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/users`,    { headers: authHeaders() }).then(r => r.ok ? r.json() : []),
    ]).then(([o, p, u]) => {
      setOrders(Array.isArray(o)   ? o   : o?.data   ?? []);
      setProducts(Array.isArray(p) ? p   : p?.data   ?? []);
      setUsers(Array.isArray(u)    ? u   : u?.data   ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const revenue      = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
  const pending      = orders.filter(o => o.status === 'pending').length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  const STATS = [
    { label: 'Commandes',  link: '/admin/orders',   value: orders.length,   sub: `${pending} en attente`,   color: '#111'    },
    { label: 'Revenu Total', value: `${revenue.toFixed(0)} TND`, sub: 'hors annulations', color: '#4a9e6f' },
    { label: 'Produits',  link: '/admin/products',   value: products.length, sub: 'dans la collection',      color: '#1976d2' },
    { label: 'Clients',  link: '/admin/users',   value: users.filter((u: any) => u.role !== 'admin').length, sub: 'comptes enregistrés', color: '#7b1fa2' },
  ];

  return (
    <div style={{ padding: '40px 48px' }}>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 300, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Vue d'ensemble</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
        {loading ? [1,2,3,4].map(i => (
          <div key={i} style={{ height: 100, background: '#eee', animation: 'pulse 1.5s ease-in-out infinite' }} />
        )) : STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '24px 20px', border: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: 28, fontWeight: 300, margin: '0 0 6px', color: s.color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{s.value}</p>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 4px', color: '#111', fontFamily: 'sans-serif' }}>{s.label}</p>
            <p style={{ fontSize: 11, color: '#aaa', margin: 0, fontFamily: 'sans-serif' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24 }}>

        {/* Commandes récentes */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontFamily: 'sans-serif', color: '#555' }}>Commandes récentes</h2>
            <Link href="/admin/orders" style={{ fontSize: 11, color: '#aaa', textDecoration: 'none' }}>Voir tout →</Link>
          </div>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#ccc', fontSize: 13 }}>Chargement...</div>
          ) : recentOrders.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#ccc', fontSize: 13 }}>Aucune commande</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['#', 'Client', 'Total', 'Statut', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#bbb', textAlign: 'left', fontWeight: 400, borderBottom: '1px solid #f5f5f5' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                    <td style={{ padding: '13px 20px', fontSize: 11, color: '#bbb', fontFamily: 'monospace' }}>#{o.id.slice(0,6).toUpperCase()}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <p style={{ fontSize: 13, margin: 0 }}>{o.firstName} {o.lastName}</p>
                      <p style={{ fontSize: 11, color: '#aaa', margin: '2px 0 0' }}>{o.email}</p>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 13 }}>{Number(o.total).toFixed(2)} TND</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ fontSize: 10, padding: '3px 8px', background: `${STATUS_COLORS[o.status]}15`, color: STATUS_COLORS[o.status], letterSpacing: '0.05em' }}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 11, color: '#aaa' }}>
                      {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Répartition statuts */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontFamily: 'sans-serif', color: '#555' }}>Par statut</h2>
          </div>
          <div style={{ padding: '20px 24px' }}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = orders.filter(o => o.status === key).length;
              const pct   = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#555' }}>{label}</span>
                    <span style={{ fontSize: 12, color: '#aaa' }}>{count}</span>
                  </div>
                  <div style={{ height: 3, background: '#f0f0f0', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLORS[key], borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}