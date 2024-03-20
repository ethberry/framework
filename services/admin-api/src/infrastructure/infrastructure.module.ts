import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { TwoFAModule } from "./2fa/2fa.module";
import { EmailModule } from "./email/email.module";
import { HealthModule } from "./health/health.module";
import { InvitationModule } from "./invitation/invitation.module";
import { MerchantModule } from "./merchant/merchant.module";
import { OtpModule } from "./otp/otp.module";
import { ProfileModule } from "./profile/profile.module";
import { SettingsModule } from "./settings/settings.module";
import { UserModule } from "./user/user.module";
import { NetworkModule } from "./network/network.module";

@Module({
  imports: [
    AuthModule,
    TwoFAModule,
    EmailModule,
    HealthModule,
    InvitationModule,
    MerchantModule,
    NetworkModule,
    OtpModule,
    ProfileModule,
    SettingsModule,
    UserModule,
  ],
})
export class InfrastructureModule {}
