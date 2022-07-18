import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ISignCraftDto } from "../interfaces";

export class SignCraftDto implements ISignCraftDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public craftId: number;
}
