import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type, Transform } from "class-transformer";

import { ClaimType } from "@framework/types";
import type { IClaimUpdateDto } from "@framework/types";
import { AccountOptionalDto } from "@gemunion/collection";

import { AllTypesDto } from "../../../../exchange/asset/dto/custom";

export class ClaimUpdateDto extends AccountOptionalDto implements IClaimUpdateDto {
  @ApiPropertyOptional({
    type: AllTypesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AllTypesDto)
  public item: InstanceType<typeof AllTypesDto>;

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
