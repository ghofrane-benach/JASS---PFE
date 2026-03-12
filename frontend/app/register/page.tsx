'use client';

import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', phone: '',
    password: '', confirmPassword: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!pwdRegex.test(form.password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          phone:     form.phone,
          password:  form.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }
      window.location.href = '/login';
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
      }} className="register-left">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 48 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 }}>
            JASS Scarvi
          </p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 300, lineHeight: 1.2, maxWidth: 280 }}>
            Rejoignez<br /><em style={{ fontStyle: 'italic' }}>la famille JASS</em>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — formulaire ──────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '60px 6vw',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', color: '#111' }}>JASS</span>
          </Link>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, margin: '0 0 10px' }}>
              Créer un compte
            </h1>
            <p style={{ fontSize: 13, color: '#aaa', letterSpacing: '0.04em' }}>
              Rejoignez la famille JASS
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', marginBottom: 20,
              border: '1px solid #fca5a5', background: '#fff5f5',
              fontSize: 13, color: '#c0392b',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Prénom + Nom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <InputField name="firstName" value={form.firstName} onChange={handleChange} placeholder="Prénom" required />
              <InputField name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Nom"    required />
            </div>

            <InputField name="email"    type="email"    value={form.email}    onChange={handleChange} placeholder="Adresse email"                required />
            <InputField name="phone"    type="tel"      value={form.phone}    onChange={handleChange} placeholder="Téléphone (optionnel)" />
            <InputField name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mot de passe (min. 6 caractères)" required />
            <InputField name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirmer le mot de passe" required />

            {/* Password strength indicator */}
            {form.password.length > 0 && (() => {
              const hasLetter = /[a-zA-Z]/.test(form.password);
              const hasNumber = /\d/.test(form.password);
              const hasLength = form.password.length >= 8;
              const score = [hasLetter, hasNumber, hasLength].filter(Boolean).length;
              const colors = ['#e55', '#f0a020', '#4a9e6f'];
              const labels = ['Faible', 'Moyen', 'Fort'];
              return (
                <div>
                  <div style={{ display: 'flex', gap: 4, marginTop: -4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 2,
                        background: score >= i ? colors[score - 1] : '#f0f0f0',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: score > 0 ? colors[score - 1] : '#aaa', marginTop: 4 }}>
                    {score > 0 ? labels[score - 1] : ''} {score === 3 ? '✓' : ''}
                    {score < 3 && form.password.length > 0 && (
                      <span style={{ color: '#bbb' }}>
                        {!hasLetter && ' · Ajoutez des lettres'}
                        {!hasNumber && ' · Ajoutez des chiffres'}
                        {!hasLength && ' · Minimum 8 caractères'}
                      </span>
                    )}
                  </p>
                </div>
              );
            })()}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: '15px',
              background: loading ? '#555' : '#111',
              color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              fontFamily: 'inherit', transition: 'background 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: '1px solid rgba(255,255,255,0.4)', borderTop: '1px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Création…
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#888' }}>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" style={{ color: '#111', textDecoration: 'none', borderBottom: '1px solid #111' }}>
              Se connecter
            </Link>
          </p>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .register-left { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────

function InputField({ name, type = 'text', value, onChange, placeholder, required }: {
  name: string; type?: string; value: string;
  onChange: (e: any) => void; placeholder: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      name={name} id={name} type={type} value={value}
      onChange={onChange} placeholder={placeholder} required={required}
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