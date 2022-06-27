import { IIdDateBase } from "@gemunion/types-collection";

import { IExchange } from "./exchange";

export enum ExchangeEventType {
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

export type TExchangeEventData = IErc721RecipeCreated | IErc721RecipeUpdated | IErc721RecipeCrafted;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  craftId: number | null;
  craft?: IExchange;
}
