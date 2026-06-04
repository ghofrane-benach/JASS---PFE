'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token        = searchParams.get('token') ?? '';

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8)  { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Erreur serveur');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  if (!token) return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: '#e55', marginBottom: 24 }}>Lien invalide ou expiré.</p>
      <Link href="/forgot-password" style={{ color: '#111', fontSize: 13, borderBottom: '1px solid #111', textDecoration: 'none' }}>
        Demander un nouveau lien
      </Link>
    </div>
  );

  return success ? (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>✅</div>
      <h2 style={{ fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Mot de passe modifié</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
      <Link href="/login" style={{ display: 'inline-block', padding: '14px 44px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
        Se connecter
      </Link>
    </div>
  ) : (
    <>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 300, margin: '0 0 10px' }}>Nouveau mot de passe</h1>
        <p style={{ fontSize: 13, color: '#aaa' }}>Choisissez un mot de passe sécurisé</p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', marginBottom: 24, border: '1px solid #fca5a5', background: '#fff5f5', fontSize: 13, color: '#c0392b' }}>
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { label: 'Nouveau mot de passe',   val: password, set: setPassword },
          { label: 'Confirmer le mot de passe', val: confirm,  set: setConfirm  },
        ].map(f => (
          <input key={f.label} type="password" value={f.val}
            onChange={e => f.set(e.target.value)}
            placeholder={f.label} required
            style={{ width: '100%', padding: '14px 16px', border: '1px solid #e8e8e8', background: '#fafafa', outline: 'none', fontFamily: 'inherit', fontSize: 14, color: '#333', boxSizing: 'border-box' as const }}
            onFocus={e => e.target.style.borderColor = '#111'}
            onBlur={e  => e.target.style.borderColor = '#e8e8e8'}
          />
        ))}
        <button type="submit" disabled={loading} style={{
          padding: '15px', background: loading ? '#555' : '#111', color: '#fff',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'inherit',
        }}>
          {loading ? 'Modification...' : 'Modifier le mot de passe'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', color: '#111' }}>JASS</span>
        </Link>
        <Suspense fallback={<div>Chargement...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>
    </div>
  );
}