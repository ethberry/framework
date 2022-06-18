import { IIdDateBase } from "@gemunion/types-collection";

import { IErc998Recipe } from "./recipe";

export enum Erc998RecipeEventType {
  RecipeCreated = "RecipeCreated",
  RecipeUpdated = "RecipeUpdated",
  RecipeCrafted = "RecipeCrafted",
}

export interface IErc998RecipeCreated {
  recipeId: string;
  ids: Array<string>;
  amounts: Array<string>;
  collection: string;
  tokenId: string;
}

export interface IErc998RecipeUpdated {
  recipeId: string;
  active: boolean;
}

export interface IErc998RecipeCrafted {
  from: string;
  recipeId: string;
}

export type TErc998RecipeEventData = IErc998RecipeCreated | IErc998RecipeUpdated | IErc998RecipeCrafted;

export interface IErc998RecipeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc998RecipeEventType;
  eventData: TErc998RecipeEventData;
  erc998RecipeId: number | null;
  erc998Recipe?: IErc998Recipe;
}
