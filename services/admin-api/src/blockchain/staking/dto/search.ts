import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { ISearchDto } from "@gemunion/types-collection";
import { StakingStatus } from "@framework/types";

export class StakingSearchDto extends SearchDto implements ISearchDto {
  public title: string;

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
}
