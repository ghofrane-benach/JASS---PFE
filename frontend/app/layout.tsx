import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JASS',
  description: 'Your one-stop shop for all your needs',
  keywords: 'ecommerce, shopping, online store, JASS',
  authors: [{ name: 'Ben Achour Ghofrane' }],
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ SessionProvider doit envelopper TOUT le contenu */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}