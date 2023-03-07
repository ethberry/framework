import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { HealthModule } from "./health/health.module";
import { OtpModule } from "./otp/otp.module";
import { ProfileModule } from "./profile/profile.module";
import { SyncModule } from "./sync/sync.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, EmailModule, HealthModule, OtpModule, ProfileModule, SyncModule, UserModule],
})
export class InfrastructureModule {}
