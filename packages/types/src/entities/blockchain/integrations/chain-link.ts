import type { IIdDateBase } from "@gemunion/types-collection";

import type { IMerchant } from "../../infrastructure";

export interface IChainLinkRandomRequestEvent {
  requestId: string;
}

export interface IChainLinkSubscription extends IIdDateBase {
  chainId: number;
  vrfSubId: string;
  merchantId: number;
  merchant: IMerchant;
}
