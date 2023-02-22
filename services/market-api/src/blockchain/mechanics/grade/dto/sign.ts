import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";
import { GradeAttribute } from "@framework/types";

import { ISignGradeDto } from "../interfaces";

export class SignGradeDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignGradeDto {
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
