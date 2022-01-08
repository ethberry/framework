import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle("Transaction watcher")
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueWatcher = configService.get<string>("RMQ_QUEUE_WATCHER_IN", "watcher_in");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueWatcher,
    },
  });

  await app
    .startAllMicroservices()
    .then(() => console.info(`API server service is subscribed to ${rmqUrl}/${rmqQueueWatcher}`));

  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  if (nodeEnv === "production" || nodeEnv === "staging") {
    app.enableShutdownHooks();
  }

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3000);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
