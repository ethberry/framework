import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ClaimType } from "@framework/types";
import type { IClaimUpdateDto } from "@framework/types";
import { AccountOptionalDto } from "@gemunion/collection";

import { AllTypesDto } from "../../../../exchange/asset/dto";

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

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;

  public chainId: number;
}
