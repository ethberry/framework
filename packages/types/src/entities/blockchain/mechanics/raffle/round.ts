import type { IIdDateBase } from "@gemunion/types-collection";

import { CronExpression } from "../../../common";
import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";
import { IToken } from "../../hierarchy/token";
import { ILotteryRound } from "../lottery/round";

export interface IRaffleRound extends IIdDateBase {
  number: string | null; // winner
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

export interface IRaffleOption {
  address: string;
  schedule: CronExpression;
  description?: string;
  round?: Partial<ILotteryRound>;
}
