import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EmailType } from "@framework/types";
import { IEmailResult, MailjetService } from "@gemunion/nest-js-module-mailjet";

import { IPayload } from "./interfaces";

@Controller()
export class EmailController {
  constructor(private readonly mailjetService: MailjetService) {}

  @EventPattern(EmailType.DUMMY)
  async welcome(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 4921134,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
      },
    });
  }

  @EventPattern(EmailType.FEEDBACK)
  async feedback(@Payload() payload: IPayload): Promise<any> {
    return this.mailjetService.sendTemplate({
      template: 4921119,
      to: ["info@gemunion.io"],
      data: {
        displayName: payload.user.displayName,
        text: payload.feedback.text,
      },
    });
  }

  // INTEGRATION:CHAIN-LINK
  @EventPattern(EmailType.LINK_TOKEN)
  async linkToken(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 4921143,
      to: [payload.user.email],
      data: {
        title: payload.contract.title,
        address: payload.contract.address,
      },
    });
  }
}
