import type { IIdDateBase } from "@gemunion/types-collection";

import type { IToken } from "../../hierarchy/token";
import type { IRaffleRound } from "./round";

export interface IRaffleTicket extends IIdDateBase {
  account: string;
  roundId: number;
  round?: IRaffleRound;
  tokenId: number;
  token?: IToken;
}
