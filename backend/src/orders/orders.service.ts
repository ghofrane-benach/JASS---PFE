// backend/src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    // ✅ Injection du service email
    private readonly emailService: EmailService,
  ) {}

  async create(dto: {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip?: string;
    payMethod: string;
    subtotal: number;
    shipping: number;
    total: number;
    items: { id: string; name: string; price: number; image: string; qty: number }[];
  }) {
    const order = this.orderRepo.create(dto);
    const saved = await this.orderRepo.save(order);

    // ✅ Envoyer email de confirmation après création
    await this.emailService.sendOrderConfirmation({
      id:        saved.id,
      firstName: saved.firstName,
      email:     saved.email,
      total:     saved.total,
      items:     saved.items,
      city:      saved.city,
      address:   saved.address,
      payMethod: saved.payMethod,
    });

    return saved;
  }

  async findAll() {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    return this.orderRepo.findOne({ where: { id } });
  }

  async findByUser(email: string) {
    return this.orderRepo.find({ where: { email }, order: { createdAt: 'DESC' } });
  }

  async findByEmail(email: string) {
    return this.findByUser(email);
  }

  async updateStatus(id: string, status: string) {
    await this.orderRepo.update(id, { status });
    const order = await this.findOne(id);

    // ✅ Envoyer notification de changement de statut
    if (order) {
      await this.emailService.sendStatusUpdate({
        id:        order.id,
        firstName: order.firstName,
        email:     order.email,
        status:    order.status,
        total:     order.total,
      });
    }

    return order;
  }
}