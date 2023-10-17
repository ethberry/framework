import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { ICartItem } from "@framework/types";

import type { ICartUpdateDto } from "../interfaces";
import { CartItemCreateDto } from "../../cart-item/dto";

export class CartUpdateDto implements ICartUpdateDto {
  @ApiProperty({ type: () => [CartItemCreateDto] })
  @IsArray({ message: "typeMismatch" })
  @ArrayNotEmpty({ message: "badInput" })
  @ValidateNested()
  @Type(() => CartItemCreateDto)
  public items: Array<ICartItem>;
}
