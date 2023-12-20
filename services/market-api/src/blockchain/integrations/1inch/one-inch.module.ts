import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

import { ThrottlerModule } from "@gemunion/nest-js-module-throttler";

import { OneInchService } from "./one-inch.service";
import { OneInchController } from "./one-inch.controller";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1500,
        limit: 1,
      },
    ]),
  ],
  providers: [OneInchService],
  controllers: [OneInchController],
  exports: [OneInchService],
})
export class OneInchModule {}
