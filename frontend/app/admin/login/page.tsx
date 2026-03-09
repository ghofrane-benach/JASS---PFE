'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError('Identifiants incorrects.');
        return;
      }

      // Vérifie que le compte est bien admin
      if (data.user?.role !== 'admin') {
        setError('Accès refusé — compte non administrateur.');
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      router.push('/admin/orders');

    } catch {
      setError('Erreur de connexion. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');
        input:focus { outline: none; border-color: #fff !important; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#fff', letterSpacing: '0.15em', margin: 0 }}>JASS</h1>
          <p style={{ fontSize: 10, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', marginTop: 8, textTransform: 'uppercase' }}>
            Administration
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '40px 36px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 300, color: '#fff', margin: '0 0 32px', textAlign: 'center', letterSpacing: '0.05em' }}>
            Connexion Admin
          </h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@jass.tn"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            {error && (
              <div style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)', padding: '10px 16px', fontSize: 12, color: '#e74c3c' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding: '14px 0', marginTop: 8, background: loading ? '#333' : '#fff', color: loading ? '#999' : '#111', border: 'none', cursor: loading ? 'wait' : 'pointer', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Retour au site</a>
        </p>
      </div>
    </div>
  );
}
