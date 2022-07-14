import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { CraftStatus } from "@framework/types";

import { IRecipeUpdateDto } from "../interfaces";
import { ExchangeCreateDto } from "./index";

export class Erc721RecipeUpdateDto extends ExchangeCreateDto implements IRecipeUpdateDto {
  @ApiPropertyOptional({
    enum: CraftStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as CraftStatus)
  @IsEnum(CraftStatus, { message: "badInput" })
  public craftStatus: CraftStatus;
}
