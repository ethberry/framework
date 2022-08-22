import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import { IStakingStakesSearchDto, StakeStatus } from "@framework/types";
import { StakingItemSearchDto } from "../../rules/dto";

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

  public account: string;
}
