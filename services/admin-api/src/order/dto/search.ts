import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";

import { OrderStatus } from "@gemunion/framework-types";
import { reDateRange } from "@gemunion/constants";
import { SearchDto } from "@gemunion/collection";

import { IOrderSearchDto } from "../interfaces";

export class OrderSearchDto extends SearchDto implements IOrderSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @Matches(reDateRange, { message: "patternMismatch" })
  public dateRange: string;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsEnum(
    {
      enum: OrderStatus,
    },
    { each: true, message: "badInput" },
  )
  public orderStatus: Array<OrderStatus>;
}
