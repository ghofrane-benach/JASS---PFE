import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  findByEmail(email: string) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
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
    return this.orderRepo.save(order);
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

  async updateStatus(id: string, status: string) {
    await this.orderRepo.update(id, { status });
    return this.findOne(id);
  }
}