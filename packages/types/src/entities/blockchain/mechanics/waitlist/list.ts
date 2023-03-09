import type { ISearchable } from "@gemunion/types-collection";

import type { IWaitlistItem } from "./item";

export interface IWaitlistList extends ISearchable {
  items?: Array<IWaitlistItem>;
}
