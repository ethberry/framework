import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

@Controller("/health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly ms: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueEmail = this.configService.get<string>("RMQ_QUEUE_EMAIL", "eml");

    return this.health.check([
      (): Promise<HealthIndicatorResult> =>
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
