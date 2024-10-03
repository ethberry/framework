import { Module } from "@nestjs/common";

import { HealthModule } from "./health/health.module";
import { MerchantModule } from "./merchant/merchant.module";
import { SettingsModule } from "./settings/settings.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [HealthModule, MerchantModule, SettingsModule, UserModule],
})
export class InfrastructureModule {}
