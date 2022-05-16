import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsString } from "class-validator";

import { Erc20VestingTemplate, IErc20VestingDeployDto } from "@framework/types";

export class Erc20VestingDeployDto implements IErc20VestingDeployDto {
  @ApiProperty({
    enum: Erc20VestingTemplate,
  })
  @IsEnum(Erc20VestingTemplate, { message: "badInput" })
  public contractTemplate: Erc20VestingTemplate;

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
