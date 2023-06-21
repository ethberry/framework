import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsISO8601, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

import { IVestingContractDeployDto } from "@framework/types";

export class VestingContractDeployDto implements IVestingContractDeployDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public beneficiary: string;

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
