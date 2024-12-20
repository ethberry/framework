import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CoinDto } from "@gemunion/nest-js-validators";
import type { IVestingClaimCreateDto } from "@framework/types";

import { VestingClaimContractDeployDto } from "./vesting";

export class VestingClaimCreateDto implements IVestingClaimCreateDto {
  @ApiProperty({
    type: CoinDto,
  })
  @ValidateNested()
  @Type(() => CoinDto)
  public item: InstanceType<typeof CoinDto>;

  // @ApiProperty()
  // @IsString({ message: "typeMismatch" })
  // @IsISO8601({}, { message: "patternMismatch" })
  // public endTimestamp: string;

  @ApiProperty({
    type: VestingClaimContractDeployDto,
  })
  @ValidateNested()
  @Type(() => VestingClaimContractDeployDto)
  public parameters: VestingClaimContractDeployDto;
}
