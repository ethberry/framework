import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { BalanceModule } from "../../blockchain/hierarchy/balance/balance.module";
import { UserModule } from "../user/user.module";
import { SyncService } from "./sync.service";
import { SyncController } from "./sync.controller";

// BUSINESS_TYPE=B2B
@Module({
  imports: [ConfigModule, UserModule, BalanceModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
