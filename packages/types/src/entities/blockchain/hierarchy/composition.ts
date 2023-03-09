import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "./contract";

export interface IComposition extends IIdDateBase {
  parentId: number;
  parent?: IContract;
  childId: number;
  child?: IContract;
  amount: number;
}
