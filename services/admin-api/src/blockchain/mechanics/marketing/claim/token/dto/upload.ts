import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@ethberry/nest-js-validators";
import type { IClaimTokenRowDto, IClaimTokenUploadDto } from "@framework/types";

import { BlockChainAssetTokenDto } from "../../../../../exchange/asset/dto";

export class ClaimTokenRowDto extends Mixin(BlockChainAssetTokenDto, AccountDto) implements IClaimTokenRowDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}

export class ClaimTokenUploadDto implements IClaimTokenUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimTokenRowDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => ClaimTokenRowDto)
  public claims: Array<ClaimTokenRowDto>;
}
