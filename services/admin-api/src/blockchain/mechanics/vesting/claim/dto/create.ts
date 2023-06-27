import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import { VestingContractDeployDto } from "../../../../contract-manager/dto";
import { IVestingClaimCreateDto } from "../interfaces";
import { ItemDto } from "../../../../exchange/asset/dto";

export class VestingClaimCreateDto extends AccountDto implements IVestingClaimCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiProperty({
    type: VestingContractDeployDto,
  })
  @ValidateNested()
  @Type(() => VestingContractDeployDto)
  public parameters: VestingContractDeployDto;
}
