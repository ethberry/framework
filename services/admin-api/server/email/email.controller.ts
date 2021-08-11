import {Controller, Post, HttpCode} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {Roles} from "@gemunionstudio/nest-js-providers";
import {EmailType, UserRole} from "@gemunionstudio/framework-types";

import {EmailService} from "./email.service";
import {UserEntity} from "../user/user.entity";
import {User} from "../common/decorators";

@ApiCookieAuth()
@Roles(UserRole.ADMIN)
@Controller("/emails")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post(`/${EmailType.WELCOME}`)
  @HttpCode(204)
  public welcome(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.welcome(userEntity);
  }

  @Post(`/${EmailType.EMAIL_VERIFICATION}`)
  @HttpCode(204)
  public emailVerification(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.emailVerification(userEntity);
  }

  @Post(`/${EmailType.FORGOT_PASSWORD}`)
  @HttpCode(204)
  public forgotPassword(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.forgotPassword(userEntity);
  }

  @Post(`/${EmailType.RESTORE_PASSWORD}`)
  @HttpCode(204)
  public restorePassword(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.restorePassword(userEntity);
  }
}
