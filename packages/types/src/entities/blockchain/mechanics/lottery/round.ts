import { IIdDateBase } from "@gemunion/types-collection";

import { ILotteryTicket } from "./ticket";

export interface ILotteryRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<ILotteryTicket>;
  startTimestamp: string;
  endTimestamp: string;
}
