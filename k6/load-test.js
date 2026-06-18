import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Métriques personnalisées ───────────────────────────────────────────────
const errorRate      = new Rate('error_rate');
const productsTrend  = new Trend('products_duration');
const authTrend      = new Trend('auth_duration');
const checkoutTrend  = new Trend('checkout_duration');
const healthTrend    = new Trend('health_duration');
const totalRequests  = new Counter('total_requests');

// ── Configuration ──────────────────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ── Scénarios de charge ────────────────────────────────────────────────────
export const options = {
  scenarios: {
    // Scénario 1 : Montée en charge progressive
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10  },  // montée à 10 users
        { duration: '2m', target: 50  },  // montée à 50 users
        { duration: '3m', target: 100 },  // charge max 100 users
        { duration: '1m', target: 0   },  // descente
      ],
      gracefulRampDown: '30s',
    },

    // Scénario 2 : Charge constante (stress test)
    constant_load: {
      executor: 'constant-vus',
      vus: 50,
      duration: '3m',
      startTime: '7m',  // démarre après le ramp_up
    },
  },

  // ── Seuils d'acceptation (réponse à la remarque encadrant) ─────────────
  thresholds: {
    // Latence globale
    http_req_duration: [
      'p(50)<500',   // 50% des requêtes < 500ms
      'p(95)<2000',  // 95% des requêtes < 2s
      'p(99)<5000',  // 99% des requêtes < 5s
    ],
    // Taux d'erreur
    error_rate:      ['rate<0.05'],  // < 5% d'erreurs
    http_req_failed: ['rate<0.05'],  // < 5% d'échecs HTTP

    // Métriques par endpoint
    products_duration: ['p(95)<1000'],  // produits < 1s
    auth_duration:     ['p(95)<2000'],  // auth < 2s
    health_duration:   ['p(95)<500'],   // health < 500ms
  },
};

// ── Données de test ────────────────────────────────────────────────────────
const TEST_USER = {
  email:    'test-k6@jass.com',
  password: 'Test@K6Pass2026',
  name:     'K6 Test User',
};

// ── Scénario principal ─────────────────────────────────────────────────────
export default function () {
  // 1. Health Check
  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health/live`);
    const ok  = check(res, {
      'health status 200': (r) => r.status === 200,
      'health ok':         (r) => JSON.parse(r.body).status === 'ok',
    });
    errorRate.add(!ok);
    healthTrend.add(res.timings.duration);
    totalRequests.add(1);
  });

  sleep(0.5);

  // 2. Navigation produits
  group('Browse Products', () => {
    // Liste des produits
    const res1 = http.get(`${BASE_URL}/products?limit=12&page=1`);
    check(res1, {
      'products list 200': (r) => r.status === 200,
      'products not empty': (r) => {
        try { return JSON.parse(r.body).length > 0; }
        catch { return false; }
      },
    });
    productsTrend.add(res1.timings.duration);
    totalRequests.add(1);

    sleep(1);

    // Produits populaires
    const res2 = http.get(`${BASE_URL}/products/popular?limit=6`);
    check(res2, { 'popular products 200': (r) => r.status === 200 });
    totalRequests.add(1);

    sleep(0.5);

    // Recherche
    const res3 = http.get(`${BASE_URL}/products/search?q=dress`);
    check(res3, { 'search 200': (r) => r.status === 200 });
    totalRequests.add(1);

    sleep(0.5);

    // Catégories
    const res4 = http.get(`${BASE_URL}/categories`);
    check(res4, { 'categories 200': (r) => r.status === 200 });
    totalRequests.add(1);
  });

  sleep(1);

  // 3. Authentification
  group('Authentication', () => {
    const payload = JSON.stringify({
      email:    TEST_USER.email,
      password: TEST_USER.password,
    });

    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(`${BASE_URL}/auth/login`, payload, params);

    const ok = check(res, {
      'login status 200 or 401': (r) => r.status === 200 || r.status === 401,
      'response time ok':        (r) => r.timings.duration < 2000,
    });

    errorRate.add(res.status >= 500);
    authTrend.add(res.timings.duration);
    totalRequests.add(1);
  });

  sleep(1);
}

// ── Setup : créer l'utilisateur de test ───────────────────────────────────
export function setup() {
  const payload = JSON.stringify({
    firstName: 'K6',
    lastName:  'Test',
    email:     TEST_USER.email,
    password:  TEST_USER.password,
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(`${BASE_URL}/auth/register`, payload, params);

  console.log(`Setup: register status = ${res.status}`);
  return { baseUrl: BASE_URL };
}

// ── Teardown : résumé ──────────────────────────────────────────────────────
export function teardown(data) {
  console.log(`\n====== K6 Load Test Complete ======`);
  console.log(`Base URL: ${data.baseUrl}`);
  console.log(`===================================\n`);
}