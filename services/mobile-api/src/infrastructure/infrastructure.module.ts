import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { UserModule } from "./user/user.module";
import { EmailModule } from "./email/email.module";
import { SyncModule } from "./sync/sync.module";

@Module({
  imports: [AuthModule, ProfileModule, UserModule, EmailModule, SyncModule],
})
export class InfrastructureModule {}
