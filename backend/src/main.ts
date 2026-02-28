import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedCategories } from './seeds/seed-categories';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://frontend:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // ✅ FIX : DataSource récupéré APRÈS création de l'app
  // Toutes les entités sont déjà enregistrées par TypeORM
  const dataSource = app.get(DataSource);

  if (dataSource.isInitialized) {
    await seedCategories(dataSource);
  } else {
    console.log('⚠️  Base de données non connectée — seed ignoré');
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend JASS démarré sur http://localhost:${port}`);
}

bootstrap();