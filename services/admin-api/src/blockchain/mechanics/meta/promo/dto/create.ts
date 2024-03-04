import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBeforeDate } from "@gemunion/nest-js-validators";

import { IAssetPromoCreateDto } from "../interfaces";
import { SemiCoinDto } from "../../../../exchange/asset/dto/custom";

export class AssetPromoCreateDto implements IAssetPromoCreateDto {
  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public item: InstanceType<typeof SemiCoinDto>;

  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

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
