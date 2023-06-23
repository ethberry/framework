import type { IIdDateBase } from "@gemunion/types-collection";

import type { IToken } from "../../hierarchy/token";
import type { ILotteryRound } from "./round";

export interface ILotteryTicket extends IIdDateBase {
  account: string;
  numbers: Array<boolean>;
  roundId: number;
  round?: ILotteryRound;
  tokenId: number;
  token?: IToken;
}
