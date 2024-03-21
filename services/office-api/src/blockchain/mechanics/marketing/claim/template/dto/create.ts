import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsISO8601, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import type { IClaimCreateDto } from "@framework/types";
import { ClaimType } from "@framework/types";
import { AccountDto, AllTypesDto } from "@gemunion/nest-js-validators";

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
