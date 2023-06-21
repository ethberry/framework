import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsString, Min, Max } from "class-validator";

import { AccountDto } from "@gemunion/collection";
import { IVestingContractDeployDto } from "@framework/types";

export class VestingContractDeployDto extends AccountDto implements IVestingContractDeployDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public startTimestamp: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public cliffInMonth: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(10000, { message: "rangeOverflow" })
  public monthlyRelease: number;
}
