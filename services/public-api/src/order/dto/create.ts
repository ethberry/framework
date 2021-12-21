import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

import { IOrderCreateDto } from "../interfaces";

export class OrderCreateDto implements IOrderCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({}, { message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public productId: number;
}
