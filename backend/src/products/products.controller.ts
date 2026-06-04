// backend/src/products/products.controller.ts
import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, ParseUUIDPipe, UseGuards, Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard }   from '../auth/guards/admin.guard';
import { AuditService } from '../audit/audit.service';
import { AuditAction }  from '../audit/audit-log.entity';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly auditService:    AuditService,  // injection audit
  ) {}

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

  //  AUDIT — création produit
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateProductDto, @Request() req: any) {
    const result = await this.productsService.create(dto);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_CREATED,
      targetId:   result.id,
      targetType: 'product',
      details:    { productName: result.name, price: result.price },
    });
    return result;
  }

  // ✅ AUDIT — modification produit
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @Request() req: any,
  ) {
    const result = await this.productsService.update(id, dto);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_UPDATED,
      targetId:   id,
      targetType: 'product',
      details:    { updatedFields: Object.keys(dto) },
    });
    return result;
  }

  // ✅ AUDIT — publication produit
  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async publish(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const result = await this.productsService.publish(id);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_PUBLISHED,
      targetId:   id,
      targetType: 'product',
      details:    { productId: id },
    });
    return result;
  }

  // ✅ AUDIT — dépublication produit
  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async unpublish(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const result = await this.productsService.unpublish(id);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_UNPUBLISHED,
      targetId:   id,
      targetType: 'product',
      details:    { productId: id },
    });
    return result;
  }

  // ✅ AUDIT — rupture de stock
  @Patch(':id/out-of-stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async outOfStock(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const result = await this.productsService.outOfStock(id);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_OUT_OF_STOCK,
      targetId:   id,
      targetType: 'product',
      details:    { productId: id },
    });
    return result;
  }

  // ✅ AUDIT — mise à jour stock
  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity') quantity: number,
    @Request() req: any,
  ) {
    const result = await this.productsService.updateStock(id, quantity);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_STOCK_UPDATED,
      targetId:   id,
      targetType: 'product',
      details:    { newQuantity: quantity },
    });
    return result;
  }

  // AUDIT — suppression produit
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const result = await this.productsService.remove(id);
    await this.auditService.log({
      adminId:    req.user?.id,
      adminEmail: req.user?.email,
      action:     AuditAction.PRODUCT_DELETED,
      targetId:   id,
      targetType: 'product',
      details:    { productId: id },
    });
    return result;
  }
}