import { Erc998RecipeStatus } from "@framework/types";

import { IErc998RecipeCreateDto } from "./create";

export interface IErc998RecipeUpdateDto extends IErc998RecipeCreateDto {
  recipeStatus: Erc998RecipeStatus;
}
