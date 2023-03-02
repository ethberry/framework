import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { emlServiceProvider } from "../../common/providers";
import { OtpModule } from "../otp/otp.module";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";

@Module({
  imports: [ConfigModule, OtpModule],
  providers: [emlServiceProvider, EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
