import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import type { ICraftCreateDto } from "../interfaces";
import { CraftItemDto, CraftPriceDto } from "./custom";

export class CraftCreateDto implements ICraftCreateDto {
  @ApiProperty({
    type: CraftItemDto,
  })
  @ValidateNested()
  @Type(() => CraftItemDto)
  public item: InstanceType<typeof CraftItemDto>;

  @ApiProperty({
    type: CraftPriceDto,
  })
  @ValidateNested()
  @Type(() => CraftPriceDto)
  public price: InstanceType<typeof CraftPriceDto>;
}
