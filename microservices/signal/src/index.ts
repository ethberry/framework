import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName } from "@framework/constants";
import { NodeEnv } from "@framework/types";

import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./common/adapters/redis-io";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useBodyParser("json", { limit: "500kb" });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
  const baseUrl = configService.get<string>("SIGNAL_FE_URL", "http://localhost:3014");

  app.useWebSocketAdapter(new RedisIoAdapter(app));

  app.enableCors({
    origin:
      process.env.NODE_ENV === NodeEnv.development
        ? [
            "http://localhost:3002",
            "http://127.0.0.1:3002",
            "http://0.0.0.0:3002",
            "http://localhost:3004",
            "http://127.0.0.1:3004",
            "http://0.0.0.0:3004",
            "http://localhost:3006",
            "http://127.0.0.1:3006",
            "http://0.0.0.0:3006",
          ]
        : [baseUrl],
    credentials: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.set("trust proxy", true);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("2.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  if (nodeEnv === NodeEnv.production || nodeEnv === NodeEnv.staging) {
    app.enableShutdownHooks();
  }

  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueSignal = configService.get<string>("RMQ_QUEUE_SIGNAL", "signal");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueSignal,
    },
  });

  await app
    .startAllMicroservices()
    .then(() => console.info(`Signal service is subscribed to ${rmqUrl}/${rmqQueueSignal}`));

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<string>("PORT", "3000");

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
