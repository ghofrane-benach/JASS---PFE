'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface CartProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category?: { name: string };
}

interface CartItem {
  id: string;
  productId: string;
  product: CartProduct;
  quantity: number;
  unitPrice: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart]     = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) { setCart(null); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, { headers: headers() });
      if (res.ok) setCart(await res.json());
      else setCart(null);
    } catch { setCart(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = async (productId: string, quantity = 1) => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) setCart(await res.json());
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) setCart(await res.json());
    } finally { setLoading(false); }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (res.ok) setCart(await res.json());
    } finally { setLoading(false); }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/cart`, { method: 'DELETE', headers: headers() });
      setCart(prev => prev ? { ...prev, items: [], total: 0, itemCount: 0 } : null);
    } finally { setLoading(false); }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}