import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IMergeCreateDto } from "../interfaces";
import { MergeItemDto, MergePriceDto } from "./custom";

export class MergeCreateDto implements IMergeCreateDto {
  @ApiProperty({
    type: MergeItemDto,
  })
  @ValidateNested()
  @Type(() => MergeItemDto)
  public item: InstanceType<typeof MergeItemDto>;

  @ApiProperty({
    type: MergePriceDto,
  })
  @ValidateNested()
  @Type(() => MergePriceDto)
  public price: InstanceType<typeof MergePriceDto>;
}
