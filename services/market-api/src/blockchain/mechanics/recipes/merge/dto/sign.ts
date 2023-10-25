import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto } from "@gemunion/collection";
import type { IMergeSignDto } from "@framework/types";

export class DismantleSignDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements IMergeSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mergeId: number;

  @ApiProperty({
    minimum: 1,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @ArrayNotEmpty({ message: "badInput" })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public tokenIds: Array<number>;
}
