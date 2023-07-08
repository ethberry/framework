import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Matches, MaxLength, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignGradeDto } from "../interfaces";

export class SignGradeDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignGradeDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public tokenId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  @Matches(/^[0-9A-Z]+$/, { message: "patternMismatch" })
  public attribute: string;
}
