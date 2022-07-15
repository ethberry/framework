import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IsBigNumber } from "@gemunion/nest-js-validators";

import { LootboxStatus, ILootboxSearchDto } from "@framework/types";

export class LootboxSearchDto extends SearchDto implements ILootboxSearchDto {
  @ApiPropertyOptional({
    enum: LootboxStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<LootboxStatus>)
  @IsEnum(LootboxStatus, { each: true, message: "badInput" })
  public lootboxStatus: Array<LootboxStatus>;

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
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public erc998TemplateCollectionIds: Array<number>;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public minPrice: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public maxPrice: string;
}
