import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    UsersModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'pfe2026',
      database: 'jass_ecommerce',
      autoLoadEntities: true,
      synchronize: true,
  
    }),
    UsersModule,
  ],
})
export class AppModule {}
