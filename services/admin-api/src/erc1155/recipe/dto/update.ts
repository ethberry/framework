import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { Erc1155RecipeStatus } from "@framework/types";

import { IErc1155RecipeUpdateDto } from "../interfaces";
import { Erc1155RecipeCreateDto } from "../dto";

export class Erc1155RecipeUpdateDto extends Erc1155RecipeCreateDto implements IErc1155RecipeUpdateDto {
  @ApiPropertyOptional({
    enum: Erc1155RecipeStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as Erc1155RecipeStatus)
  @IsEnum(Erc1155RecipeStatus, { message: "badInput" })
  public recipeStatus: Erc1155RecipeStatus;
}
