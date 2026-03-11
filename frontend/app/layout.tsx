import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/component/AuthProvider';
import { CartProvider } from '@/context/CartContext';
import ClientShell from '@/component/clientshell';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'JASS',
  description: 'Your one-stop shop for all your needs',
  keywords: 'ecommerce, shopping, online store, JASS',
  authors: [{ name: 'Ben Achour Ghofrane' }],
  icons: { icon: '/logo.jpeg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ClientShell>{children}</ClientShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}