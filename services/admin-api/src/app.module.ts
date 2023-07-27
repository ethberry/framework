import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { HttpExceptionFilter, HttpValidationPipe, ValidationExceptionFilter } from "@gemunion/nest-js-utils";
import { FirebaseHttpGuard } from "@gemunion/nest-js-guards";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { HelmetModule } from "@gemunion/nest-js-module-helmet";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { GemunionThrottlerModule, THROTTLE_STORE, ThrottlerHttpGuard } from "@gemunion/nest-js-module-throttler";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { EcommerceModule } from "./ecommerce/ecommecre.module";
import { AchievementModule } from "./achievements/achievement.module";

@Module({
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
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
      useClass: ThrottlerHttpGuard,
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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
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
    RequestLoggerModule,
    GemunionThrottlerModule,
    BlockchainModule,
    InfrastructureModule,
    EcommerceModule,
    AchievementModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
