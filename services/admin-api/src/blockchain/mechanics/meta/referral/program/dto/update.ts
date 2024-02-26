import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";
import { IReferralProgramUpdateDto } from "../interfaces";
import { ReferralProgramStatus } from "@framework/types";

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
