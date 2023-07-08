import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { StakingRuleStatus } from "@framework/types";
import { IStakingRuleAutocompleteDto } from "../interfaces";

export class StakingRuleAutocompleteDto implements IStakingRuleAutocompleteDto {
  @ApiPropertyOptional({
    enum: StakingRuleStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakingRuleStatus>)
  @IsEnum(StakingRuleStatus, { each: true, message: "badInput" })
  public stakingRuleStatus: Array<StakingRuleStatus>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public stakingId: number;
}
