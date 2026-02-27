import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
//import { CategoriesModule } from './categories/categories.module';
//import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // 1. Charger les variables d'environnement en premier
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. TypeORM avec ConfigService (lecture du .env)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'db'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME', 'jass_ecommerce'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        retryAttempts: 5,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    //CategoriesModule,
    //ProductsModule,
  ],
})
export class AppModule {}