import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { HealthModule } from "./health/health.module";
import { NetworkModule } from "./network/network.module";
import { MerchantModule } from "./merchant/merchant.module";
import { OtpModule } from "./otp/otp.module";
import { PageModule } from "./page/page.module";
import { ProfileModule } from "./profile/profile.module";
import { RatePlanModule } from "./rate-plan/rate-plan.module";
import { SettingsModule } from "./settings/settings.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    EmailModule,
    HealthModule,
    MerchantModule,
    NetworkModule,
    OtpModule,
    PageModule,
    ProfileModule,
    RatePlanModule,
    SettingsModule,
    UserModule,
  ],
})
export class InfrastructureModule {}
