'use client';

import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>📧</div>
        <h2 style={{ fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Email envoyé</h2>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>
          Si cet email existe dans notre base, vous recevrez un lien de réinitialisation dans quelques minutes.
        </p>
        <Link href="/login" style={{ fontSize: 12, color: '#111', textDecoration: 'none', borderBottom: '1px solid #111' }}>
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', color: '#111' }}>JASS</span>
        </Link>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, margin: '0 0 10px' }}>Mot de passe oublié</h1>
          <p style={{ fontSize: 13, color: '#aaa' }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', marginBottom: 24, border: '1px solid #fca5a5', background: '#fff5f5', fontSize: 13, color: '#c0392b' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Adresse email" required
            style={{ width: '100%', padding: '14px 16px', border: '1px solid #e8e8e8', background: '#fafafa', outline: 'none', fontFamily: 'inherit', fontSize: 14, color: '#333', boxSizing: 'border-box' as const }}
            onFocus={e => e.target.style.borderColor = '#111'}
            onBlur={e  => e.target.style.borderColor = '#e8e8e8'}
          />
          <button type="submit" disabled={loading} style={{
            padding: '15px', background: loading ? '#555' : '#111', color: '#fff',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
            fontFamily: 'inherit',
          }}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: '#888' }}>
          <Link href="/login" style={{ color: '#111', textDecoration: 'none', borderBottom: '1px solid #111' }}>
            ← Retour à la connexion
          </Link>
        </p>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>
    </div>
  );
}