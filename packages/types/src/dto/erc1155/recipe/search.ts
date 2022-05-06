import { ISearchDto } from "@gemunion/types-collection";

import { RecipeStatus } from "../../../entities";

export interface IErc1155RecipeSearchDto extends ISearchDto {
  recipeStatus: Array<RecipeStatus>;
}
