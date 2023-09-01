import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IGradeSearchDto } from "@framework/types";
import { GradeStatus } from "@framework/types";

export class GradeSearchDto extends SearchDto implements IGradeSearchDto {
  @ApiPropertyOptional({
    enum: GradeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<GradeStatus>)
  @IsEnum(GradeStatus, { each: true, message: "badInput" })
  public gradeStatus: Array<GradeStatus>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;
}
