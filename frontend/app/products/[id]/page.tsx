// apps/frontend/app/products/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic' ;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Données de produits (à remplacer par l'API)
  const sampleProducts = [
    {
      id: '1',
      name: 'Mikasa Red Scarf',
      price: 40,
      image: '/images/scarfs/red.jpeg',
      description: 'Mikasa Scarf - More than a red scarf, a true symbol of love and care. Inspired by Mikasa ❤️',
      category: 'Scarfs',
      details: 'Dimension 50*200 .',
      composition: 'Cachemire',
      images: [
        '/images/scarfs/red2.jpg',
        '/images/scarfs/rouge1.jpeg',
        '/images/scarfs/rouge.jpeg',
      ],
    },
    {
      id: '2',
      name: 'Browny Scard ',
      price: 40,
      image: '/images/scarfs/jaune.jpeg',
      description: 'Brown Sugar Glow 💛🤎',
      category: 'clothing',
      details: 'Dimension 50*200.',
      composition: '100% Bouclette',
      images: [
        '/images/scarfs/jaune1.jpeg',
        '/images/scarfs/jaune2.jpeg',
      ],
    },
    {
      id: '3',
      name: 'Earing Heart',
      price: 30,
      image: '/images/accessoires/coeur.jpeg',
      description: 'Boucle en Acier inoxydable',
      category: 'accessories',
      details: 'Focus on the Shine.\n Adorn yourself with these stunning intricate earrings Their elegant design catches the light perfectly adding a touch of class to any look.',
      composition: '100% soie naturelle',
      images: [
        '/images/accessoires/coeur1.jpeg',
        '/images/accessoires/coeur2.jpeg',
      ],
    },
    {
      id: '4',
      name: 'Rose necklace  ',
      price: 30,
      image: '/images/accessoires/collier.jpeg',
      description: 'Necklace ',
      category: 'accessories',
      details: 'A little spice, Tunisian style 🌶️.',
      composition: 'Acier inoxydable',
      images: [
        '/images/accessoires/collier1.jpeg',
        '/images/accessoires/collier.jpeg',
      ],
    }
  ];

  useEffect(() => {
    const foundProduct = sampleProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(null);
    }
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-serif">Produit non trouvé</p>
          <Link href="/products" className="text-black font-serif hover:text-nude-500 mt-4 block">
            ← Retour à la collection
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    // Ajouter au panier (à implémenter)
    alert(`Ajouté au panier : ${product.name} x ${quantity}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-light">{product.name}</h1>
          <p className="text-xl text-gray-300 mt-4">{product.description}</p>
        </div>
      </section>

      {/* Product Images */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-100">
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div>
              <div className="bg-gray-50 p-8">
                <h2 className="text-2xl font-serif font-light mb-6">
                  {product.name}
                </h2>
                
                <div className="mb-8">
                  <p className="text-gray-600 mb-4">{product.details}</p>
                  
                  <div className="flex items-center mb-6">
                    <span className="text-4xl font-serif mr-4">{product.price.toFixed(2)} TND</span>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-serif mr-4">Quantité:</span>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-serif">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={addToCart}
                      className="px-8 py-4 bg-black text-white font-serif hover:bg-gray-800 transition-colors"
                    >
                      Ajouter au panier
                    </button>
                    <button className="px-8 py-4 border border-black font-serif hover:bg-black hover:text-white transition-colors">
                      Favoris
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-serif mb-4">Détails du produit</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-serif">Composition:</span>
                      <span className="text-gray-600 ml-2">{product.composition}</span>
                    </div>
                    <div>
                      <span className="font-serif">Entretien:</span>
                      <span className="text-gray-600 ml-2">{product.care}</span>
                    </div>
                    <div>
                      <span className="font-serif">Catégorie:</span>
                      <span className="text-gray-600 ml-2">
                        {product.category === 'clothing' ? 'Vêtements' : 
                         product.category === 'scarfs' ? 'Foulards' : 'Accessoires'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-light mb-8 text-center">
            Produits similaires
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sampleProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} className="group cursor-pointer">
                  <Link href={`/products/${p.id}`}>
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="mt-4">
                    <h3 className="font-serif text-lg hover:text-nude-500 transition-colors">
                      {p.name}
                    </h3>
                    <p className="font-serif text-lg mt-2">
                      {p.price.toFixed(2)} TND
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}