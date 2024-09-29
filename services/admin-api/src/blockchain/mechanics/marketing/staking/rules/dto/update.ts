import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

import { SearchableOptionalDto } from "@ethberry/collection";

import type { IStakingRuleUpdateDto } from "../interfaces";

export class StakingRuleUpdateDto extends SearchableOptionalDto implements IStakingRuleUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
