'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  totalQty: number;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,   setItems]   = useState<CartItem[]>([]);
  const [isOpen,  setIsOpen]  = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setItems(JSON.parse(stored));
    setMounted(true);
  }, []);

  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  function addItem(item: Omit<CartItem, 'qty'>) {
    setItems(prev => {
      const next = [...prev];
      const existing = next.find(i => i.id === item.id);
      if (existing) existing.qty += 1;
      else next.push({ ...item, qty: 1 });
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
    setIsOpen(true);
  }

  function removeItem(id: string) { save(items.filter(i => i.id !== id)); }

  function updateQty(id: string, delta: number) {
    save(items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }

  function clearCart() { save([]); }

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  if (!mounted) return <>{children}</>;

  return (
    <CartContext.Provider value={{ items, totalQty, addItem, removeItem, updateQty, clearCart, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) return { items: [], totalQty: 0, addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {}, isOpen: false, setIsOpen: () => {} } as any;
  return ctx;
}