import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsOptional, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { AccountOptionalDto, NotNativeDto } from "@gemunion/nest-js-validators";
import type { IClaimUpdateDto } from "@framework/types";
import { ClaimType } from "@framework/types";

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
