import { IAssetItem } from "./common";

export interface IExchangeGradeEvent {
  from: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}
