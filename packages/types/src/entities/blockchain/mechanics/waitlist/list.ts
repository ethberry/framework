import type { ISearchable } from "@gemunion/types-collection";

import type { IMerchant } from "../../../infrastructure";
import type { IWaitListItem } from "./item";
import { IAsset } from "../../exchange/asset";

export interface IWaitListList extends ISearchable {
  items?: Array<IWaitListItem>;
  root: string;
  merchantId: number;
  merchant?: IMerchant;
  item?: IAsset;
  itemId: number;
}
