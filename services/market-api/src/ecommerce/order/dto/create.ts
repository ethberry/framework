import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import type { IOrderCreateDto } from "../interfaces";

export class OrderCreateDto implements IOrderCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "valueMissing" })
  public addressId: number;
}
