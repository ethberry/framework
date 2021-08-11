import {Controller, Get} from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import {SkipThrottle} from "@nestjs/throttler";
import {RedisHealthIndicator} from "@liaoliaots/nestjs-redis";
import {ConfigService} from "@nestjs/config";
import {Transport} from "@nestjs/microservices";

import {Public} from "@gemunionstudio/nest-js-utils";
import {StorageType} from "@gemunionstudio/framework-types";

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
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");

    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck("DataSase", {
          timeout: 600,
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.ms.pingCheck("RabbitMQ", {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
          },
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.redisIndicator.isHealthy("Redis", {namespace: StorageType.THROTTLE}),
    ]);
  }
}
