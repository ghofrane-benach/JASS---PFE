'use client';

import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const REASONS = [
  { id: 'customer_service',  label: 'Service Client',          icon: '🛒' },
  { id: 'product_inquiry',   label: 'Demande produit',          icon: '🧣' },
  { id: 'billing_issue',     label: 'Facturation',              icon: '💳' },
  { id: 'general_feedback',  label: 'Retour général',           icon: '💬' },
  { id: 'other',             label: 'Autre',                    icon: '✉️' },
];

const FAQ = [
  {
    q: "Combien de temps pour obtenir une réponse ?",
    a: "Nous répondons dans les 24h ouvrables. Pour les urgences, mentionnez 'URGENT' dans votre message.",
  },
  {
    q: "Puis-je retourner ou échanger un produit ?",
    a: "Oui, vous avez 5 jours à compter de la réception pour retourner un produit en parfait état.",
  },
  {
    q: "Comment modifier ma commande ?",
    a: "Vous pouvez modifier votre commande dans les 2 heures suivant la confirmation. Contactez-nous avec votre numéro de commande.",
  },
];

export default function ContactPage() {
  const [form, setForm]           = useState({ name: '', email: '', reason: 'customer_service', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [openFaq, setOpenFaq]     = useState<number | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) { setError('Veuillez entrer un message.'); return; }
    if (!form.email.includes('@')) { setError('Adresse email invalide.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    setForm({ name: '', email: '', reason: 'customer_service', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  }

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', color: '#111', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#080808', color: '#fff', padding: '110px 6vw 90px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
            JASS — Contactez-nous
          </p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 300, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            Nous Sommes<br /><em style={{ fontStyle: 'italic' }}>à Votre Écoute</em>
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Une question, une suggestion, un problème ? Notre équipe vous répond sous 24h.
          </p>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          FORM + INFO
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '90px 6vw' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'start' }}>

          {/* ── FORM ─────────────────────────────────────── */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>Formulaire</p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, margin: '0 0 40px' }}>
              Envoyez-nous<br /><em style={{ fontStyle: 'italic' }}>un message</em>
            </h2>

            {/* SUCCESS */}
            {submitted ? (
              <div style={{
                padding: '48px 32px', border: '1px solid #4a9e6f',
                textAlign: 'center', animation: 'fadeUp 0.4s ease',
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 400, margin: '0 0 12px' }}>Message envoyé !</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, margin: 0 }}>
                  Nous vous répondrons dans les 24 heures.<br />Pensez à vérifier vos spams.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Votre nom" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Ghofrane B." />
                  <Field label="Email *" id="email" name="email" value={form.email} onChange={handleChange} placeholder="vous@email.com" type="email" required />
                </div>

                {/* Reason */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>
                    Raison du contact *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {REASONS.map(r => (
                      <button key={r.id} type="button"
                        onClick={() => setForm({ ...form, reason: r.id })}
                        style={{
                          padding: '14px 8px', border: '1px solid',
                          borderColor: form.reason === r.id ? '#111' : '#e8e8e8',
                          background: form.reason === r.id ? '#111' : '#fff',
                          color: form.reason === r.id ? '#fff' : '#555',
                          cursor: 'pointer', textAlign: 'center',
                          fontFamily: 'inherit', transition: 'all 0.2s',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 8,
                        }}>
                        <span style={{ fontSize: 20 }}>{r.icon}</span>
                        <span style={{ fontSize: 10, letterSpacing: '0.05em', lineHeight: 1.3 }}>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" style={{ display: 'block', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>
                    Votre message *
                  </label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={6} required
                    placeholder="Décrivez votre demande..."
                    style={{
                      width: '100%', padding: '16px', resize: 'vertical',
                      border: '1px solid #e8e8e8', outline: 'none',
                      fontFamily: 'inherit', fontSize: 14, lineHeight: 1.7,
                      color: '#333', background: '#fafafa',
                      boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#111')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p style={{ fontSize: 12, color: '#c0392b', letterSpacing: '0.04em', margin: 0 }}>⚠ {error}</p>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  padding: '17px 48px', background: loading ? '#555' : '#111',
                  color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                  fontFamily: 'inherit', transition: 'background 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  {loading ? (
                    <>
                      <div style={{ width: 14, height: 14, border: '1px solid rgba(255,255,255,0.4)', borderTop: '1px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Envoi en cours…
                    </>
                  ) : 'Envoyer le message'}
                </button>

              </form>
            )}
          </div>

          {/* ── INFO CARDS ───────────────────────────────── */}
          <div style={{ paddingTop: 64 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>Coordonnées</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, margin: '0 0 40px' }}>
              Retrouvez-nous
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { icon: '📍', title: 'Adresse',   lines: ['Tunis', 'Tunisie'] },
                { icon: '📱', title: 'Téléphone', lines: ['+216 12 345 678'] },
                { icon: '✉️', title: 'Email',     lines: ['jass@gmail.com'] },
                { icon: '🕐', title: 'Horaires',  lines: ['Lun – Ven : 9h – 18h'] },
              ].map((info, i) => (
                <InfoCard key={i} {...info} />
              ))}
            </div>

            {/* Social links */}
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>
                Suivez-nous
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <SocialBtn href="https://www.facebook.com/share/1DsBrL4nmY/?mibextid=wwXIfr" label="Facebook" />
                <SocialBtn href="https://www.instagram.com/jasscarvi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" label="Instagram" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '90px 6vw', background: '#f9f9f9' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>Support</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, margin: 0 }}>Questions Fréquentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {FAQ.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BOTTOM
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 6vw', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>Explorez</p>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, margin: '0 0 40px' }}>
          En attendant, découvrez<br /><em style={{ fontStyle: 'italic' }}>notre collection</em>
        </h2>
        <Link href="/products" style={{
          display: 'inline-block', padding: '15px 52px',
          background: '#111', color: '#fff', textDecoration: 'none',
          fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: 'inherit',
        }}>
          Voir la collection
        </Link>
      </section>

    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────

function Field({ label, id, name, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; id: string; name: string; value: string;
  onChange: (e: any) => void; placeholder?: string;
  type?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>
        {label}
      </label>
      <input id={id} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={{
          width: '100%', padding: '14px 16px', border: '1px solid #e8e8e8',
          background: '#fafafa', outline: 'none', fontFamily: 'inherit',
          fontSize: 14, color: '#333', boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = '#111')}
        onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
      />
    </div>
  );
}

function InfoCard({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      padding: '20px 24px', background: '#fff',
      border: '1px solid', borderColor: hov ? '#111' : '#f0f0f0',
      display: 'flex', alignItems: 'flex-start', gap: 16,
      transition: 'border-color 0.25s',
    }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      <span style={{ fontSize: 20, marginTop: 2 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>{title}</p>
        {lines.map((l, i) => <p key={i} style={{ fontSize: 13, color: '#333', margin: 0, lineHeight: 1.6 }}>{l}</p>)}
      </div>
    </div>
  );
}

function SocialBtn({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      padding: '10px 24px', border: '1px solid', textDecoration: 'none',
      borderColor: hov ? '#111' : '#e8e8e8',
      color: hov ? '#111' : '#888',
      fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
      fontFamily: 'inherit', transition: 'all 0.2s',
    }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      {label}
    </a>
  );
}

function FaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', textAlign: 'left',
      }}>
        <span style={{ fontSize: 15, fontWeight: 400, color: '#111', lineHeight: 1.4 }}>{question}</span>
        <span style={{
          fontSize: 18, color: '#aaa', marginLeft: 16, flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.25s', display: 'inline-block',
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', animation: 'fadeUp 0.2s ease' }}>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.8, margin: 0 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}