import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type, Transform } from "class-transformer";

import { ClaimType } from "@framework/types";
import type { IClaimUpdateDto } from "@framework/types";
import { AccountOptionalDto } from "@gemunion/collection";

import { NotNativeDto } from "../../../../../exchange/asset/dto";

export class ClaimUpdateDto extends AccountOptionalDto implements IClaimUpdateDto {
  @ApiPropertyOptional({
    type: NotNativeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiPropertyOptional({
    enum: ClaimType,
  })
  @IsOptional()
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "badInput" })
  public claimType: ClaimType;

  public chainId: number;
}
