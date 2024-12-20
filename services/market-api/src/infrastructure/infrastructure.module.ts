import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { HealthModule } from "./health/health.module";
import { InvitationModule } from "./invitation/invitation.module";
import { MerchantModule } from "./merchant/merchant.module";
import { NetworkModule } from "./network/network.module";
import { OtpModule } from "./otp/otp.module";
import { PageModule } from "./page/page.module";
import { ProfileModule } from "./profile/profile.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    EmailModule,
    FeedbackModule,
    HealthModule,
    InvitationModule,
    MerchantModule,
    NetworkModule,
    OtpModule,
    PageModule,
    ProfileModule,
    UserModule,
  ],
})
export class InfrastructureModule {}
