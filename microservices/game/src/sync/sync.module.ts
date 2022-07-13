import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SyncService } from "./sync.service";
import { SyncController } from "./sync.controller";
import { UserModule } from "../user/user.module";
import { BalanceModule } from "../blockchain/hierarchy/balance/balance.module";

@Module({
  imports: [ConfigModule, UserModule, BalanceModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
