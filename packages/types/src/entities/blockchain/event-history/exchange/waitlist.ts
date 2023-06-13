import { IExchangeItem } from "./common";

export interface IRewardSetEvent {
  externalId: string;
  items: Array<IExchangeItem>;
}

export interface IClaimRewardEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
}
