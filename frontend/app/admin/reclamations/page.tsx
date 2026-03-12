'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const REASON_LABELS: Record<string, string> = {
  customer_service: 'Service Client',
  product_inquiry:  'Demande produit',
  billing_issue:    'Facturation',
  general_feedback: 'Retour général',
  other:            'Autre',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:      { label: 'Nouveau',  color: '#c0392b', bg: '#fff5f5' },
  read:     { label: 'Lu',       color: '#d97706', bg: '#fffbeb' },
  replied:  { label: 'Répondu',  color: '#4a9e6f', bg: '#f0faf4' },
  archived: { label: 'Archivé',  color: '#999',    bg: '#f5f5f5' },
};

interface Contact {
  id: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

const btn = (color: string, bg: string, border: string): React.CSSProperties => ({
  padding: '5px 12px', background: bg, color, border: `1px solid ${border}`,
  borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
  letterSpacing: '0.05em', whiteSpace: 'nowrap' as const,
});

export default function AdminReclamationsPage() {
  const [contacts,      setContacts]      = useState<Contact[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [selected,      setSelected]      = useState<Contact | null>(null);
  const [filter,        setFilter]        = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedIds,   setSelectedIds]   = useState<Set<string>>(new Set());

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setContacts(await res.json());
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchContacts(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`${API_URL}/contacts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null);
  }

  async function deleteOne(id: string) {
    await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` },
    });
    setContacts(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteConfirm(null);
    setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  }

  async function bulkDelete() {
    await Promise.all([...selectedIds].map(id => deleteOne(id)));
    setSelectedIds(new Set());
    setDeleteConfirm(null);
  }

  async function bulkArchive() {
    await Promise.all([...selectedIds].map(id => updateStatus(id, 'archived')));
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.status === filter);
  const counts = {
    all:      contacts.length,
    new:      contacts.filter(c => c.status === 'new').length,
    read:     contacts.filter(c => c.status === 'read').length,
    replied:  contacts.filter(c => c.status === 'replied').length,
    archived: contacts.filter(c => c.status === 'archived').length,
  };

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111', margin: '0 0 6px' }}>Réclamations</h1>
        <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Messages reçus depuis le formulaire de contact</p>
      </div>

      {/* FILTRES */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelectedIds(new Set()); }}
            style={{
              padding: '8px 18px', border: '1px solid',
              borderColor: filter === f ? '#111' : '#e0e0e0',
              background:  filter === f ? '#111' : '#fff',
              color:       filter === f ? '#fff' : '#555',
              fontSize: 12, cursor: 'pointer', borderRadius: 4,
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
            {f === 'all' ? 'Tous' : f === 'new' ? 'Nouveaux' : f === 'read' ? 'Lus' : f === 'replied' ? 'Répondus' : 'Archivés'}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* ACTIONS EN MASSE */}
      {selectedIds.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 16px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6 }}>
          <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
          </span>
          <button onClick={bulkArchive} style={btn('#555', '#f5f5f5', '#e0e0e0')}>Archiver</button>
          <button onClick={() => setDeleteConfirm('bulk')} style={btn('#c0392b', '#fff5f5', '#fca5a5')}>Supprimer</button>
          <button onClick={() => setSelectedIds(new Set())}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#aaa', fontSize: 18, cursor: 'pointer', padding: 0 }}>×</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 24 }}>

        {/* LISTE */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Chargement…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Aucun message</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                  <th style={{ padding: '12px 16px', width: 40 }}>
                    <input type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={() => selectedIds.size === filtered.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(filtered.map(c => c.id)))}
                      style={{ cursor: 'pointer', accentColor: '#111' }}
                    />
                  </th>
                  {['Expéditeur', 'Sujet', 'Date', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aaa', fontWeight: 500, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const st   = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.read;
                  const isSel = selectedIds.has(c.id);
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f5f5f5', background: isSel ? '#f0f4ff' : selected?.id === c.id ? '#f8f8f8' : '#fff', opacity: c.status === 'archived' ? 0.6 : 1 }}>

                      <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isSel} onChange={() => toggleSelect(c.id)} style={{ cursor: 'pointer', accentColor: '#111' }} />
                      </td>

                      <td style={{ padding: '14px 16px', cursor: 'pointer' }}
                        onClick={() => { setSelected(c); if (c.status === 'new') updateStatus(c.id, 'read'); }}>
                        <p style={{ fontSize: 14, fontWeight: c.status === 'new' ? 600 : 400, color: '#111', margin: '0 0 2px' }}>{c.name || '—'}</p>
                        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{c.email}</p>
                      </td>

                      <td style={{ padding: '14px 16px', cursor: 'pointer' }}
                        onClick={() => { setSelected(c); if (c.status === 'new') updateStatus(c.id, 'read'); }}>
                        <p style={{ fontSize: 13, color: '#555', margin: '0 0 2px' }}>{REASON_LABELS[c.reason] ?? c.reason}</p>
                        <p style={{ fontSize: 12, color: '#aaa', margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</p>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                        {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, color: st.color, background: st.bg }}>{st.label}</span>
                      </td>

                      <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {c.status !== 'replied' && c.status !== 'archived' && (
                            <button onClick={() => updateStatus(c.id, 'replied')} style={btn('#4a9e6f', '#f0faf4', '#b7dfc8')}>Répondu</button>
                          )}
                          {c.status !== 'archived' ? (
                            <button onClick={() => updateStatus(c.id, 'archived')} style={btn('#555', '#f5f5f5', '#e0e0e0')}>Archiver</button>
                          ) : (
                            <button onClick={() => updateStatus(c.id, 'new')} style={btn('#555', '#f5f5f5', '#e0e0e0')}>Restaurer</button>
                          )}
                          <button onClick={() => setDeleteConfirm(c.id)} style={btn('#c0392b', '#fff5f5', '#fca5a5')}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* PANNEAU DÉTAIL */}
        {selected && (
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 28, position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Détail du message</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa', padding: 0 }}>×</button>
            </div>

            <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '16px 20px', marginBottom: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>{selected.name || 'Anonyme'}</p>
              <p style={{ fontSize: 13, color: '#555', margin: '0 0 8px' }}>{selected.email}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#888', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4, padding: '3px 8px' }}>
                  {REASON_LABELS[selected.reason] ?? selected.reason}
                </span>
                <span style={{ fontSize: 12, color: '#888' }}>
                  {new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: 10 }}>Message</p>
              <p style={{ fontSize: 14, color: '#333', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f0f0f0', paddingTop: 20, flexWrap: 'wrap' }}>
              <a href={`mailto:${selected.email}?subject=Réponse à votre message JASS`}
                style={{ flex: 1, padding: '11px', background: '#111', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 4, fontFamily: 'inherit', minWidth: 100 }}>
                Répondre par email
              </a>
              {selected.status !== 'archived' ? (
                <button onClick={() => updateStatus(selected.id, 'archived')} style={{ ...btn('#555', '#f5f5f5', '#e0e0e0'), padding: '11px 14px' }}>Archiver</button>
              ) : (
                <button onClick={() => updateStatus(selected.id, 'new')} style={{ ...btn('#555', '#f5f5f5', '#e0e0e0'), padding: '11px 14px' }}>Restaurer</button>
              )}
              <button onClick={() => setDeleteConfirm(selected.id)} style={{ ...btn('#c0392b', '#fff5f5', '#fca5a5'), padding: '11px 14px' }}>Supprimer</button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL CONFIRMATION */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 32, maxWidth: 400, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Confirmer la suppression</h3>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: '0 0 24px' }}>
              {deleteConfirm === 'bulk'
                ? `Supprimer définitivement ${selectedIds.size} message${selectedIds.size > 1 ? 's' : ''} ? Cette action est irréversible.`
                : 'Supprimer définitivement ce message ? Cette action est irréversible.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ padding: '10px 20px', background: '#f5f5f5', color: '#555', border: '1px solid #e0e0e0', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuler
              </button>
              <button onClick={() => deleteConfirm === 'bulk' ? bulkDelete() : deleteOne(deleteConfirm)}
                style={{ padding: '10px 20px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}