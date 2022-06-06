import { IIdDateBase } from "@gemunion/types-collection";

import { IErc1155Token } from "./token";
import { IErc1155Recipe } from "./recipe";

export interface IErc1155Ingredient extends IIdDateBase {
  erc1155RecipeId: number;
  erc1155Recipe?: IErc1155Recipe;
  erc1155TokenId: number;
  erc1155Token: IErc1155Token;
  amount: number;
}
