// backend/src/audit/audit-log.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

export enum AuditAction {
  // Commandes
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  // Produits
  PRODUCT_CREATED      = 'PRODUCT_CREATED',
  PRODUCT_UPDATED      = 'PRODUCT_UPDATED',
  PRODUCT_DELETED      = 'PRODUCT_DELETED',
  PRODUCT_PUBLISHED    = 'PRODUCT_PUBLISHED',
  PRODUCT_UNPUBLISHED  = 'PRODUCT_UNPUBLISHED',
  PRODUCT_OUT_OF_STOCK = 'PRODUCT_OUT_OF_STOCK',
  PRODUCT_STOCK_UPDATED = 'PRODUCT_STOCK_UPDATED',
  // Comptes
  USER_ROLE_CHANGED    = 'USER_ROLE_CHANGED',
  USER_DELETED         = 'USER_DELETED',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Qui a fait l'action
  @Column({ nullable: true })
  adminId: string;

  @Column({ nullable: true })
  adminEmail: string;

  // Quelle action
  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  // Sur quoi (ex: orderId, productId)
  @Column({ nullable: true })
  targetId: string;

  @Column({ nullable: true })
  targetType: string; // 'order' | 'product' | 'user'

  // Détails de l'action
  @Column({ type: 'jsonb', default: {} })
  details: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}