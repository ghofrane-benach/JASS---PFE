// apps/backend/src/seeds/seed-categories.ts
import { getRepository } from 'typeorm';
import { Category } from '../categories/categories.entity';

export const seedCategories = async () => {
  const categoryRepository = getRepository(Category);
  
  // Crée les 3 catégories si elles n'existent pas
  const categories = [
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Scarfs', slug: 'scarfs' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  for (const category of categories) {
    const existing = await categoryRepository.findOne({
      where: { slug: category.slug }
    });
    
    if (!existing) {
      const newCategory = categoryRepository.create({
        name: category.name,
        slug: category.slug
      });
      
      await categoryRepository.save(newCategory);
    }
  }
};