import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { emailServiceProvider } from "../common/providers";
import { TokenModule } from "../token/token.module";
import { EmailService } from "./email.service";

@Module({
  imports: [ConfigModule, TokenModule],
  providers: [emailServiceProvider, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
