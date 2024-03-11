import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ClaimType } from "@framework/types";
import type { IClaimCreateDto } from "@framework/types";
import { AccountDto } from "@gemunion/collection";

import { AllTypesDto } from "../../../../../exchange/asset/dto";

export class ClaimCreateDto extends AccountDto implements IClaimCreateDto {
  @ApiProperty({
    type: AllTypesDto,
  })
  @ValidateNested()
  @Type(() => AllTypesDto)
  public item: InstanceType<typeof AllTypesDto>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiProperty({
    enum: ClaimType,
  })
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "badInput" })
  public claimType: ClaimType;

  public chainId: number;
}
