import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IVestingClaimCreateDto } from "@framework/types";

import { ItemDto } from "../../../../exchange/asset/dto";
import { VestingClaimContractDeployDto } from "./vesting";

export class VestingClaimCreateDto implements IVestingClaimCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

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
