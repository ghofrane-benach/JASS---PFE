import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders — créer une commande
  @Post()
  create(@Body() dto: any) {
    return this.ordersService.create(dto);
  }

  // GET /orders — toutes les commandes (admin)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // GET /orders/user/:email — commandes d'un client
  @Get('user/:email')
  findByUser(@Param('email') email: string) {
    return this.ordersService.findByUser(email);
  }

  // PATCH /orders/:id/status — changer le statut
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}