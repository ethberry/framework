import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, Matches } from "class-validator";

import { reDateRange } from "@gemunion/constants";
import { SearchDto } from "@gemunion/collection";
import { OrderStatus } from "@framework/types";

import type { IOrderSearchDto } from "../interfaces";

export class OrderSearchDto extends SearchDto implements IOrderSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @Matches(reDateRange, { message: "patternMismatch" })
  public dateRange: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<OrderStatus>)
  @IsEnum(OrderStatus, { each: true, message: "badInput" })
  public orderStatus: Array<OrderStatus>;
}
