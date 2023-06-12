import type { IIdDateBase } from "@gemunion/types-collection";

import type { ILotteryTicket } from "./ticket";
import { CronExpression } from "../../../common";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<ILotteryTicket>;
  roundId: string;
  contractId: number;
  maxTickets: number;
  startTimestamp: string;
  endTimestamp: string;
}

export interface ILotteryOption {
  address: string;
  schedule: CronExpression;
  description?: string;
}
