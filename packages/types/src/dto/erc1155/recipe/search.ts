import { ISearchDto } from "@gemunion/types-collection";

import { Erc1155RecipeStatus } from "../../../entities";

export interface IErc1155RecipeSearchDto extends ISearchDto {
  recipeStatus: Array<Erc1155RecipeStatus>;
}
