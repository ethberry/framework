import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import type { ICartItemCreateDto } from "../interfaces";

export class CartItemCreateDto implements ICartItemCreateDto {
  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(0, { each: true, message: "valueMissing" })
  public quantity: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public productItemId: number;
}
