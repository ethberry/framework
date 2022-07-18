import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IGradeDto } from "../interfaces";

export class GradeDto implements IGradeDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public tokenId: number;
}
