import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { OrderStatus } from "@gemunion/framework-types";

import { IOrderUpdateDto } from "../interfaces";
import { OrderCreateDto } from "./create";

export class OrderUpdateDto extends OrderCreateDto implements IOrderUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(
    {
      enum: OrderStatus,
    },
    { message: "badInput" },
  )
  public orderStatus: OrderStatus;
}
