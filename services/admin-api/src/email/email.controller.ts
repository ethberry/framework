import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Roles, User } from "@gemunion/nest-js-utils";
import { EmailType, UserRole } from "@gemunion/framework-types";

import { EmailService } from "./email.service";
import { UserEntity } from "../user/user.entity";

@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller("/emails")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post(EmailType.WELCOME)
  @HttpCode(HttpStatus.NO_CONTENT)
  public welcome(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.welcome(userEntity);
  }

  @Post(EmailType.EMAIL_VERIFICATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  public emailVerification(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.emailVerification(userEntity);
  }

  @Post(EmailType.FORGOT_PASSWORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  public forgotPassword(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.forgotPassword(userEntity);
  }

  @Post(EmailType.RESTORE_PASSWORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  public restorePassword(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.restorePassword(userEntity);
  }
}
