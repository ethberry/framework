import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail } from "class-validator";

import { ReCaptcha } from "@gemunion/nest-js-validators";

import { IResendEmailVerificationDto } from "../interfaces";

export class ResendEmailVerificationDto implements IResendEmailVerificationDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
  @ReCaptcha()
  public captcha: string;
}
