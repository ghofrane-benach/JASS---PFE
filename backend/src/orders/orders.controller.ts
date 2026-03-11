// backend/src/orders/orders.controller.ts
import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard }   from '../auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ PUBLIC — client crée une commande
  @Post()
  create(@Body() dto: any) {
    return this.ordersService.create(dto);
  }

  // ✅ ADMIN SEULEMENT — voir toutes les commandes
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  // ✅ ADMIN SEULEMENT — changer le statut d'une commande
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  // ✅ CLIENT — voir ses propres commandes uniquement
  @Get('user/:email')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('email') email: string, @Request() req: any) {
    // Sécurité : client voit seulement SES commandes, admin voit tout
    if (req.user.role !== 'admin' && req.user.email !== email) {
      return [];
    }
    return this.ordersService.findByEmail(email);
  }
}
