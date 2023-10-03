import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum } from "class-validator";

import { OrderStatus } from "@framework/types";

import type { IOrderMoveDto } from "../interfaces";

export class OrderMoveDto implements IOrderMoveDto {
  @ApiProperty({
    enum: OrderStatus,
  })
  @Transform(({ value }) => value as OrderStatus)
  @IsEnum(OrderStatus, { message: "badInput" })
  public orderStatus: OrderStatus;
}
