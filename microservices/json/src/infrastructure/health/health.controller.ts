import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { RedisManager } from "@liaoliaots/nestjs-redis";
import { RedisHealthIndicator } from "@liaoliaots/nestjs-redis-health";
import { ConfigService } from "@nestjs/config";

import { Public } from "@gemunion/nest-js-utils";
import { SkipThrottle, THROTTLE_STORE } from "@gemunion/nest-js-module-throttler";

@Public()
@SkipThrottle(true)
@Controller("/health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly ms: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly redisManager: RedisManager,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck("Postgres", {
          timeout: 600,
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.redisIndicator.checkHealth("Redis", {
          type: "redis",
          client: this.redisManager.getClient(THROTTLE_STORE),
        }),
    ]);
  }
}
