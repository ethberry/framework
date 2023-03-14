import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Matches, Min } from "class-validator";

import { OrderStatus } from "@framework/types";
import { reDateRange } from "@gemunion/constants";
import { SearchDto } from "@gemunion/collection";

import { IOrderSearchDto } from "../interfaces";

export class OrderSearchDto extends SearchDto implements IOrderSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(reDateRange, { message: "patternMismatch" })
  public dateRange: string;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  @Type(() => Number)
  public merchantId: number;

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
