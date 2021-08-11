import {APP_FILTER, APP_GUARD, APP_PIPE} from "@nestjs/core";
import {Logger, Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {WinstonModule} from "nest-winston";
import {RedisModule, RedisModuleOptions, RedisService} from "@liaoliaots/nestjs-redis";
import {ThrottlerStorageRedisService} from "nestjs-throttler-storage-redis";

import {HttpExceptionFilter, HttpValidationPipe} from "@gemunionstudio/nest-js-providers";
import {JwtHttpGuard} from "@gemunionstudio/nest-js-guards";
import {RequestLoggerModule} from "@gemunionstudio/nest-js-module-request-logger";
import {PassportInitialize} from "@gemunionstudio/nest-js-module-passport";
import {HelmetModule} from "@gemunionstudio/nest-js-module-helmet";
import {WinstonConfigService} from "@gemunionstudio/nest-js-module-winston-logdna";
import {IS3Options, ISdkOptions, S3Module} from "@gemunionstudio/nest-js-module-s3";
import {StorageType} from "@gemunionstudio/solo-types";

import {RolesGuard} from "./common/guards";
import {AuthModule} from "./auth/auth.module";
import {CategoryModule} from "./category/category.module";
import {DatabaseModule} from "./database/database.module";
import {EmailModule} from "./email/email.module";
import {HealthModule} from "./health/health.module";
import {MerchantModule} from "./merchant/merchant.module";
import {OrderModule} from "./order/order.module";
import {PageModule} from "./page/page.module";
import {PhotoModule} from "./photo/photo.module";
import {ProductModule} from "./product/product.module";
import {ProfileModule} from "./profile/profile.module";
import {PromoModule} from "./promo/promo.module";
import {UserModule} from "./user/user.module";
import {ValidationModule} from "./validation/validation.module";

import {AppController} from "./app.controller";

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
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
    S3Module.forRootAsync({
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
    PassportInitialize.forRoot(),
    RequestLoggerModule,
    AuthModule,
    CategoryModule,
    EmailModule,
    HealthModule,
    MerchantModule,
    OrderModule,
    PageModule,
    PhotoModule,
    ProductModule,
    ProfileModule,
    PromoModule,
    UserModule,
    ValidationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
