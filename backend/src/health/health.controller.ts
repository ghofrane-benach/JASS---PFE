import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  // ── GET /health ─────────────────────────────────────────────────────────
  // Endpoint principal pour Azure Traffic Manager health probe
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Vérifier la connexion PostgreSQL
      () => this.db.pingCheck('postgresql', { timeout: 3000 }),

      // Mémoire heap < 512MB
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),

      // Mémoire RSS < 1GB
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
    ]);
  }

  // ── GET /health/live ─────────────────────────────────────────────────────
  // Kubernetes liveness probe — l'app tourne-t-elle ?
  @Get('live')
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  // ── GET /health/ready ────────────────────────────────────────────────────
  // Kubernetes readiness probe — prête à recevoir du trafic ?
  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('postgresql', { timeout: 3000 }),
    ]);
  }
}