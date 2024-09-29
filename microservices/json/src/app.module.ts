import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { ApiKeyGuard } from "@ethberry/nest-js-guards";
import { RequestLoggerModule } from "@ethberry/nest-js-module-request-logger";
import { HelmetModule } from "@ethberry/nest-js-module-helmet";
import { WinstonConfigService } from "@ethberry/nest-js-module-winston-logdna";
import { GemunionThrottlerModule, THROTTLE_STORE, ThrottlerBehindProxyGuard } from "@ethberry/nest-js-module-throttler";
import { GemunionTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";
import { CACHE_STORE, GemunionCacheModule, CacheInterceptor } from "@ethberry/nest-js-module-cache";
import { LicenseModule } from "@ethberry/nest-js-module-license";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { BlockchainModule } from "./blockchain/blockchain.module";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
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
        const redisCacheUrl = configService.get<string>("REDIS_CACHE_URL", "redis://127.0.0.1:6379/15");
        return {
          config: [
            {
              namespace: THROTTLE_STORE,
              url: redisThrottleUrl,
            },
            {
              namespace: CACHE_STORE,
              url: redisCacheUrl,
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
    RequestLoggerModule,
    GemunionThrottlerModule,
    GemunionCacheModule,
    BlockchainModule,
    InfrastructureModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
