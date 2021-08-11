import {Controller, Get, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";
import {EventPattern, Payload} from "@nestjs/microservices";
import juice from "juice";

import {EmailType} from "@gemunionstudio/framework-types";
import {i18n} from "@gemunionstudio/framework-localization-emailer";

import {renderEmailToString} from "../utils/render.email";
import {renderAppToString} from "../utils/render.app";
import {EmailService} from "./email.service";
import {IPayload} from "./interfaces";

@Controller("/")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get("/*")
  public index(@Req() req: Request, @Res() res: Response): void {
    renderAppToString(req, res);
  }

  @EventPattern(EmailType.WELCOME)
  async welcome(@Payload() payload: IPayload): Promise<any> {
    const html = await renderEmailToString(EmailType.WELCOME, payload);
    return this.emailService.sendEmail({
      html: juice(html),
      to: [payload.user.email],
      subject: i18n[payload.user.language].email[EmailType.WELCOME].subject,
    });
  }

  @EventPattern(EmailType.EMAIL_VERIFICATION)
  async verification(@Payload() payload: IPayload): Promise<any> {
    const html = await renderEmailToString(EmailType.EMAIL_VERIFICATION, payload);
    return this.emailService.sendEmail({
      html: juice(html),
      to: [payload.user.email],
      subject: i18n[payload.user.language].email[EmailType.EMAIL_VERIFICATION].subject,
    });
  }

  @EventPattern(EmailType.FORGOT_PASSWORD)
  async forgotPassword(@Payload() payload: IPayload): Promise<any> {
    const html = await renderEmailToString(EmailType.FORGOT_PASSWORD, payload);
    return this.emailService.sendEmail({
      html: juice(html),
      to: [payload.user.email],
      subject: i18n[payload.user.language].email[EmailType.FORGOT_PASSWORD].subject,
    });
  }

  @EventPattern(EmailType.RESTORE_PASSWORD)
  async restorePassword(@Payload() payload: IPayload): Promise<any> {
    const html = await renderEmailToString(EmailType.RESTORE_PASSWORD, payload);
    return this.emailService.sendEmail({
      html: juice(html),
      to: [payload.user.email],
      subject: i18n[payload.user.language].email[EmailType.RESTORE_PASSWORD].subject,
    });
  }
}
