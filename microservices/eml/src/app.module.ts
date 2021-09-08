import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";

import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { IMailjetOptions, MailjetModule } from "@gemunion/nest-js-module-mailjet";
import { companyName } from "@gemunion/framework-constants-misc";

import { EmailModule } from "./email/email.module";

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
    RequestLoggerModule,
    EmailModule,
  ],
})
export class AppModule {}
