import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBeforeDate } from "@gemunion/nest-js-validators";

import { IAssetPromoCreateDto } from "../interfaces";
import { CoinDto, SemiNftDto } from "../../../../exchange/asset/dto";

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
