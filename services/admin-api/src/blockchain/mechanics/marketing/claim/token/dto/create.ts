import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { AccountDto, NotNativeDto } from "@gemunion/nest-js-validators";
import type { IClaimCreateDto } from "@framework/types";
import { ClaimType } from "@framework/types";

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
  @IsEnum(ClaimType, { message: "badInput" })
  public claimType: ClaimType;

  public chainId: number;
}
