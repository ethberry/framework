import type { IIdDateBase } from "@gemunion/types-collection";

import type { ILotteryTicket } from "./ticket";
import { CronExpression } from "../../../common";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<ILotteryTicket>;
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
}

export interface ILotteryOption {
  lottery: string;
  schedule: CronExpression;
  description?: string;
}
