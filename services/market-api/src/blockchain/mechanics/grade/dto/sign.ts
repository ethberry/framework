import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { ISignGradeDto } from "../interfaces";
import { TokenAttributes } from "@framework/types";

export class SignGradeDto implements ISignGradeDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public tokenId: number;

  @ApiProperty({
    enum: TokenAttributes,
  })
  @IsEnum(TokenAttributes, { message: "badInput" })
  public attribute: TokenAttributes;
}
