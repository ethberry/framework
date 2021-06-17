import {ApiPropertyOptional} from "@nestjs/swagger";
import {Type} from "class-transformer";

import {OrderStatus} from "@trejgun/solo-types";
import {reDateRange} from "@trejgun/constants-regexp";
import {IsNumber, IsString} from "@trejgun/nest-js-validators";
import {SearchDto} from "@trejgun/collection";

import {IOrderSearchDto} from "../interfaces";

export class OrderSearchDto extends SearchDto implements IOrderSearchDto {
  @ApiPropertyOptional()
  @IsString({
    required: false,
    regexp: reDateRange,
  })
  public dateRange: string;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsNumber({
    required: false,
    minimum: 1,
  })
  @Type(() => Number)
  public merchantId: number;

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsString({
    required: false,
    enum: OrderStatus,
    isArray: true,
  })
  public orderStatus: Array<OrderStatus>;
}
