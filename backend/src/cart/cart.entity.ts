import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

// ── CartItem : une ligne du panier (produit + quantité) ──────────────────
@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @Column()
  cartId: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // Prix snapshot au moment de l'ajout
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ── Cart : le panier d'un utilisateur ────────────────────────────────────
@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Calculé à la volée
  get total(): number {
    return (this.items ?? []).reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity, 0
    );
  }

  get itemCount(): number {
    return (this.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  }
}