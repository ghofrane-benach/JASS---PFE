import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class AddItemDto {
  productId: string;
  quantity?: number;
}

class UpdateItemDto {
  quantity: number;
}

@Controller('cart')
@UseGuards(JwtAuthGuard) // Toutes les routes nécessitent un JWT
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET /cart — récupérer le panier
  @Get()
  getCart(@Request() req) {
    return this.cartService.getOrCreate(req.user.id);
  }

  // POST /cart/items — ajouter un produit
  @Post('items')
  addItem(@Request() req, @Body() body: AddItemDto) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity ?? 1);
  }

  // PATCH /cart/items/:itemId — modifier la quantité
  @Patch('items/:itemId')
  updateItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() body: UpdateItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, itemId, body.quantity);
  }

  // DELETE /cart/items/:itemId — supprimer un item
  @Delete('items/:itemId')
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  // DELETE /cart — vider le panier
  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}