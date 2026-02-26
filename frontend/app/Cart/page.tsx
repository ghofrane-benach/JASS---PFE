// apps/frontend/app/(shop)/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic' ;

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger le panier depuis localStorage ou API
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600 font-serif">Chargement...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-serif font-light mb-4">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 mb-8">
            Commencez vos achats et ajoutez des articles à votre panier
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-black text-white font-serif hover:bg-gray-800 transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-light">Votre Panier</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 p-6 border border-gray-200"
                >
                  <div className="aspect-square w-24 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <p className="text-gray-600">{item.price.toFixed(2)} TND</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-serif">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-serif">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-gray-500 hover:text-black mt-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Link
                href="/products"
                className="text-black border-b border-black hover:border-nude-500 transition-colors"
              >
                ← Continuer vos achats
              </Link>
              
              <button
                onClick={() => {
                  localStorage.removeItem('cart');
                  setCartItems([]);
                }}
                className="text-sm text-gray-500 hover:text-black"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6">
              <h2 className="text-xl font-serif font-light mb-6">Récapitulatif</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-serif">{subtotal.toFixed(2)} TND</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-serif">
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} TND`}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-serif text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)} TND</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 bg-black text-white text-center font-serif hover:bg-gray-800 transition-colors mb-4"
              >
                Procéder au paiement
              </Link>

              <div className="text-sm text-gray-600 text-center">
                <p>✓ Paiement sécurisé</p>
                <p>✓ Livraison gratuite dès 150 TND</p>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6 bg-white p-6 border border-gray-200">
              <h3 className="font-serif mb-4">Code promo</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Entrez votre code"
                  className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-black focus:border-black font-serif"
                />
                <button className="px-6 py-2 bg-black text-white font-serif hover:bg-gray-800 transition-colors">
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}