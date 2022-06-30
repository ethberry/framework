import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SyncService } from "./sync.service";
import { SyncController } from "./sync.controller";
import { UserModule } from "../user/user.module";
import { UniBalanceModule } from "../blockchain/uni-token/uni-balance/uni-balance.module";

@Module({
  imports: [ConfigModule, UserModule, UniBalanceModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
