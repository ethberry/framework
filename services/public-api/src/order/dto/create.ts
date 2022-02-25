import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IOrderCreateDto } from "../interfaces";

export class OrderCreateDto implements IOrderCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public productId: number;
}
