import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { IVestingBoxSignDto } from "@framework/types";

export class VestingBoxSignDto extends Mixin(ReferrerOptionalDto) implements IVestingBoxSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public vestingBoxId: number;

  public chainId: number;
  public account: string;
}
