import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import type { IStakingContractDeployDto } from "@framework/types";
import { StakingContractTemplates } from "@framework/types";

export class StakingContractDeployDto implements IStakingContractDeployDto {
  @ApiProperty({
    enum: StakingContractTemplates,
  })
  @Transform(({ value }) => value as StakingContractTemplates)
  @IsEnum(StakingContractTemplates, { message: "badInput" })
  public contractTemplate: StakingContractTemplates;
}
