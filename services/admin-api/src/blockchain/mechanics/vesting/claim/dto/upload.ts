import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { BCAssetDto } from "../../../../exchange/asset/dto";
import { VestingContractDeployDto } from "../../../../contract-manager/dto";
import { IVestingClaimRow, IVestingClaimUploadDto } from "../interfaces";

export class VestingClaimRow extends Mixin(BCAssetDto, VestingContractDeployDto) implements IVestingClaimRow {}

export class VestingClaimUploadDto implements IVestingClaimUploadDto {
  @ApiProperty({
    isArray: true,
    type: VestingClaimRow,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => VestingClaimRow)
  public claims: Array<VestingClaimRow>;
}
