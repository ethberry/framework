import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IsBigNumber } from "@gemunion/nest-js-validators";

import { IMysteryboxSearchDto, MysteryboxStatus } from "@framework/types";

export class MysteryboxSearchDto extends SearchDto implements IMysteryboxSearchDto {
  public mysteryboxStatus: Array<MysteryboxStatus>;

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
  @IsBigNumber({}, { message: "typeMismatch" })
  public minPrice: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public maxPrice: string;
}
