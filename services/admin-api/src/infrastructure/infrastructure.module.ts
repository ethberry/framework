import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
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
