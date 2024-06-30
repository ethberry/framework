import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/nest-js-validators";
import { ClaimType } from "@framework/types";
import type { IClaimTemplateRowDto, IClaimTemplateUploadDto } from "@framework/types";

import { BlockChainAssetTemplateDto } from "../../../../../exchange/asset/dto";

export class ClaimTemplateRowDto extends Mixin(BlockChainAssetTemplateDto, AccountDto) implements IClaimTemplateRowDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}

export class ClaimTemplateUploadDto implements IClaimTemplateUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimTemplateRowDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => ClaimTemplateRowDto)
  public claims: Array<ClaimTemplateRowDto>;

  @ApiProperty({
    enum: ClaimType,
  })
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "typeMismatch" })
  public claimType: ClaimType;
}
