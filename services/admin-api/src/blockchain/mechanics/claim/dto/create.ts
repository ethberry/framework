import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsEnum, IsString, ValidateNested } from "class-validator";
import { Type, Transform } from "class-transformer";

import { AccountDto } from "@gemunion/collection";
import type { IClaimCreateDto } from "@framework/types";

import { NotNativeDto } from "../../../exchange/asset/dto/custom";
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
