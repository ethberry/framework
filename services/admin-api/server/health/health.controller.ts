import {Controller, Get} from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import {ConfigService} from "@nestjs/config";
import {Transport} from "@nestjs/microservices";

import {Public} from "@trejgun/nest-js-providers";

@Public()
@Controller("/health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly ms: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueEmail = this.configService.get<string>("RMQ_QUEUE_EMAIL", "email");
    const rmqQueueWebhook = this.configService.get<string>("RMQ_QUEUE_WEBHOOK", "webhook");

    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck("database", {
          timeout: 300,
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.ms.pingCheck("email", {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: rmqQueueEmail,
          },
        }),
      async (): Promise<HealthIndicatorResult> =>
        this.ms.pingCheck("webhook", {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: rmqQueueWebhook,
          },
        }),
    ]);
  }
}
