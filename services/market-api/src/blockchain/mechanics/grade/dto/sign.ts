import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Matches, MaxLength, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";
import type { IGradeSignDto } from "@framework/types";

import { ChainIdDto } from "../../../../common/dto";

export class GradeSignDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements IGradeSignDto {
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
