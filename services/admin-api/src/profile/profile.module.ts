import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { emlServiceProvider } from "../common/providers";
import { AuthModule } from "../auth/auth.module";
import { TokenModule } from "../token/token.module";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [AuthModule, UserModule, TokenModule, ConfigModule],
  providers: [ProfileService, emlServiceProvider],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
