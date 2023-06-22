import { IAssetItem } from "./common";

export interface IExchangeGradeEvent {
  account: string;
  externalId: string;
  attribute: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}
