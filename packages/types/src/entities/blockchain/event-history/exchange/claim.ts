import { IExchangeItem } from "./common";

export interface IExchangeClaimEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
}
