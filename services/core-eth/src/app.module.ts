import { APP_FILTER } from "@nestjs/core";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { WinstonModule } from "nest-winston";

import { HttpExceptionFilter } from "@gemunion/nest-js-utils";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { GameModule } from "./game/game.module";

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
