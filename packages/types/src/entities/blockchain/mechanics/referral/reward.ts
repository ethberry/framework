import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../hierarchy/contract";
import { IAsset } from "../../exchange/asset";
import { IEventHistory } from "../../event-history";
import { IMerchant } from "../../../infrastructure";

export interface IReferralReward extends IIdDateBase {
  account: string;
  referrer: string;
  share: number;
  merchantId: number | null;
  merchant?: IMerchant;
  priceId: number | null;
  price: IAsset;
  itemId: number | null;
  item?: IAsset;
  historyId: number;
  history?: IEventHistory;
  contractId: number | null;
  contract?: IContract;
}
