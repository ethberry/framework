import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

import { ValidateReCaptcha } from "@gemunion/nest-js-validators";

import { UserModule } from "../user/user.module";

@Module({
  imports: [HttpModule, UserModule, ConfigModule],
  providers: [ValidateReCaptcha],
})
export class ValidationModule {}
