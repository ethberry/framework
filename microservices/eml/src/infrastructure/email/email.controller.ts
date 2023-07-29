import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EmailType } from "@framework/types";
import { IEmailResult, MailjetService } from "@gemunion/nest-js-module-mailjet";

import type { IContactPayload, IPayload, IVrfPayload } from "./interfaces";

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
      to: ["trejgun@gemunion.io"],
      data: {
        displayName: payload.user.displayName,
        text: payload.feedback.text,
      },
    });
  }

  @EventPattern(EmailType.CONTACT)
  async contact(@Payload() payload: IContactPayload): Promise<any> {
    return this.mailjetService.sendTemplate({
      template: 4976528,
      to: ["trejgun@gemunion.io"],
      data: {
        contactType: payload.contactType,
        displayName: payload.displayName,
        email: payload.email,
        companyName: payload.companyName,
        jobTitle: payload.jobTitle,
        text: payload.text,
        features: payload.features,
      },
    });
  }

  // INTEGRATION:CHAIN-LINK
  @EventPattern(EmailType.LINK_TOKEN)
  async linkToken(@Payload() payload: IVrfPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 4921143,
      to: [payload.merchant.email],
      data: {
        vrfSubId: payload.merchant.subscriptions[0].vrfSubId.toString(),
      },
    });
  }
}
