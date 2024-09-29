import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@ethberry/collection";
import type { IStakingLeaderboardItemSearchDto, IStakingLeaderboardSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class StakingReportItemSearchDto implements IStakingLeaderboardItemSearchDto {
  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}

export class StakingLeaderboardSearchDto extends PaginationDto implements IStakingLeaderboardSearchDto {
  @ApiProperty({
    type: StakingReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingReportItemSearchDto)
  public deposit: StakingReportItemSearchDto;

  @ApiPropertyOptional({
    type: StakingReportItemSearchDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StakingReportItemSearchDto)
  public reward: StakingReportItemSearchDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => [true, "true"].includes(value))
  public emptyReward: boolean;
}
