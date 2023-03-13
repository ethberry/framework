import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ICartItem } from "@framework/types";

import { ICartUpdateDto } from "../interfaces";
import { CartItemCreateDto } from "../../cart-item/dto";

export class CartUpdateDto implements ICartUpdateDto {
  @ApiProperty({ type: () => [CartItemCreateDto] })
  @IsArray()
  @ArrayNotEmpty({ message: "badInput" })
  @ValidateNested()
  @Type(() => CartItemCreateDto)
  public items: Array<ICartItem>;
}
