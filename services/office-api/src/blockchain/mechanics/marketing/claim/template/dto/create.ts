import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsInt, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ClaimType } from "@framework/types";
import type { IClaimCreateDto } from "@framework/types";
import { AccountDto } from "@gemunion/collection";

import { NotNativeDto } from "../../../../../exchange/asset/dto";

export class ClaimCreateDto extends AccountDto implements IClaimCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiProperty({
    enum: ClaimType,
  })
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "typeMismatch" })
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
