import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsEnum, IsArray } from "class-validator";
import { Transform } from "class-transformer";

import { IStakingDeployDto, StakingContractFeatures } from "@framework/types";

export class StakingDeployDto implements IStakingDeployDto {
  @ApiProperty({
    enum: StakingContractFeatures,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<StakingContractFeatures>)
  @IsEnum(StakingContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<StakingContractFeatures>;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public maxStake: number;
}
