import {
  IsString, IsNotEmpty, IsOptional, IsNumber,
  IsBoolean, IsArray, IsEnum, IsUUID, MinLength, MaxLength, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../types/product-status.enum';

export class CreateProductDto {
  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(255) name: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @Min(0) @Type(() => Number) price: number;
  @IsNumber() @IsOptional() @Min(0) @Type(() => Number) costPrice?: number;
  @IsNumber() @IsOptional() @Min(0) @Type(() => Number) stock?: number;
  @IsString() @IsOptional() @MaxLength(100) sku?: string;
  @IsString() @IsOptional() @MaxLength(100) brand?: string;
  @IsNumber() @IsOptional() @Min(0) @Type(() => Number) weight?: number;
  @IsOptional() dimensions?: Record<string, number>;
  @IsArray() @IsOptional() images?: string[];
  @IsOptional() metadata?: Record<string, any>;
  @IsBoolean() @IsOptional() isActive?: boolean;
  @IsEnum(ProductStatus) @IsOptional() status?: ProductStatus;
  @IsUUID() @IsOptional() categoryId?: string;
}