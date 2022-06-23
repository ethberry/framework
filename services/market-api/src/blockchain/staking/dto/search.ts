import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IStakingRuleItemSearchDto, IStakingRuleSearchDto, StakingRuleStatus, TokenType } from "@framework/types";

export class StakingItemSearchDto implements IStakingRuleItemSearchDto {
  @ApiPropertyOptional({
    enum: TokenType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TokenType>)
  @IsEnum(TokenType, { each: true, message: "badInput" })
  public tokenType: Array<TokenType>;
}

export class StakingSearchDto extends SearchDto implements IStakingRuleSearchDto {
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
  public stakingStatus: Array<StakingRuleStatus>;

  @ApiPropertyOptional({
    type: StakingItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingItemSearchDto)
  public deposit: StakingItemSearchDto;

  @ApiPropertyOptional({
    type: StakingItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingItemSearchDto)
  public reward: StakingItemSearchDto;
}
