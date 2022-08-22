import { IIdDateBase } from "@gemunion/types-collection";

import { IToken } from "./token";

export interface IOwnership extends IIdDateBase {
  parentId: number;
  parent?: IToken;
  childId: number;
  child?: IToken;
  amount: number;
}
