import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ICartItemCreateDto } from "../interfaces";

export class CartItemCreateDto implements ICartItemCreateDto {
  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(0, { each: true, message: "valueMissing" })
  public amount: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public productId: number;
}
