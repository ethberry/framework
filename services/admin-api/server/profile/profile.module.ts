import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { emlServiceProvider } from "../common/providers";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [AuthModule, UserModule, TokenModule, ConfigModule],
  providers: [ProfileService, emlServiceProvider],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
