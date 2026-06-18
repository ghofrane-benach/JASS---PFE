/**
 * Smoke Test K6 — JASS E-Commerce
 * Test rapide pour vérifier que tout fonctionne avant le load test
 * Durée : ~1 minute, 1 VU
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus:      1,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed:   ['rate<0.01'],
  },
};

export default function () {
  // Health
  let res = http.get(`${BASE_URL}/health`);
  check(res, {
    'health OK':        (r) => r.status === 200,
    'postgresql up':    (r) => r.body.includes('"postgresql":{"status":"up"}'),
  });
  sleep(1);

  // Products
  res = http.get(`${BASE_URL}/products?limit=5`);
  check(res, { 'products OK': (r) => r.status === 200 });
  sleep(1);

  // Categories
  res = http.get(`${BASE_URL}/categories`);
  check(res, { 'categories OK': (r) => r.status === 200 });
  sleep(1);
}