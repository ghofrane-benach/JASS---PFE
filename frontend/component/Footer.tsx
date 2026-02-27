'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  }

  const columns = [
    {
      title: 'Boutique',
      links: [
        { name: 'Tous les produits', href: '/products' },
        { name: 'Scarfs',            href: '/products?category=scarfs' },
        { name: 'Accessories',       href: '/products?category=accessories' },
        { name: 'Clothing',          href: '/products?category=clothing' },
        { name: 'Nouveautés',        href: '/products?sort=newest' },
      ],
    },
    {
      title: 'Service Client',
      links: [
        { name: 'Contactez-nous',    href: '/contact' },
        { name: 'Politique d\'échange', href: '/politique-echange' },
        { name: 'Livraison',         href: '/livraison' },
        { name: 'Politique de confidentialité', href: '/privacy' },
        { name: 'Conditions générales',          href: '/terms' },
      ],
    },
    {
      title: 'Mon Compte',
      links: [
        { name: 'Mon espace',        href: '/account' },
        { name: 'Mes commandes',     href: '/orders' },
        { name: 'Connexion',         href: '/login' },
        { name: 'Créer un compte',   href: '/register' },
      ],
    },
    {
      title: 'JASS',
      links: [
        { name: 'Notre Histoire',    href: '/about' },
        { name: 'Contact',           href: '/contact' },
      ],
    },
  ];

  return (
    <footer style={{
      background: '#080808',
      color: 'rgba(255,255,255,0.55)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* ── NEWSLETTER BAND ──────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '56px 6vw',
      }}>
        <div style={{
          maxWidth: 1300, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 32,
        }}>
          <div style={{ flex: '1 1 340px' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              Newsletter
            </p>
            <h3 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, lineHeight: 1.1, margin: 0 }}>
              Soyez la première à<br /><em style={{ fontStyle: 'italic' }}>découvrir nos nouveautés</em>
            </h3>
          </div>

          <div style={{ flex: '1 1 420px' }}>
            {subscribed ? (
              <div style={{
                padding: '20px 32px',
                border: '1px solid rgba(255,255,255,0.15)',
                textAlign: 'center', color: '#fff',
                fontSize: 13, letterSpacing: '0.1em',
              }}>
                ✓ &nbsp; Merci ! Vous êtes inscrite.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 0 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  placeholder="Votre adresse email"
                  style={{
                    flex: 1, padding: '16px 20px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRight: 'none',
                    color: '#fff', fontSize: 12,
                    letterSpacing: '0.06em',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  style={{
                    padding: '16px 32px',
                    background: '#fff', color: '#080808',
                    border: 'none', cursor: 'pointer',
                    fontSize: 10, letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontFamily: 'inherit', fontWeight: 600,
                    whiteSpace: 'nowrap',
                    transition: 'background 0.25s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#e0e0e0')}
                  onMouseOut={e => (e.currentTarget.style.background = '#fff')}
                >
                  S'inscrire
                </button>
              </div>
            )}
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 10, letterSpacing: '0.04em' }}>
              Pas de spam. Désabonnement à tout moment.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN LINKS GRID ──────────────────────────────────────── */}
      <div style={{ padding: '64px 6vw 48px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '48px 32px' }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ color: '#fff', fontSize: 28, fontWeight: 300, letterSpacing: '0.08em', display: 'block', marginBottom: 16 }}>
                JASS
              </span>
            </Link>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', marginBottom: 28, maxWidth: 200 }}>
              Écharpes, accessoires & vêtements — fait avec soin, porté avec élégance.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 16 }}>
              <a
                href="https://www.facebook.com/share/1DsBrL4nmY/?mibextid=wwXIfr"
                target="_blank" rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
                aria-label="Facebook"
              >
                <FaFacebook size={14} />
              </a>
              <a
                href="https://www.instagram.com/jasscarvi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank" rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <p style={{
                color: '#fff', fontSize: 10, letterSpacing: '0.35em',
                textTransform: 'uppercase', marginBottom: 20, fontWeight: 500,
              }}>
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} style={{
                      color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                      fontSize: 13, letterSpacing: '0.02em', lineHeight: 1.4,
                      transition: 'color 0.2s',
                      display: 'inline-block',
                    }}
                      onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                      onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────────── */}
      <div style={{ padding: '24px 6vw' }}>
        <div style={{
          maxWidth: 1300, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          {/* Copyright */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
            © {currentYear} JASS — Tous droits réservés
          </p>

          {/* Payment badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginRight: 4 }}>Paiement</span>
            {['VISA', 'MC', 'PayPal'].map(m => (
              <div key={m} style={{
                padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 3,
                fontSize: 9, color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.06em', fontWeight: 600,
              }}>{m}</div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 20 }}>
            {['🔒 Paiement sécurisé', '✓ SSL chiffré'].map(b => (
              <span key={b} style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}