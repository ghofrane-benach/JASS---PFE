'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

type Step = 'livraison' | 'paiement' | 'confirmation';

export default function CheckoutPage() {
  const { items, totalQty, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('livraison');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    payMethod: 'card' as 'card' | 'cash',
  });

  const subtotal = items.reduce((s: number, i: { price: any; qty: number; }) => s + Number(i.price) * i.qty, 0);
  const shipping  = subtotal > 0 ? 8 : 0;
  const total     = subtotal + shipping;

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function formatCard(v: string) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(v: string) {
    return v.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/');
  }

  async function placeOrder() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    clearCart();
    setStep('confirmation');
    setLoading(false);
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <p style={{ fontSize: 18, color: '#333' }}>Votre panier est vide</p>
        <Link href="/products" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: 2 }}>
          Découvrir la collection
        </Link>
      </div>
    );
  }

  const STEPS = [
    { key: 'livraison',     label: 'Livraison'     },
    { key: 'paiement',      label: 'Paiement'      },
    { key: 'confirmation',  label: 'Confirmation'  },
  ];

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1px solid #e8e8e8', background: '#fff',
    fontSize: 14, fontFamily: "'Cormorant Garamond', Georgia, serif",
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block' as const,
    fontSize: 10, letterSpacing: '0.3em',
    textTransform: 'uppercase' as const,
    color: '#888', marginBottom: 8,
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#080808', color: '#fff', textAlign: 'center', padding: '60px 6vw 50px' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>JASS</p>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300, margin: 0 }}>Ma Commande</h1>
      </section>

      {/* STEPPER */}
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '0 6vw' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ padding: '18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontFamily: 'sans-serif',
                  background: step === s.key ? '#111' : STEPS.indexOf({ key: step } as any) > i || step === 'confirmation' ? '#4a9e6f' : '#f0f0f0',
                  color: step === s.key || STEPS.indexOf({ key: step } as any) > i || step === 'confirmation' ? '#fff' : '#aaa',
                }}>
                  {step === 'confirmation' || (STEPS.findIndex(x => x.key === step) > i) ? '✓' : i + 1}
                </span>
                <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: step === s.key ? '#111' : '#aaa' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: '#f0f0f0', margin: '0 16px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 6vw', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48 }}>

        {/* ── FORM AREA ─────────────────────────────────── */}
        <div>

          {/* ÉTAPE 1 — LIVRAISON */}
          {step === 'livraison' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 300, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                Informations de livraison
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Prénom *</label>
                  <input value={form.firstName} onChange={e => update('firstName', e.target.value)}
                    style={inputStyle} placeholder="Votre prénom"
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input value={form.lastName} onChange={e => update('lastName', e.target.value)}
                    style={inputStyle} placeholder="Votre Nom"
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    style={inputStyle} placeholder="email@exemple.com"
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                </div>
                <div>
                  <label style={labelStyle}>Téléphone *</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    style={inputStyle} placeholder="+216 XX XXX XXX"
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Adresse *</label>
                <input value={form.address} onChange={e => update('address', e.target.value)}
                  style={inputStyle} placeholder="Rue, Numéro, Appartement..."
                  onFocus={e => e.target.style.borderColor = '#111'}
                  onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div>
                  <label style={labelStyle}>Ville *</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)}
                    style={inputStyle} placeholder="Tunis"
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                </div>
                <div>
                  <label style={labelStyle}>Code postal</label>
                  <input value={form.zip} onChange={e => update('zip', e.target.value)}
                    style={inputStyle} placeholder="1000"
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                </div>
              </div>

              <button onClick={() => setStep('paiement')}
                disabled={!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city}
                style={{
                  padding: '14px 48px', background: '#111', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 11,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  fontFamily: 'inherit', opacity: (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city) ? 0.4 : 1,
                }}>
                Continuer vers le paiement →
              </button>
            </div>
          )}

          {/* ÉTAPE 2 — PAIEMENT */}
          {step === 'paiement' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 300, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                Mode de paiement
              </h2>

              {/* Choix méthode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                {[
                  { key: 'card', icon: '💳', label: 'Carte bancaire' },
                  { key: 'cash', icon: '💵', label: 'Paiement à la livraison' },
                ].map(m => (
                  <button key={m.key} onClick={() => update('payMethod', m.key)}
                    style={{
                      padding: '16px', border: `1px solid ${form.payMethod === m.key ? '#111' : '#e8e8e8'}`,
                      background: form.payMethod === m.key ? '#f9f9f9' : '#fff',
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontSize: 13, color: '#333', transition: 'all 0.2s',
                    }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Formulaire carte */}
              {form.payMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                  <div>
                    <label style={labelStyle}>Nom sur la carte *</label>
                    <input value={form.cardName} onChange={e => update('cardName', e.target.value)}
                      style={inputStyle} placeholder="GHOFRANE BEN ACHOUR"
                      onFocus={e => e.target.style.borderColor = '#111'}
                      onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Numéro de carte *</label>
                    <input value={form.cardNumber}
                      onChange={e => update('cardNumber', formatCard(e.target.value))}
                      style={inputStyle} placeholder="0000 0000 0000 0000" maxLength={19}
                      onFocus={e => e.target.style.borderColor = '#111'}
                      onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Date d'expiration *</label>
                      <input value={form.expiry}
                        onChange={e => update('expiry', formatExpiry(e.target.value))}
                        style={inputStyle} placeholder="MM/AA" maxLength={5}
                        onFocus={e => e.target.style.borderColor = '#111'}
                        onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV *</label>
                      <input value={form.cvv}
                        onChange={e => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                        style={inputStyle} placeholder="000" maxLength={3}
                        onFocus={e => e.target.style.borderColor = '#111'}
                        onBlur={e => e.target.style.borderColor = '#e8e8e8'} />
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🔒 Vos données bancaires sont sécurisées et chiffrées
                  </p>
                </div>
              )}

              {form.payMethod === 'cash' && (
                <div style={{ padding: '20px 24px', background: '#f9f9f9', marginBottom: 32, borderLeft: '3px solid #4a9e6f' }}>
                  <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.7 }}>
                    Vous paierez en espèces à la réception de votre commande.<br />
                    Notre livreur vous contactera avant la livraison.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep('livraison')}
                  style={{ padding: '14px 32px', background: 'transparent', color: '#111', border: '1px solid #111', cursor: 'pointer', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
                  ← Retour
                </button>
                <button onClick={placeOrder} disabled={loading}
                  style={{ padding: '14px 48px', background: loading ? '#888' : '#111', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
                  {loading ? 'Traitement...' : 'Confirmer la commande'}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — CONFIRMATION */}
          {step === 'confirmation' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0faf5', border: '2px solid #4a9e6f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>
                ✓
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 300, marginBottom: 12 }}>Commande confirmée !</h2>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 8, lineHeight: 1.7 }}>
                Merci {form.firstName} pour votre commande.
              </p>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 40 }}>
                Un email de confirmation sera envoyé à <strong>{form.email}</strong>
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Link href="/account" style={{ padding: '14px 32px', background: 'transparent', color: '#111', border: '1px solid #111', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Mes commandes
                </Link>
                <Link href="/products" style={{ padding: '14px 32px', background: '#111', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Continuer les achats
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── RÉSUMÉ COMMANDE ───────────────────────────── */}
        {step !== 'confirmation' && (
          <div>
            <div style={{ background: '#f9f9f9', padding: 28, position: 'sticky', top: 88 }}>
              <h3 style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 400, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #ebebeb' }}>
                Résumé ({totalQty} article{totalQty > 1 ? 's' : ''})
              </h3>

              {/* Articles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {items.map((item: { id: Key | null | undefined; image: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: any; }) => (
                  <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 56, background: '#f0f0f0', flexShrink: 0, overflow: 'hidden' }}>
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>× {item.qty}</p>
                    </div>
                    <p style={{ fontSize: 13, margin: 0, whiteSpace: 'nowrap' }}>{(Number(item.price) * item.qty).toFixed(2)} TND</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#666' }}>Sous-total</span>
                  <span>{subtotal.toFixed(2)} TND</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#666' }}>Livraison</span>
                  <span style={{ color: '#4a9e6f' }}>{shipping.toFixed(2)} TND</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 300, paddingTop: 12, borderTop: '1px solid #ebebeb', marginTop: 4 }}>
                  <span>Total</span>
                  <span>{total.toFixed(2)} <span style={{ fontSize: 12, color: '#888' }}>TND</span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 360px'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: '1fr 1fr'"]   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}