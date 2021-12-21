import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail } from "class-validator";

import { ReCaptcha } from "@gemunion/nest-js-utils";

import { IForgotPasswordDto } from "../interfaces";

export class ForgotPasswordDto implements IForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
  @ReCaptcha()
  public captcha: string;
}
