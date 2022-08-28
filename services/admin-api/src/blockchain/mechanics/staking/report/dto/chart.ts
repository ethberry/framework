import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IsBeforeDate } from "@gemunion/nest-js-validators";
import { IStakingStakesSearchDto, StakeStatus } from "@framework/types";

import { StakingItemSearchDto } from "../../rules/dto";

export class StakingReportChartDto extends SearchDto implements IStakingStakesSearchDto {
  public stakeStatus: Array<StakeStatus>;
  public account: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  @ValidateIf(o => !!o.startTimestamp)
  public endTimestamp: string;
}
