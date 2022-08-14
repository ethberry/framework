import { IIdDateBase } from "@gemunion/types-collection";

import { ILotteryRound } from "./round";

export interface ILotteryTicket extends IIdDateBase {
  account: string;
  numbers: Array<boolean>;
  roundId: number;
  round?: ILotteryRound;
  amount: string;
}
