'use client';

import { usePathname } from 'next/navigation';
import Header from '@/component/Header';
import { ReactNode } from 'react';
import Footer from './Footer';

export default function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Toutes les routes /admin n'ont pas de Header/Footer client
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}