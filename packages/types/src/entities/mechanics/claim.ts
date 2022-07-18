import { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "./asset";

export enum ClaimStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  UNPACKED = "UNPACKED",
}

export interface IClaim extends IIdDateBase {
  account: string;
  item: IAsset;
  claimStatus: ClaimStatus;
  nonce: string;
  signature: string;
}
