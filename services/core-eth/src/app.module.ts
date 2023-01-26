import { APP_FILTER } from "@nestjs/core";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { WinstonModule } from "nest-winston";

import { HttpExceptionFilter } from "@gemunion/nest-js-utils";
import { RequestLoggerModule } from "@gemunion/nest-js-module-request-logger";
import { WinstonConfigService } from "@gemunion/nest-js-module-winston";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";

import ormconfig from "./ormconfig";
import { HealthModule } from "./health/health.module";
import { AppController } from "./app.controller";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { NotificatorModule } from "./notificator/notificator.module";
import { IntegrationsModule } from "./integrations/integrations.module";

@Module({
  providers: [
    Logger,
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
    GemunionTypeormModule.forRoot(ormconfig),
    LicenseModule.forRootAsync(LicenseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>("GEMUNION_API_KEY", "");
      },
    }),
    ScheduleModule.forRoot(),
    RequestLoggerModule,
    HealthModule,
    BlockchainModule,
    IntegrationsModule,
    NotificatorModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.info(signal); // e.g. "SIGINT"
  }
}
