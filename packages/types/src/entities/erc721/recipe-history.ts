import { IIdDateBase } from "@gemunion/types-collection";

import { IErc721Recipe } from "./recipe";

export enum Erc721RecipeEventType {
  RecipeCreated = "RecipeCreated",
  RecipeUpdated = "RecipeUpdated",
  RecipeCrafted = "RecipeCrafted",
}

export interface IErc721RecipeCreated {
  recipeId: string;
  ids: Array<string>;
  amounts: Array<string>;
  collection: string;
  tokenId: string;
}

export interface IErc721RecipeUpdated {
  recipeId: string;
  active: boolean;
}

export interface IErc721RecipeCrafted {
  from: string;
  recipeId: string;
}

export type TErc721RecipeEventData = IErc721RecipeCreated | IErc721RecipeUpdated | IErc721RecipeCrafted;

export interface IErc721RecipeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc721RecipeEventType;
  eventData: TErc721RecipeEventData;
  erc721RecipeId: number | null;
  erc721Recipe?: IErc721Recipe;
}
