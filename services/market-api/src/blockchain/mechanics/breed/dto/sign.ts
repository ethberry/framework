import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ISignBreedDto } from "../interfaces";

export class SignBreedDto implements ISignBreedDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public momId: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dadId: number;
}
