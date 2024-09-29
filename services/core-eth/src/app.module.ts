import { APP_FILTER } from "@nestjs/core";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { WinstonModule } from "nest-winston";

import { HttpExceptionFilter } from "@ethberry/nest-js-utils";
import { RequestLoggerModule } from "@ethberry/nest-js-module-request-logger";
import { WinstonConfigService } from "@ethberry/nest-js-module-winston-logdna";
import { LicenseModule } from "@ethberry/nest-js-module-license";
import { EthBerryTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { GameModule } from "./game/game.module";
import { DiscoveryModule } from "@golevelup/nestjs-discovery";

@Module({
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    EthBerryTypeormModule.forRoot(ormconfig),
    LicenseModule.forRootAsync(LicenseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>("ETHBERRY_API_KEY", "");
      },
    }),
    SecretManagerModule.forRootAsync(SecretManagerModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          keyFile: configService.get<string>("GCLOUD_KEYFILE_BASE64_PATH", ""),
        };
      },
    }),
    ScheduleModule.forRoot(),
    RequestLoggerModule,
    BlockchainModule,
    GameModule,
    InfrastructureModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.info(signal); // e.g. "SIGINT"
  }
}
