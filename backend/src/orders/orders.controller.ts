// backend/src/orders/orders.controller.ts
import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard }   from '../auth/guards/admin.guard';
import { AuditService } from '../audit/audit.service';
import { AuditAction }  from '../audit/audit-log.entity';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly auditService:  AuditService,  // ✅ injection audit
  ) {}

  // PUBLIC — client crée une commande
  @Post()
  create(@Body() dto: any) {
    return this.ordersService.create(dto);
  }

  // ADMIN SEULEMENT — voir toutes les commandes
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  // ADMIN SEULEMENT — changer le statut d'une commande ✅ AUDIT
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    const result = await this.ordersService.updateStatus(id, status);

    // ✅ Enregistrer dans le journal d'audit
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.ORDER_STATUS_CHANGED,
      targetId:   id,
      targetType: 'order',
      details:    { newStatus: status, orderId: id },
    });

    return result;
  }

  // CLIENT — voir ses propres commandes uniquement
  @Get('user/:email')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('email') email: string, @Request() req: any) {
    if (req.user.role !== 'admin' && req.user.email !== email) {
      return [];
    }
    return this.ordersService.findByEmail(email);
  }
}