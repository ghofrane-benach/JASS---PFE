// apps/frontend/app/product/[id]/page.tsx
'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://backend:3000';

export default async function ProductPage({ params }: { params: { id: string } }) {
  let product;

  try {
    const response = await fetch(`${API_URL}/products/${params.id}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      if (response.status === 404) notFound();
      throw new Error('Erreur serveur');
    }
    product = await response.json();
  } catch {
    notFound();
  }

  const name = product?.name ?? 'Produit non nommé';
  const price = product?.price ?? 0;
  const description = product?.description ?? 'Description non disponible';
  const images: (string | StaticImport)[] = product?.images?.length
    ? product.images
    : ['/images/placeholder/product-placeholder.jpg'];

  return (
    <div className="bg-white">
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-light">{name}</h1>
          <p className="text-xl text-gray-300 mt-4">{description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100">
                  <Image
                    src={image}
                    alt={`${name} - ${index + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8">
              <h2 className="text-2xl font-serif font-light mb-6">{name}</h2>
              <p className="text-gray-600 mb-4">{description}</p>
              <span className="text-4xl font-serif block mb-6">
                {Number(price).toFixed(2)} TND
              </span>
              <div className="flex space-x-4">
                <button className="px-8 py-4 bg-black text-white font-serif hover:bg-gray-800 transition-colors">
                  Ajouter au panier
                </button>
                <button className="px-8 py-4 border border-black font-serif hover:bg-black hover:text-white transition-colors">
                  Favoris
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8">
            <h2 className="text-2xl font-serif font-light mb-6">Détails du produit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-lg mb-2">Composition</h3>
                <p className="text-gray-600">100% cachemire</p>
              </div>
              <div>
                <h3 className="font-serif text-lg mb-2">Entretien</h3>
                <p className="text-gray-600">Lavage à 30°C, repassage à température modérée</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}