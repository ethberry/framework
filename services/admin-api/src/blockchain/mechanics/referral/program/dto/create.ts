import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IReferralProgramCreateDto, IReferralProgramLevelDto } from "../interfaces";

export class ReferralProgramLevelCreateDto implements IReferralProgramLevelDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
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
  @ValidateNested()
  @Type(() => ReferralProgramLevelCreateDto)
  public levels: Array<IReferralProgramLevelDto>;
}
