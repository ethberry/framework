import {ApiPropertyOptional} from "@nestjs/swagger";

import {OrderStatus} from "@trejgun/solo-types";
import {reDateRange} from "@trejgun/constants-regexp";
import {IsString} from "@trejgun/nest-js-validators";
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
