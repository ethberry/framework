import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBeforeDate } from "@gemunion/nest-js-validators";

import { CoinDto, SemiNftDto } from "../../../../exchange/asset/dto";
import type { IAssetPromoCreateDto } from "../interfaces";

export class AssetPromoCreateDto implements IAssetPromoCreateDto {
  @ApiProperty({
    type: SemiNftDto,
  })
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiProperty({
    type: CoinDto,
  })
  @ValidateNested()
  @Type(() => CoinDto)
  public price: InstanceType<typeof CoinDto>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
