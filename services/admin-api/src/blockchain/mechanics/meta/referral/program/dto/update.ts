import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";

import { ReferralProgramStatus } from "@framework/types";

import type { IReferralProgramUpdateDto } from "../interfaces";

export class ReferralProgramUpdateDto implements IReferralProgramUpdateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;

  /* update status */
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as ReferralProgramStatus)
  @IsEnum(ReferralProgramStatus, { message: "badInput" })
  public referralProgramStatus: ReferralProgramStatus;
}
