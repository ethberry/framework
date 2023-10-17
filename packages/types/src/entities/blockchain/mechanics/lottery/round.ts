import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { IContract } from "../../hierarchy/contract";
import type { IToken } from "../../hierarchy/token";
import type { IAssetItem } from "../../event-history";
import type { ILotteryRoundAggregation } from "./aggregation";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<IToken>;
  roundId: string;
  contractId: number; // lottery contract
  ticketContractId: number; // ticket contract
  priceId: number;
  price?: IAsset;
  maxTickets: number;
  startTimestamp: string;
  endTimestamp: string;
  contract?: IContract;
  ticketContract?: IContract;
  aggregation?: Array<ILotteryRoundAggregation>;
}

export interface ILotteryCurrentRound {
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
  maxTicket: string;
  balance: string; // left after get prize
  total: string; // max money before
  values: Array<string>; // prize numbers
  aggregation: Array<string>; // prize counts
  acceptedAsset: IAssetItem;
  ticketAsset: IAssetItem;
}
