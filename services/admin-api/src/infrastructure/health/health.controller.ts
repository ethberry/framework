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
import { Transport } from "@nestjs/microservices";

import { Public } from "@ethberry/nest-js-utils";
import { SkipThrottle, THROTTLE_STORE } from "@ethberry/nest-js-module-throttler";

@Public()
@SkipThrottle({ default: true })
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
    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");

    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck("Postgres", {
          timeout: 1200,
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.ms.pingCheck("RabbitMQ", {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
          },
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.redisIndicator.checkHealth("Redis", {
          type: "redis",
          client: this.redisManager.getClient(THROTTLE_STORE),
        }),
    ]);
  }
}
