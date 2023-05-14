import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Logger, Module } from "@nestjs/common";

import { MerchantModule } from "../merchant/merchant.module";
import { SyncService } from "./sync.service";
import { SyncController } from "./sync.controller";

@Module({
  imports: [ConfigModule, HttpModule, MerchantModule],
  providers: [Logger, SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
