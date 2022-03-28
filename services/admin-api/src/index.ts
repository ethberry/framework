import { NestFactory } from "@nestjs/core";
import { LoggerService } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName } from "@gemunion/framework-constants";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const loggerService = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(loggerService);

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

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.set("trust proxy", true);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  if (nodeEnv === "production" || nodeEnv === "staging") {
    app.enableShutdownHooks();
  }

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3001);

  await app.listen(port, host, () => {
    loggerService.log(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
