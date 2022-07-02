import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsString } from "class-validator";

import { VestingTemplate, IVestingDeployDto } from "@framework/types";

export class VestingDeployDto implements IVestingDeployDto {
  @ApiProperty({
    enum: VestingTemplate,
  })
  @IsEnum(VestingTemplate, { message: "badInput" })
  public contractTemplate: VestingTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public beneficiary: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public startTimestamp: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public duration: number;
}
