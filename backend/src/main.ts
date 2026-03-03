import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedCategories } from './seeds/seed-categories';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;

  // ✅ app.listen() D'ABORD — TypeORM est prêt seulement après
  await app.listen(port); 
  console.log(`🚀 Backend JASS démarré sur http://localhost:${port}`);

  // ✅ Seed APRÈS que l'app soit complètement démarrée
  try {
    const dataSource = app.get(DataSource);
    await seedCategories(dataSource);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

bootstrap();