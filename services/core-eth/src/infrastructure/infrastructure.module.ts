import { Module } from "@nestjs/common";

import { HealthModule } from "./health/health.module";
import { MerchantModule } from "./merchant/merchant.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [HealthModule, MerchantModule, UserModule],
})
export class InfrastructureModule {}
