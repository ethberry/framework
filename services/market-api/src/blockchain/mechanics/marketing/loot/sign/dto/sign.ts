import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { ILootBoxSignDto } from "@framework/types";

export class LootBoxSignDto extends Mixin(ReferrerOptionalDto) implements ILootBoxSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public lootBoxId: number;

  public chainId: number;
  public account: string;
}
