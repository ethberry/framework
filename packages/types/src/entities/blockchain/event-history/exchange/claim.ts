import type { IAssetItem } from "./common";

export interface IExchangeClaimEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
}
