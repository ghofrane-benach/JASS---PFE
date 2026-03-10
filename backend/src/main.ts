import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedCategories } from './seeds/seed-categories';
import { seedAdmin } from './seeds/seed-admin';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ✅ whitelist: false — sinon les champs sans @IsString() etc. sont supprimés
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
    forbidNonWhitelisted: false,
    transform: true,
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend JASS démarré sur http://localhost:${port}`);

  try {
    const dataSource = app.get(DataSource);
    await seedCategories(dataSource);
    await seedAdmin(dataSource);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

bootstrap();