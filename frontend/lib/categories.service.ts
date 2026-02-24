// apps/frontend/lib/categories.service.ts
export const getFeaturedCategories = async () => {
  try {
    const response = await fetch('/api/categories/featured');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    // Retourne les 3 catégories par défaut en cas d'erreur
    return [
      { id: '1', name: 'Clothing', slug: 'clothing' },
      { id: '2', name: 'Scarfs', slug: 'scarfs' },
      { id: '3', name: 'Accessories', slug: 'accessories' },
    ];
  }
};