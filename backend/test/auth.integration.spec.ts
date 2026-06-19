/**
 * Tests d'intégration — Auth Module
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const testUser = {
    firstName: 'Test',
    lastName:  'Integration',
    email:     `test.integration.${Date.now()}@jass.tn`,
    password:  'Test@Pass2026!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
    await app.init();
    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.query(`DELETE FROM "user" WHERE email = $1`, [testUser.email]);
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register').send(testUser).expect(201);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('role', 'user');
    });

    it('should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register').send(testUser).expect(401);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);
      expect(res.body).toHaveProperty('access_token');
    });

    it('should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('should reject non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@jass.tn', password: 'anypassword' })
        .expect(401);
    });
  });

  describe('GET /health', () => {
    it('should return health status with postgresql up', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.info.postgresql.status).toBe('up');
    });

    it('should return liveness status', async () => {
      const res = await request(app.getHttpServer()).get('/health/live').expect(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});
