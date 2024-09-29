import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import { emailMaxLength } from "@ethberry/constants";
import type { IInvitationCreateDto } from "@framework/types";

export class InvitationCreateDto implements IInvitationCreateDto {
  @ApiProperty({
    maxLength: emailMaxLength,
  })
  @IsEmail({}, { message: "patternMismatch" })
  @MaxLength(emailMaxLength, { message: "rangeOverflow" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;
}
