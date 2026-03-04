import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/component/AuthProvider';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { CartProvider } from '@/context/CartContext';
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
  icons: {
    icon: '/logo.jpeg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}