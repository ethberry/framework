import type { IIdDateBase } from "@gemunion/types-collection";

import type { IRaffleRound } from "./round";
import type { IToken } from "../../hierarchy/token";

export interface IRaffleTicket extends IIdDateBase {
  account: string;
  roundId: number;
  round?: IRaffleRound;
  tokenId: number;
  token?: IToken;
  amount: string;
}
