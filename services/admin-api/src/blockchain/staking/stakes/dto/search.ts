import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";

import { StakeStatus, IStakesSearchDto } from "@framework/types";

export class StakesSearchDto extends SearchDto implements IStakesSearchDto {
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
}
