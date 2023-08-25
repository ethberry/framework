import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IOrderItem } from "@framework/types";

import { IOrderCreateDto } from "../interfaces";
import { OrderItemCreateDto } from "../../order-item/dto";

export class OrderCreateDto implements IOrderCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public userId: number;

  @ApiProperty({ type: () => [OrderItemCreateDto] })
  @IsArray({ message: "typeMismatch" })
  @ArrayNotEmpty({ message: "badInput" })
  @ValidateNested()
  @Type(() => OrderItemCreateDto)
  public items: Array<IOrderItem>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public addressId: number;
}
