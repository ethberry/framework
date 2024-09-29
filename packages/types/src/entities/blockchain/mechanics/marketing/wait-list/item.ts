import type { IIdDateBase } from "@ethberry/types-collection";

import type { IWaitListList } from "./list";

export enum WaitListItemStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
}

export interface IWaitListItem extends IIdDateBase {
  account: string;
  waitListItemStatus: WaitListItemStatus;
  listId: number;
  list?: IWaitListList;
}
