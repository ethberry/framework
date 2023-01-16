import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, IsOptional, Min, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { GradeAttribute, GradeStrategy } from "@framework/types";

import { IGradeUpdateDto } from "../interfaces";
import { PriceDto } from "../../../exchange/asset/dto";

export class GradeUpdateDto implements IGradeUpdateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    enum: GradeAttribute,
  })
  @IsEnum(GradeAttribute, { message: "badInput" })
  public attribute: GradeAttribute;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GradeStrategy, { message: "badInput" })
  public gradeStrategy: GradeStrategy;

  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => o.gradeStrategy === GradeStrategy.EXPONENTIAL)
  public growthRate: number;

  @ApiProperty({
    type: PriceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;
}
