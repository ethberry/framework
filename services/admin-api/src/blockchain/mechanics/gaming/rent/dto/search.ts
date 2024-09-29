import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@ethberry/collection";
import type { IRentSearchDto } from "@framework/types";
import { RentRuleStatus } from "@framework/types";

export class RentSearchDto extends SearchDto implements IRentSearchDto {
  @ApiPropertyOptional({
    enum: RentRuleStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<RentRuleStatus>)
  @IsEnum(RentRuleStatus, { each: true, message: "badInput" })
  public rentStatus: Array<RentRuleStatus>;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public contractIds: Array<number>;
}
