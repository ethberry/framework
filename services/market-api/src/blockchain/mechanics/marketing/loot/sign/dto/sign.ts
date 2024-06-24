import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";

import type { ISignLootboxDto } from "../interfaces";

export class SignLootboxDto extends Mixin(ReferrerOptionalDto) implements ISignLootboxDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public lootBoxId: number;

  public chainId?: number;
  public account?: string;
}
