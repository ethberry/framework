import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { IWaitListListCreateDto } from "@framework/types";

import { ItemDto } from "../../../../exchange/asset/dto";

export class WaitListListCreateDto extends SearchableDto implements IWaitListListCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;
}
