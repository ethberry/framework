import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Logger, Module } from "@nestjs/common";

import { SyncService } from "./sync.service";
import { SyncController } from "./sync.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [Logger, SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
