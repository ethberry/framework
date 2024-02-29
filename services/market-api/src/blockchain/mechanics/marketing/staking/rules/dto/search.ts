import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IStakingRuleDepositSearchDto, IStakingRuleSearchDto } from "@framework/types";
import {
  IStakingRuleRewardSearchDto,
  StakingDepositTokenType,
  StakingRewardTokenType,
  StakingRuleStatus,
} from "@framework/types";

export class StakingRuleDepositSearchDto implements IStakingRuleDepositSearchDto {
  @ApiPropertyOptional({
    enum: StakingDepositTokenType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakingDepositTokenType>)
  @IsEnum(StakingDepositTokenType, { each: true, message: "badInput" })
  public tokenType: Array<StakingDepositTokenType>;

  public contractIds: Array<number>;
  public templateIds: Array<number>;
  public maxPrice: string;
  public minPrice: string;
}

export class StakingRuleRewardSearchDto implements IStakingRuleRewardSearchDto {
  @ApiPropertyOptional({
    enum: StakingRewardTokenType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakingRewardTokenType>)
  @IsEnum(StakingRewardTokenType, { each: true, message: "badInput" })
  public tokenType: Array<StakingRewardTokenType>;

  public contractIds: Array<number>;
  public templateIds: Array<number>;
  public maxPrice: string;
  public minPrice: string;
}

export class StakingRuleSearchDto extends SearchDto implements IStakingRuleSearchDto {
  @ApiPropertyOptional({
    type: StakingRuleDepositSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingRuleDepositSearchDto)
  public deposit: StakingRuleDepositSearchDto;

  @ApiPropertyOptional({
    type: StakingRuleRewardSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingRuleRewardSearchDto)
  public reward: StakingRuleRewardSearchDto;

  public stakingRuleStatus: Array<StakingRuleStatus>;

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

  public merchantId: number;
}
