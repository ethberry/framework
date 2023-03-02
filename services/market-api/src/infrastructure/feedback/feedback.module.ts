import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EmailModule } from "../email/email.module";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";

@Module({
  imports: [ConfigModule, EmailModule],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
