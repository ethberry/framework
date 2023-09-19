import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "@framework/types";

import { NftComponentDto } from "./nft-components";

export class NftDto implements IAssetDto {
  @ApiProperty({
    type: NftComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => NftComponentDto)
  public components: Array<NftComponentDto>;
}
