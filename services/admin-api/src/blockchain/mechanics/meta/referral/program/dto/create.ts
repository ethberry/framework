import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Max, Min, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IReferralProgramCreateDto, IReferralProgramLevelDto } from "../interfaces";
import { RefProgramLevelsRule } from "./levels";

export class ReferralProgramLevelCreateDto implements IReferralProgramLevelDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public level: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(10000, { message: "rangeUnderflow" })
  public share: number;
}

export class ReferralProgramCreateDto implements IReferralProgramCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;

  @ApiProperty({ type: () => [ReferralProgramLevelCreateDto] })
  @IsArray({ message: "typeMismatch" })
  @ArrayNotEmpty({ message: "badInput" })
  @Validate(RefProgramLevelsRule, {
    message: "typeMismatch",
  })
  @ValidateNested()
  @Type(() => ReferralProgramLevelCreateDto)
  public levels: Array<IReferralProgramLevelDto>;
}
