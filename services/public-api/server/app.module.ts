import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Injectable, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerException, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions, RedisService } from "@liaoliaots/nestjs-redis";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";

import { HttpExceptionFilter, HttpValidationPipe } from "@gemunion/nest-js-utils";
import { JwtHttpGuard } from "@gemunion/nest-js-guards";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { HelmetModule } from "@gemunion/nest-js-module-helmet";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { IS3Options, ISdkOptions, S3Module } from "@gemunion/nest-js-module-s3";
import { StorageType } from "@gemunion/framework-types";

import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { MerchantModule } from "./merchant/merchant.module";
import { OrderModule } from "./order/order.module";
import { PageModule } from "./page/page.module";
import { ProductModule } from "./product/product.module";
import { ProfileModule } from "./profile/profile.module";
import { PromoModule } from "./promo/promo.module";
import { UserModule } from "./user/user.module";
import { ValidationModule } from "./validation/validation.module";

import { AppController } from "./app.controller";

@Injectable()
class MyThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): void {
    throw new ThrottlerException("tooManyRequests");
  }
}

@Module({
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtHttpGuard,
    },
    {
      provide: APP_GUARD,
      useClass: MyThrottlerGuard,
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
    DatabaseModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const redisThrottleUrl = configService.get<string>("REDIS_THROTTLE_URL", "redis://127.0.0.1:6379/2");
        return {
          config: [
            {
              namespace: StorageType.THROTTLE,
              url: redisThrottleUrl,
            },
          ],
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, RedisModule],
      inject: [ConfigService, RedisService],
      useFactory: (config: ConfigService, redisService: RedisService) => ({
        ttl: config.get<number>("THROTTLE_TTL", 3600),
        limit: config.get<number>("THROTTLE_LIMIT", 200),
        storage: new ThrottlerStorageRedisService(redisService.getClient(StorageType.THROTTLE)),
      }),
    }),
    HelmetModule.forRoot({
      contentSecurityPolicy: false,
    }),
    S3Module.forRootAsync(S3Module, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ISdkOptions & IS3Options => {
        return {
          region: configService.get<string>("AWS_REGION", ""),
          accessKeyId: configService.get<string>("AWS_ACCESS_KEY_ID", ""),
          secretAccessKey: configService.get<string>("AWS_SECRET_ACCESS_KEY", ""),
          bucket: configService.get<string>("AWS_S3_BUCKET", ""),
        };
      },
    }),
    RequestLoggerModule,
    AuthModule,
    CategoryModule,
    HealthModule,
    MerchantModule,
    OrderModule,
    PageModule,
    ProductModule,
    ProfileModule,
    PromoModule,
    UserModule,
    ValidationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
