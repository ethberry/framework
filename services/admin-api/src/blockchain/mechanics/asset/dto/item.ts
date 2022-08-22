import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "@framework/types";

import { ItemComponentDto } from "./item-components";

export class ItemDto implements IAssetDto {
  @ApiProperty({
    type: ItemComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => ItemComponentDto)
  public components: Array<ItemComponentDto>;
}
