import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { WinstonModule } from "nest-winston";

import { WinstonConfigService } from "@ethberry/nest-js-module-winston-logdna";
import { RequestLoggerModule } from "@ethberry/nest-js-module-request-logger";
import { LicenseModule } from "@ethberry/nest-js-module-license";
import { GemunionTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";

import ormconfig from "./ormconfig";

import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { BlockchainModule } from "./blockchain/blockchain.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    GemunionTypeormModule.forRoot(ormconfig),
    LicenseModule.forRootAsync(LicenseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>("GEMUNION_API_KEY", "");
      },
    }),
    ScheduleModule.forRoot(),
    RequestLoggerModule,
    InfrastructureModule,
    BlockchainModule,
  ],
})
export class AppModule {}
