import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { CraftStatus } from "@framework/types";

import type { ICraftUpdateDto } from "../interfaces";
import { CraftCreateDto } from "./index";

export class CraftUpdateDto extends CraftCreateDto implements ICraftUpdateDto {
  @ApiPropertyOptional({
    enum: CraftStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as CraftStatus)
  @IsEnum(CraftStatus, { message: "badInput" })
  public craftStatus: CraftStatus;
}
