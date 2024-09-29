import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { IMysteryBoxSignDto } from "@framework/types";

export class MysteryBoxSignDto
  extends Mixin(ReferrerOptionalDto, AccountDto, ChainIdDto)
  implements IMysteryBoxSignDto
{
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryBoxId: number;
}
