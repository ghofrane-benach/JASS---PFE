'use client';

import { useState } from 'react';
import { useAuth } from '@/component/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function AdminLoginPage() {
  const { reload } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? 'Identifiants invalides');

      const token = data.token ?? data.access_token;
      const user  = data.user;

      if (user?.role !== 'admin') throw new Error('Accès réservé aux administrateurs');

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      reload();
      window.location.href = '/admin/dashboard';

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#080808', fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 24, fontWeight: 300, letterSpacing: '0.2em', color: '#fff', margin: '0 0 6px' }}>JASS</p>
          <p style={{ fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Administration</p>
        </div>

        <div style={{ background: '#111', padding: '40px 36px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 300, color: '#fff', margin: '0 0 8px' }}>Connexion</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 32px' }}>Espace réservé aux administrateurs</p>

          {error && (
            <div style={{ padding: '12px 16px', marginBottom: 24, background: 'rgba(229,85,85,0.1)', border: '1px solid rgba(229,85,85,0.3)', fontSize: 12, color: '#e55' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Email',         type: 'email',    val: email,    set: setEmail,    ph: 'admin@jass.tn' },
              { label: 'Mot de passe',  type: 'password', val: password, set: setPassword, ph: '••••••••'       },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} required
                  style={{ width: '100%', padding: '12px 16px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                  onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ marginTop: 8, padding: '14px', background: loading ? '#333' : '#fff', color: '#111', border: 'none', cursor: loading ? 'wait' : 'pointer', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          ← <a href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Retour au site</a>
        </p>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>
    </div>
  );
}