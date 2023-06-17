import type { IIdDateBase } from "@gemunion/types-collection";

import type { IWaitListList } from "./list";

export interface IWaitListItem extends IIdDateBase {
  account: string;
  listId: number;
  list?: IWaitListList;
}
