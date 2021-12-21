import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IEmailVerificationDto } from "../interfaces";

export class VerifyEmailDto implements IEmailVerificationDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public token: string;
}
