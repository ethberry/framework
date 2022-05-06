import { IIdBase } from "@gemunion/types-collection";

import { IErc1155Recipe } from "./recipe";

export enum Erc1155RecipeEventType {
  RecipeCreated = "RecipeCreated",
  RecipeUpdated = "RecipeUpdated",
  RecipeCrafted = "RecipeCrafted",
}

export interface IErc1155RecipeCreated {
  recipeId: string;
  ids: Array<string>;
  amounts: Array<string>;
  tokenId: string;
}

export interface IErc1155RecipeUpdated {
  recipeId: string;
  active: boolean;
}

export interface IErc1155RecipeCrafted {
  from: string;
  recipeId: string;
  amount: string;
}

export type TErc1155RecipeEventData = IErc1155RecipeCreated | IErc1155RecipeUpdated | IErc1155RecipeCrafted;

export interface IErc1155RecipeHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc1155RecipeEventType;
  eventData: TErc1155RecipeEventData;
  erc1155RecipeId: number | null;
  erc1155Recipe?: IErc1155Recipe;
}
