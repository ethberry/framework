import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { Erc721RecipeStatus } from "@framework/types";

import { IErc721RecipeUpdateDto } from "../interfaces";
import { Erc721RecipeCreateDto } from "../dto";

export class Erc721RecipeUpdateDto extends Erc721RecipeCreateDto implements IErc721RecipeUpdateDto {
  @ApiPropertyOptional({
    enum: Erc721RecipeStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as Erc721RecipeStatus)
  @IsEnum(Erc721RecipeStatus, { message: "badInput" })
  public recipeStatus: Erc721RecipeStatus;
}
