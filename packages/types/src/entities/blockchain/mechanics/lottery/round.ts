import type { IIdDateBase } from "@gemunion/types-collection";

import type { ILotteryTicket } from "./ticket";
import { CronExpression } from "../../../common";
import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<ILotteryTicket>;
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

export interface ILotteryOption {
  address: string;
  schedule: CronExpression;
  description?: string;
}
