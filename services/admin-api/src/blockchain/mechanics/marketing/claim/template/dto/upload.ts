import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/nest-js-validators";
import { ClaimType } from "@framework/types";

import type { IClaimRowDto, IClaimUploadDto } from "../interfaces";
import { BCAssetTemplateDto } from "../../../../../exchange/asset/dto";

export class ClaimRowDto extends Mixin(BCAssetTemplateDto, AccountDto) implements IClaimRowDto {
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

  @ApiProperty({
    enum: ClaimType,
  })
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "typeMismatch" })
  public claimType: ClaimType;
}
