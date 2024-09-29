import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { IMysteryBoxSignDto } from "@framework/types";

export class MysteryBoxSignDto extends Mixin(ReferrerOptionalDto) implements IMysteryBoxSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryBoxId: number;

  public chainId: number;
  public account: string;
}
