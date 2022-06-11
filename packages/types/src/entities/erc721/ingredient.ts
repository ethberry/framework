import { IIdBase } from "@gemunion/types-collection";

import { IErc1155Token } from "../erc1155/token";
import { IErc721Recipe } from "./recipe";

export interface IErc721Ingredient extends IIdBase {
  erc721RecipeId: number;
  erc721Recipe?: IErc721Recipe;
  erc1155TokenId: number;
  erc1155Token: IErc1155Token;
  amount: number;
}
