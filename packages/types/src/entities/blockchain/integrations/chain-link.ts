import type { IIdDateBase } from "@gemunion/types-collection";

import { IMerchant } from "../../infrastructure";

export interface IChainLinkRandomRequestEvent {
  requestId: string;
}

export interface IMerchantSubscriptions extends IIdDateBase {
  merchantId: number;
  chainId: number;
  vrfSubId: number;
  merchant: IMerchant;
}
