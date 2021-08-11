import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@gemunionstudio/nest-js-validators";

import { IEmailVerificationDto } from "../interfaces";

export class VerifyEmailDto implements IEmailVerificationDto {
  @ApiProperty()
  @IsString()
  public token: string;
}
