import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsString,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { GradeStrategy, ProtectedAttribute } from "@framework/types";

import { PriceDto } from "../../../exchange/asset/dto";
import { IGradeCreateDto } from "../interfaces";

export class GradeCreateDto implements IGradeCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    maxLength: 32,
  })
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  @Validate(ForbidEnumValues, Object.values(ProtectedAttribute))
  @Matches(/^[A-Z][A-Z0-9]*$/, { message: "patternMismatch" })
  public attribute: string;

  @ApiProperty()
  @IsEnum(GradeStrategy, { message: "badInput" })
  public gradeStrategy: GradeStrategy;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => o.gradeStrategy === GradeStrategy.EXPONENTIAL)
  public growthRate: number;

  @ApiProperty({
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;
}
