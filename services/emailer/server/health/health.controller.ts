import {Controller, Get} from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";
import {ConfigService} from "@nestjs/config";
import {Transport} from "@nestjs/microservices";

import {EmailHealthIndicator} from "./health.indicator";

@Controller("/health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly emailer: EmailHealthIndicator,
    private readonly ms: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueEmail = this.configService.get<string>("RMQ_QUEUE_EMAIL", "email");

    return this.health.check([
      async (): Promise<HealthIndicatorResult> => this.emailer.isHealthy("emailer"),
      async (): Promise<HealthIndicatorResult> =>
        this.ms.pingCheck("email", {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: rmqQueueEmail,
          },
        }),
    ]);
  }
}
