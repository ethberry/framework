import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";

import { HttpExceptionFilter, HttpValidationPipe } from "@gemunion/nest-js-utils";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";

import { AppController } from "./app.controller";
import { WebhookModule } from "./webhook/webhook.module";
import { JsonModule } from "./json/json.module";

@Module({
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    WebhookModule,
    JsonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
