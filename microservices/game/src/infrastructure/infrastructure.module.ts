import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { MerchantModule } from "./merchant/merchant.module";
import { SyncModule } from "./sync/sync.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, HealthModule, MerchantModule, SyncModule, UserModule],
})
export class InfrastructureModule {}
