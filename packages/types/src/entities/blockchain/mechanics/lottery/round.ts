import type { IIdDateBase } from "@gemunion/types-collection";

import { CronExpression } from "../../../common";
import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";
import { IToken } from "../../hierarchy/token";

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
  address: string;
  schedule: CronExpression;
}

export interface ILotteryContractRound extends IContract {
  round?: ILotteryRound | null;
}
