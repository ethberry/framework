import {APP_FILTER, APP_GUARD, APP_PIPE} from "@nestjs/core";
import {Logger, Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {WinstonModule} from "nest-winston";
import {RedisModule, RedisModuleOptions, RedisService} from "nestjs-redis";
import {ThrottlerStorageRedisService} from "nestjs-throttler-storage-redis";

import {HttpExceptionFilter, HttpValidationPipe} from "@trejgun/nest-js-providers";
import {JwtHttpGuard} from "@trejgun/nest-js-guards";
import {RequestLoggerModule} from "@trejgun/nest-js-module-request-logger";
import {PassportInitialize, PassportSession} from "@trejgun/nest-js-module-passport";
import {HelmetModule} from "@trejgun/nest-js-module-helmet";
import {ISessionOptions, SessionModule} from "@trejgun/nest-js-module-session";
import {WinstonConfigService} from "@trejgun/nest-js-module-winston";
import {IS3Options, ISdkOptions, S3Module} from "@trejgun/nest-js-module-s3";
import {ns} from "@trejgun/solo-constants-misc";
import {StorageType} from "@trejgun/solo-types";

import {AuthModule} from "./auth/auth.module";
import {CategoryModule} from "./category/category.module";
import {DatabaseModule} from "./database/database.module";
import {HealthModule} from "./health/health.module";
import {MerchantModule} from "./merchant/merchant.module";
import {OrderModule} from "./order/order.module";
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
      useFactory: (configService: ConfigService): Array<RedisModuleOptions> => {
        const redisSessionUrl = configService.get<string>("REDIS_SESSION_URL", "redis://127.0.0.1:6379/1");
        const redisThrottleUrl = configService.get<string>("REDIS_THROTTLE_URL", "redis://127.0.0.1:6379/2");
        return [
          {
            name: StorageType.SESSION,
            url: redisSessionUrl,
          },
          {
            name: StorageType.THROTTLE,
            url: redisThrottleUrl,
          },
        ];
      },
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule, RedisModule],
      inject: [ConfigService, RedisService],
      useFactory: (configService: ConfigService, redisService: RedisService): ISessionOptions => {
        return {
          client: redisService.getClient(StorageType.SESSION),
          secret: configService.get<string>("COOKIE_SESSION_SECRET", "keyboard_cat"),
          secure: configService.get<string>("NODE_ENV", "development") === "production",
          name: ns,
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
    PassportSession.forRoot(),
    RequestLoggerModule,
    AuthModule,
    CategoryModule,
    HealthModule,
    ProfileModule,
    MerchantModule,
    OrderModule,
    ProductModule,
    PromoModule,
    UserModule,
    ValidationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
