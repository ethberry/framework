import {ApiPropertyOptional} from "@nestjs/swagger";

import {OrderStatus} from "@trejgun/solo-types";
import {IsString} from "@trejgun/nest-js-validators";

import {IOrderUpdateDto} from "../interfaces";
import {OrderCreateDto} from "./create";

export class OrderUpdateDto extends OrderCreateDto implements IOrderUpdateDto {
  @ApiPropertyOptional()
  @IsString({
    required: false,
    enum: OrderStatus,
  })
  public orderStatus: OrderStatus;
}
