// apps/backend/src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findOneBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async getAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getFeaturedCategories(): Promise<Category[]> {
    // Renvoie les 3 catégories principales
    return this.categoriesRepository.find({
      where: [
        { slug: 'clothing' },
        { slug: 'scarfs' },
        { slug: 'accessories' },
      ],
    });
  }
}