"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── HERO SLIDES ──────────────────────────────────────────────────────────
const SLIDES = [
  {
    left:  "/images/scarfs/violet.jpeg",
    right: "/images/scarfs/burgundy.jpeg",
    label: "Nouvelle Collection Scarfs",
    cta:   "Découvrir",
    href:  "/products?category=scarfs",        // → page produits Scarfs
  },
  {
    left:  "/images/accessoires/papillon.jpg",
    right: "/images/accessoires/coeur2.jpeg",
    label: "Accessoires Cerise",
    cta:   "Voir la collection",
    href:  "/products?category=accessories",   // → page produits Accessories
  },
  {
    left:  "/images/scarfs/zebra1.jpeg",
    right: "/images/scarfs/zebra.jpeg",
    label: "Collection Clothing",
    cta:   "Explorer",
    href:  "/products?category=clothing",      // → page produits Clothing
  },
];

// ─── LOOKBOOK GRID ────────────────────────────────────────────────────────
const LOOKBOOK = [
  "/images/scarfs/cow.jpeg",
  "/images/scarfs/burgundy.jpeg",
  "/images/scarfs/zebra1.jpeg",
  "/images/scarfs/red2.jpeg",
  "/images/scarfs/white.jpeg",
  "/images/accessoires/papillon2.jpeg",
  "/images/accessoires/braclet.jpeg",
  "/images/accessoires/collierfleur.jpeg",
  "/images/accessoires/collier1.jpeg",
  "/images/accessoires/coquettes.jpeg",
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#fafafa", color: "#111" }}>
      <HeroSlider />
      <CategoriesStrip />
      <VideoSection />
      <LookbookGrid />
      <FeaturesBar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes kenburns { from{transform:scale(1.08)} to{transform:scale(1)} }
        @keyframes scrollbar { 0%,100%{height:0;opacity:0;top:0} 50%{height:32px;opacity:1} 75%{height:0;opacity:0;top:100%} }
        .cta-btn { transition: background 0.25s, color 0.25s !important; }
        .cta-btn:hover { background: #111 !important; color: #fff !important; }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HERO SLIDER — dual panel
// ══════════════════════════════════════════════════════════════════════════
function HeroSlider() {
  const [cur, setCur]     = useState(0);
  const [textIn, setIn]   = useState(true);
  const [trans, setTrans] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo((cur + 1) % SLIDES.length), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cur]);

  function goTo(i: number) {
    if (i === cur || trans) return;
    setIn(false); setTrans(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => { setCur(i); setTrans(false); setTimeout(() => setIn(true), 80); }, 750);
  }

  const sl = SLIDES[cur];

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#111" }}>

      {/* ── DUAL PANEL ─────────────────────────────────────────── */}
      {SLIDES.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0, display: "flex",
          opacity: i === cur ? 1 : 0,
          transition: "opacity 1s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: i === cur ? "auto" : "none",
        }}>
          {/* Left panel */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${s.left})`,
              backgroundSize: "cover", backgroundPosition: "center top",
              animation: i === cur ? "kenburns 7s ease-out forwards" : "none",
            }} />
          </div>
          {/* Right panel */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${s.right})`,
              backgroundSize: "cover", backgroundPosition: "center top",
              animation: i === cur ? "kenburns 7s ease-out 0.2s forwards" : "none",
            }} />
          </div>
        </div>
      ))}

      {/* ── DARK OVERLAY ───────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)", zIndex: 1 }} />

      {/* ── CENTER TEXT + CTA BUTTON ───────────────────────────── */}
      <div style={{
        position: "absolute", bottom: "14%", left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2, textAlign: "center", width: "90%",
      }}>
        {/* Label */}
        <div style={{ overflow: "hidden", marginBottom: 20 }}>
          <h2 style={{
            color: "#fff",
            fontSize: "clamp(1.8rem, 5vw, 4rem)",
            fontWeight: 300, letterSpacing: "0.08em",
            textTransform: "uppercase",
            transform: textIn ? "translateY(0)" : "translateY(110%)",
            transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}>{sl.label}</h2>
        </div>

        {/* ✅ CTA Button → redirige vers la bonne page produits */}
        <div style={{
          opacity: textIn ? 1 : 0,
          transform: textIn ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.55s ease 0.38s",
        }}>
          <Link
            href={sl.href}
            className="cta-btn"
            style={{
              display: "inline-block",
              padding: "14px 52px",
              background: "#fff",
              color: "#111",
              textDecoration: "none",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              fontWeight: 500,
              border: "1px solid #fff",
            }}
          >
            {sl.cta}
          </Link>
        </div>
      </div>

      {/* ── DOTS ───────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 3,
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === cur ? 24 : 6, height: 6, borderRadius: 3,
            background: i === cur ? "#fff" : "rgba(255,255,255,0.4)",
            border: "none", cursor: "pointer", padding: 0,
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          }} />
        ))}
      </div>

      {/* ── ARROWS ─────────────────────────────────────────────── */}
      {[-1, 1].map(d => (
        <button key={d} onClick={() => goTo((cur + d + SLIDES.length) % SLIDES.length)} style={{
          position: "absolute", top: "50%", zIndex: 3,
          [d === -1 ? "left" : "right"]: 20,
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", width: 44, height: 44, borderRadius: "50%",
          cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{d === -1 ? "←" : "→"}</button>
      ))}

      {/* ── SCROLL INDICATOR ─────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: 1, height: 50, zIndex: 3, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, width: "100%",
          background: "rgba(255,255,255,0.6)",
          animation: "scrollbar 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CATEGORIES STRIP
// ══════════════════════════════════════════════════════════════════════════
function CategoriesStrip() {
  return (
    <section style={{ padding: "72px 6vw", background: "#fff" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", color: "#888", marginBottom: 48 }}>
          Nos Collections
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
          {[
            { name: "Clothing",    slug: "clothing",    img: "/images/scarfs/violet.jpeg",      ratio: "4/5" },
            { name: "Scarfs",      slug: "scarfs",      img: "/images/scarfs/zebra1.jpeg",       ratio: "4/5" },
            { name: "Accessories", slug: "accessories", img: "/images/accessoires/cerise.jpeg",  ratio: "4/5" },
          ].map((c, i) => <CatCard key={i} {...c} />)}
        </div>
      </div>
    </section>
  );
}

function CatCard({ name, slug, img, ratio }: { name: string; slug: string; img: string; ratio: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={`/products?category=${slug}`}
      style={{ display: "block", position: "relative", aspectRatio: ratio, overflow: "hidden", textDecoration: "none" }}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
    >
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: "cover", backgroundPosition: "center",
        transform: hov ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: hov ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)",
        transition: "background 0.4s",
      }} />
      <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center" }}>
        <h3 style={{
          color: "#fff", fontSize: "clamp(1rem,2vw,1.4rem)",
          fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase",
          marginBottom: 10,
        }}>{name}</h3>
        <span style={{
          display: "inline-block", color: "#fff", fontSize: 9,
          letterSpacing: "0.3em", textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,255,255,0.6)", paddingBottom: 2,
          opacity: hov ? 1 : 0, transform: hov ? "none" : "translateY(6px)",
          transition: "all 0.3s ease 0.05s",
        }}>Voir tout</span>
      </div>
    </Link>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// VIDEO SECTION — editorial style
// ══════════════════════════════════════════════════════════════════════════
function VideoSection() {
  const [play, setPlay]   = useState(false);
  const [muted, setMuted] = useState(true);
  const vRef = useRef<HTMLVideoElement>(null);

  // ✅ Chemin statique — vidéo dans frontend/public/videos/jass-video.mp4
  const VIDEO_SRC = "/videos/scarvs.mp4";

  function toggle() {
    const v = vRef.current; if (!v) return;
    if (play) { v.pause(); setPlay(false); } else { v.play(); setPlay(true); }
  }

  return (
    <section style={{ background: "#111", padding: "80px 0" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 12 }}>
              L'Univers JASS
            </p>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.05 }}>
              L'art du tissu,<br /><em style={{ fontStyle: "italic" }}>sublimé</em>
            </h2>
          </div>
          <Link href="/about" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 3 }}>
            Notre histoire →
          </Link>
        </div>

        {/* Video player */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#1c1c1c", overflow: "hidden" }}>
          <video
            ref={vRef}
            src={VIDEO_SRC}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted={muted}
            loop
            playsInline
            onEnded={() => setPlay(false)}
          />

          {/* Click to play/pause */}
          <div style={{ position: "absolute", inset: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={toggle}>
            {!play && (
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 24, paddingLeft: 5,
              }}>▶</div>
            )}
          </div>

          {/* Controls bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px",
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <button onClick={toggle} style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", width: 38, height: 38, borderRadius: "50%",
              cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {play ? "⏸" : "▶"}
            </button>
            <button onClick={() => setMuted(m => { if (vRef.current) vRef.current.muted = !m; return !m; })} style={{
              background: "transparent", border: "none",
              color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 16,
            }}>
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// LOOKBOOK GRID — #INJASS
// ══════════════════════════════════════════════════════════════════════════
function LookbookGrid() {
  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6vw" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
            #INJASS
          </h2>
          <p style={{ color: "#666", fontSize: 13, letterSpacing: "0.04em", maxWidth: 480, margin: "0 auto" }}>
            Inspirez-vous de notre communauté et partagez vos looks avec <strong>#INJASS</strong>
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(2, 220px)", gap: 3 }}>
          {LOOKBOOK.map((img, i) => <LookCell key={i} img={img} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <Link href="/products" style={{
            display: "inline-block", padding: "14px 52px",
            background: "#fff", color: "#111",
            border: "1px solid #111", fontSize: 11,
            letterSpacing: "0.22em", textTransform: "uppercase",
            textDecoration: "none", fontFamily: "inherit",
          }}>Voir plus de looks</Link>
        </div>
      </div>
    </section>
  );
}

function LookCell({ img }: { img: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: "cover", backgroundPosition: "center",
        transform: hov ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        filter: hov ? "brightness(0.85)" : "brightness(1)",
      }} />
      {hov && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontSize: 16 }}>+</div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// FEATURES BAR
// ══════════════════════════════════════════════════════════════════════════
function FeaturesBar() {
  return (
    <section style={{ background: "#f5f5f5", padding: "44px 6vw", borderTop: "1px solid #e8e8e8" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
        {[
          { icon: "🚚", title: "Livraison Tunisie",  sub: "Partout en Tunisie" },
          { icon: "🔄", title: "Échange Facile",     sub: "Politique d'échange" },
          { icon: "🔒", title: "Paiement Sécurisé",  sub: "Plusieurs options" },
          { icon: "💬", title: "Service Client",     sub: "Disponible 7j/7" },
        ].map((f, i) => (
          <div key={i} style={{ textAlign: "center", flex: "1 1 160px" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{f.title}</p>
            <p style={{ fontSize: 11, color: "#888" }}>{f.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}