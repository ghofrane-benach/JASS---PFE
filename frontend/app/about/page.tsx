'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const VALUES = [
  {
    num: '01',
    title: 'Savoir-Faire Ancestral',
    text: "Chaque pièce est confectionnée à la main par nos artisans, transmettant des techniques séculaires de génération en génération.",
  },
  {
    num: '02',
    title: 'Matières Nobles',
    text: "Cachemire, Bouclette, lin — nous sélectionnons rigoureusement les meilleurs matériaux pour chaque création.",
  },
  {
    num: '03',
    title: 'Éthique & Durable',
    text: "Production locale, commerce équitable, emballages écologiques. Nous construisons une mode responsable.",
  },
];

const TIMELINE = [
  { year: '2025', title: 'Naissance de JASS',      text: "Fondation à La Marsa, Tunis. Un atelier, une vision, une passion pour le textile tunisien." },
  { year: '2025', title: 'Numérisation',            text: "Lancement de la boutique en ligne — l'artisanat tunisien accessible partout dans le monde." },
  { year: '2025', title: 'Nouvelle Génération',     text: "Transmission du savoir-faire à la prochaine génération d'artisans passionnés." },
];

const STORY_IMAGES = [
  { src: '/images/scarfs/marrose.jpeg',  alt: 'Fondatrice JASS'       },
  { src: '/images/scarfs/red.jpeg',      alt: 'Atelier de broderie'    },
  { src: '/images/scarfs/cow.jpeg',      alt: 'Tissage traditionnel'   },
  { src: '/images/scarfs/jaune2.jpeg',   alt: 'Détail broderie'        },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#fff', color: '#111' }}>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section style={{
        background: '#080808', color: '#fff',
        padding: '120px 6vw 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative line */}
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          width: 1, height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)',
        }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
            JASS Scarvi — Tunis, 2025
          </p>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 300,
            lineHeight: 1.05, margin: '0 0 28px',
            letterSpacing: '-0.02em',
          }}>
            Notre Histoire
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto',
            lineHeight: 1.7, fontStyle: 'italic',
          }}>
            Depuis 2025, JASS Scarvi conjugue élégance et authenticité à travers des écharpes raffinées, faites à la main en Tunisie.
          </p>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          STORY SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 6vw' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Text */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 20 }}>
              Notre Fondatrice
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, margin: '0 0 32px', lineHeight: 1.1 }}>
              Une Histoire<br /><em style={{ fontStyle: 'italic' }}>d'Amour & d'Artisanat</em>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 20 }}>
              Fondée en 2025 à Tunis par <strong style={{ color: '#111' }}>Ghofrane Ben Achour</strong>, notre maison a commencé comme un petit atelier familial dans le quartier historique de La Marsa. Ce n'était pas seulement une entreprise, mais une mission : préserver et valoriser le savoir-faire textile tunisien face à la mondialisation.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 20 }}>
              Aujourd'hui, JASS travaille avec des matières nobles — cachemire, lin, soie naturelle — et des teintures végétales traditionnelles, pour créer des pièces qui traversent le temps.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 40 }}>
              Notre philosophie est simple : chaque pièce doit raconter une histoire, porter l'âme de son créateur, et faire honneur à l'héritage culturel tunisien.
            </p>
            <Link href="/contact" style={{
              fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#111', textDecoration: 'none',
              borderBottom: '1px solid #111', paddingBottom: 3,
            }}>
              Nous contacter →
            </Link>
          </div>

          {/* Image grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {STORY_IMAGES.map((img, i) => (
              <ImageCard key={i} src={img.src} alt={img.alt} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOUNDER PORTRAIT
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '20px 6vw 80px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            overflow: 'hidden', margin: '0 auto 20px',
            border: '1px solid #e8e8e8',
          }}>
            <Image
              src="/images/ghofrane.jpeg"
              alt="Ghofrane Ben Achour"
              width={120} height={120}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 400, margin: '0 0 6px' }}>Ghofrane Ben Achour</h3>
          <p style={{ fontSize: 12, letterSpacing: '0.15em', color: '#aaa', textTransform: 'uppercase' }}>
            Fondatrice & Directrice Artistique
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 6vw', background: '#f9f9f9' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>Ce qui nous guide</p>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, margin: 0 }}>Nos Valeurs</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {VALUES.map((v, i) => (
              <ValueCard key={i} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 6vw', background: '#080808', color: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              Notre parcours
            </p>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, margin: 0 }}>
              Notre Chronologie
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: 1, background: 'rgba(255,255,255,0.1)',
              transform: 'translateX(-50%)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                  gap: 32, alignItems: 'center',
                }}>
                  {/* Left text (alternating) */}
                  {i % 2 === 0 ? (
                    <div style={{ textAlign: 'right' }}>
                      <h3 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 8px' }}>{item.title}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                    </div>
                  ) : <div />}

                  {/* Center dot */}
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#080808', flexShrink: 0,
                    fontSize: 10, letterSpacing: '0.05em',
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                    {item.year}
                  </div>

                  {/* Right text (alternating) */}
                  {i % 2 !== 0 ? (
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 8px' }}>{item.title}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                    </div>
                  ) : <div />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 6vw', background: '#fff' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa', marginBottom: 20 }}>
            Venez nous rencontrer
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, margin: '0 0 20px', lineHeight: 1.1 }}>
            Envie de découvrir<br /><em style={{ fontStyle: 'italic' }}>notre univers ?</em>
          </h2>
          <p style={{ fontSize: 14, color: '#777', lineHeight: 1.8, margin: '0 0 48px' }}>
            Contactez-nous pour une expérience personnalisée ou pour visiter notre atelier à Tunis.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <CtaLink href="/contact" dark>Prendre rendez-vous</CtaLink>
            <CtaLink href="/products">Découvrir la collection</CtaLink>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────

function ImageCard({ src, alt }: { src: string; alt: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      <Image src={src} alt={alt} fill
        style={{ objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </div>
  );
}

function ValueCard({ num, title, text }: { num: string; title: string; text: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      padding: '48px 36px', background: '#fff',
      border: '1px solid', borderColor: hov ? '#111' : '#f0f0f0',
      textAlign: 'center', transition: 'border-color 0.3s',
      cursor: 'default',
    }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      <div style={{ fontSize: 52, fontWeight: 300, color: '#e8e8e8', marginBottom: 20, lineHeight: 1 }}>
        {num}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 400, margin: '0 0 16px', letterSpacing: '0.02em' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, lineHeight: 1.8, color: '#777', margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

function CtaLink({ href, children, dark }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href} style={{
      display: 'inline-block', padding: '15px 44px', textDecoration: 'none',
      fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
      fontFamily: 'inherit', transition: 'all 0.25s',
      background: dark ? (hov ? '#333' : '#111') : (hov ? '#111' : 'transparent'),
      color: dark ? '#fff' : (hov ? '#fff' : '#111'),
      border: '1px solid #111',
    }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      {children}
    </Link>
  );
}