import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { GradeAttribute } from "@framework/types";

import { ISearchGradeDto } from "../interfaces";

export class SearchGradeDto implements ISearchGradeDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public tokenId: number;

  @ApiProperty({
    enum: GradeAttribute,
  })
  @IsEnum(GradeAttribute, { message: "badInput" })
  public attribute: GradeAttribute;
}
