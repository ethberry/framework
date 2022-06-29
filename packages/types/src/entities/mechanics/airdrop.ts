import { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../blockchain/asset";

export enum AirdropStatus {
  NEW = "NEW",
  REDEEMED = "REDEEMED",
  UNPACKED = "UNPACKED",
}

export interface IAirdrop extends IIdDateBase {
  account: string;
  item: IAsset;
  airdropStatus: AirdropStatus;
  signature: string;
}
