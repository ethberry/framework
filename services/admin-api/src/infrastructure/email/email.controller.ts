import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import { EmailType } from "@framework/types";

import { EmailService } from "./email.service";
import { UserEntity } from "../user/user.entity";

@ApiBearerAuth()
@Controller("/emails")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post(EmailType.DUMMY)
  @HttpCode(HttpStatus.NO_CONTENT)
  public dummy(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.dummy(userEntity);
  }

  @Post(EmailType.FEEDBACK)
  @HttpCode(HttpStatus.NO_CONTENT)
  public feedback(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.feedback(userEntity);
  }

  @Post(EmailType.LINK_TOKEN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public link(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.link(userEntity);
  }

  @Post(EmailType.INVITE)
  @HttpCode(HttpStatus.NO_CONTENT)
  public invite(@User() userEntity: UserEntity): Promise<any> {
    return this.emailService.invite(userEntity, { merchantId: userEntity.merchantId });
  }
}
