import type { ISearchable } from "@gemunion/types-collection";

import type { IMerchant } from "../../../infrastructure";
import type { IWaitListItem } from "./item";

export interface IWaitListList extends ISearchable {
  items?: Array<IWaitListItem>;
  merchantId: number;
  merchant?: IMerchant;
}
