import type { IIdDateBase } from "@gemunion/types-collection";

import { IWaitlistList } from "./list";

export interface IWaitlistItem extends IIdDateBase {
  account: string;
  listId: number;
  list?: IWaitlistList;
}
