import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsString } from "class-validator";

import { IVestingDeployDto, VestingContractTemplate } from "@framework/types";

export class VestingDeployDto implements IVestingDeployDto {
  @ApiProperty({
    enum: VestingContractTemplate,
  })
  @IsEnum(VestingContractTemplate, { message: "badInput" })
  public contractTemplate: VestingContractTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public account: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public startTimestamp: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public duration: number;
}
