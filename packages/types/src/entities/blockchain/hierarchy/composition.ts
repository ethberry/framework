import type { IIdDateBase } from "@ethberry/types-collection";

import type { IContract } from "./contract";

export enum CompositionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IComposition extends IIdDateBase {
  parentId: number;
  parent?: IContract;
  childId: number;
  child?: IContract;
  amount: number;
  compositionStatus: CompositionStatus;
}
