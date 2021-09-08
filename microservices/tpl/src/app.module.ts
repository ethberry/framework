import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";

import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";

import { HandlebarsModule } from "./handlebars/handlebars.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    HandlebarsModule,
  ],
})
export class AppModule {}
