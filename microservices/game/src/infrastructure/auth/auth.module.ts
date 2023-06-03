import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";

import { ApiKeyStrategy } from "./strategies";
import { MerchantModule } from "../merchant/merchant.module";

@Module({
  imports: [ConfigModule, PassportModule, MerchantModule],
  providers: [ApiKeyStrategy],
})
export class AuthModule {}
