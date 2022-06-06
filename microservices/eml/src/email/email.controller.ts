import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EmailType } from "@framework/types";
import { IEmailResult, MailjetService } from "@gemunion/nest-js-module-mailjet";

import { IPayload } from "./interfaces";

@Controller("/")
export class EmailController {
  constructor(private readonly mailjetService: MailjetService) {}

  @EventPattern(EmailType.DUMMY)
  async welcome(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 12345,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
      },
    });
  }
}
