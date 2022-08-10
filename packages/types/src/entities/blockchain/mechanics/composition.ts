import { IIdDateBase } from "@gemunion/types-collection";

import { IContract } from "../hierarchy/contract";

export interface IComposition extends IIdDateBase {
  parentId: number;
  parent?: IContract;
  childId: number;
  child?: IContract;
  amount: number;
}
