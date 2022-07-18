import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ICraftDto } from "../interfaces";

export class CraftDto implements ICraftDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public craftId: number;
}
