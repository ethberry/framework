import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { HealthModule } from "./health/health.module";
import { OtpModule } from "./otp/otp.module";
// import { MerchantModule } from "./merchant/merchant.module";
// import { PageModule } from "./page/page.module";
import { ProfileModule } from "./profile/profile.module";
import { SettingsModule } from "./settings/settings.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    EmailModule,
    HealthModule,
    // GEMUNION_BUSINESS_MODEL:B2C
    // MerchantModule,
    OtpModule,
    // GEMUNION_BUSINESS_MODEL:B2C
    // PageModule,
    ProfileModule,
    SettingsModule,
    UserModule,
  ],
})
export class InfrastructureModule {}
