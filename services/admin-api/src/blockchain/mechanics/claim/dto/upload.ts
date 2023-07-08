import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";

import { IClaimRowDto, IClaimUploadDto } from "../interfaces";
import { BCAssetDto } from "../../../exchange/asset/dto";

export class ClaimRowDto extends Mixin(BCAssetDto, AccountDto) implements IClaimRowDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}

export class ClaimUploadDto implements IClaimUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimRowDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => ClaimRowDto)
  public claims: Array<ClaimRowDto>;
}
