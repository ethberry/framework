import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Matches, Min } from "class-validator";

import type { IOrderSearchDto } from "@framework/types";
import { OrderStatus } from "@framework/types";
import { reDateRange } from "@gemunion/constants";
import { SearchDto } from "@gemunion/collection";

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

  @ApiPropertyOptional()
  // https://github.com/typestack/class-transformer/issues/626
  @Transform(({ value }) => {
    return [true, "true"].includes(value);
  })
  @IsBoolean({ message: "typeMismatch" })
  public isArchived: boolean;
}
