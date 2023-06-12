import type { IIdDateBase } from "@gemunion/types-collection";

import type { ILotteryRound } from "./round";
import type { IToken } from "../../hierarchy/token";

export interface ILotteryTicket extends IIdDateBase {
  account: string;
  numbers: Array<boolean>;
  roundId: number;
  round?: ILotteryRound;
  tokenId: number;
  token?: IToken;
}
