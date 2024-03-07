import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../../hierarchy/contract";
import { IAsset } from "../../../exchange/asset";
import { IEventHistory } from "../../../event-history";
import { IMerchant } from "../../../../infrastructure";
import { IReferralRewardShare } from "./share";

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
