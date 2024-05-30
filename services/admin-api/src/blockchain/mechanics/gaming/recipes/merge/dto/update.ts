import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { MergeStatus } from "@framework/types";

import type { IMergeUpdateDto } from "../interfaces";
import { MergeCreateDto } from "./index";

export class MergeUpdateDto extends MergeCreateDto implements IMergeUpdateDto {
  @ApiPropertyOptional({
    enum: MergeStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as MergeStatus)
  @IsEnum(MergeStatus, { message: "badInput" })
  public mergeStatus: MergeStatus;
}
