// apps/frontend/components/common/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Collection', href: '/products' },
    { name: 'Notre Histoire', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const categories = [
    { name: 'Clothing', href: '/products?category=clothing' },
    { name: 'Scarfs', href: '/products?category=scarfs' },
    { name: 'Accessories', href: '/products?category=accessories' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-light">JASS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-serif text-sm hover:text-black transition-colors ${
                  pathname === item.href ? 'text-black' : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Categories Dropdown (Desktop) */}
          <div className="hidden md:block">
            <div className="relative group">
              <button className="font-serif text-sm hover:text-black transition-colors">
                Catégories
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg hidden group-hover:block">
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-6 py-2 font-serif text-sm hover:bg-gray-100 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <Link
              href="/login"
              className="font-serif text-sm hover:text-black transition-colors"
            >
              Mon Compte
            </Link>

            <Link
              href="/cart"
              className="relative p-2 hover:text-black transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-serif text-sm py-2 ${
                    pathname === item.href ? 'text-black' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t">
                <span className="font-serif text-sm block mb-2">Catégories</span>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="font-serif text-sm py-2 text-gray-600 hover:text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}