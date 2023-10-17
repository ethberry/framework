import type { IIdDateBase } from "@gemunion/types-collection";

import type { IMerchant } from "../../infrastructure";

export interface IChainLinkRandomRequestEvent {
  requestId: string;
}

export interface IChainLinkSubscription extends IIdDateBase {
  chainId: number;
  vrfSubId: number;
  merchantId: number;
  merchant: IMerchant;
}
