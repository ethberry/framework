import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, Validate, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import type { IReferralProgramLevelDto, IReferralProgramUpdateDto } from "@framework/types";
import { ReferralProgramStatus } from "@framework/types";

import { ReferralProgramLevelCreateDto } from "./create";
import { RefProgramLevelsRule } from "./levels";

export class ReferralProgramUpdateDto implements IReferralProgramUpdateDto {
  @ApiPropertyOptional({ type: () => [ReferralProgramLevelCreateDto] })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Validate(RefProgramLevelsRule, {
    message: "typeMismatch",
  })
  @ValidateNested()
  @Type(() => ReferralProgramLevelCreateDto)
  public levels?: Array<IReferralProgramLevelDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as ReferralProgramStatus)
  @IsEnum(ReferralProgramStatus, { message: "badInput" })
  public referralProgramStatus?: ReferralProgramStatus;
}
