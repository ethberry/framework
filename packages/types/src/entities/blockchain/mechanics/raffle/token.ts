import type { IToken } from "../../hierarchy/token";
import type { IRaffleRound } from "./round";

export interface IRaffleToken extends IToken {
  round: IRaffleRound;
}
