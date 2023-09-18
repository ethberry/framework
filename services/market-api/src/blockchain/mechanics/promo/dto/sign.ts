import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { IAssetPromoSignDto } from "../interfaces";
import { ChainIdDto } from "../../../../common/dto";

export class AssetPromoSignDto
  extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto)
  implements IAssetPromoSignDto
{
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public promoId: number;
}
