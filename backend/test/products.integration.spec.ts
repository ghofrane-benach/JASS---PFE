/**
 * Tests d'intégration — Products Module
 * Teste l'API produits complète avec la vraie base de données
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products Integration Tests', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
    await app.init();

    // Login admin
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email:    'ghofrane26@jass.tn',
        password: 'benachour@jass2026',
      });
    adminToken = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // ── GET /products ──────────────────────────────────────────────────────────
  describe('GET /products', () => {
    it('should return list of products', async () => {
      const res = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(Array.isArray(res.body) || res.body.data).toBeTruthy();
    });

    it('should filter by category slug', async () => {
      const res = await request(app.getHttpServer())
        .get('/products?category=clothing')
        .expect(200);

      expect(res.status).toBe(200);
    });

    it('should support pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/products?limit=5&page=1')
        .expect(200);

      expect(res.status).toBe(200);
    });
  });

  // ── GET /products/popular ─────────────────────────────────────────────────
  describe('GET /products/popular', () => {
    it('should return popular products', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/popular?limit=6')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeLessThanOrEqual(6);
    });
  });

  // ── GET /products/search ──────────────────────────────────────────────────
  describe('GET /products/search', () => {
    it('should search products by query', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/search?q=dress')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return empty array for no results', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/search?q=xyznotexist123')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  // ── GET /categories ───────────────────────────────────────────────────────
  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const res = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const slugs = res.body.map((c: any) => c.slug);
      expect(slugs).toContain('clothing');
      expect(slugs).toContain('scarfs');
      expect(slugs).toContain('accessories');
    });
  });
});