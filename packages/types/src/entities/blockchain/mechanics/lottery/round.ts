import type { IIdDateBase } from "@gemunion/types-collection";

import { ILotteryTicket } from "./ticket";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<ILotteryTicket>;
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
}
