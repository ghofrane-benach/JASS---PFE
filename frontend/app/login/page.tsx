'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/component/AuthProvider';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function LoginPage() {
  const { reload }    = useAuth();
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

      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {
        throw new Error('Erreur serveur — vérifiez que le backend est démarré');
      }

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message[0] : (data.message || 'Email ou mot de passe incorrect')
        );
      }

      const { token, user } = data;

      // Stocker le token + user en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: user.name ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      }));

      // Recharger le AuthContext
      reload();

      // Redirection
      window.location.href = '/account';

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: '#fff',
    }}>

      <div style={{
        flex: 1, display: 'none',
        backgroundImage: "url('/images/scarfs/violet.jpeg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }} className="login-left">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 48 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 }}>JASS</p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 300, lineHeight: 1.2, maxWidth: 280 }}>
            L'élégance<br /><em style={{ fontStyle: 'italic' }}>à portée de main</em>
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 6vw' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', color: '#111' }}>JASS</span>
          </Link>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, margin: '0 0 10px' }}>Bonjour</h1>
            <p style={{ fontSize: 13, color: '#aaa', letterSpacing: '0.04em' }}>Connectez-vous à votre compte</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', marginBottom: 24, border: '1px solid #fca5a5', background: '#fff5f5', fontSize: 13, color: '#c0392b' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputField id="email"    type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Adresse email"  required />
            <InputField id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"   required />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#111' }} />
                Se souvenir de moi
              </label>
              <a href="#" style={{ fontSize: 12, color: '#888', textDecoration: 'none', borderBottom: '1px solid #ddd' }}>
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: '15px',
              background: loading ? '#555' : '#111',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              fontFamily: 'inherit', transition: 'background 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: '1px solid rgba(255,255,255,0.4)', borderTop: '1px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Connexion…
                </>
              ) : 'Se Connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: '#888' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#111', textDecoration: 'none', borderBottom: '1px solid #111' }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .login-left { display: block !important; } }
      `}</style>
    </div>
  );
}

function InputField({ id, type, value, onChange, placeholder, required }: {
  id: string; type: string; value: string;
  onChange: (e: any) => void; placeholder: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '14px 16px',
        border: `1px solid ${focused ? '#111' : '#e8e8e8'}`,
        background: '#fafafa', outline: 'none',
        fontFamily: 'inherit', fontSize: 14, color: '#333',
        boxSizing: 'border-box', transition: 'border-color 0.2s',
      }}
    />
  );
}