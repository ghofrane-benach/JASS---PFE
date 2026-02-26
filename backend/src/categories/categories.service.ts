import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create.category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Catégorie #${id} introuvable`);
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) throw new NotFoundException(`Catégorie "${slug}" introuvable`);
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ?? this.generateSlug(dto.name);
    const existing = await this.categoryRepository.findOne({ where: { slug } });
    if (existing) throw new ConflictException(`Le slug "${slug}" est déjà utilisé`);
    const category = this.categoryRepository.create({ ...dto, slug });
    return this.categoryRepository.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (dto.name && !dto.slug) dto.slug = this.generateSlug(dto.name);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: `Catégorie #${id} supprimée avec succès` };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}