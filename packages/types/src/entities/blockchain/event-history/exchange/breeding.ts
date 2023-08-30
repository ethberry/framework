import { IAssetItem } from "./common";

export interface IExchangeBreedEvent {
  account: string;
  externalId: string;
  matron: IAssetItem;
  sire: IAssetItem;
}
