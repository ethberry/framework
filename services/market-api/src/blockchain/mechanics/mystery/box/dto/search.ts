import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IMysteryBoxSearchDto, MysteryBoxStatus } from "@framework/types";
import { IsBigInt } from "@gemunion/nest-js-validators";

export class MysteryBoxSearchDto extends SearchDto implements IMysteryBoxSearchDto {
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

  public chainId: number;
  public merchantId: number;
  public templateIds: Array<number>;
  public mysteryBoxStatus: Array<MysteryBoxStatus>;
}
