import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly itemRepo: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // ── Récupérer ou créer le panier du user ────────────────────────────
  async getOrCreate(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product', 'items.product.category'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      cart = await this.cartRepo.save(cart);
    }

    return this.formatCart(cart);
  }

  // ── Ajouter un produit au panier ────────────────────────────────────
  async addItem(userId: string, productId: string, quantity: number = 1): Promise<Cart> {
    if (quantity < 1) throw new BadRequestException('Quantité invalide');

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Produit #${productId} introuvable`);
    if (product.stock < quantity) throw new BadRequestException(`Stock insuffisant (${product.stock} disponibles)`);

    const cart = await this.getOrCreate(userId);

    // Chercher si le produit est déjà dans le panier
    const existing = await this.itemRepo.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) throw new BadRequestException(`Stock insuffisant (${product.stock} disponibles)`);
      existing.quantity = newQty;
      await this.itemRepo.save(existing);
    } else {
      const item = this.itemRepo.create({
        cartId: cart.id,
        productId,
        quantity,
        unitPrice: product.price,
      });
      await this.itemRepo.save(item);
    }

    return this.getOrCreate(userId);
  }

  // ── Modifier la quantité d'un item ──────────────────────────────────
  async updateItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
    if (quantity < 1) throw new BadRequestException('Quantité minimum : 1');

    const cart = await this.getOrCreate(userId);
    const item = await this.itemRepo.findOne({
      where: { id: itemId, cartId: cart.id },
      relations: ['product'],
    });

    if (!item) throw new NotFoundException(`Item #${itemId} introuvable dans le panier`);
    if (item.product.stock < quantity) throw new BadRequestException(`Stock insuffisant (${item.product.stock} disponibles)`);

    item.quantity = quantity;
    await this.itemRepo.save(item);

    return this.getOrCreate(userId);
  }

  // ── Supprimer un item du panier ─────────────────────────────────────
  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreate(userId);
    const item = await this.itemRepo.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw new NotFoundException(`Item #${itemId} introuvable`);
    await this.itemRepo.remove(item);

    return this.getOrCreate(userId);
  }

  // ── Vider le panier ──────────────────────────────────────────────────
  async clearCart(userId: string): Promise<{ message: string }> {
    const cart = await this.getOrCreate(userId);
    await this.itemRepo.delete({ cartId: cart.id });
    return { message: 'Panier vidé' };
  }

  // ── Formater la réponse avec totaux ──────────────────────────────────
  private formatCart(cart: Cart) {
    const total = (cart.items ?? []).reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity, 0
    );
    const itemCount = (cart.items ?? []).reduce(
      (sum, item) => sum + item.quantity, 0
    );
    return { ...cart, total: Number(total.toFixed(2)), itemCount } as any;
  }
}