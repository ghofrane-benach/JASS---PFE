// apps/backend/src/products/product.service.ts
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
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductStatus } from './types/product-status.enum';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product');

    // Filters
    if (category) {
      queryBuilder.andWhere('product.categoryId = :category', { category });
    }

    if (brand) {
      queryBuilder.andWhere('product.brand = :brand', { brand });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    } else {
      queryBuilder.andWhere('product.status = :status', {
        status: ProductStatus.PUBLISHED,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    queryBuilder.orderBy(`product.${sortBy}`, order as 'ASC' | 'DESC');

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Incrémente le compteur de vues
    await this.productsRepository.update(id, {
      viewsCount: () => 'views_count + 1',
    });

    return product;
  }

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

    const product = this.productsRepository.create({
      ...createProductDto,
      status: ProductStatus.DRAFT,
      viewsCount: 0,
    });

    return await this.productsRepository.save(product);
  }

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

  async remove(id: string, user: User): Promise<void> {
    const product = await this.findOne(id);
    product.status = ProductStatus.ARCHIVED;
    await this.productsRepository.save(product);
  }

  async publish(id: string, user: User): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.PUBLISHED;
    return await this.productsRepository.save(product);
  }

  async unpublish(id: string, user: User): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.DRAFT;
    return await this.productsRepository.save(product);
  }

  async search(query: string, limit: number = 20) {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.name ILIKE :query OR product.description ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('product.status = :status', {
        status: ProductStatus.PUBLISHED,
      })
      .take(limit)
      .getMany();
  }
}