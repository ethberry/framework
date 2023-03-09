import type { IIdDateBase } from "@gemunion/types-collection";

import type { IWaitlistList } from "./list";

export interface IWaitlistItem extends IIdDateBase {
  account: string;
  listId: number;
  list?: IWaitlistList;
}
