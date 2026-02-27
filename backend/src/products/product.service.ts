import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      category, brand, minPrice, maxPrice,
      status, search, page = 1, limit = 50,
      sortBy = 'createdAt', order = 'DESC',
    } = query;

    const qb = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // FIX : filtrer catégorie par slug OU name OU id
    if (category) {
      qb.andWhere(
        '(LOWER(category.slug) = LOWER(:cat) OR LOWER(category.name) = LOWER(:cat) OR product.categoryId = :cat)',
        { cat: category },
      );
    }

    if (brand)    qb.andWhere('product.brand = :brand', { brand });
    if (minPrice) qb.andWhere('product.price >= :minPrice', { minPrice: Number(minPrice) });
    if (maxPrice) qb.andWhere('product.price <= :maxPrice', { maxPrice: Number(maxPrice) });

    // FIX : pas de filtre status par defaut -> retourne tout
    if (status) {
      qb.andWhere('product.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const allowed = ['createdAt', 'updatedAt', 'price', 'name', 'viewsCount', 'stock'];
    const safe    = allowed.includes(sortBy) ? sortBy : 'createdAt';

    qb.orderBy(`product.${safe}`, order === 'ASC' ? 'ASC' : 'DESC')
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit));

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Produit #${id} introuvable`);
    this.productsRepository.increment({ id }, 'viewsCount', 1).catch(() => {});
    return product;
  }

  async create(dto: CreateProductDto, user?: User): Promise<Product> {
    if (dto.sku) {
      const existing = await this.productsRepository.findOne({ where: { sku: dto.sku } });
      if (existing) throw new BadRequestException(`SKU "${dto.sku}" deja utilise`);
    }
    const product = this.productsRepository.create({
      ...dto,
      status: dto.status ?? ProductStatus.PUBLISHED,
      viewsCount: 0,
    });
    return this.productsRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto, user?: User): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productsRepository.findOne({ where: { sku: dto.sku } });
      if (existing) throw new BadRequestException(`SKU "${dto.sku}" deja utilise`);
    }
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: string, user?: User): Promise<{ message: string }> {
    const product = await this.findOne(id);
    product.status = ProductStatus.ARCHIVED;
    await this.productsRepository.save(product);
    return { message: `Produit #${id} archive` };
  }

  async publish(id: string, user?: User): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.PUBLISHED;
    return this.productsRepository.save(product);
  }

  async unpublish(id: string, user?: User): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.DRAFT;
    return this.productsRepository.save(product);
  }

  async publishAll(): Promise<{ message: string; count: number }> {
    const result = await this.productsRepository
      .createQueryBuilder()
      .update(Product)
      .set({ status: ProductStatus.PUBLISHED })
      .where('status IN (:...statuses)', {
        statuses: [ProductStatus.DRAFT, ProductStatus.OUT_OF_STOCK],
      })
      .execute();
    return { message: `${result.affected ?? 0} produits publies`, count: result.affected ?? 0 };
  }

  async search(query: string, limit: number = 20) {
    if (!query?.trim()) return [];
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('(product.name ILIKE :query OR product.description ILIKE :query)', {
        query: `%${query}%`,
      })
      .take(Number(limit))
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
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.viewsCount', 'DESC')
      .take(Number(limit))
      .getMany();
  }

  async seed(): Promise<{ message: string; count: number }> {
    const existing = await this.productsRepository.count();
    if (existing > 0) {
      return { message: `Base deja peuplee : ${existing} produits`, count: existing };
    }

    const items = [
      { name: 'Echarpe Violette',  price: 40, stock: 15, images: ['/images/scarfs/violet.jpeg'],            description: 'Echarpe en cachemire violette, douce et elegante.' },
      { name: 'Echarpe Bordeaux',  price: 40, stock: 10, images: ['/images/scarfs/burgundy.jpeg'],          description: 'Echarpe bordeaux en laine fine.' },
      { name: 'Echarpe Zebree',    price: 40, stock: 8,  images: ['/images/scarfs/zebra1.jpeg'],            description: 'Echarpe motif zebre, tendance et originale.' },
      { name: 'Echarpe Rouge',     price: 40, stock: 20, images: ['/images/scarfs/red2.jpeg'],              description: 'Echarpe rouge vif en coton premium.' },
      { name: 'Echarpe Blanche',   price: 40, stock: 12, images: ['/images/scarfs/white.jpeg'],             description: 'Echarpe blanche legere, parfaite pour ete.' },
      { name: 'Echarpe Rose',      price: 40, stock: 9,  images: ['/images/scarfs/marrose.jpeg'],           description: 'Echarpe rose mauve en soie naturelle.' },
      { name: 'Echarpe Vache',     price: 40, stock: 11, images: ['/images/scarfs/cow.jpeg'],               description: 'Echarpe motif vache, audacieuse et fun.' },
      { name: 'Accessoire Cerise', price: 15, stock: 25, images: ['/images/accessoires/cerise.jpeg'],       description: 'Bijou cerise artisanal, fait main a Tunis.' },
      { name: 'Bracelet Elegant',  price: 20, stock: 30, images: ['/images/accessoires/braclet.jpeg'],      description: 'Bracelet fait main, finitions soignees.' },
      { name: 'Collier Fleur',     price: 25, stock: 18, images: ['/images/accessoires/collierfleur.jpeg'], description: 'Collier floral artisanal en metal dore.' },
      { name: 'Papillon',          price: 20, stock: 22, images: ['/images/accessoires/papillon.jpg'],      description: 'Accessoire papillon decoratif.' },
      { name: 'Collier Perles',    price: 25, stock: 14, images: ['/images/accessoires/collier1.jpeg'],     description: 'Collier en perles naturelles.' },
      { name: 'Coquettes',         price: 15, stock: 16, images: ['/images/accessoires/coquettes.jpeg'],    description: 'Accessoires coquettes assortis.' },
    ];

    const products = await this.productsRepository.save(
      items.map(p => this.productsRepository.create({
        ...p,
        status: ProductStatus.PUBLISHED,
        isActive: true,
        viewsCount: 0,
        dimensions: {},
        metadata: {},
      }))
    );

    return { message: `${products.length} produits crees`, count: products.length };
  }
}