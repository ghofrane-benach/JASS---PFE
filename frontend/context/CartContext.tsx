'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface CartItem {
  id: string;         // CartItem UUID (pas le product id)
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  totalQty: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

// ── Transformer la réponse API → format interne ──────────────────────────
function toItems(cart: any): CartItem[] {
  if (!cart?.items) return [];
  return cart.items.map((i: any) => ({
    id:        i.id,
    productId: i.productId,
    name:      i.product?.name  ?? '',
    price:     Number(i.unitPrice),
    image:     i.product?.images?.[0] ?? '/images/placeholder.jpg',
    qty:       i.quantity,
  }));
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // ── Charger le panier depuis l'API ──────────────────────────────────
  const refresh = useCallback(async () => {
    if (!getToken()) { setItems([]); return; }
    try {
      const res = await fetch(`${API_URL}/cart`, { headers: authHeaders() });
      if (res.ok) setItems(toItems(await res.json()));
      else        setItems([]);
    } catch { setItems([]); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Ajouter un produit ──────────────────────────────────────────────
  async function addItem(productId: string, quantity = 1) {
    if (!getToken()) { window.location.href = '/login'; return; }
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) { setItems(toItems(await res.json())); setIsOpen(true); }
    } catch {}
  }

  // ── Supprimer un item ───────────────────────────────────────────────
  async function removeItem(itemId: string) {
    try {
      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (res.ok) setItems(toItems(await res.json()));
    } catch {}
  }

  // ── Modifier la quantité (delta = +1 ou -1) ─────────────────────────
  async function updateQty(itemId: string, delta: number) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty < 1) { await removeItem(itemId); return; }
    try {
      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) setItems(toItems(await res.json()));
    } catch {}
  }

  // ── Vider le panier ─────────────────────────────────────────────────
  async function clearCart() {
    try {
      await fetch(`${API_URL}/cart`, { method: 'DELETE', headers: authHeaders() });
      setItems([]);
    } catch {}
  }

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, totalQty, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) return {
    items: [], totalQty: 0, isOpen: false,
    setIsOpen: () => {}, addItem: async () => {}, removeItem: async () => {},
    updateQty: async () => {}, clearCart: async () => {}, refresh: async () => {},
  } as any;
  return ctx;
}