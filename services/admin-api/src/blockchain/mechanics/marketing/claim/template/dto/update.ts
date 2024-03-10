import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountOptionalDto } from "@gemunion/collection";
import type { IClaimUpdateDto } from "@framework/types";

import { NotNativeDto } from "../../../../../exchange/asset/dto/custom";

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

  public chainId: number;
}
