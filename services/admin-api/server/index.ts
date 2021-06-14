import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {useContainer} from "class-validator";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";

import {companyName, ns} from "@trejgun/solo-constants-misc";

import {AppModule} from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const baseUrl = configService.get<string>("ADMIN_FE_URL", "http://localhost:3002");

  app.enableCors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3002", "http://127.0.0.1:3002", "http://0.0.0.0:3002"]
        : [baseUrl],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  });

  useContainer(app.select(AppModule), {fallbackOnErrors: true});

  app.set("trust proxy", true);

  const options = new DocumentBuilder()
    .addCookieAuth(ns)
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueWebhook = configService.get<string>("RMQ_QUEUE_WEBHOOK", "webhook");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueWebhook,
    },
  });

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3000);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
