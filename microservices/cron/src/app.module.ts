import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";

import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { LicenseModule } from "@gemunion/nest-js-module-license";

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
    LicenseModule.forRootAsync(LicenseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>("GEMUNION_API_KEY", "");
      },
    }),
    RequestLoggerModule,
    InfrastructureModule,
  ],
})
export class AppModule {}
