import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, Min, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IStakingRuleItemSearchDto, IStakingRuleSearchDto } from "@framework/types";
import { StakingRuleStatus, TokenType } from "@framework/types";

export class StakingRuleItemSearchDto implements IStakingRuleItemSearchDto {
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

  public contractIds: Array<number>;
  public templateIds: Array<number>;
  public maxPrice: string;
  public minPrice: string;
}

export class StakingRuleSearchDto extends SearchDto implements IStakingRuleSearchDto {
  @ApiPropertyOptional({
    type: StakingRuleItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingRuleItemSearchDto)
  public deposit: StakingRuleItemSearchDto;

  @ApiPropertyOptional({
    type: StakingRuleItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingRuleItemSearchDto)
  public reward: StakingRuleItemSearchDto;

  public stakingRuleStatus: Array<StakingRuleStatus>;

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
