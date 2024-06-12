import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { SearchDto } from "@gemunion/collection";
import type { ILootBoxSearchDto } from "@framework/types";
import { LootBoxStatus } from "@framework/types";
import { ChainIdDto, IsBigInt } from "@gemunion/nest-js-validators";

export class LootBoxSearchDto extends Mixin(SearchDto, ChainIdDto) implements ILootBoxSearchDto {
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public contractIds: Array<number>;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigInt({}, { message: "typeMismatch" })
  public minPrice: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigInt({}, { message: "typeMismatch" })
  public maxPrice: string;

  public templateIds: Array<number>;
  public lootBoxStatus: Array<LootBoxStatus>;
  public merchantId: number;
}
