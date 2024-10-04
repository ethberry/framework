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
import { EthersModule, IModuleOptions, EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { NodeEnv } from "@ethberry/constants";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { GameModule } from "./game/game.module";
import { DiscoveryModule } from "@golevelup/nestjs-discovery";
import { CronExpression, SettingsKeys } from "@framework/types";
import { SettingsModule } from "./infrastructure/settings/settings.module";
import { SettingsService } from "./infrastructure/settings/settings.service";
import { OnModuleDestroy } from "@nestjs/common/interfaces/hooks/on-destroy.interface";

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
    EthersModule.forRootAsync(EthersModule, {
      imports: [ConfigModule, SettingsModule],
      inject: [ConfigService, SettingsService],
      useFactory: async (configService: ConfigService, settingsService: SettingsService): Promise<IModuleOptions> => {
        const latency = ~~configService.get<string>("LATENCY", "32");
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const cronSchedule = configService.get<string>("CRON_SCHEDULE", CronExpression.EVERY_30_SECONDS);
        const fromBlock = await settingsService.retrieveByKey(SettingsKeys.STARTING_BLOCK_ETHBERRY_BESU);
        return Promise.resolve({
          latency,
          fromBlock,
          chunkSize: 100,
          debug: nodeEnv === NodeEnv.development,
          cron: Object.values(CronExpression)[Object.keys(CronExpression).indexOf(cronSchedule)],
        });
      },
    }),
    ScheduleModule.forRoot(),
    RequestLoggerModule,
    BlockchainModule,
    GameModule,
    InfrastructureModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationShutdown, OnModuleDestroy {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly ethersService: EthersService,
  ) {}

  public async onModuleDestroy(): Promise<void> {
    const lastProcessedBlock = await this.ethersService.getLastBlock();
    await this.settingsService.update(SettingsKeys.STARTING_BLOCK_ETHBERRY_BESU, lastProcessedBlock);
  }

  public onApplicationShutdown(signal: string): void {
    console.info(signal); // e.g. "SIGINT"
  }
}
