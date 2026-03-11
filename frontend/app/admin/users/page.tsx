'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState<'all' | 'user' | 'admin'>('all');

  useEffect(() => {
    fetch(`${API_URL}/users`, { headers: headers() })
      .then(r => r.ok ? r.json() : [])
      .then(d => setUsers(Array.isArray(d) ? d : d?.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users
    .filter(u => filter === 'all' ? true : u.role === filter)
    .filter(u => {
      const name = u.name ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
      return name.toLowerCase().includes(search.toLowerCase()) ||
             u.email.toLowerCase().includes(search.toLowerCase());
    });

  const admins  = users.filter(u => u.role === 'admin').length;
  const clients = users.filter(u => u.role !== 'admin').length;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>Administration</p>
        <h1 style={{ fontSize: 28, fontWeight: 300, margin: 0 }}>Gestion des utilisateurs</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total',   value: users.length,  color: '#111'    },
          { label: 'Clients', value: clients,        color: '#1976d2' },
          { label: 'Admins',  value: admins,         color: '#7b1fa2' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #f0f0f0', padding: '20px' }}>
            <p style={{ fontSize: 24, fontWeight: 300, margin: '0 0 4px', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input
          type="text" placeholder="Rechercher par nom ou email..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 360, padding: '10px 16px', border: '1px solid #e8e8e8', background: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = '#111'}
          onBlur={e  => e.target.style.borderColor = '#e8e8e8'}
        />
        {(['all', 'user', 'admin'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '10px 16px', border: `1px solid ${filter === f ? '#111' : '#e8e8e8'}`,
              background: filter === f ? '#111' : '#fff', color: filter === f ? '#fff' : '#666',
              cursor: 'pointer', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
            {f === 'all' ? 'Tous' : f === 'user' ? 'Clients' : 'Admins'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Utilisateur', 'Email', 'Rôle', 'Inscrit le'].map(h => (
                <th key={h} style={{ padding: '12px 24px', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', textAlign: 'left', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '60px 0', textAlign: 'center', color: '#ccc', fontSize: 13 }}>Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '60px 0', textAlign: 'center', color: '#ccc', fontSize: 13 }}>Aucun utilisateur trouvé</td></tr>
            ) : filtered.map((u, i) => {
              const name = (u.name ?? ((u.firstName ?? '') + ' ' + (u.lastName ?? '')).trim()) || '—';
              const initials = name !== '—' ? name.split(' ').map(w => w?.[0] ?? '').join('').slice(0,2).toUpperCase() : '?';
              const isAdmin  = u.role === 'admin';
              return (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>

                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: isAdmin ? '#0a0a0a' : '#f0f0f0',
                        color: isAdmin ? '#fff' : '#888',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                      }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, margin: 0 }}>{name}</p>
                        <p style={{ fontSize: 10, color: '#bbb', margin: '2px 0 0' }}>{u.id.slice(0,8)}</p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 24px', fontSize: 13, color: '#555' }}>{u.email}</td>

                  <td style={{ padding: '14px 24px' }}>
                    <span style={{
                      fontSize: 10, letterSpacing: '0.1em', padding: '3px 10px',
                      background: isAdmin ? '#0a0a0a' : '#f5f5f5',
                      color: isAdmin ? '#fff' : '#888',
                    }}>
                      {isAdmin ? 'Admin' : 'Client'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 24px', fontSize: 12, color: '#aaa' }}>
                    {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}