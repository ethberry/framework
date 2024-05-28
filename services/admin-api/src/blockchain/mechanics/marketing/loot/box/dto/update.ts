import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsOptional, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { NotNativeDto, SemiCoinDto } from "@gemunion/nest-js-validators";
import { LootBoxStatus } from "@framework/types";

import type { ILootBoxUpdateDto } from "../interfaces";
import { MaxPropertyValue } from "../../../../../../common/decorators";

export class LootBoxUpdateDto implements ILootBoxUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: NotNativeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(LootBoxStatus, { message: "badInput" })
  public lootBoxStatus: LootBoxStatus;

  @ApiPropertyOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @MaxPropertyValue(["max"], { message: "maxMaxValue" })
  public min: number;

  @ApiPropertyOptional()
  @IsInt({ message: "typeMismatch" })
  @MaxPropertyValue(["item", "components", "length"], { message: "maxItemLength" })
  public max: number;
}
