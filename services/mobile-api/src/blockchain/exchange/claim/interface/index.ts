import type { IExchangeClaimTemplateEvent, IExchangeClaimTokenEvent } from "@framework/types";

export interface IRmqClaimTemplate {
  transactionHash: string;
  waitListList: IExchangeClaimTemplateEvent;
}

export interface IRmqClaimToken {
  transactionHash: string;
  waitListItem: IExchangeClaimTokenEvent;
}
