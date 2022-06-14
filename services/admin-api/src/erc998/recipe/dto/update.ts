import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { Erc998RecipeStatus } from "@framework/types";

import { IErc998RecipeUpdateDto } from "../interfaces";
import { Erc998RecipeCreateDto } from "../dto";

export class Erc998RecipeUpdateDto extends Erc998RecipeCreateDto implements IErc998RecipeUpdateDto {
  @ApiPropertyOptional({
    enum: Erc998RecipeStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as Erc998RecipeStatus)
  @IsEnum(Erc998RecipeStatus, { message: "badInput" })
  public recipeStatus: Erc998RecipeStatus;
}
