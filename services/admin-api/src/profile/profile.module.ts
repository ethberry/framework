import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { emlServiceProvider } from "../common/providers";
import { AuthModule } from "../auth/auth.module";
import { OtpModule } from "../otp/otp.module";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [AuthModule, UserModule, OtpModule, ConfigModule],
  providers: [ProfileService, emlServiceProvider],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
