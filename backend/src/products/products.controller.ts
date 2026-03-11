import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard }   from '../auth/guards/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('search')
  search(@Query('q') q: string, @Query('limit') limit?: number) {
    return this.productsService.search(q ?? '', limit);
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: number) {
    return this.productsService.getPopularProducts(limit);
  }

  @Get('seed')
  seed() {
    return this.productsService.seed();
  }

  @Patch('publish-all')
  publishAll() {
    return this.productsService.publishAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.publish(id);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.unpublish(id);
  }

  // ✅ Nouvelle route — marquer rupture de stock
  @Patch(':id/out-of-stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  outOfStock(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.outOfStock(id);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}