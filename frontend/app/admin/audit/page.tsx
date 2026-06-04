'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetId: string;
  targetType: string;
  details: Record<string, any>;
  createdAt: string;
}

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  ORDER_STATUS_CHANGED:   { bg: '#e3f2fd', color: '#1976d2' },
  PRODUCT_CREATED:        { bg: '#e8f5e9', color: '#4a9e6f' },
  PRODUCT_UPDATED:        { bg: '#fff8e1', color: '#f59e0b' },
  PRODUCT_DELETED:        { bg: '#ffebee', color: '#e55'    },
  PRODUCT_PUBLISHED:      { bg: '#e8f5e9', color: '#4a9e6f' },
  PRODUCT_UNPUBLISHED:    { bg: '#fff8e1', color: '#f59e0b' },
  PRODUCT_OUT_OF_STOCK:   { bg: '#ffebee', color: '#e55'    },
  PRODUCT_STOCK_UPDATED:  { bg: '#f3e5f5', color: '#7b1fa2' },
};

const ACTION_LABELS: Record<string, string> = {
  ORDER_STATUS_CHANGED:   'Statut commande modifié',
  PRODUCT_CREATED:        'Produit créé',
  PRODUCT_UPDATED:        'Produit modifié',
  PRODUCT_DELETED:        'Produit supprimé',
  PRODUCT_PUBLISHED:      'Produit publié',
  PRODUCT_UNPUBLISHED:    'Produit dépublié',
  PRODUCT_OUT_OF_STOCK:   'Rupture de stock',
  PRODUCT_STOCK_UPDATED:  'Stock mis à jour',
};

export default function AuditPage() {
  const [logs,    setLogs]    = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch(`${API_URL}/audit`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? logs.filter(l => l.action.includes(filter) || l.targetType === filter)
    : logs;

  return (
    <div style={{ padding: '48px 6vw', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>Administration</p>
        <h1 style={{ fontSize: 28, fontWeight: 300, margin: '0 0 8px' }}>Journal d'audit</h1>
        <p style={{ fontSize: 13, color: '#888' }}>Historique des actions critiques des administrateurs</p>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { label: 'Tous',      val: ''        },
          { label: 'Commandes', val: 'order'   },
          { label: 'Produits',  val: 'product' },
        ].map(f => (
          <button key={f.val} onClick={() => setFilter(f.val)}
            style={{
              padding: '8px 20px', border: '1px solid #e8e8e8',
              background: filter === f.val ? '#111' : '#fff',
              color: filter === f.val ? '#fff' : '#666',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
          <p style={{ color: '#aaa', fontSize: 14 }}>Aucune action enregistrée</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(log => {
            const st = ACTION_COLORS[log.action] ?? { bg: '#f5f5f5', color: '#666' };
            return (
              <div key={log.id} style={{ background: '#fff', border: '1px solid #f0f0f0', padding: '16px 24px', display: 'grid', gridTemplateColumns: '140px 1fr 180px 160px', gap: 16, alignItems: 'center' }}>

                {/* Action */}
                <span style={{ padding: '4px 10px', background: st.bg, color: st.color, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {ACTION_LABELS[log.action] ?? log.action}
                </span>

                {/* Détails */}
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: '#111' }}>
                    {log.targetType === 'order'   && `Commande #${log.targetId?.slice(0, 8).toUpperCase()}`}
                    {log.targetType === 'product' && `Produit #${log.targetId?.slice(0, 8).toUpperCase()}`}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#aaa' }}>
                    {JSON.stringify(log.details)}
                  </p>
                </div>

                {/* Admin */}
                <p style={{ margin: 0, fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.adminEmail ?? '—'}
                </p>

                {/* Date */}
                <p style={{ margin: 0, fontSize: 11, color: '#aaa', textAlign: 'right' }}>
                  {new Date(log.createdAt).toLocaleString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}