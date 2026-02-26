import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

const mockUser: any = { id: 'mock', role: 'admin' };

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string) {
    return this.productsService.getPopularProducts(limit ? parseInt(limit) : 10);
  }

  @Get('search')
  search(@Query('q') q: string, @Query('limit') limit?: string) {
    return this.productsService.search(q, limit ? parseInt(limit) : 20);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto, mockUser);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto, mockUser);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.productsService.publish(id, mockUser);
  }

  @Patch(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.productsService.unpublish(id, mockUser);
  }

  @Put(':id/stock/decrease')
  decreaseStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateStock(id, quantity);
  }

  @Put(':id/stock/increase')
  increaseStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.increaseStock(id, quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id, mockUser);
  }
}