import {ApiProperty} from "@nestjs/swagger";

import {reEmail} from "@gemunionstudio/constants-regexp";

import {ReCaptcha, IsEmail} from "../../common/validators";
import {IResendEmailVerificationDto} from "../interfaces";

export class ResendEmailVerificationDto implements IResendEmailVerificationDto {
  @ApiProperty()
  @IsEmail({
    regexp: reEmail,
  })
  public email: string;

  // TODO FIX ME
  @ApiProperty()
  @ReCaptcha({
    required: false,
  })
  public captcha: string;
}
