import type { IIdDateBase } from "@ethberry/types-collection";

import type { IAsset } from "../../../exchange/asset";
import type { IMerchant } from "../../../../infrastructure";

export enum ClaimStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  EXPIRED = "EXPIRED",
}

export enum ClaimType {
  TEMPLATE = "TEMPLATE",
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
