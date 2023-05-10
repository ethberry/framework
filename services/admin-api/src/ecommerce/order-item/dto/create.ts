import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IOrderItemCreateDto } from "../interfaces";

export class OrderItemCreateDto implements IOrderItemCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public amount: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public productItemId: number;

  public orderId: number;
}
