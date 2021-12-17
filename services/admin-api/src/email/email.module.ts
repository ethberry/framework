import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { emlServiceProvider } from "../common/providers";
import { TokenModule } from "../token/token.module";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";

@Module({
  imports: [ConfigModule, TokenModule],
  providers: [emlServiceProvider, EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
