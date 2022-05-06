import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EmailType } from "@framework/types";
import { IEmailResult, MailjetService } from "@gemunion/nest-js-module-mailjet";

import { IPayload } from "./interfaces";

@Controller("/")
export class EmailController {
  constructor(private readonly mailjetService: MailjetService) {}

  @EventPattern(EmailType.WELCOME)
  async welcome(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3839701,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
      },
    });
  }

  @EventPattern(EmailType.EMAIL_VERIFICATION)
  async verification(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3839684,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
        code: payload.otp.uuid,
        link: `${payload.baseUrl}/verify-email/${payload.otp.uuid}`,
      },
    });
  }

  @EventPattern(EmailType.FORGOT_PASSWORD)
  async forgotPassword(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3839687,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
        code: payload.otp.uuid,
        link: `${payload.baseUrl}/restore-password/${payload.otp.uuid}`,
      },
    });
  }

  @EventPattern(EmailType.RESTORE_PASSWORD)
  async restorePassword(@Payload() payload: IPayload): Promise<IEmailResult> {
    return this.mailjetService.sendTemplate({
      template: 3839688,
      to: [payload.user.email],
      data: {
        displayName: payload.user.displayName,
        link: `${payload.baseUrl}/login`,
      },
    });
  }
}
