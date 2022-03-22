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
import { RedisHealthIndicator } from "@liaoliaots/nestjs-redis/health";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

import { Public } from "@gemunion/nest-js-utils";
import { THROTTLE_STORE, SkipThrottle } from "@gemunion/nest-js-module-throttler";

@Public()
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

  @SkipThrottle(true)
  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueBackend = this.configService.get<string>("RMQ_QUEUE_BACKEND", "backend");

    return this.health.check([
      (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck("Postgres", {
          timeout: 300,
        }),
      (): Promise<HealthIndicatorResult> =>
        this.ms.pingCheck("RabbitMQ", {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: rmqQueueBackend,
          },
        }),
      (): Promise<HealthIndicatorResult> =>
        this.redisIndicator.checkHealth("Redis", {
          type: "redis",
          client: this.redisManager.getClient(THROTTLE_STORE),
        }),
    ]);
  }
}
