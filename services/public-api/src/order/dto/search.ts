import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Matches } from "class-validator";

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
