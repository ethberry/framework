import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../../hierarchy/contract";
import type { IAsset } from "../../../exchange/asset";
import type { IEventHistory } from "../../../event-history";
import type { IMerchant } from "../../../../infrastructure";
import type { IReferralRewardShare } from "./share";

export interface IReferralEvents extends IIdDateBase {
  account: string;
  referrer: string;
  merchantId: number | null;
  merchant?: IMerchant;
  contractId: number | null;
  contract?: IContract;
  priceId: number | null;
  price: IAsset;
  itemId: number | null;
  item?: IAsset;
  historyId: number;
  history?: IEventHistory;
  shares?: Array<IReferralRewardShare>;
}
