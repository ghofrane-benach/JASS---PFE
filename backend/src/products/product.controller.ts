// apps/backend/src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Récupère tous les produits avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });

    // Tri
    queryBuilder.orderBy(`product.${sortBy}`, order);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère un produit par ID
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec ID ${id} non trouvé`);
    }

    // Incrémente le compteur de vues
    await this.productsRepository.update(id, {
      viewsCount: () => 'views_count + 1',
    });

    return product;
  }

  /**
   * Crée un nouveau produit
   */
  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    // Vérifie si le SKU existe déjà
    if (createProductDto.sku) {
      const existingProduct = await this.productsRepository.findOne({
        where: { sku: createProductDto.sku },
      });

      if (existingProduct) {
        throw new BadRequestException('SKU déjà existant');
      }
    }

    // Crée le produit
    const product = this.productsRepository.create({
      ...createProductDto,
      isActive: true,
      viewsCount: 0,
    });

    return await this.productsRepository.save(product);
  }

  /**
   * Met à jour un produit
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Met à jour uniquement les champs fournis
    Object.assign(product, updateProductDto);

    return await this.productsRepository.save(product);
  }

  /**
   * Supprime un produit (soft delete)
   */
  async remove(id: string, user: User): Promise<void> {
    const product = await this.findOne(id);

    // Soft delete au lieu de hard delete
    product.isActive = false;
    await this.productsRepository.save(product);
  }

  /**
   * Recherche de produits par nom ou description
   */
  async search(query: string, limit: number = 20) {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.name ILIKE :query OR product.description ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .take(limit)
      .getMany();
  }

  /**
   * Met à jour le stock d'un produit
   */
  async updateStock(productId: string, quantity: number) {
    const product = await this.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException('Stock insuffisant');
    }

    product.stock -= quantity;
    return await this.productsRepository.save(product);
  }

  /**
   * Incrémente le stock d'un produit
   */
  async increaseStock(productId: string, quantity: number) {
    const product = await this.findOne(productId);
    product.stock += quantity;
    return await this.productsRepository.save(product);
  }

  /**
   * Récupère les produits les plus populaires
   */
  async getPopularProducts(limit: number = 10) {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.viewsCount', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Récupère les produits en rupture de stock
   */
  async getOutOfStockProducts() {
    return await this.productsRepository.find({
      where: { isActive: true, stock: 0 },
    });
  }
}