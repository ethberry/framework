import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { ExchangeStatus } from "@framework/types";

import { IRecipeUpdateDto } from "../interfaces";
import { ExchangeCreateDto } from "./index";

export class Erc721RecipeUpdateDto extends ExchangeCreateDto implements IRecipeUpdateDto {
  @ApiPropertyOptional({
    enum: ExchangeStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as ExchangeStatus)
  @IsEnum(ExchangeStatus, { message: "badInput" })
  public exchangeStatus: ExchangeStatus;
}
