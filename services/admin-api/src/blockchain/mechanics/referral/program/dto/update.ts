import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IReferralProgramLevelDto, IReferralProgramUpdateDto } from "../interfaces";

export class ReferralProgramLevelUpdateDto implements IReferralProgramLevelDto {
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

export class ReferralProgramUpdateDto implements IReferralProgramUpdateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;

  @ApiProperty({ type: () => [ReferralProgramLevelUpdateDto] })
  @IsArray({ message: "typeMismatch" })
  @ArrayNotEmpty({ message: "badInput" })
  @ValidateNested()
  @Type(() => ReferralProgramLevelUpdateDto)
  public levels: Array<IReferralProgramLevelDto>;
}
