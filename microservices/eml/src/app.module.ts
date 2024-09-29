import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";

import { WinstonConfigService } from "@ethberry/nest-js-module-winston-logdna";
import { RequestLoggerModule } from "@ethberry/nest-js-module-request-logger";
import type { IMailjetOptions } from "@ethberry/nest-js-module-mailjet";
import { MailjetModule } from "@ethberry/nest-js-module-mailjet";
import { LicenseModule } from "@ethberry/nest-js-module-license";
import { companyName } from "@framework/constants";

import { InfrastructureModule } from "./infrastructure/infrastructure.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    MailjetModule.forRootAsync(MailjetModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): IMailjetOptions => {
        return {
          publicKey: configService.get<string>("MAILJET_PUBLIC_KEY", ""),
          privateKey: configService.get<string>("MAILJET_PRIVATE_KEY", ""),
          from: configService.get<string>("MAILJET_FROM", ""),
          name: companyName,
        };
      },
    }),
    LicenseModule.forRootAsync(LicenseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>("ETHBERRY_API_KEY", "");
      },
    }),
    RequestLoggerModule,
    InfrastructureModule,
  ],
})
export class AppModule {}
