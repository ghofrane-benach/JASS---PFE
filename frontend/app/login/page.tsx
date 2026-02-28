'use client';

import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Email ou mot de passe incorrect');
      }
      const { access_token, user } = await res.json();
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
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

      {/* ── LEFT PANEL — image déco ───────────────────── */}
      <div style={{
        flex: 1, display: 'none',
        backgroundImage: "url('/images/scarfs/bley.jpeg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }} className="login-left">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 48 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 }}>
            JASS Scarvi
          </p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 300, lineHeight: 1.2, maxWidth: 280 }}>
            L'élégance<br /><em style={{ fontStyle: 'italic' }}>à portée de main</em>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — formulaire ──────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '60px 6vw',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', color: '#111' }}>JASS</span>
          </Link>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, margin: '0 0 10px' }}>
              Bonjour
            </h1>
            <p style={{ fontSize: 13, color: '#aaa', letterSpacing: '0.04em' }}>
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', marginBottom: 24,
              border: '1px solid #fca5a5', background: '#fff5f5',
              fontSize: 13, color: '#c0392b', letterSpacing: '0.02em',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <InputField
              id="email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Adresse email" required
            />

            <InputField
              id="password" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe" required
            />

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#111' }} />
                Se souvenir de moi
              </label>
              <a href="#" style={{ fontSize: 12, color: '#888', textDecoration: 'none', borderBottom: '1px solid #ddd' }}>
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit */}
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

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: '#888' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#111', textDecoration: 'none', borderBottom: '1px solid #111' }}>
              Créer un compte
            </Link>
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
            <span style={{ fontSize: 11, color: '#bbb', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Ou</span>
            <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SocialBtn icon="google" label="Google" />
            <SocialBtn icon="facebook" label="Facebook" />
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .login-left { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────

function InputField({ id, type, value, onChange, placeholder, required }: {
  id: string; type: string; value: string;
  onChange: (e: any) => void; placeholder: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id} type={type} value={value} onChange={onChange}
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

function SocialBtn({ icon, label }: { icon: 'google' | 'facebook'; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button style={{
      padding: '12px', border: `1px solid ${hov ? '#111' : '#e8e8e8'}`,
      background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
      fontSize: 12, color: '#333', letterSpacing: '0.06em',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'border-color 0.2s',
    }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      {icon === 'google' ? (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#1877F2" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.852V15.467h-3.604V12h3.604V9.356c0-3.593 2.121-5.532 5.193-5.532 1.483 0 2.688.109 3.063.157v3.51h-2.11c-1.659 0-1.975.793-1.975 1.945V12h3.95l-.525 3.467h-3.425v8.385C19.612 23.006 24 18.067 24 12z"/>
        </svg>
      )}
      {label}
    </button>
  );
}