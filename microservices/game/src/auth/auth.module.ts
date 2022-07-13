import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";

import { ApiKeyStrategy } from "./strategies";

@Module({
  imports: [ConfigModule, PassportModule],
  providers: [ApiKeyStrategy],
})
export class AuthModule {}
