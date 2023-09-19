import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueCron = configService.get<string>("RMQ_QUEUE_CRON", "cron");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueCron,
    },
  });

  await app.startAllMicroservices().then(() => console.info(`Cron service is subscribed to ${rmqUrl}/${rmqQueueCron}`));

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3010);

  await app.listen(port, host, () => {
    console.info(`Cron service health check is running on http://${host}:${port}/health`);
  });
}

void bootstrap();
