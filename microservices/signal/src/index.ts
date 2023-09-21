import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName } from "@framework/constants";

import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./common/adapters/redis-io";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const baseUrl = configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

  app.useWebSocketAdapter(new RedisIoAdapter(app));

  app.enableCors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:3005",
            "http://127.0.0.1:3005",
            "http://0.0.0.0:3005",
            "http://localhost:3009",
            "http://127.0.0.1:3009",
            "http://0.0.0.0:3009",
          ]
        : [baseUrl],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
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

  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  if (nodeEnv === "production" || nodeEnv === "staging") {
    app.enableShutdownHooks();
  }

  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueMobile = configService.get<string>("RMQ_QUEUE_SIGNAL", "signal");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueMobile,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app
    .startAllMicroservices()
    .then(() => console.info(`Mobile service is subscribed to ${rmqUrl}/${rmqQueueMobile}`));

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<string>("PORT", "3000");

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
