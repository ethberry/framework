import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {WinstonModule} from "nest-winston";

import {WinstonConfigService} from "@gemunionstudio/nest-js-module-winston-logdna";
import {RequestLoggerModule} from "@gemunionstudio/nest-js-module-request-logger";

import {EmailModule} from "./email/email.module";
import {HealthModule} from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    RequestLoggerModule,
    HealthModule,
    EmailModule,
  ],
})
export class AppModule {}
