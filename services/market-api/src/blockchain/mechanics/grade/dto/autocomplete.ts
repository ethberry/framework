import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { IGradeAutocompleteDto } from "../interfaces";

export class GradeAutocompleteDto implements IGradeAutocompleteDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}
