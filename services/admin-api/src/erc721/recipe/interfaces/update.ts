import { Erc721RecipeStatus } from "@framework/types";

import { IErc721RecipeCreateDto } from "./create";

export interface IErc721RecipeUpdateDto extends IErc721RecipeCreateDto {
  recipeStatus: Erc721RecipeStatus;
}
