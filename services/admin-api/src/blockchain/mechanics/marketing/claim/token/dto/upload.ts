import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ClaimType } from "@framework/types";
import type { IClaimTokenRowDto, IClaimTokenUploadDto } from "@framework/types";

import { AllInsteadNativeDto } from "../../claim.common.dto";

export class ClaimTokenRowDto extends AllInsteadNativeDto implements IClaimTokenRowDto {
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

  @ApiProperty({
    enum: ClaimType,
  })
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "typeMismatch" })
  public claimType: ClaimType;
}
