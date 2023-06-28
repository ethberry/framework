import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IClaimUpdateDto } from "@framework/types";

import { AccountOptionalDto } from "@gemunion/collection";

import { ItemDto } from "../../../exchange/asset/dto";

export class ClaimUpdateDto extends AccountOptionalDto implements IClaimUpdateDto {
  @ApiPropertyOptional({
    type: ItemDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
