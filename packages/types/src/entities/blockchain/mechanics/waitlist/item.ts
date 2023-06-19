import type { IIdDateBase } from "@gemunion/types-collection";

import type { IWaitListList } from "./list";

export enum WaitListStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
}

export interface IWaitListItem extends IIdDateBase {
  account: string;
  waitListStatus: WaitListStatus;
  listId: number;
  list?: IWaitListList;
}
