import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { ApiKeyGuard } from "@gemunion/nest-js-guards";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { HelmetModule } from "@gemunion/nest-js-module-helmet";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { THROTTLE_STORE } from "@gemunion/nest-js-module-throttler";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";

import ormconfig from "./ormconfig";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { Erc721Module } from "./erc721/erc721.module";
import { Erc1155Module } from "./erc1155/erc1155.module";
import { SyncModule } from "./sync/sync.module";
import { Erc998Module } from "./erc998/erc998.module";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
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
    RequestLoggerModule,
    HealthModule,
    AuthModule,
    Erc721Module,
    Erc998Module,
    Erc1155Module,
    SyncModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
