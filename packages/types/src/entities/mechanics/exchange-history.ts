import { IIdDateBase } from "@gemunion/types-collection";

import { IExchangeRule } from "./exchange-rule";

export enum ExchangeEventType {
  RecipeCreated = "RecipeCreated",
  RecipeUpdated = "RecipeUpdated",
  RecipeCrafted = "RecipeCrafted",
}

export interface IRecipeCreated {
  recipeId: string;
  ids: Array<string>;
  amounts: Array<string>;
  collection: string;
  tokenId: string;
}

export interface IRecipeUpdated {
  recipeId: string;
  active: boolean;
}

export interface IRecipeCrafted {
  from: string;
  recipeId: string;
}

export type TExchangeEventData = IRecipeCreated | IRecipeUpdated | IRecipeCrafted;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  exchangeId: number | null;
  exchange?: IExchangeRule;
}
