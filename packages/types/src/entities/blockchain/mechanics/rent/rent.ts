import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../hierarchy/contract";
import type { IAsset } from "../../exchange/asset";

export enum RentRuleStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IRent extends IIdDateBase {
  title: string;
  contractId: number;
  contract?: IContract;
  price?: IAsset;
  rentStatus: RentRuleStatus;
}
