import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";

import { IEmailVerificationDto } from "../interfaces";

export class VerifyEmailDto implements IEmailVerificationDto {
  @ApiProperty()
  @IsString()
  public token: string;
}
