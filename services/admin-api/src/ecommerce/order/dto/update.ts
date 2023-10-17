import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { OrderStatus } from "@framework/types";

import type { IOrderUpdateDto } from "../interfaces";
import { OrderCreateDto } from "./create";

export class OrderUpdateDto extends OrderCreateDto implements IOrderUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as OrderStatus)
  @IsEnum(OrderStatus, { message: "badInput" })
  public orderStatus: OrderStatus;
}
