import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsString } from "class-validator";

import { AccountDto } from "@gemunion/collection";
import { IVestingContractDeployDto } from "@framework/types";

export class VestingContractDeployDto extends AccountDto implements IVestingContractDeployDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public startTimestamp: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public cliffInMonth: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public monthlyRelease: number;
}
