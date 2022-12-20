import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ICraftCreateDto } from "../interfaces";
import { ItemDto } from "../../../exchange/asset/dto";
import { IngredientsDto } from "./ingredients";

export class ExchangeCreateDto implements ICraftCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty({
    type: IngredientsDto,
  })
  @ValidateNested()
  @Type(() => IngredientsDto)
  public price: IngredientsDto;
}
