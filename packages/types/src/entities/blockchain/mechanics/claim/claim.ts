import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import { IMerchant } from "../../../infrastructure";

export enum ClaimStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  UNPACKED = "UNPACKED",
  EXPIRED = "EXPIRED",
}

export enum ClaimType {
  TOKEN = "TOKEN",
  VESTING = "VESTING",
}

export interface IClaim extends IIdDateBase {
  account: string;
  item: IAsset;
  claimStatus: ClaimStatus;
  claimType: ClaimType;
  parameters: any;
  nonce: string;
  signature: string;
  endTimestamp: string;
  merchantId: number;
  merchant?: IMerchant;
}
