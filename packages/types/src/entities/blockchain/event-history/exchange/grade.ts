import { IExchangeItem } from "./common";

export interface IExchangeGradeEvent {
  from: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}
