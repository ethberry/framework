import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { HttpExceptionFilter, HttpValidationPipe } from "@gemunion/nest-js-utils";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm";

import { WATCHER_STORE } from "./common/constants";
import { HealthModule } from "./health/health.module";
import { AppController } from "./app.controller";
import { WatcherModule } from "./watcher/watcher.module";
import ormconfig from "./ormconfig";

@Module({
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const redisWatcherUrl = configService.get<string>("REDIS_WATCHER_URL", "redis://127.0.0.1:6379/2");
        return {
          closeClient: true,
          config: [
            {
              namespace: WATCHER_STORE,
              url: redisWatcherUrl,
            },
          ],
        };
      },
    }),
    HealthModule,
    GemunionTypeormModule.forRoot(ormconfig),
    WatcherModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
