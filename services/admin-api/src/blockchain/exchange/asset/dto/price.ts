import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "@framework/types";

import { PriceComponentDto } from "./price-components";

export class PriceDto implements IAssetDto {
  @ApiProperty({
    type: PriceComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => PriceComponentDto)
  public components: Array<PriceComponentDto>;
}
