import { ISearchDto } from "@gemunion/types-collection";

import { Erc998RecipeStatus } from "../../../entities";

export interface IErc998RecipeSearchDto extends ISearchDto {
  recipeStatus: Array<Erc998RecipeStatus>;
}
