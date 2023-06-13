import { IExchangeItem } from "./common";

export interface IExchangeBreedEvent {
  from: string;
  externalId: string;
  matron: IExchangeItem;
  sire: IExchangeItem;
}
