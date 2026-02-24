// apps/frontend/components/categories/Categories.tsx
import { useEffect, useState } from 'react';
import { getFeaturedCategories } from '@/lib/categories.service';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const featured = await getFeaturedCategories();
      setCategories(featured);
    };
    loadCategories();
  }, []);

  return (
    <div className="flex space-x-4 mb-8">
      {categories.map((category) => (
        <a
          key={category.id}
          href={`/products?category=${category.slug}`}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-black hover:text-white transition-colors"
        >
          {category.name}
        </a>
      ))}
    </div>
  );
}