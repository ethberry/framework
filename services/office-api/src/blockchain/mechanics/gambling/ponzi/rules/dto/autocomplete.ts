import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PonziRuleStatus } from "@framework/types";
import { IPonziRuleAutocompleteDto } from "../interfaces";

export class PonziRuleAutocompleteDto implements IPonziRuleAutocompleteDto {
  @ApiPropertyOptional({
    enum: PonziRuleStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PonziRuleStatus>)
  @IsEnum(PonziRuleStatus, { each: true, message: "badInput" })
  public ponziRuleStatus: Array<PonziRuleStatus>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public ponziId: number;
}
