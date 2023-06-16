import { IAssetItem } from "./common";

export interface IExchangeBreedEvent {
  from: string;
  externalId: string;
  matron: IAssetItem;
  sire: IAssetItem;
}
