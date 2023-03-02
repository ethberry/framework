import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { UserModule } from "./user/user.module";
import { SettingsModule } from "./settings/settings.module";
import { PageModule } from "./page/page.module";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [AuthModule, ProfileModule, UserModule, SettingsModule, PageModule, EmailModule],
})
export class InfrastructureModule {}
