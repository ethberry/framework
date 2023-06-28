import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PyramidRuleStatus } from "@framework/types";
import { IPyramidRuleAutocompleteDto } from "../interfaces";

export class PyramidRuleAutocompleteDto implements IPyramidRuleAutocompleteDto {
  @ApiPropertyOptional({
    enum: PyramidRuleStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PyramidRuleStatus>)
  @IsEnum(PyramidRuleStatus, { each: true, message: "badInput" })
  public pyramidRuleStatus: Array<PyramidRuleStatus>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public pyramidId: number;
}
