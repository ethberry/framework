import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IDismantleCreateDto } from "../interfaces";
import { DismantleItemDto, DismantlePriceDto } from "./custom";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: DismantleItemDto,
  })
  @ValidateNested()
  @Type(() => DismantleItemDto)
  public item: InstanceType<typeof DismantleItemDto>;

  @ApiProperty({
    type: DismantlePriceDto,
  })
  @ValidateNested()
  @Type(() => DismantlePriceDto)
  public price: InstanceType<typeof DismantlePriceDto>;
}
