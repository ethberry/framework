import type { IAssetItem } from "./common";

export interface IExchangeClaimTemplateEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
}

export interface IExchangeClaimTokenEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
}
