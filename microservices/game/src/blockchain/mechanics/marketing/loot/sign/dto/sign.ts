import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { ILootBoxSignDto } from "@framework/types";

export class LootBoxSignDto extends Mixin(ReferrerOptionalDto, AccountDto, ChainIdDto) implements ILootBoxSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public lootBoxId: number;
}
