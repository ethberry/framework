import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../../exchange/asset";

export enum ClaimStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  UNPACKED = "UNPACKED",
  EXPIRED = "EXPIRED",
}

export interface IClaim extends IIdDateBase {
  account: string;
  item: IAsset;
  claimStatus: ClaimStatus;
  nonce: string;
  signature: string;
  endTimestamp: string;
}
