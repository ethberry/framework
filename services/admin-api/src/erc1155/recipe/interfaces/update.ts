import { Erc1155RecipeStatus } from "@framework/types";

import { IErc1155RecipeCreateDto } from "./create";

export interface IErc1155RecipeUpdateDto extends IErc1155RecipeCreateDto {
  recipeStatus: Erc1155RecipeStatus;
}
