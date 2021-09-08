import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { RedisHealthIndicator } from "@liaoliaots/nestjs-redis/health";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

import { Public } from "@gemunion/nest-js-utils";
import { StorageType } from "@gemunion/framework-types";

@Public()
@Controller("/health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly ms: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly redisService: RedisService,
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
        this.redisIndicator.checkHealth("Redis", { client: this.redisService.getClient(StorageType.THROTTLE) }),
    ]);
  }
}
