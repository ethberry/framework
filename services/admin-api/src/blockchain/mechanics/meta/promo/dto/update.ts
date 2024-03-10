import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBeforeDate } from "@gemunion/nest-js-validators";

import { IAssetPromoUpdateDto } from "../interfaces";
import { CoinDto, SemiNftDto } from "../../../../exchange/asset/dto/custom";

export class AssetPromoUpdateDto implements IAssetPromoUpdateDto {
  @ApiPropertyOptional({
    type: SemiNftDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiPropertyOptional({
    type: CoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoinDto)
  public price: InstanceType<typeof CoinDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
