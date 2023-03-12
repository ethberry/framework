import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsISO8601, IsString } from "class-validator";

import { AccountDto } from "@gemunion/collection";
import { IVestingContractDeployDto, VestingContractTemplate } from "@framework/types";

export class VestingContractDeployDto extends AccountDto implements IVestingContractDeployDto {
  @ApiProperty({
    enum: VestingContractTemplate,
  })
  @IsEnum(VestingContractTemplate, { message: "badInput" })
  public contractTemplate: VestingContractTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public startTimestamp: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public duration: number;
}
