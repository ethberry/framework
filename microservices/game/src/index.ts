import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName } from "@framework/constants";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.set("trust proxy", true);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  if (nodeEnv === "production" || nodeEnv === "staging") {
    app.enableShutdownHooks();
  }

  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueEmail = configService.get<string>("RMQ_QUEUE_GAME", "game");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueEmail,
    },
  });

  await app
    .startAllMicroservices()
    .then(() => console.info(`Email service is subscribed to ${rmqUrl}/${rmqQueueEmail}`));

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3012);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
