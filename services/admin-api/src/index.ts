import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName } from "@framework/constants";
import { BusinessType } from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useBodyParser("json", { limit: "500kb" });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
  const baseUrl = configService.get<string>("ADMIN_FE_URL", "http://localhost:3002");

  app.enableCors({
    origin:
      nodeEnv === NodeEnv.development
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
    .setVersion("2.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  if (nodeEnv === NodeEnv.production || nodeEnv === NodeEnv.staging) {
    app.enableShutdownHooks();
  }

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3001);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
    console.info("NODE_ENV", process.env.NODE_ENV);
    console.info("LOG_MODE", process.env.LOG_MODE === "true");
    console.info("BUSINESS_TYPE B2B", process.env.BUSINESS_TYPE === BusinessType.B2B);
  });
}

void bootstrap();
