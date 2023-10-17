import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Logger, Module } from "@nestjs/common";

import { RmqService } from "./rmq.service";
// import { SyncController } from "./sync.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [Logger, RmqService],
  // controllers: [SyncController],
  exports: [RmqService],
})
export class RmqModule {}
