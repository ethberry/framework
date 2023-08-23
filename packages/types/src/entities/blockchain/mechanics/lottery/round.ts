import type { IIdDateBase } from "@gemunion/types-collection";

import { CronExpression } from "../../../common";
import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";
import { IToken } from "../../hierarchy/token";
import { IAssetItem } from "../../event-history";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<IToken>;
  roundId: string;
  contractId: number; // lottery contract
  ticketContractId: number; // ticket contract
  priceId: number;
  maxTickets: number;
  startTimestamp: string;
  endTimestamp: string;
  contract?: IContract;
  ticketContract?: IContract;
  price?: IAsset;
}

export interface ILotteryScheduleUpdateDto {
  schedule: CronExpression;
}

export interface ILotteryScheduleUpdateRmq {
  address: string;
  schedule: CronExpression;
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
