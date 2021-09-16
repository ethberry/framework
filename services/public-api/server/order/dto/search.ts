import { ApiPropertyOptional } from "@nestjs/swagger";

import { OrderStatus } from "@gemunion/framework-types";
import { reDateRange } from "@gemunion/constants";
import { IsString } from "@gemunion/nest-js-validators";
import { SearchDto } from "@gemunion/collection";

import { IOrderSearchDto } from "../interfaces";

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
