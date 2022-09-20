import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import type { IStakingDepositItemSearchDto, IStakingDepositSearchDto } from "@framework/types";
import { StakingDepositStatus, TokenType } from "@framework/types";

export class StakingDepositItemSearchDto implements IStakingDepositItemSearchDto {
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

export class StakingDepositSearchDto extends SearchDto implements IStakingDepositSearchDto {
  @ApiPropertyOptional({
    enum: StakingDepositStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakingDepositStatus>)
  @IsEnum(StakingDepositStatus, { each: true, message: "badInput" })
  public stakingDepositStatus: Array<StakingDepositStatus>;

  @ApiPropertyOptional({
    type: StakingDepositItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingDepositItemSearchDto)
  public deposit: StakingDepositItemSearchDto;

  @ApiPropertyOptional({
    type: StakingDepositItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingDepositItemSearchDto)
  public reward: StakingDepositItemSearchDto;

  public account: string;
  public startTimestamp: string;
  public endTimestamp: string;
}
