import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName } from "@framework/constants";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueGame = configService.get<string>("RMQ_QUEUE_GAME", "game");

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueGame,
    },
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const options = new DocumentBuilder()
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.startAllMicroservices();

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3022);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
