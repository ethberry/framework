import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { DismantleStatus } from "@framework/types";

import { IDismantleUpdateDto } from "../interfaces";
import { DismantleCreateDto } from "./index";

export class DismantleUpdateDto extends DismantleCreateDto implements IDismantleUpdateDto {
  @ApiPropertyOptional({
    enum: DismantleStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as DismantleStatus)
  @IsEnum(DismantleStatus, { message: "badInput" })
  public dismantleStatus: DismantleStatus;
}
