import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsOptional, ValidateNested } from "class-validator";

import { SemiNftDto, NotNativeDto } from "@ethberry/nest-js-validators";
import { CraftStatus } from "@framework/types";

import type { ICraftUpdateDto } from "../interfaces";

export class CraftUpdateDto implements ICraftUpdateDto {
  @ApiPropertyOptional({
    type: SemiNftDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiPropertyOptional({
    type: NotNativeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotNativeDto)
  public price: InstanceType<typeof NotNativeDto>;

  @ApiPropertyOptional({
    enum: CraftStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as CraftStatus)
  @IsEnum(CraftStatus, { message: "badInput" })
  public craftStatus: CraftStatus;
}
