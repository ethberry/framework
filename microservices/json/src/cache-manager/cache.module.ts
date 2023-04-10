import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisManager } from "@liaoliaots/nestjs-redis";
import { CacheModule, CacheModuleAsyncOptions, CacheInterceptor } from "@nestjs/cache-manager";
import { redisInsStore } from "cache-manager-ioredis-yet";

import { CACHE_STORE } from "./cache.constants";

@Module({
  imports: [
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      imports: [ConfigModule],
      inject: [ConfigService, RedisManager],
      useFactory: (configService: ConfigService, redisManager: RedisManager) => {
        return {
          ttl: configService.get<number>("CACHE_TTL", 3600),
          max: configService.get<number>("CACHE_MAX", 1000),
          store: redisInsStore(redisManager.getClient(CACHE_STORE)),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class GemunionCacheModule {}
