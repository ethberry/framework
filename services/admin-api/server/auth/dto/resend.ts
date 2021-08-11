import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

import {ReCaptcha} from "@gemunionstudio/nest-js-utils";

import {IsEmail} from "../../common/validators";
import {IResendEmailVerificationDto} from "../interfaces";

export class ResendEmailVerificationDto implements IResendEmailVerificationDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({value}: {value: string}) => value.toLowerCase())
  public email: string;

  // TODO FIX ME
  @ApiProperty()
  @ReCaptcha({
    required: false,
  })
  public captcha: string;
}
