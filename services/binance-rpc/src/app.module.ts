import { APP_FILTER } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";

import { HttpExceptionFilter } from "@gemunion/nest-js-utils";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";

import ormconfig from "./ormconfig";
import { HealthModule } from "./health/health.module";
import { AppController } from "./app.controller";
import { VestingModule } from "./vesting/vesting.module";
import { Erc20Module } from "./erc20/erc20.module";
import { Erc721Module } from "./erc721/erc721.module";
import { Erc1155Module } from "./erc1155/erc1155.module";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { ContractManagerModule } from "./contract-manager/contract-manager.module";

@Module({
  providers: [
    Logger,
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
    GemunionTypeormModule.forRoot(ormconfig),
    LicenseModule.forRootAsync(LicenseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>("GEMUNION_API_KEY", "");
      },
    }),
    RequestLoggerModule,
    HealthModule,
    BlockchainModule,
    ContractManagerModule,
    VestingModule,
    Erc20Module,
    Erc721Module,
    Erc1155Module,
  ],
  controllers: [AppController],
})
export class AppModule {}
