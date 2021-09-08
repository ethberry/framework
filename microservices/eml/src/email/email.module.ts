import { Module } from "@nestjs/common";

import { MailjetModule } from "@gemunion/nest-js-module-mailjet";

import { EmailController } from "./email.controller";

@Module({
  imports: [MailjetModule.deferred()],
  controllers: [EmailController],
})
export class EmailModule {}
