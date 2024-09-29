import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { HttpExceptionFilter, HttpValidationPipe } from "@ethberry/nest-js-utils";
import { FirebaseHttpGuard } from "@ethberry/nest-js-guards";
import { RequestLoggerModule } from "@ethberry/nest-js-module-request-logger";
import { HelmetModule } from "@ethberry/nest-js-module-helmet";
import { WinstonConfigService } from "@ethberry/nest-js-module-winston-logdna";
import { EthBerryThrottlerModule, THROTTLE_STORE, ThrottlerBehindProxyGuard } from "@ethberry/nest-js-module-throttler";
import { EthBerryTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";
import { LicenseModule } from "@ethberry/nest-js-module-license";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";

@Module({
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: FirebaseHttpGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
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
    EthBerryTypeormModule.forRoot(ormconfig),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // @ts-ignore
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const redisThrottleUrl = configService.get<string>("REDIS_THROTTLE_URL", "redis://127.0.0.1:6379/2");
        return {
          config: [
            {
              namespace: THROTTLE_STORE,
              url: redisThrottleUrl,
            },
          ],
        };
      },
    }),
    HelmetModule.forRoot({
      contentSecurityPolicy: false,
    }),
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
    RequestLoggerModule,
    EthBerryThrottlerModule,
    BlockchainModule,
    InfrastructureModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
