import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Infos client
  @Column({ nullable: true })
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  // Livraison
  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  zip: string;

  // Paiement
  @Column({ default: 'cash' })
  payMethod: string; // 'card' | 'cash'

  // Montants
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 8 })
  shipping: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  // Statut
  @Column({ default: 'pending' })
  status: string; // pending | confirmed | shipped | delivered | cancelled

  // Articles (JSON)
  @Column('json')
  items: {
    id: string;
    name: string;
    price: number;
    image: string;
    qty: number;
  }[];

  @CreateDateColumn()
  createdAt: Date;
}