/**
 * Tests de régression — JASS E-Commerce
 * Vérifie que les fonctionnalités critiques ne sont pas cassées
 * après chaque modification du code
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Regression Tests — JASS', () => {
  let app: INestApplication;
  let userToken: string;
  let adminToken: string;

  const regressionUser = {
    firstName: 'Regression',
    lastName:  'Test',
    email:     `regression.${Date.now()}@jass.tn`,
    password:  'Regression@2026!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
    await app.init();

    // Créer utilisateur de test
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send(regressionUser);
    userToken = registerRes.body.access_token;

    // Login admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ghofrane26@jass.tn', password: 'benachour@jass2026' });
    adminToken = adminRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Régression 1 : Authentification ───────────────────────────────────────
  describe('REG-001 : Authentification', () => {
    it('REG-001-1 : login retourne un JWT valide', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: regressionUser.email, password: regressionUser.password });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
      expect(res.body.access_token.split('.').length).toBe(3); // JWT format
    });

    it('REG-001-2 : token invalide retourne 401', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });

    it('REG-001-3 : accès admin refusé aux users normaux', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  // ── Régression 2 : Produits ───────────────────────────────────────────────
  describe('REG-002 : Catalogue produits', () => {
    it('REG-002-1 : liste produits accessible sans auth', async () => {
      await request(app.getHttpServer())
        .get('/products')
        .expect(200);
    });

    it('REG-002-2 : catégories toujours présentes', async () => {
      const res = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      const slugs = res.body.map((c: any) => c.slug);
      expect(slugs).toContain('clothing');
      expect(slugs).toContain('scarfs');
      expect(slugs).toContain('accessories');
    });

    it('REG-002-3 : recherche produits fonctionnelle', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/search?q=a')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ── Régression 3 : Commandes ──────────────────────────────────────────────
  describe('REG-003 : Commandes', () => {
    it('REG-003-1 : créer une commande sans auth', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .send({
          firstName: 'Test',
          lastName:  'Regression',
          email:     regressionUser.email,
          phone:     '12345678',
          address:   'Tunis',
          city:      'Tunis',
          payMethod: 'cash',
          subtotal:  100,
          shipping:  7,
          total:     107,
          items:     [{ id: '1', name: 'Test', price: 100, image: '', qty: 1 }],
        });

      expect([200, 201]).toContain(res.status);
    });

    it('REG-003-2 : admin peut voir toutes les commandes', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ── Régression 4 : Health endpoints ──────────────────────────────────────
  describe('REG-004 : Health & Monitoring', () => {
    it('REG-004-1 : /health/live toujours 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      expect(res.body.status).toBe('ok');
    });

    it('REG-004-2 : /health/ready vérifie PostgreSQL', async () => {
      const res = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(res.body.info.postgresql.status).toBe('up');
    });

    it('REG-004-3 : /health complet retourne tous les checks', async () => {
      const res = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(res.body.info).toHaveProperty('postgresql');
      expect(res.body.info).toHaveProperty('memory_heap');
      expect(res.body.info).toHaveProperty('memory_rss');
    });
  });

  // ── Régression 5 : Journal d'audit ────────────────────────────────────────
  describe('REG-005 : Journal d\'audit', () => {
    it('REG-005-1 : audit logs accessible par admin', async () => {
      await request(app.getHttpServer())
        .get('/audit')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('REG-005-2 : audit logs refusé aux users', async () => {
      await request(app.getHttpServer())
        .get('/audit')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});