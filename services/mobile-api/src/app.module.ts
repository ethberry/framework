import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { WinstonModule } from "nest-winston";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

import { HttpExceptionFilter, HttpValidationPipe } from "@gemunion/nest-js-utils";
import { FirebaseHttpGuard } from "@gemunion/nest-js-guards";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { HelmetModule } from "@gemunion/nest-js-module-helmet";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston-logdna";
import { RedisProviderType } from "@framework/types";
import { GemunionThrottlerModule, THROTTLE_STORE, ThrottlerHttpGuard } from "@gemunion/nest-js-module-throttler";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";

import { AuthModule } from "./auth/auth.module";
import { EventModule } from "./events/event.module";
import { HealthModule } from "./health/health.module";
import { ProfileModule } from "./profile/profile.module";
import { UserModule } from "./user/user.module";

import ormconfig from "./ormconfig";
import { AppController } from "./app.controller";
import { OtpModule } from "./otp/otp.module";

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
      provide: APP_GUARD,
      useClass: ThrottlerHttpGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [
    ScheduleModule.forRoot(),
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
        const redisStorageUrl = configService.get<string>("REDIS_STORAGE_URL", "redis://127.0.0.1:6379/4");
        const redisThrottleUrl = configService.get<string>("REDIS_THROTTLE_URL", "redis://127.0.0.1:6379/2");
        return {
          config: [
            {
              namespace: RedisProviderType.STORAGE,
              url: redisStorageUrl,
            },
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
    AuthModule,
    EventModule,
    GemunionThrottlerModule,
    HealthModule,
    ProfileModule,
    UserModule,
    OtpModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
