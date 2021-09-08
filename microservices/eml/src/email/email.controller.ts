import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EmailType } from "@gemunion/framework-types";
import { MailjetService, IEmailResult } from "@gemunion/nest-js-module-mailjet";

import { IPayload } from "./interfaces";
import * as console from "console";

@Controller("/")
export class EmailController {
  constructor(private readonly mailjetService: MailjetService) {}

  @EventPattern(EmailType.WELCOME)
  async welcome(@Payload() payload: IPayload): Promise<IEmailResult> {
    console.log("welcome", payload);
    return this.mailjetService.sendTemplate({
      template: 3131445,
      to: [payload.user.email],
      data: {
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
      },
    });
  }

  @EventPattern(EmailType.EMAIL_VERIFICATION)
  async verification(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3131467,
      to: [payload.user.email],
      data: {
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        code: payload.token.uuid,
        link: `${payload.baseUrl}/verify-email/${payload.token.uuid}`,
      },
    });
  }

  @EventPattern(EmailType.FORGOT_PASSWORD)
  async forgotPassword(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3131473,
      to: [payload.user.email],
      data: {
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        code: payload.token.uuid,
        link: `${payload.baseUrl}/verify-email/${payload.token.uuid}`,
      },
    });
  }

  @EventPattern(EmailType.RESTORE_PASSWORD)
  async restorePassword(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3131474,
      to: [payload.user.email],
      data: {
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        link: `${payload.baseUrl}/login`,
      },
    });
  }
}
