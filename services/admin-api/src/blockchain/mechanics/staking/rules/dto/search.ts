import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IStakingItemSearchDto, IStakingRuleSearchDto, StakingStatus, TokenType } from "@framework/types";

export class StakingItemSearchDto implements IStakingItemSearchDto {
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

export class StakingRuleSearchDto extends SearchDto implements IStakingRuleSearchDto {
  @ApiPropertyOptional({
    enum: StakingStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakingStatus>)
  @IsEnum(StakingStatus, { each: true, message: "badInput" })
  public stakingStatus: Array<StakingStatus>;

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
