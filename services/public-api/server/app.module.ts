import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { HttpExceptionFilter, HttpValidationPipe } from "@gemunion/nest-js-utils";
import { JwtHttpGuard } from "@gemunion/nest-js-guards";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { HelmetModule } from "@gemunion/nest-js-module-helmet";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { IS3Options, ISdkOptions, S3Module } from "@gemunion/nest-js-module-s3";
import { THROTTLE_STORE, GemunionThrottlerModule } from "@gemunion/nest-js-module-throttle";

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
    GemunionThrottlerModule,
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
