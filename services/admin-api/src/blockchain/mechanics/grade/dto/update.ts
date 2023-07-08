import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { GradeStatus, GradeStrategy } from "@framework/types";

import { PriceDto } from "../../../exchange/asset/dto";
import { IGradeUpdateDto } from "../interfaces";

export class GradeUpdateDto implements IGradeUpdateDto {
  @ApiPropertyOptional({
    enum: GradeStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as GradeStatus)
  @IsEnum(GradeStatus, { message: "badInput" })
  public gradeStatus: GradeStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as GradeStrategy)
  @IsEnum(GradeStrategy, { message: "badInput" })
  public gradeStrategy: GradeStrategy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => o.gradeStrategy === GradeStrategy.EXPONENTIAL)
  public growthRate: number;

  @ApiPropertyOptional({
    type: PriceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;
}
