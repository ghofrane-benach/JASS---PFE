// apps/frontend/component/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id?: string;
  name?: string;
  price?: number;
  images?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  // Gestion sécurisée des données
  const name = product?.name || 'Produit non nommé';
  const price = product?.price || 0;
  const image = product?.images?.[0] || '/images/placeholder/product-placeholder.jpg';
  const id = product?.id || 'unknown';

  return (
    <div className="group cursor-pointer">
      <Link href={`/products/${id}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="mt-4">
        <h3 className="font-serif text-lg hover:text-nude-500 transition-colors line-clamp-2">
          {name}
        </h3>
        <p className="font-serif text-lg mt-2">
          {price.toFixed(2)} TND
        </p>
      </div>
    </div>
  );
}