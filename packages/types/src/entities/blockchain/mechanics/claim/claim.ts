import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import { IMerchant } from "../../../infrastructure";

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
  merchantId: number;
  merchant?: IMerchant;
}
