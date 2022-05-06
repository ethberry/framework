import { IIdBase } from "@gemunion/types-collection";

import { IErc1155Token } from "./token";
import { IErc1155Ingredient } from "./ingredient";
import { IErc1155RecipeHistory } from "./recipe-history";

export enum RecipeStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc1155Recipe extends IIdBase {
  title: string;
  description: string;
  erc1155TokenId: number;
  erc1155Token?: IErc1155Token;
  ingredients: Array<IErc1155Ingredient>;
  recipeStatus: RecipeStatus;
  history?: Array<IErc1155RecipeHistory>;
}
