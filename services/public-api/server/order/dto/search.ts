import {ApiPropertyOptional} from "@nestjs/swagger";

import {OrderStatus} from "@gemunionstudio/solo-types";
import {reDateRange} from "@gemunionstudio/constants-regexp";
import {IsString} from "@gemunionstudio/nest-js-validators";
import {SearchDto} from "@gemunionstudio/collection";

import {IOrderSearchDto} from "../interfaces";

export class OrderSearchDto extends SearchDto implements IOrderSearchDto {
  @ApiPropertyOptional()
  @IsString({
    required: false,
    regexp: reDateRange,
  })
  public dateRange: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsString({
    enum: OrderStatus,
    isArray: true,
    required: false,
  })
  public orderStatus: Array<OrderStatus>;
}
