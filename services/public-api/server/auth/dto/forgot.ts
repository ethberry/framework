import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { ReCaptcha } from "@gemunion/nest-js-utils";

import { IsEmail } from "../../common/validators";
import { IForgotPasswordDto } from "../interfaces";

export class ForgotPasswordDto implements IForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  // TODO FIX ME
  @ApiProperty()
  @ReCaptcha({
    required: false,
  })
  public captcha: string;
}
