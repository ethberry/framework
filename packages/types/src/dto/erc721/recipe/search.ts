import { ISearchDto } from "@gemunion/types-collection";

import { Erc721RecipeStatus } from "../../../entities";

export interface IErc721RecipeSearchDto extends ISearchDto {
  recipeStatus: Array<Erc721RecipeStatus>;
}
