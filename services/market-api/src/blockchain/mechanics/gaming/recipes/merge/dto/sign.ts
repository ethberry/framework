import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";
import type { IMergeSignDto } from "@framework/types";

export class MergeSignDto extends Mixin(ReferrerOptionalDto) implements IMergeSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mergeId: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @ArrayNotEmpty({ message: "badInput" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  public tokenIds: Array<number>;

  public chainId: number;
  public account: string;
}
