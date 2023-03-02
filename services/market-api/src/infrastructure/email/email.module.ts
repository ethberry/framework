import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { emlServiceProvider } from "../../common/providers";
import { EmailService } from "./email.service";

@Module({
  imports: [ConfigModule],
  providers: [emlServiceProvider, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
