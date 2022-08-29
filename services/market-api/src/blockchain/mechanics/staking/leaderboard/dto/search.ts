import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
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

  @ApiProperty({
    type: StakingReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => StakingReportItemSearchDto)
  public reward: StakingReportItemSearchDto;
}
