import { IIdBase } from "@gemunion/types-collection";

import { IErc1155Token } from "../erc1155/token";
import { IErc998Recipe } from "./recipe";

export interface IErc998Ingredient extends IIdBase {
  erc998RecipeId: number;
  erc998Recipe?: IErc998Recipe;
  erc1155TokenId: number;
  erc1155Token: IErc1155Token;
  amount: number;
}
