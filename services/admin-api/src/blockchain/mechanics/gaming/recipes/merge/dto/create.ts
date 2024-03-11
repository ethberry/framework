import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, ValidateNested } from "class-validator";

import { Type } from "class-transformer";

import type { IMergeCreateDto } from "../interfaces";
import { NftDto } from "../../../../../exchange/asset/dto";
import { MergeStatus } from "@framework/types";

export class MergeCreateDto implements IMergeCreateDto {
  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public item: InstanceType<typeof NftDto>;

  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public price: InstanceType<typeof NftDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MergeStatus, { message: "badInput" })
  public mergeStatus: MergeStatus;
}
