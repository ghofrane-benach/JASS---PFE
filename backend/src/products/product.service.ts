import {
  Injectable, NotFoundException, BadRequestException,
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
      category, brand, minPrice, maxPrice,
      status, search, page = 1, limit = 20,
      sortBy = 'createdAt', order = 'DESC',
    } = query;

    const qb = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (category) qb.andWhere('product.categoryId = :category', { category });
    if (brand) qb.andWhere('product.brand = :brand', { brand });
    if (minPrice) qb.andWhere('product.price >= :minPrice', { minPrice });
    if (maxPrice) qb.andWhere('product.price <= :maxPrice', { maxPrice });
    qb.andWhere('product.status = :status', {
      status: status ?? ProductStatus.PUBLISHED,
    });
    if (search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    qb.orderBy(`product.${sortBy}`, order as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Produit #${id} introuvable`);
    await this.productsRepository.increment({ id }, 'viewsCount', 1);
    return product;
  }

  async create(dto: CreateProductDto, user: User): Promise<Product> {
    if (dto.sku) {
      const existing = await this.productsRepository.findOne({ where: { sku: dto.sku } });
      if (existing) throw new BadRequestException(`SKU "${dto.sku}" déjà utilisé`);
    }
    const product = this.productsRepository.create({
      ...dto,
      status: dto.status ?? ProductStatus.DRAFT,
      viewsCount: 0,
    });
    return this.productsRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto, user: User): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productsRepository.findOne({ where: { sku: dto.sku } });
      if (existing) throw new BadRequestException(`SKU "${dto.sku}" déjà utilisé`);
    }
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const product = await this.findOne(id);
    product.status = ProductStatus.ARCHIVED;
    await this.productsRepository.save(product);
    return { message: `Produit #${id} archivé avec succès` };
  }

  async publish(id: string, user: User): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.PUBLISHED;
    return this.productsRepository.save(product);
  }

  async unpublish(id: string, user: User): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.DRAFT;
    return this.productsRepository.save(product);
  }

  async search(query: string, limit: number = 20) {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('(product.name ILIKE :query OR product.description ILIKE :query)', {
        query: `%${query}%`,
      })
      .andWhere('product.status = :status', { status: ProductStatus.PUBLISHED })
      .take(limit)
      .getMany();
  }

  async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await this.findOne(productId);
    if (product.stock < quantity) throw new BadRequestException('Stock insuffisant');
    product.stock -= quantity;
    if (product.stock === 0) product.status = ProductStatus.OUT_OF_STOCK;
    return this.productsRepository.save(product);
  }

  async increaseStock(productId: string, quantity: number): Promise<Product> {
    const product = await this.findOne(productId);
    product.stock += quantity;
    if (product.status === ProductStatus.OUT_OF_STOCK) product.status = ProductStatus.PUBLISHED;
    return this.productsRepository.save(product);
  }

  async getPopularProducts(limit: number = 10) {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.PUBLISHED })
      .orderBy('product.viewsCount', 'DESC')
      .take(limit)
      .getMany();
  }
}