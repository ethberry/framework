import type { ISearchable } from "@gemunion/types-collection";

import { IWaitlistItem } from "./item";

export interface IWaitlistList extends ISearchable {
  items?: Array<IWaitlistItem>;
}
