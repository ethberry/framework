import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
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

  const baseUrl = configService.get<string>("MARKET_FE_URL", "http://localhost:3004");

  app.enableCors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3004", "http://127.0.0.1:3004", "http://0.0.0.0:3004"]
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
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  if (nodeEnv === "production" || nodeEnv === "staging") {
    app.enableShutdownHooks();
  }

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3003);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
