import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import type { IStakingStakeItemSearchDto, IStakingStakesSearchDto } from "@framework/types";
import { StakeStatus, TokenType } from "@framework/types";

export class StakingStakeItemSearchDto implements IStakingStakeItemSearchDto {
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
}

export class StakingStakesSearchDto extends SearchDto implements IStakingStakesSearchDto {
  @ApiPropertyOptional({
    enum: StakeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakeStatus>)
  @IsEnum(StakeStatus, { each: true, message: "badInput" })
  public stakeStatus: Array<StakeStatus>;

  @ApiPropertyOptional({
    type: StakingStakeItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingStakeItemSearchDto)
  public deposit: StakingStakeItemSearchDto;

  @ApiPropertyOptional({
    type: StakingStakeItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingStakeItemSearchDto)
  public reward: StakingStakeItemSearchDto;

  public account: string;
  public startTimestamp: string;
  public endTimestamp: string;
}
