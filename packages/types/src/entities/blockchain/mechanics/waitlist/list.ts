import type { ISearchable } from "@gemunion/types-collection";

import type { IContract } from "../../hierarchy/contract";
import type { IAsset } from "../../exchange/asset";
import type { IWaitListItem } from "./item";

export interface IWaitListList extends ISearchable {
  items?: Array<IWaitListItem>;
  root: string;
  item?: IAsset;
  itemId: number;
  contractId: number;
  contract: IContract;
}
