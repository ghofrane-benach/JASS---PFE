'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/component/AuthProvider';

const NAV = [
  { href: '/admin/dashboard', icon: '◈', label: 'Dashboard'     },
  { href: '/admin/orders',    icon: '◎', label: 'Commandes'     },
  { href: '/admin/products',  icon: '◻', label: 'Produits'      },
  { href: '/admin/users',     icon: '◯', label: 'Utilisateurs'  },
  { href: '/admin/reclamations', label: 'Réclamations', icon: '✉️' }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isLoggedIn, mounted, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) { router.push('/admin/login'); return; }
    if ((user as any)?.role !== 'admin') { router.push('/'); return; }
  }, [mounted, isLoggedIn, user]);

  if (!mounted || !isLoggedIn) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.2)', borderTop: '1px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#f7f7f5' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 64 : 220, flexShrink: 0,
        background: '#0a0a0a', color: '#fff',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'sticky', top: 0, height: '100vh', zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '28px 0' : '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div>
              <p style={{ fontSize: 18, fontWeight: 300, letterSpacing: '0.15em', margin: 0 }}>JASS</p>
              <p style={{ fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0', textTransform: 'uppercase' }}>Admin</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 18, padding: 0, lineHeight: 1 }}
            onMouseOver={e => (e.currentTarget.style.color = '#fff')}
            onMouseOut={e  => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '13px 0' : '13px 24px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  textDecoration: 'none',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderLeft: active ? '2px solid #fff' : '2px solid transparent',
                  fontSize: 13, letterSpacing: '0.04em', transition: 'all 0.15s',
                }}
                onMouseOver={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
                onMouseOut={e  => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; } }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: collapsed ? '16px 0' : '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <Link href="/" title="Retour au site"
              style={{ fontSize: collapsed ? 14 : 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e  => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              {collapsed ? '⌂' : '← Site'}
            </Link>
            {!collapsed && (
              <button onClick={logout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0, fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.color = '#e55')}
                onMouseOut={e  => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                Quitter
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
}