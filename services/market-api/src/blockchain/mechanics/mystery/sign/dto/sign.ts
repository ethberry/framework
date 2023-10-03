import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto } from "@gemunion/collection";

import type { ISignMysteryboxDto } from "../interfaces";

export class SignMysteryboxDto
  extends Mixin(ReferrerOptionalDto, AccountDto, ChainIdDto)
  implements ISignMysteryboxDto
{
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryBoxId: number;
}
